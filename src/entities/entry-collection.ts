import { EntryCollection } from 'contentful';
import { CFEntry } from './entry';
import { CMAClient, EntryHashmap } from '../utilities';
import { CFMapKey, CMAEntryCollection } from '../types';

export class CFEntryCollection<TFields> {
  public total: number;
  public skip: number;
  public limit: number;
  public items: EntryHashmap<TFields>;

  private constructor(
    collection: Pick<EntryCollection<TFields>, 'total' | 'skip' | 'limit'> & {
      items: EntryHashmap<TFields>;
    }
  ) {
    this.total = collection.total;
    this.skip = collection.skip;
    this.limit = collection.limit;
    this.items = collection.items;
  }

  static createFromCDN<TFields>(
    cma: CMAClient,
    collection: EntryCollection<TFields>,
    key: CFMapKey<TFields> = 'sys.id'
  ): CFEntryCollection<TFields> {
    const [sysOrFields, field] = key.split('.');
    const items = new EntryHashmap<TFields>(
      collection.items.map((item) => {
        return [
          item[sysOrFields][field],
          CFEntry.createFromCDN<TFields>(cma, item),
        ];
      })
    );

    return new CFEntryCollection({ ...collection, items });
  }

  static createFromCMA<TFields>(
    cma: CMAClient,
    collection: CMAEntryCollection<TFields>,
    key: CFMapKey<TFields> = 'sys.id'
  ): CFEntryCollection<TFields> {
    const [sysOrFields, field] = key.split('.');
    const items = new EntryHashmap<TFields>(
      collection.items.map((item) => {
        return [
          item[sysOrFields][field],
          CFEntry.createFromCMA<TFields>(cma, item),
        ];
      })
    );

    return new CFEntryCollection({ ...collection, items });
  }
}
