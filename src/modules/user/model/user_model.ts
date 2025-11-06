import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
  },
  { timestamps: true },
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const defaultComponentOverrides: Record<string, string> = {
  email: 'Email',
  password: 'Password',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
userSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

userSchema.statics.getTableFields = function () {
  return ['name', 'email', 'role'];
};

userSchema.statics.getSingleInstanceState = function () {
  return false;
};

userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'users',
      id: ret._id,
      name: ret.name,
      email: ret.email,
      role: ret.role,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface IUserModel extends PaginateModel<IUser> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
const User = model<IUser, IUserModel>('User', userSchema);

export default User;
