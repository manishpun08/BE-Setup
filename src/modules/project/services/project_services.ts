import { apiError } from '@utils/response';
import { IProject } from '../model/project_model';
import ProjectRepository from '../repository/project_repository';

class ProjectService {
  // Create a new project
  async createProject(data: Partial<IProject>): Promise<IProject> {
    const newProject = await ProjectRepository.createProject(data);
    if (!newProject) {
      throw apiError('Project creation failed', 400, {});
    }
    return newProject;
  }

  // get all projects
  async getAllProjects(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    const projects = await ProjectRepository.getAllProjects(
      match,
      sort,
      page,
      perPage,
    );
    if (!projects) {
      throw apiError('No projects found', 404, {});
    }
    return projects;
  }

  // get project by id
  async getProjectById(id: string): Promise<IProject | null> {
    return await ProjectRepository.getProjectById(id);
  }

  // update project by id
  async updateProjectById(
    id: string,
    data: Partial<IProject>,
  ): Promise<IProject | null> {
    return await ProjectRepository.updateProjectById(id, data);
  }

  // delete project by id
  async deleteProjectById(id: string): Promise<IProject | null> {
    return await ProjectRepository.deleteProjectById(id);
  }
}

export default new ProjectService();
