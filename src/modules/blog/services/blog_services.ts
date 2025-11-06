import { BlogDocument } from '../model/blog_model';
import blogRepository from '../repository/blog_repository';
import { apiError } from '@utils/response';

class BlogService {
  public async createBlog(data: Partial<BlogDocument>): Promise<BlogDocument> {
    const newblog = await blogRepository.createBlog(data);
    if (!newblog) {
      throw apiError('Blog creation failed', 400, {});
    }
    return newblog;
  }

  public async getBlogBySlug(slug: string): Promise<{
    blog: BlogDocument | null;
    relatedBlogs: BlogDocument[];
  } | null> {
    const result = await blogRepository.getBlogBySlug(slug);
    if (!result) {
      return null;
    }
    return result;
  }

  public async getAllBlogs(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    const blogs = await blogRepository.getAllBlogs(
      match,
      sort,
      page,
      perPage,
      author,
    );
    if (!blogs) {
      throw apiError('No blogs found', 404, {});
    }
    return blogs;
  }
  public async updateBlog(
    id: string,
    data: Partial<BlogDocument>,
  ): Promise<BlogDocument | null> {
    const updatedBlog = await blogRepository.updateBlog(id, data);
    return updatedBlog;
  }

  public async deleteBlog(id: string): Promise<BlogDocument | null> {
    const deletedBlog = await blogRepository.deleteBlog(id);
    return deletedBlog;
  }
  public async favoriteBlog(slug: string): Promise<BlogDocument | null> {
    const blog = await blogRepository.favoriteBlog(slug);
    return blog;
  }
  public async addComment(
    slug: string,
    comment: { comment: string; name: string; email: string },
  ): Promise<BlogDocument | null> {
    const blog = await blogRepository.addComment(slug, comment);
    return blog;
  }

  public async getTrendingBlogs(
    matchData: Record<string, any>,
    sortData: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    const trendingBlogs = await blogRepository.getTrendingBlogs(
      matchData,
      sortData,
      page,
      perPage,
      author,
    );
    return trendingBlogs;
  }
  public async getLatestBlogs(
    matchData: Record<string, any>,
    sortData: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    const latestBlogs = await blogRepository.getLatestBlogs(
      matchData,
      sortData,
      page,
      perPage,
      author,
    );
    return latestBlogs;
  }
}

export default new BlogService();
