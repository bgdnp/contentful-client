import { Asset, AssetCollection, Entry, Sys } from 'contentful';
import { Asset as CMAAsset } from 'contentful-management/dist/typings/export-types';
import { EntityMetaSysProps } from 'contentful-management/dist/typings/common-types';
import { AssetFields, CMAEntry } from '../../src/types';
import { parser } from '../../src/utilities';
import { MockEntryFields } from './types';

export const cdnSysMock = (id?: string): Sys => ({
  type: 'Asset',
  id: id ?? 'mock-asset-id',
  createdAt: '2021-10-01T00:00:00Z',
  updatedAt: '2021-10-01T01:00:00Z',
  locale: 'en-US',
  contentType: {
    sys: {
      type: 'Link',
      linkType: 'ContentType',
      id: 'mockType',
    },
  },
  revision: 0,
});

export const cdnFieldsMock: AssetFields = {
  title: 'Mock Asset Title',
  description: 'Mock Asset Description',
  file: {
    url: '//asseturl.com/asd',
    details: {
      size: 1234,
      image: {
        height: 1080,
        width: 1920,
      },
    },
    fileName: 'filename.jpg',
    contentType: 'image/jpeg',
  },
};

export const cdnAssetMock = (params?: {
  id?: string;
  fields?: AssetFields;
}): Asset => ({
  sys: cdnSysMock(params?.id),
  fields: params?.fields ?? cdnFieldsMock,
  metadata: { tags: [] },
  toPlainObject: () => {
    const { sys, fields, metadata } = cdnAssetMock(params);

    return { sys, fields, metadata };
  },
});

export const cmaSysMock = (id?: string): EntityMetaSysProps => ({
  type: 'Asset',
  id: id ?? 'mock-asset-id',
  createdAt: '2021-10-01T00:00:00Z',
  updatedAt: '2021-10-01T01:00:00Z',
  contentType: {
    sys: {
      type: 'Link',
      linkType: 'ContentType',
      id: 'mockType',
    },
  },
  space: {
    sys: {
      type: 'Link',
      linkType: 'Space',
      id: 'mock-space',
    },
  },
  environment: {
    sys: {
      type: 'Link',
      linkType: 'Environment',
      id: 'mock-env',
    },
  },
  version: 0,
});

export const cmaAssetMock = (params?: {
  id?: string;
  fields?: AssetFields;
}): CMAAsset =>
  (({
    sys: cmaSysMock(params?.id),
    fields: parser.addLocale(params?.fields ?? cdnFieldsMock),
    metadata: { tags: [] },
    toPlainObject: () => {
      const { sys, fields, metadata } = cmaAssetMock(params);

      return { sys, fields, metadata };
    },
    update: async () => cmaAssetMock(params),
    delete: async () => cmaAssetMock(params),
    publish: async () => cmaAssetMock(params),
    unpublish: async () => cmaAssetMock(params),
    archive: async () => cmaAssetMock(params),
    unarchive: async () => cmaAssetMock(params),
    isArchived: () => false,
    isDraft: () => false,
    isPublished: () => true,
    isUpdated: () => false,
  } as unknown) as CMAAsset);

export const cdnAssetCollectionMock = (ids: string[]): AssetCollection => {
  return {
    total: ids.length,
    skip: 0,
    limit: 10,
    items: ids.map((id) => {
      return cdnAssetMock({ id });
    }),
    toPlainObject: () => ({}),
  };
};

export const cmaAssetCollectionMock = (ids: string[]): any => {
  return {
    total: ids.length,
    skip: 0,
    limit: 10,
    items: ids.map((id) => {
      return cmaAssetMock({ id });
    }),
    toPlainObject: () => ({}),
  };
};
