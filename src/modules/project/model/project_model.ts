import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the Project interface
export interface IProject extends Document {
  title: string;
  description: string;
  img: string;
  iconLists: string[];
  link: string;
}

// Define the Project schema
const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    img: { type: String, required: true },
    iconLists: { type: [String], required: true },
    link: { type: String, required: true },
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
      image: ret.img,
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
