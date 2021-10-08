import { Sys } from 'contentful';

type CFSelect<T> = `fields.${Extract<keyof T, string>}`[];

type CFWhereOperator =
  | 'ne'
  | 'in'
  | 'nin'
  | 'exists'
  | 'lt'
  | 'gt'
  | 'lte'
  | 'gte';

type SysConditions = Pick<Sys, 'id' | 'type' | 'createdAt' | 'updatedAt'>;

type CFWhereKeys<T> =
  | `sys.${keyof SysConditions}`
  | `sys.${keyof SysConditions}[${CFWhereOperator}]`
  | `fields.${Extract<keyof T, string>}`
  | `fields.${Extract<keyof T, string>}[${CFWhereOperator}]`;

type CFWhere<T> = Partial<
  {
    [K in CFWhereKeys<T>]: string | number | boolean;
  }
>;

type CFOrder<T> =
  | `sys.${keyof SysConditions}`
  | `-sys.${keyof SysConditions}`
  | `fields.${Extract<keyof T, string>}`
  | `-fields.${Extract<keyof T, string>}`;

type KeysOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

export type CFMapKey<T> =
  | 'sys.id'
  | `fields.${Extract<KeysOfType<T, string>, string>}`;

export type CFQuery<T> = {
  content_type: string;
  skip?: number;
  limit?: number;
  include?: number;
  select?: CFSelect<T>;
  where?: CFWhere<T>;
  order?: CFOrder<T>;
  key?: CFMapKey<T>;
};
