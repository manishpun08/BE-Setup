import {
  BlogSectionDocument,
  BlogSectionModel,
} from '../model/blog_section_model';
import { create, getById, updateById ,} from 'helper/service_helper';
import { paginatedData } from '@utils/pagination';

class BlogSectionRepository {
  public async findAll(
    matchData: Record<string, any>,
    sortData: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData<BlogSectionDocument>(
      BlogSectionModel,
      matchData,
      sortData,
      page,
      perPage,
    );
  }

  public async findById(id: string): Promise<BlogSectionDocument | null> {
    return await getById<BlogSectionDocument>(BlogSectionModel, id);
  }

  public async create(data: BlogSectionDocument): Promise<BlogSectionDocument> {
    return await create<BlogSectionDocument>(BlogSectionModel, data);
  }

  public async update(
    id: string,
    data: Partial<BlogSectionDocument>,
  ): Promise<BlogSectionDocument | null> {
    return await updateById<BlogSectionDocument>(BlogSectionModel, {
      id,
      ...data,
    });
  }

  public async delete(id: string) {
    return await BlogSectionModel.findByIdAndDelete(id);
  }
}

export default new BlogSectionRepository();
