import { ContentfulClient } from '../contentful-client';
import { CFEntryCollection } from './entry-collection';
import { EntryHashmap } from '../utilities';
import { CFQuery } from '../types';

export class CFEntryRepository<TFields> {
  public total?: number;
  public skip: number;
  public limit: number;

  private client: ContentfulClient;
  private query: CFQuery<TFields>;
  private collection: CFEntryCollection<TFields>;

  constructor(client: ContentfulClient, query: CFQuery<TFields>) {
    this.client = client;
    this.query = query;
    this.skip = query.skip ?? 0;
    this.limit = query.limit ?? 100;
  }

  hasMore(): boolean {
    return !this.total || this.skip + this.limit < this.total;
  }

  async next(): Promise<Readonly<CFEntryCollection<TFields>>> {
    const collection = await this.client.getEntries<TFields>({
      ...this.query,
      skip: this.total ? this.skip + this.limit : this.skip,
      limit: this.limit,
    });

    this.total = collection.total;
    this.skip = collection.skip;

    return collection;
  }

  async all(): Promise<Readonly<CFEntryCollection<TFields>>> {
    while (this.hasMore()) {
      const collection = await this.next();

      this.collection = {
        ...collection,
        items: new EntryHashmap<TFields>([
          ...this.collection.items,
          ...collection.items,
        ]),
      };
    }

    return this.collection;
  }

  reset(): void {
    this.total = undefined;
    this.skip = this.query.skip ?? 0;
  }
}
