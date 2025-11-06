import User from '../model/user_model';
import { create, getById, updateById, deleteById } from 'helper/service_helper';
import { paginatedData } from '@utils/pagination';
import { apiError } from '@utils/response';

class UserService {
  async createUser(data: any) {
    return await create(User, data);
  }

  async getUserById(id: string) {
    const users = await getById(User, id);
    if (!users) {
      throw apiError('User not found', 400, {});
    }
    return users;
  }

  async updateUser(id: string, data: any) {
    const user = await updateById(User, { id, ...data });
    if (!user) {
      throw apiError('User not found', 400, {});
    }
  }

  async deleteUser(id: string) {
    return await deleteById(User, { id });
  }

  async getUsers(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(User, match, sort, page, perPage);
  }
}

export default new UserService();
