import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the Project interface
export interface IProject extends Document {
  title: string;
  description: string;
  image: string[];
  iconLists: string[];
  link: string;
}

// Define the Project schema
const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },
    image: { type: [String], required: false },
    iconLists: { type: [String], required: false },
    link: { type: String, required: false },
  },
  { timestamps: true },
);

// Add plugins
projectSchema.plugin(mongoosePaginate);
projectSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

// Custom JSON transformation
projectSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      object: 'projects',
      id: ret._id,
      title: ret.title,
      descriptioncription: ret.description,
      image: ret.image,
      icons: ret.iconLists,
      link: ret.link,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
  },
});

// Export the model
const Project = model<IProject, PaginateModel<IProject>>(
  'Project',
  projectSchema,
);
export default Project;
