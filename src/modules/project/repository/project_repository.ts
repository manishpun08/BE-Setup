import Project, { IProject } from '../model/project_model';

class ProjectRepository {
  async createProject(data: Partial<IProject>): Promise<IProject> {
    return Project.create(data);
  }
}

export default new ProjectRepository();
