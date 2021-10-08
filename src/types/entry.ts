import {
  Collection,
  Entry,
  EntryProps,
} from 'contentful-management/dist/typings/export-types';
import { Entry as CDNEntry } from 'contentful';
import { CDNClient } from '../utilities';

export interface CMAEntry<TFields> extends Entry {
  fields: {
    [K in keyof TFields]: {
      [locale: string]: TFields[K];
    };
  };
}

export interface CMAEntryCollection<TFields>
  extends Collection<CMAEntry<TFields>, EntryProps> {}

export type PlainEntry<TFields> = Pick<
  CDNEntry<TFields>,
  'sys' | 'fields' | 'metadata'
>;
