import { Asset, Sys } from 'contentful';
import {
  Entry as CMAEntry,
  Asset as CMAAsset,
  EntityMetaSysProps,
} from 'contentful-management/dist/typings/export-types';
import { config } from './';
import { AssetFields, CFQuery, PlainEntry } from '../types';

class Parser {
  parseEntry<TFields>(cmaEntry: CMAEntry): PlainEntry<TFields> {
    return {
      sys: this.parseSys(cmaEntry.sys, {
        locale: config.locale(),
        revision: 0,
      }),
      fields: this.removeLocale<TFields>(cmaEntry.fields),
      metadata: cmaEntry.metadata,
    };
  }

  parseAsset(cmaAsset: CMAAsset): Omit<Asset, 'toPlainObject'> {
    return {
      sys: this.parseSys(cmaAsset.sys, {
        locale: config.locale(),
        revision: 0,
      }),
      fields: this.removeLocale<AssetFields>(cmaAsset.fields),
      metadata: cmaAsset.metadata,
    };
  }

  parseSys(
    newSys: EntityMetaSysProps,
    existingSys: Pick<Sys, 'locale' | 'revision'>
  ): Sys {
    return {
      ...existingSys,
      type: newSys.type,
      id: newSys.id,
      createdAt: newSys.createdAt,
      updatedAt: newSys.updatedAt,
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: newSys.contentType.sys.id,
        },
      },
    };
  }

  addLocale<T>(
    fields: Partial<T>
  ): { [K in keyof T]: { [locale: string]: T[K] } } {
    const parsed: any = {};

    for (const key in fields) {
      parsed[key] = {};
      parsed[key][config.locale()] = fields[key];
    }

    return parsed;
  }

  removeLocale<TFields>(fields: Record<string, any>): TFields {
    const parsed = {};

    for (const key in fields) {
      parsed[key] = fields[key][config.locale()];
    }

    return parsed as TFields;
  }

  parseQuery<TFields>(
    query: CFQuery<TFields>
  ): Omit<CFQuery<TFields>, 'select' | 'where' | 'key'> & {
    select?: string;
    [key: string]: string | number | boolean;
  } {
    const { select, where, key, ...rest } = query;

    return {
      ...rest,
      select:
        select && select.length ? ['sys', ...select].join(',') : undefined,
      ...(where ?? {}),
    };
  }
}

export const parser = new Parser();
