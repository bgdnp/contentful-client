import {
  Asset,
  AssetCollection,
  ContentfulClientApi,
  createClient,
  Entry,
  EntryCollection,
} from 'contentful';
import { config } from './config';
import { parser } from './parser';
import { AssetFields, CFQuery } from '../types';

export class CDNClient {
  private cdn: ContentfulClientApi;

  constructor() {
    this.cdn = createClient(config.cdn());
  }

  async getEntry<TFields>(id: string): Promise<Entry<TFields>> {
    return await this.cdn.getEntry<TFields>(id);
  }

  async getEntries<TFields>(
    query: CFQuery<TFields>
  ): Promise<EntryCollection<TFields>> {
    return await this.cdn.getEntries<TFields>(
      parser.parseQuery<TFields>(query)
    );
  }

  async getAsset(id: string): Promise<Asset> {
    return await this.cdn.getAsset(id);
  }

  async getAssets(query: CFQuery<AssetFields>): Promise<AssetCollection> {
    return await this.cdn.getAssets(parser.parseQuery<AssetFields>(query));
  }
}
