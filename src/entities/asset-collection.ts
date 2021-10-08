import { AssetCollection } from 'contentful';
import {
  Asset,
  AssetProps,
  Collection,
} from 'contentful-management/dist/typings/export-types';
import { CFAsset } from './asset';
import { AssetHashmap, CMAClient } from '../utilities';

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
    collection: AssetCollection
  ): CFAssetCollection {
    const items = new AssetHashmap(
      collection.items.map((item) => {
        return [item.sys.id, CFAsset.createFromCDN(cma, item)];
      })
    );

    return new CFAssetCollection({ ...collection, items });
  }

  static createFromCMA(
    cma: CMAClient,
    collection: Collection<Asset, AssetProps>
  ): CFAssetCollection {
    const items = new AssetHashmap(
      collection.items.map((item) => {
        return [item.sys.id, CFAsset.createFromCMA(cma, item)];
      })
    );

    return new CFAssetCollection({ ...collection, items });
  }
}
