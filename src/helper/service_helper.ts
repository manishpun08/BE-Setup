import mongoose, {
  ClientSession,
  Model,
  Document,
  HydratedDocument,
} from 'mongoose';

export const create = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>,
): Promise<T> => {
  return await model.create(data);
};

export const createWithSession = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>,
  session: ClientSession,
): Promise<T> => {
  const [created] = await model.create([data], { session });
  return created;
};

export const getAll = async <T extends Document>(
  model: Model<T>,
): Promise<T[]> => {
  return await model.find();
};

export const getById = async <T extends Document>(
  model: Model<T>,
  id: string,
): Promise<T | null> => {
  return await model.findById(new mongoose.Types.ObjectId(id));
};

export const getByIdWithPopulated = async <T extends Document>(
  model: Model<T>,
  id: string,
  relatedModel: string[] = [],
): Promise<T | null> => {
  let query = model.findById(id);
  relatedModel.forEach((val) => {
    query = query.populate(val);
  });
  return await query.exec();
};

export const getByIdWithNestedPopulated = async <T extends Document>(
  model: Model<T>,
  id: string,
  path: string,
  nestedPopulate: { path: string }[],
): Promise<T | null> => {
  return await model.findById(id).populate({
    path,
    populate: nestedPopulate,
  });
};

export const getByIdWithMultiplePopulated = async <T extends Document>(
  model: Model<T>,
  id: string,
  populateOptions: Array<{
    path: string;
    match?: Record<string, any>;
    select?: string;
    populate?: Array<{ path: string; select?: string; populate?: any } | any>;
  }>,
): Promise<T | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await model.findById(id).populate(populateOptions);
};
export const getByIdWithAllDoc = async <T extends Document>(
  model: Model<T>,
  id: string,
): Promise<T | null> => {
  return await model.findById(id);
};

export const getDataByIdWithRelatedDocId = async <T extends Document>(
  model: Model<T>,
  id: string,
  childField: string,
  childValue: any,
): Promise<T[]> => {
  return await model.find({ _id: id, [childField]: childValue });
};

export const getByIdWithRelatedDocId = async <T extends Document>(
  model: Model<T>,
  id: string,
  childField: string,
  childValue: any,
  selectField: string,
): Promise<T[]> => {
  return await model
    .find({ _id: id, [childField]: childValue })
    .select(selectField);
};

export const updateById = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>,
  relatedModel: string[] = [],
): Promise<T | null> => {
  const updates = { ...data };
  let query = model.findByIdAndUpdate(
    data.id,
    { $set: updates },
    { new: true, useFindAndModify: false },
  );
  relatedModel.forEach((val) => {
    query = query.populate(val);
  });
  return await query.exec();
};

export const updateOrInsert = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>,
): Promise<T | null> => {
  const updates = { ...data };
  return await model.findByIdAndUpdate(
    data.id,
    { $set: updates },
    { new: true, useFindAndModify: false, upsert: true },
  );
};

export const deleteById = async <T extends Document>(
  model: Model<T>,
  data: { id: string; deletedBy?: string },
): Promise<T | null> => {
  if (data.deletedBy) {
    await model.findByIdAndUpdate(data.id, { deletedBy: data.deletedBy });
  }
  return await model.findByIdAndDelete(data.id, {
    new: true,
    useFindAndModify: false,
  });
};
export const softDeleteById = async <T extends Document>(
  model: Model<T>,
  data: { id: string; deletedBy?: string },
): Promise<T | null> => {
  const update: any = {
    deleted: true,
    deletedAt: new Date(),
  };

  if (data.deletedBy) {
    update.deletedBy = data.deletedBy;
  }

  return await model.findByIdAndUpdate(data.id, update, {
    new: true,
    useFindAndModify: false,
  });
};

export const softDeleteByIdSession = async <T extends Document>(
  model: Model<T>,
  data: { id: string; deletedBy?: string },
  session: ClientSession,
): Promise<T | null> => {
  const update: any = {
    deleted: true,
    deletedAt: new Date(),
  };

  if (data.deletedBy) {
    update.deletedBy = data.deletedBy;
  }

  return await model.findByIdAndUpdate(data.id, update, {
    session,
    new: true,
    useFindAndModify: false,
  });
};

export const deleteByIdSession = async <T extends Document>(
  model: Model<T>,
  data: { id: string; deletedBy?: string },
  session: ClientSession,
): Promise<T | null> => {
  if (data.deletedBy) {
    await model.findByIdAndUpdate(data.id, { deletedBy: data.deletedBy });
  }
  return await model.findByIdAndDelete(data.id, {
    session,
    new: true,
    useFindAndModify: false,
  });
};

export const findByEmail = async <T extends Document>(
  model: Model<T>,
  email: string,
): Promise<T | null> => {
  return await model.findOne({ email }).exec();
};

export const findOne = async <T extends Document>(
  model: Model<T>,
  query: Record<string, any>,
): Promise<T | null> => {
  return await model.findOne(query).exec();
};

export const createBulk = async <T>(
  model: Model<T>,
  data: Partial<T>[],
): Promise<T | any> => {
  return await model.insertMany(data);
};

interface BulkUpdateInput<T> {
  filter: Record<string, any>;
  update: Partial<T>;
}

export const updateBulk = async <T>(
  model: Model<T>,
  updates: BulkUpdateInput<T>[],
  upsert = false,
): Promise<HydratedDocument<T>[]> => {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new Error('No updates provided for bulk update.');
  }

  const bulkOps: any = updates.map((item) => ({
    updateOne: {
      filter: item.filter,
      update: { $set: item.update },
      upsert,
    },
  }));

  await model.bulkWrite(bulkOps, { ordered: false });

  const ids = updates.map((item) => item.filter._id);
  return model.find({ _id: { $in: ids } });
};
