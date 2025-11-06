import { Request, Response } from 'express';
import project_services from '../services/project_services';
import { apiError, success } from '@utils/response';

class ProjectController {
  async createNewProject(req: Request, res: Response): Promise<void> {
    const newProjectData: Partial<any> = {
      ...(req.body as any),
    };
    const newProject = await project_services.createProject(newProjectData);
    res
      .status(201)
      .json(success('Project created successfully', 201, newProject));
  }
}

export default new ProjectController();
