import { Request, Response } from 'express';
import BlogService from '../services/blog_services';
import { getMatchAndSortData } from '@utils/pagination';
import { apiError, success } from '@utils/response';

class BlogController {
  async createNewBlog(req: Request, res: Response): Promise<void> {
    const author = (req as any).user.id;
    const newBlogData = {
      author,
      ...req.body,
    };
    const newBlog = await BlogService.createBlog(newBlogData);
    res.status(201).json(success('Blog created successfully', 201, newBlog));
  }

  async getBlogs(req: Request, res: Response): Promise<void> {
    const { matchData, sortData } = await getMatchAndSortData(req);
    const search = req.query.search;
    if (search) {
      matchData.$or = [{ title: { $regex: search, $options: 'i' } }];
    }
    const filterBy = req.query.filterBy as string;
    if (filterBy) {
      matchData.type = filterBy;
    }
    const { page = 1, perPage = 10 } = req.query;

    const blogs = await BlogService.getAllBlogs(
      matchData,
      sortData,
      Number(page),
      Number(perPage),
      'author',
    );
    res.status(200).json(success('Blogs retrieved successfully', 200, blogs));
  }

  async getBlog(req: Request, res: Response): Promise<void> {
    const blog = await BlogService.getBlogBySlug(req.params.slug);
    if (blog) {
      res.status(200).json(success('Blog retrieved successfully', 200, blog));
    } else {
      res.status(404).json(apiError('Blog not found', 404, {}));
    }
  }

  async updateExistingBlog(req: Request, res: Response): Promise<void> {
    const author = (req as any).user.id;
    const newBlogData = {
      author,
      ...req.body,
    };

    const updatedBlog = await BlogService.updateBlog(
      req.params.id,
      newBlogData,
    );
    if (updatedBlog) {
      res
        .status(200)
        .json(success('Blog updated successfully', 200, updatedBlog));
    } else {
      res.status(404).json(apiError('Blog not found', 404, {}));
    }
  }

  async deleteBlogPost(req: Request, res: Response): Promise<void> {
    const deletedBlog = await BlogService.deleteBlog(req.params.id);
    if (deletedBlog) {
      res.status(200).json(success('Blog deleted successfully', 200, {}));
    } else {
      res.status(404).json(apiError('Blog not found', 404, {}));
    }
  }

  async favoriteBlogPost(req: Request, res: Response): Promise<void> {
    const blog = await BlogService.favoriteBlog(req.params.slug);
    if (blog) {
      res.status(200).json(success('Blog favorited successfully', 200, blog));
    } else {
      res.status(404).json(apiError('Blog not found', 404, {}));
    }
  }

  async addBlogComment(req: Request, res: Response): Promise<void> {
    const blog = await BlogService.addComment(req.params.slug, req.body);
    if (blog) {
      res.status(200).json(success('Comment added successfully', 200, blog));
    } else {
      res.status(404).json(apiError('Blog not found', 404, {}));
    }
  }

  async getTrendingBlogs(req: Request, res: Response): Promise<void> {
    const { matchData, sortData } = await getMatchAndSortData(req);
    const { page = 1, perPage = 10 } = req.query;
    const blogs = await BlogService.getTrendingBlogs(
      matchData,
      sortData,
      Number(page),
      Number(perPage),
      'author',
    );
    res
      .status(200)
      .json(success('Trending blogs retrieved successfully', 200, blogs));
  }

  async getLatestBlogs(req: Request, res: Response): Promise<void> {
    const { matchData, sortData } = await getMatchAndSortData(req);
    const { page = 1, perPage = 10 } = req.query;

    const blogs = await BlogService.getLatestBlogs(
      matchData,
      sortData,
      Number(page),
      Number(perPage),
      'author',
    );

    res
      .status(200)
      .json(success('Latest blogs retrieved successfully', 200, blogs));
  }
}

export default new BlogController();
