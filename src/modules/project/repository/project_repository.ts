import { paginatedData } from '@utils/pagination';
import Project, { IProject } from '../model/project_model';

class ProjectRepository {
  async createProject(data: Partial<IProject>): Promise<IProject> {
    return Project.create(data);
  }

  async getProjects(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(Project, match, sort, page, perPage);
  }
}

export default new ProjectRepository();
