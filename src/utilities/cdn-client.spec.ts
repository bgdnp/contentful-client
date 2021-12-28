import { createClient } from 'contentful';
import { CDNClient } from './cdn-client';
import { config } from './config';

describe('CDNClient', () => {
  let client: CDNClient;

  beforeEach(() => {
    config.set({
      space: 'space',
      environment: 'environment',
      accessToken: 'ccc',
      managementToken: 'aaa',
      locale: 'en-US',
    });
    client = new CDNClient();
  });

  describe('CDNClient constructor', () => {
    it('should create contentful client', () => {
      expect(JSON.stringify((client as any).cdn)).toEqual(
        JSON.stringify(createClient(config.cdn()))
      );
    });
  });

  describe('getEntry method', () => {
    it('should return entry', async () => {
      const entry = await client.getEntry('someid');

      expect(entry.sys.id).toEqual('someid');
    });
  });

  describe('getEntries method', () => {
    it('should return entry collection', async () => {
      const collection = await client.getEntries({ content_type: 'mockEntry' });

      expect(collection.total).toEqual(3);
      expect(collection.items.length).toEqual(3);
      expect(collection.skip).toBeDefined();
      expect(collection.limit).toBeDefined();
    });
  });

  describe('getAsset method', () => {
    it('should return asset', async () => {
      const asset = await client.getAsset('someid');

      expect(asset.sys.id).toEqual('someid');
    });
  });

  describe('getAssets method', () => {
    it('should return asset collection', async () => {
      const collection = await client.getAssets({ content_type: 'mockEntry' });

      expect(collection.total).toEqual(3);
      expect(collection.items.length).toEqual(3);
      expect(collection.skip).toBeDefined();
      expect(collection.limit).toBeDefined();
    });
  });
});
