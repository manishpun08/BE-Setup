import BlogSectionRepository from '../repository/blog_section_repository';

class BlogSectionService {
  public async getAll() {
    return await BlogSectionRepository.findAll();
  }

  public async getById(id: string) {
    const result = await BlogSectionRepository.findById(id);
    if (!result) {
      throw new Error('BlogSection not found');
    }
    return result;
  }

  public async create(data: any) {
    return await BlogSectionRepository.create(data);
  }

  public async update(id: string, data: any) {
    return await BlogSectionRepository.update(id, data);
  }

  public async delete(id: string) {
    return await BlogSectionRepository.delete(id);
  }
}

export default new BlogSectionService();
