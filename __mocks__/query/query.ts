import { CFQuery } from '../../src/types';
import { MockEntryFields } from '../entities/types';

export const getEntriesQueryMock: CFQuery<MockEntryFields> = {
  content_type: 'mockEntry',
  select: ['fields.title'],
  where: {
    'fields.title': 'Some Title',
  },
};
