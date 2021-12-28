import { cdnAssetMock, cmaAssetMock } from '../../__mocks__/entities/asset';
import { cdnEntryMock, cmaEntryMock } from '../../__mocks__/entities/entry';
import { getEntriesQueryMock } from '../../__mocks__/query/query';
import { config } from './config';
import { parser } from './parser';

describe('parser', () => {
  beforeAll(() => {
    config.set({
      space: 'mock-space',
      environment: 'mock-env',
      accessToken: 'mock-access-token',
      managementToken: 'mock-management-token',
      locale: 'en-US',
    });
  });

  describe('parseEntry method', () => {
    it('should convert cma entry to cdn entry', () => {
      const parsed = parser.parseEntry(cmaEntryMock());

      expect(parsed.sys).toEqual(cdnEntryMock().sys);
      expect(parsed.fields).toEqual(cdnEntryMock().fields);
    });
  });

  describe('parseAsset method', () => {
    it('should convert cma asset to cdn asset', () => {
      const parsed = parser.parseAsset(cmaAssetMock());

      expect(parsed.sys).toEqual(cdnAssetMock().sys);
      expect(parsed.fields).toEqual(cdnAssetMock().fields);
    });
  });

  describe('parseQuery method', () => {
    it('should convert query to contentful format', () => {
      const parsed = parser.parseQuery(getEntriesQueryMock);

      expect(parsed).toEqual({
        content_type: 'mockEntry',
        select: 'sys,fields.title',
        'fields.title': 'Some Title',
      });

      const parsed2 = parser.parseQuery({ content_type: 'page' });

      expect(parsed2).toEqual({
        content_type: 'page',
      });
    });
  });
});
