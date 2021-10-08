import { ClientAPI, createClient } from 'contentful-management';
import {
  Asset,
  AssetProps,
  Collection,
  Environment,
} from 'contentful-management/dist/typings/export-types';
import { config } from './config';
import { parser } from './parser';
import {
  AssetFields,
  CFQuery,
  CMAEntry,
  CMAEntryCollection,
  CreateAssetFields,
} from '../types';

export class CMAClient {
  private cma: ClientAPI;
  private env?: Environment;

  constructor() {
    this.cma = createClient(config.cma());
  }

  async getEntry<TFields>(id: string): Promise<CMAEntry<TFields>> {
    return (await this.env.getEntry(id)) as CMAEntry<TFields>;
  }

  async getEntries<TFields>(
    query: CFQuery<TFields>
  ): Promise<CMAEntryCollection<TFields>> {
    return (await this.env.getEntries(
      parser.parseQuery<TFields>(query)
    )) as CMAEntryCollection<TFields>;
  }

  async createEntry<TFields>(
    contentType: string,
    fields: TFields
  ): Promise<CMAEntry<TFields>> {
    return (await this.env.createEntry(contentType, {
      fields: parser.addLocale<TFields>(fields),
    })) as CMAEntry<TFields>;
  }

  async deleteEntry(id: string): Promise<void> {
    await this.env.deleteEntry(id);
  }

  async getAsset(id: string): Promise<Asset> {
    return await this.env.getAsset(id);
  }

  async getAssets(
    query: CFQuery<AssetFields>
  ): Promise<Collection<Asset, AssetProps>> {
    return await this.env.getAssets(parser.parseQuery(query));
  }

  async createAsset(fields: CreateAssetFields): Promise<Asset> {
    return await this.env.createAsset({
      fields: parser.addLocale<CreateAssetFields>(fields),
    });
  }

  async setup(): Promise<void> {
    if (!this.env) {
      const space = await this.cma.getSpace(config.space());
      this.env = await space.getEnvironment(config.environment());
    }
  }
}
