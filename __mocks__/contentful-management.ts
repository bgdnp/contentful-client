import { parser } from '../src/utilities';
import { cmaEntryCollectionMock, cmaEntryMock } from './entities/entry';
import { cmaAssetCollectionMock, cmaAssetMock } from './entities/asset';

export const deleteEntryMock = jest.fn();

export function createClient(params: any) {
  return {
    getSpace: async (id: string) => {
      return {
        getEnvironment: async (id: string) => {
          return {
            getEntry: async (id: string) => cmaEntryMock({ id }),
            getEntries: async (query: any) =>
              cmaEntryCollectionMock(['id1', 'id2', 'id3']),
            createEntry: async (contentType: string, data) =>
              cmaEntryMock({
                id: 'someid',
                fields: parser.removeLocale(data.fields),
              }),
            deleteEntry: deleteEntryMock,
            getAsset: async (id: string) => cmaAssetMock({ id }),
            getAssets: async (query: any) =>
              cmaAssetCollectionMock(['id1', 'id2', 'id3']),
            createAsset: async (data) => cmaAssetMock(),
          };
        },
      };
    },
  };
}
