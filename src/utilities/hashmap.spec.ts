import { cdnEntryMock } from '../../__mocks__/entities/entry';
import { MockEntryFields } from '../../__mocks__/entities/types';
import { CFEntry } from '../entities';
import { CMAClient } from './cma-client';
import { config } from './config';
import { Hashmap, EntryHashmap } from './hashmap';

describe('Hashmaps', () => {
  describe('length getter', () => {
    it('should return length of map', () => {
      const hashmap = new Hashmap([
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ]);

      expect(hashmap.length).toEqual(3);
    });
  });

  describe('map method', () => {
    it('should return changed hashmap', () => {
      const hashmap = new Hashmap([
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ]);

      const mapped = hashmap.map((item) => {
        return item + item;
      });

      expect(mapped.get(1)).toEqual('aa');
      expect(mapped.get(2)).toEqual('bb');
      expect(mapped.get(3)).toEqual('cc');
    });
  });

  describe('reindex method', () => {
    it('should return map with new index', () => {
      config.set({
        space: 'mock-space',
        environment: 'mock-env',
        accessToken: 'mock-access-token',
        managementToken: 'mock-management-token',
        locale: 'en-US',
      });
      const entry = CFEntry.createFromCDN(
        new CMAClient(),
        cdnEntryMock({ id: 'a', fields: { title: 'b' } })
      );

      const hashmap = new EntryHashmap<MockEntryFields>();
      hashmap.set(entry.sys.id, entry);
      hashmap.reindex('fields.title');

      expect(hashmap.get('b')).toEqual(entry);
    });
  });
});
