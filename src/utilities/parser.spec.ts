import { cdnEntryMock, cmaEntryMock } from '../../__mocks__/entities/entry';
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
});
