import { paginatedData } from '@utils/pagination';
import Blog, { BlogDocument } from '../model/blog_model';

class BlogRepository {
  async getAllBlogs(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    return await paginatedData(Blog, match, sort, page, perPage, author);
  }

  async getBlogBySlug(slug: string): Promise<{
    blog: BlogDocument | null;
    relatedBlogs: BlogDocument[];
  }> {
    const blog = await Blog.findOne({ slug }).populate('author');

    if (!blog) {
      return { blog: null, relatedBlogs: [] };
    }

    const relatedBlogs = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
    })
      .populate('author')
      .limit(4);

    return { blog, relatedBlogs };
  }

  async createBlog(data: Partial<BlogDocument>): Promise<BlogDocument> {
    return Blog.create(data);
  }

  async updateBlog(
    id: string,
    data: Partial<BlogDocument>,
  ): Promise<BlogDocument | null> {
    return await Blog.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBlog(id: string): Promise<BlogDocument | null> {
    return Blog.findByIdAndUpdate(id, { deleted: true }, { new: true });
  }

  async favoriteBlog(slug: string): Promise<BlogDocument | null> {
    const blog = await Blog.findOne({ slug });
    if (blog) {
      blog.favorites += 1;
      return blog.save();
    }
    return null;
  }

  async addComment(
    slug: string,
    comment: { comment: string; name: string; email: string },
  ): Promise<BlogDocument | null> {
    const blog = await Blog.findOne({ slug });
    if (blog) {
      blog.comments.push(comment);
      return blog.save();
    }
    return null;
  }

  async getTrendingBlogs(
    matchData: Record<string, any>,
    sortData: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    return await paginatedData(
      Blog,
      matchData,
      sortData,
      page,
      perPage,
      author,
    );
  }

  async getLatestBlogs(
    matchData: Record<string, any>,
    sortData: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    return await paginatedData(
      Blog,
      matchData,
      sortData,
      page,
      perPage,
      author,
    );
  }
}

export default new BlogRepository();
