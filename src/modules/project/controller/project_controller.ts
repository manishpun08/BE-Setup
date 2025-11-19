import { Request, Response } from 'express';
import ProjectService from '../services/project_services';
import { apiError, success } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';

class ProjectController {
  // Create new project
  async createNewProject(req: Request, res: Response): Promise<void> {
    const newProjectData: Partial<any> = {
      ...(req.body as any),
    };
    const newProject = await ProjectService.createProject(newProjectData);
    res
      .status(201)
      .json(success('Project created successfully', 201, newProject));
  }

  // Get all projects
  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const search = req.query.search;

      if (search) {
        matchData.$or = [
          { title: { $regex: search, $options: 'i' } },
          { des: { $regex: search, $options: 'i' } },
        ];
      }

      const projects = await ProjectService.getProjects(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );

      res
        .status(200)
        .json(success('Projects retrieved successfully', 200, projects));
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve projects', error as any, 500));
    }
  }
}

export default new ProjectController();
