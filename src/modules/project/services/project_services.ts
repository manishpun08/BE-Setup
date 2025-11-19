import { apiError } from '@utils/response';
import { IProject } from '../model/project_model';
import ProjectRepository from '../repository/project_repository';

class ProjectService {
  async createProject(data: Partial<IProject>): Promise<IProject> {
    const newProject = await ProjectRepository.createProject(data);
    if (!newProject) {
      throw apiError('Project creation failed', 400, {});
    }
    return newProject;
  }

  async getProjects(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await ProjectRepository.getProjects(match, sort, page, perPage);
  }
}

export default new ProjectService();
