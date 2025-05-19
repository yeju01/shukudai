import { FilterQuery, Model, SortValues } from 'mongoose';

export type QueryArgs<T> = Partial<{
  filter: FilterQuery<T>;
  select: string | Array<string> | Record<string, any>;
  sort: Record<string, SortValues>;
  limit: number;
  skip: number;
}>;

export type QueryOneArgs<T> = Omit<QueryArgs<T>, 'limit'>;

export const findOne = <Schema>(
  model: Model<Schema>,
  queryOneArgs?: QueryOneArgs<Schema>,
) => {
  const query = model.findOne(queryOneArgs?.filter ?? {});

  if (queryOneArgs?.sort) query.sort(queryOneArgs.sort);
  if (queryOneArgs?.skip != null) query.skip(queryOneArgs.skip);
  if (queryOneArgs?.select) query.select(queryOneArgs.select);

  return query;
};

export const findOneAndLean = <Schema>(
  model: Model<Schema>,
  queryOneArgs?: QueryOneArgs<Schema>,
) => {
  return findOne(model, queryOneArgs).lean<Schema>();
};

export const findMany = <Schema>(
  model: Model<Schema>,
  queryArgs?: QueryArgs<Schema>,
) => {
  const query = model.find(queryArgs?.filter ?? {});

  if (queryArgs?.sort) query.sort(queryArgs.sort);
  if (queryArgs?.limit != null) query.limit(queryArgs.limit);
  if (queryArgs?.skip != null) query.skip(queryArgs.skip);
  if (queryArgs?.select) query.select(queryArgs.select);

  return query;
};

export const findManyAndLean = <Schema>(
  model: Model<Schema>,
  queryArgs?: QueryArgs<Schema>,
) => {
  return findMany(model, queryArgs).lean<Schema>();
};
