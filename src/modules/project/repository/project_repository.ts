import { paginatedData } from '@utils/pagination';
import Project, { IProject } from '../model/project_model';

class ProjectRepository {
  // Create a new project
  async createProject(data: Partial<IProject>): Promise<IProject> {
    return Project.create(data);
  }

  // get all projects
  async getAllProjects(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(Project, match, sort, page, perPage);
  }

  // get project by id
  async getProjectById(id: string): Promise<IProject | null> {
    return await Project.findById(id);
  }

  // update Project by id
  async updateProjectById(
    id: string,
    data: Partial<IProject>,
  ): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(id, data, { new: true });
  }

  // delete project by id
  async deleteProjectById(id: string): Promise<IProject | null> {
    return Project.findByIdAndUpdate(id, { deleted: true }, { new: true });
  }
}

export default new ProjectRepository();
