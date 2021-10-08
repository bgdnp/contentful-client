import { CFAssetCollection } from './asset-collection';
import { ContentfulClient } from '../contentful-client';
import { AssetHashmap } from '../utilities';
import { AssetFields, CFQuery } from '../types';

export class CFAssetRepository {
  public total?: number;
  public skip: number;
  public limit: number;

  private client: ContentfulClient;
  private query: CFQuery<AssetFields>;
  private collection: CFAssetCollection;

  constructor(client: ContentfulClient, query: CFQuery<AssetFields>) {
    this.client = client;
    this.query = query;
    this.skip = query.skip ?? 0;
    this.limit = query.limit ?? 100;
  }

  hasMore(): boolean {
    return !this.total || this.skip + this.limit < this.total;
  }

  async next(): Promise<Readonly<CFAssetCollection>> {
    const collection = await this.client.getAssets({
      ...this.query,
      skip: this.total ? this.skip + this.limit : this.skip,
      limit: this.limit,
    });

    this.total = collection.total;
    this.skip = collection.skip;

    return collection;
  }

  async all(): Promise<Readonly<CFAssetCollection>> {
    while (this.hasMore()) {
      const collection = await this.next();

      this.collection = {
        ...collection,
        items: new AssetHashmap([
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
