import { Entry, Sys } from 'contentful';
import { EntityMetaSysProps } from 'contentful-management/dist/typings/common-types';
import { CMAEntry } from '../../src/types';
import { parser } from '../../src/utilities';
import { MockEntryFields } from './types';

export const cdnSysMock = (id?: string): Sys => ({
  type: 'Entry',
  id: id ?? 'mock-entry-id',
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

export const cdnFieldsMock: MockEntryFields = {
  title: 'Mock Entry Title',
};

export const cdnEntryMock = (params?: {
  id?: string;
  fields?: MockEntryFields;
}): Entry<MockEntryFields> => ({
  sys: cdnSysMock(params?.id),
  fields: params?.fields ?? cdnFieldsMock,
  metadata: { tags: [] },
  toPlainObject: () => {
    const { sys, fields, metadata } = cdnEntryMock(params);

    return { sys, fields, metadata };
  },
  update: async () => cdnEntryMock(params),
});

export const cmaSysMock = (id?: string): EntityMetaSysProps => ({
  type: 'Entry',
  id: id ?? 'mock-entry-id',
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

export const cmaEntryMock = (params?: {
  id?: string;
  fields?: MockEntryFields;
}): CMAEntry<MockEntryFields> =>
  (({
    sys: cmaSysMock(params?.id),
    fields: parser.addLocale(params?.fields ?? cdnFieldsMock),
    metadata: { tags: [] },
    toPlainObject: () => {
      const { sys, fields, metadata } = cmaEntryMock(params);

      return { sys, fields, metadata };
    },
    update: async () => cmaEntryMock(params),
    delete: async () => cmaEntryMock(params),
    publish: async () => cmaEntryMock(params),
    unpublish: async () => cmaEntryMock(params),
    archive: async () => cmaEntryMock(params),
    unarchive: async () => cmaEntryMock(params),
    isArchived: () => false,
    isDraft: () => false,
    isPublished: () => true,
    isUpdated: () => false,
  } as unknown) as CMAEntry<MockEntryFields>);
