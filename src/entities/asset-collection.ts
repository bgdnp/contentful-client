import { AssetCollection } from 'contentful';
import {
  Asset,
  AssetProps,
  Collection,
} from 'contentful-management/dist/typings/export-types';
import { CFAsset } from './asset';
import { AssetHashmap, CMAClient } from '../utilities';
import { AssetFields, CFMapKey } from '../types';

export class CFAssetCollection {
  public total: number;
  public skip: number;
  public limit: number;
  public items: AssetHashmap;

  private constructor(
    collection: Pick<AssetCollection, 'total' | 'skip' | 'limit'> & {
      items: AssetHashmap;
    }
  ) {
    this.total = collection.total;
    this.skip = collection.skip;
    this.limit = collection.limit;
    this.items = collection.items;
  }

  static createFromCDN(
    cma: CMAClient,
    collection: AssetCollection,
    key: CFMapKey<AssetFields> = 'sys.id'
  ): CFAssetCollection {
    const [sysOrFields, field] = key.split('.');
    const items = new AssetHashmap(
      collection.items.map((item) => {
        return [item[sysOrFields][field], CFAsset.createFromCDN(cma, item)];
      })
    );

    return new CFAssetCollection({ ...collection, items });
  }

  static createFromCMA(
    cma: CMAClient,
    collection: Collection<Asset, AssetProps>,
    key: CFMapKey<AssetFields> = 'sys.id'
  ): CFAssetCollection {
    const [sysOrFields, field] = key.split('.');
    const items = new AssetHashmap(
      collection.items.map((item) => {
        return [item[sysOrFields][field], CFAsset.createFromCMA(cma, item)];
      })
    );

    return new CFAssetCollection({ ...collection, items });
  }
}
