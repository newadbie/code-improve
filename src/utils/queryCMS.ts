import qs from "qs";
import { z } from "zod";

import { env } from "env.js";
import type { ImageSchema } from "schemas/cms";

// CMS query types
type LogicOperator = "and" | "or";
type ArrayOperators = "all" | "in" | "not_in";
type NormalOperators =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "greater_than_or_equals"
  | "less_than"
  | "less_than_or_equals"
  | "like"
  | "contains"
  | "exists"
  | "near";
type AllOperators = NormalOperators | ArrayOperators;
type Operator<Value> = Partial<
  Record<ArrayOperators, Value[]> | Record<NormalOperators, Value>
>;
type Where<
  T extends LogicOperator | AllOperators,
  ZodSchema extends z.ZodTypeAny,
  FieldsToDig extends OnlyObjects<QueryFirstKeys<ZodSchema>>,
  Item = NoImageKeys<NoArrayKeys<NoObjectKeys<QueryFirstKeys<ZodSchema>>>>,
> = T extends LogicOperator
  ? Record<
      T,
      (
        | Where<LogicOperator | AllOperators, ZodSchema, FieldsToDig, Item>
        | DigFirstLevelKeys<FieldsToDig>
      )[]
    >
  : Partial<{ [key in keyof Item]: Operator<Item[key]> }>;

// Utils
type Obj = Record<string, unknown>;
type RemoveNullish<T extends Obj> = { [Key in keyof T]-?: NonNullable<T[Key]> };
type RemoveNever<T extends Obj> = Pick<
  T,
  { [K in keyof T]: T[K] extends never ? never : K }[keyof T]
>;
type OnlyValues<T extends Obj> = Pick<
  T,
  { [K in keyof T]: T[K] extends Obj ? never : K }[keyof T]
>;
type OnlyObjects<T extends Obj> = Pick<
  T,
  { [K in keyof T]: T[K] extends Obj ? K : never }[keyof T]
>;
type NoArrayKeys<T extends Obj> = RemoveNever<{
  [key in keyof T]: T[key] extends unknown[] ? never : T[key];
}>;
type NoObjectKeys<T extends Obj> = RemoveNever<{
  [key in keyof T]: T[key] extends Obj ? never : T[key];
}>;
type StringOrNever<T> = T extends string ? T : never;
type NoImageKeys<T extends Obj> = RemoveNever<{
  [key in keyof T]: ImageSchema extends T[key] ? never : T[key];
}>;

// Based on zod take all first level keys from schema, remember to not keep nullish values, we want to loop them all!
type QueryFirstKeys<T extends z.ZodTypeAny> = keyof z.infer<T> extends "docs"
  ? NoImageKeys<RemoveNullish<z.infer<T>["docs"][number]>>
  : NoImageKeys<RemoveNullish<z.infer<T>>>;

type Sort<ZodSchema extends z.ZodTypeAny> = keyof NoImageKeys<
  NoArrayKeys<NoObjectKeys<QueryFirstKeys<ZodSchema>>>
>;

// Payload allow us to query via relations, to keep app safe we allow only one level of depth
type DigFirstLevelKeys<FieldsToDig extends Record<string, unknown>> = {
  [Key in keyof FieldsToDig]: FieldsToDig[Key] extends Record<string, unknown>
    ? {
        [K in keyof OnlyValues<
          FieldsToDig[Key]
        > as `${StringOrNever<Key>}.${StringOrNever<K>}`]?: Operator<
          FieldsToDig[Key][K]
        >;
      }
    : never;
}[keyof FieldsToDig];

interface Config<
  T extends z.ZodTypeAny,
  W extends LogicOperator | AllOperators,
  FieldsToDig extends OnlyObjects<QueryFirstKeys<T>>,
> {
  endpoint: string;
  config?: Parameters<typeof fetch>[1];
  schema: T;
  where?: Where<W, T, FieldsToDig> | DigFirstLevelKeys<FieldsToDig>;
  depth: number;
  limit: number;
  sort?: `${`` | `-`}${StringOrNever<Sort<T>>}`;
}

export const queryCMS = async <
  T extends z.ZodTypeAny,
  W extends LogicOperator | AllOperators,
  FieldsToDig extends OnlyObjects<QueryFirstKeys<T>>,
>({
  config,
  endpoint,
  schema,
  where,
  depth,
  limit,
  sort,
}: Config<T, W, FieldsToDig>) => {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, env.CMS_ABORT_TIMEOUT);

  try {
    const queryParams = qs.stringify(
      { where, depth, limit, sort },
      { addQueryPrefix: true },
    );
    const response = await fetch(
      `${env.CMS_API_URL}${endpoint}${queryParams}`,
      {
        ...config,
        signal: controller.signal,
        headers: {
          Authorization: env.CMS_API_KEY,
          ...(config?.headers ?? {}),
        },
      },
    );
    if (!response.ok) {
      // TODO:
      const error = new Error();
      throw error;
    }
    const data: unknown = await response.json();
    const validData = schema.parse(data) as unknown as z.output<T>;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return validData;
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      // TODO:
      throw new Error();
    }
    if (error instanceof Error) {
      throw new Error();
    }

    throw new Error();
  }
};
