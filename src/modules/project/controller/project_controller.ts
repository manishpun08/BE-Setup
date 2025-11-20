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

    const projects = await ProjectService.getAllProjects(
      matchData,
      sortData,
      Number(page),
      Number(perPage),
    );

    res
      .status(200)
      .json(success('Projects retrieved successfully', 200, projects));
  }

  // get project by id
  async getProjectById(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id;
    const project = await ProjectService.getProjectById(projectId);
    if (project) {
      res
        .status(200)
        .json(success('Project retrieved successfully', 200, project));
    } else {
      res.status(404).json(apiError('Project not found', 404, {}));
    }
  }

  // update project by id
  async updateProjectById(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id;
    const updatedProject = await ProjectService.updateProjectById(
      projectId,
      req.body,
    );
    if (updatedProject) {
      res
        .status(200)
        .json(success('Project updated successfully', 200, updatedProject));
    } else {
      res.status(404).json(apiError('Project not found', 404, {}));
    }
  }

  // delete project by id
  async deleteProjectById(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id;
    const deletedProject = await ProjectService.deleteProjectById(projectId);
    if (deletedProject) {
      res
        .status(200)
        .json(success('Project deleted successfully', 200, deletedProject));
    } else {
      res.status(404).json(apiError('Project not found', 404, {}));
    }
  }
}

export default new ProjectController();
