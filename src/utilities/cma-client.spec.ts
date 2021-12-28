import { createClient } from 'contentful-management';
import { deleteEntryMock } from '../../__mocks__/contentful-management';
import { cdnFieldsMock } from '../../__mocks__/entities/asset';
import { CMAClient } from './cma-client';
import { config } from './config';

describe('CMAClient', () => {
  let client: CMAClient;

  beforeEach(() => {
    config.set({
      space: 'space',
      environment: 'environment',
      accessToken: 'ccc',
      managementToken: 'aaa',
      locale: 'en-US',
    });
    client = new CMAClient();
  });

  describe('CMAClient constructor', () => {
    it('should create contentful client', () => {
      expect(JSON.stringify((client as any).cma)).toEqual(
        JSON.stringify(createClient(config.cma()))
      );
    });
  });

  describe('getEntry method', () => {
    it('should return entry', async () => {
      await client.setup();
      await client.setup(); // called twice to cover case if management is already setup
      const entry = await client.getEntry('someid');

      expect(entry.sys.id).toEqual('someid');
    });
  });

  describe('getEntries method', () => {
    it('should return entry collection', async () => {
      await client.setup();
      const collection = await client.getEntries({ content_type: 'mockType' });

      expect(collection.total).toEqual(3);
      expect(collection.items.length).toEqual(3);
      expect(collection.skip).toBeDefined();
      expect(collection.limit).toBeDefined();
    });
  });

  describe('createEntry method', () => {
    it('should create entry', async () => {
      await client.setup();
      const entry = await client.createEntry('mockType', {
        title: 'Some Title',
      });

      expect(entry.fields.title['en-US']).toEqual('Some Title');
    });
  });

  describe('deleteEntry method', () => {
    it('should delete entry', async () => {
      await client.setup();
      await client.deleteEntry('someid');

      expect(deleteEntryMock).toHaveBeenCalledWith('someid');
    });
  });

  describe('getAsset method', () => {
    it('should return asset', async () => {
      await client.setup();
      const asset = await client.getAsset('someid');

      expect(asset.sys.id).toEqual('someid');
    });
  });

  describe('getAssets method', () => {
    it('should return asset collection', async () => {
      await client.setup();
      const collection = await client.getAssets({ content_type: 'mockType' });

      expect(collection.total).toEqual(3);
      expect(collection.items.length).toEqual(3);
      expect(collection.skip).toBeDefined();
      expect(collection.limit).toBeDefined();
    });
  });

  describe('createAsset method', () => {
    it('should create asset', async () => {
      await client.setup();
      const entry = await client.createAsset(cdnFieldsMock);

      expect(entry.fields.title['en-US']).toEqual('Mock Asset Title');
    });
  });
});
