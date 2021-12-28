import { cdnEntryCollectionMock, cdnEntryMock } from './entities/entry';
import { cdnAssetCollectionMock, cdnAssetMock } from './entities/asset';

export function createClient(params: any) {
  return {
    getEntry: async (id: string) => cdnEntryMock({ id }),
    getEntries: async (query: any) =>
      cdnEntryCollectionMock(['id1', 'id2', 'id3']),
    getAsset: async (id: string) => cdnAssetMock({ id }),
    getAssets: async (query: any) =>
      cdnAssetCollectionMock(['id1', 'id2', 'id3']),
  };
}
