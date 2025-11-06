import _ from 'lodash';
import moment from 'moment';
import { Request } from 'express';
import { Document, Model } from 'mongoose';

interface PaginationResult<T> {
  totalRecords: number;
  records: T[];
  perPage: number;
  currentPage: number;
  next: number | null;
  prev: number | null;
  totalPages: number;
  pagingCounter: number;
  hasPrevious: boolean;
  hasNext: boolean;
  recordShown: number;
}

interface PaginateModel<T extends Document> extends Model<T> {
  paginate(
    query?: any,
    options?: any,
    callback?: (err: any, result: any) => void,
  ): Promise<any>;
}

export const paginatedData = async <T extends Document>(
  model: PaginateModel<T>,
  match: Record<string, any>,
  sort: Record<string, any>,
  page: number,
  perPage: number = 10,
  populate?: string | object | Array<string | object>,
  select?: string | object,
): Promise<PaginationResult<T>> => {
  if (Object.keys(sort).length === 1) {
    const value = Object.keys(sort)[0];
    if (value === 'createdDate') {
      sort = { createdAt: _.result(sort, 'createdDate') };
    } else if (value === 'updatedDate') {
      sort = { updatedAt: _.result(sort, 'updatedDate') };
    } else if (value === 'id') {
      sort = { _id: _.result(sort, 'id') };
    }
    match = _.assign({ [value]: { $exists: true } }, match);
  }
  if (match.createdDate) {
    const createDate = {
      createdAt: _.pickBy(_.result(match, 'createdDate') as any),
    };
    match = _.assign(createDate, match);
  }
  if (match.updatedDate) {
    const updatedDate = {
      updatedAt: _.pickBy(_.result(match, 'updatedDate') as any),
    };
    match = _.assign(updatedDate, match);
  }
  if (match.id) {
    const id = { _id: _.pickBy(_.result(match, 'id') as any) };
    match = _.assign(id, match);
  }

  match = _.omit(match, ['createdDate', 'updatedDate', 'id']);

  match = _.omit(match, ['createdDate', 'updatedDate', 'id']);
  const query = _.assign({ deleted: false }, match);
  const formattedData = {
    totalDocs: 'totalRecords',
    docs: 'records',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'totalPages',
    pagingCounter: 'pagingCounter',
    hasPrevPage: 'hasPrevious',
    hasNextPage: 'hasNext',
  };
  const isPage = page ? page : perPage ? 1 : page;
  const options = {
    sort,
    pagination: isPage ? true : false,
    limit: perPage ? perPage : 10,
    page: isPage,
    select,
    populate,
    customLabels: formattedData,
  };

  let data = await model.paginate(query, options);
  if (data?.records?.length > 0) {
    data = _.assign(data, {
      recordShown: data?.records?.length + data?.pagingCounter - 1,
    });
  } else {
    data = _.assign(data, {
      recordShown: data?.totalRecords,
    });
  }
  return data;
};

export const getMatchAndSortData = async (req: Request) => {
  let matchData: Record<string, any> = {};
  let sortData: Record<string, any> = { createdAt: -1 };

  if (req.query.sortBy || req.query.orderBy) {
    const orderBy = req.query.orderBy ? req.query.orderBy : 'desc';
    sortData[req.query.sortBy as string] = orderBy === 'desc' ? -1 : 1;
  }
  if (req.query.startDate && req.query.endDate) {
    matchData['createdAt'] = _.pickBy({
      $gte: new Date(req.query.startDate as string),
      $lt: moment(req.query.endDate as string)
        .add(1, 'days')
        .toDate(),
    });
  } else if (req.query.startDate) {
    matchData['createdAt'] = _.pickBy({
      $gte: new Date(req.query.startDate as string),
    });
  } else if (req.query.endDate) {
    matchData['createdAt'] = _.pickBy({
      $lt: moment(req.query.endDate as string)
        .add(1, 'days')
        .toDate(),
    });
  }
  if (req.query.createdDate) {
    matchData['createdAt'] = {
      $gte: new Date(req.query.createdDate as string),
      $lt: moment(req.query.createdDate as string).add(1, 'days'),
    };
  }
  if (req.query.updatedDate) {
    matchData['updatedAt'] = {
      $gte: new Date(req.query.updatedDate as string),
      $lt: moment(req.query.updatedDate as string).add(1, 'days'),
    };
  }

  return {
    matchData,
    sortData,
  };
};
