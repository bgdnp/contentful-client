import {
  CFEntry,
  CFEntryCollection,
  CFEntryRepository,
  CFAsset,
  CFAssetCollection,
  CFAssetRepository,
} from './entities';
import { CDNClient, CMAClient, config } from './utilities';
import {
  AssetFields,
  CFClientConfig,
  CFQuery,
  CreateAssetFields,
} from './types';

export class ContentfulClient {
  private cdn: CDNClient;
  private cma: CMAClient;

  constructor(params: CFClientConfig) {
    config.set(params);

    this.cdn = new CDNClient();
    this.cma = new CMAClient();
  }

  async getEntry<TFields = unknown>(
    id: string
  ): Promise<Readonly<CFEntry<TFields>>> {
    await this.cma.setup();

    const entry = await this.cdn.getEntry<TFields>(id);

    return CFEntry.createFromCDN<TFields>(this.cma, entry);
  }

  async getEntries<TFields = unknown>(
    query: CFQuery<TFields>
  ): Promise<Readonly<CFEntryCollection<TFields>>> {
    await this.cma.setup();

    const collection = await this.cdn.getEntries<TFields>(query);

    return CFEntryCollection.createFromCDN(this.cma, collection, query.key);
  }

  async manageEntry<TFields = unknown>(
    id: string
  ): Promise<Readonly<CFEntry<TFields>>> {
    await this.cma.setup();

    const cmaEntry = await this.cma.getEntry<TFields>(id);

    return CFEntry.createFromCMA<TFields>(this.cma, cmaEntry);
  }

  async manageEntries<TFields = unknown>(
    query: CFQuery<TFields>
  ): Promise<Readonly<CFEntryCollection<TFields>>> {
    await this.cma.setup();

    const cmaCollection = await this.cma.getEntries<TFields>(query);

    return CFEntryCollection.createFromCMA(this.cma, cmaCollection, query.key);
  }

  async createEntry<TFields = unknown>(
    contentType: string,
    fields: TFields
  ): Promise<Readonly<CFEntry<TFields>>> {
    await this.cma.setup();

    const cmaEntry = await this.cma.createEntry<TFields>(contentType, fields);

    return CFEntry.createFromCMA<TFields>(this.cma, cmaEntry);
  }

  async deleteEntry(id: string): Promise<void> {
    await this.cma.setup();

    return await this.cma.deleteEntry(id);
  }

  async getAsset(id: string): Promise<Readonly<CFAsset>> {
    await this.cma.setup();

    const asset = await this.cdn.getAsset(id);

    return CFAsset.createFromCDN(this.cma, asset);
  }

  async getAssets(
    query: CFQuery<AssetFields>
  ): Promise<Readonly<CFAssetCollection>> {
    await this.cma.setup();

    const collection = await this.cdn.getAssets(query);

    return CFAssetCollection.createFromCDN(this.cma, collection, query.key);
  }

  async manageAsset(id: string): Promise<Readonly<CFAsset>> {
    await this.cma.setup();

    const cmaAsset = await this.cma.getAsset(id);

    return CFAsset.createFromCMA(this.cma, cmaAsset);
  }

  async manageAssets(
    query: CFQuery<AssetFields>
  ): Promise<Readonly<CFAssetCollection>> {
    await this.cma.setup();

    const cmaCollection = await this.cma.getAssets(query);

    return CFAssetCollection.createFromCMA(this.cma, cmaCollection, query.key);
  }

  async createAsset(fields: CreateAssetFields): Promise<Readonly<CFAsset>> {
    await this.cma.setup();

    const cmaAsset = await this.cma.createAsset(fields);

    return CFAsset.createFromCMA(this.cma, cmaAsset);
  }

  entryRepository<TFields = unknown>(
    query: CFQuery<TFields>
  ): Readonly<CFEntryRepository<TFields>> {
    return new CFEntryRepository<TFields>(this, query);
  }

  assetRepository(query: CFQuery<AssetFields>): Readonly<CFAssetRepository> {
    return new CFAssetRepository(this, query);
  }
}
