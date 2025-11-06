import { Request, Response, NextFunction } from 'express';
import BlogSectionService from '../services/blog_section_service';

class BlogSectionController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const result = await BlogSectionService.getAll();
    res.json({ success: true, data: result });
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await BlogSectionService.getById(id);
    res.json({ success: true, data: result });
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const result = await BlogSectionService.create(req.body);
    res.status(201).json({ success: true, data: result });
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await BlogSectionService.update(id, req.body);
    res.json({ success: true, data: result });
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    await BlogSectionService.delete(id);
    res.json({ success: true, message: 'BlogSection deleted successfully' });
  }
}

export default new BlogSectionController();
