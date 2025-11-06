import { getFormattedDate } from 'helper/data_format_helper';
import { ISEO } from 'interface/seo_interface';
import mongoose, {
  Schema,
  model,
  Document,
  PaginateModel,
  Types,
  CallbackWithoutResultAndOptionalError,
  UpdateQuery,
} from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';

export interface BlogSectionDocument extends Document {
  title: string;
  mainDescription: string;
  footerDescription?: string;
  image: IImage;
  blog: mongoose.Types.ObjectId;
}

const ImageSchema = new Schema<IImage>(
  {
    url: { type: String, required: true },
    title: { type: String, required: false },
    caption: { type: String, required: false },
    alt: { type: String, required: false },
  },
  { _id: false },
);

const BlogSchema = new Schema<BlogSectionDocument>(
  {
    title: { type: String, required: true },
    mainDescription: { type: String, required: true },
    footerDescription: { type: String, required: false },
    image: { type: ImageSchema, required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  },
  { timestamps: true },
);

BlogSchema.plugin(mongoosePaginate);
BlogSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const defaultComponentOverrides: Record<
  string,
  Record<string, string> | string
> = {
  image: {
    url: 'ImageUpload',
  },
  mainImage: {
    url: 'ImageUpload',
  },
  blog: 'AutoComplete',
  footerDescription: 'RichTextEditor',
  mainDescription: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};

BlogSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

BlogSchema.statics.getTableFields = function () {
  return ['title', 'image.url'];
};

BlogSchema.statics.getSingleInstanceState = function () {
  return false;
};

BlogSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'blogSections',
      id: ret._id,
      title: ret.title,
      mainDescription: ret.mainDescription,
      footerDescription: ret.footerDescription,
      image: ret.image,
      blog: ret.blog,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface IBlogModel extends PaginateModel<BlogSectionDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}

export const BlogSectionModel = model<BlogSectionDocument, IBlogModel>(
  'BlogSection',
  BlogSchema,
);
