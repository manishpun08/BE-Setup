import { apiError } from '@utils/response';
import { IProject } from '../model/project_model';
import project_repository from '../repository/project_repository';

class ProjectService {
  public async createProject(data: Partial<IProject>): Promise<IProject> {
    const newProject = await project_repository.createProject(data);
    if (!newProject) {
      throw apiError('Project creation failed', 400, {});
    }
    return newProject;
  }
}

export default new ProjectService();
