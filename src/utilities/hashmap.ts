import { CFEntry, CFAsset } from '../entities';
import { AssetFields, CFMapKey } from '../types';

export class Hashmap<K, V> extends Map<K, V> {
  get length(): number {
    return this.size;
  }

  map<T>(callback: (item?: V, key?: K) => T): Hashmap<K, T> {
    const mapped: [K, T][] = [];

    this.forEach((v, k) => {
      mapped.push([k, callback(v, k)]);
    });

    return new Hashmap<K, T>(mapped);
  }
}

class EntityHashmap<TEntity, TKey extends string> extends Hashmap<
  string,
  TEntity
> {
  reindex(key: TKey): EntityHashmap<TEntity, TKey> {
    const [sysOrFields, property] = key.split('.');

    [...this].forEach(([k, v]) => {
      this.set(v[sysOrFields][property], v);
      this.delete(k);
    });

    return this;
  }
}

export class EntryHashmap<TFields> extends EntityHashmap<
  CFEntry<TFields>,
  CFMapKey<TFields>
> {}

export class AssetHashmap extends EntityHashmap<
  CFAsset,
  CFMapKey<AssetFields>
> {}
