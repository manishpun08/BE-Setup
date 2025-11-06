import { NextFunction, Request, Response } from 'express';
import UserService from '../service/user_service';
import { getMatchAndSortData } from '@utils/pagination';
import { success, apiError } from '@utils/response';
import AuthService from '../service/auth_service';
import { comparePassword, hashPassword } from '@utils/bcrypt';
import { UserPayload } from '@middleware/auth';

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    const { password, ...otherData } = req.body;
    const hashedPassword = await hashPassword(password);
    const userData = { ...otherData, password: hashedPassword };
    const user = await UserService.createUser(userData);
    res.status(201).json(success('User created successfully', 201, user));
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json(success('User retrieved successfully', 200, user));
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const user = await UserService.updateUser(req.params.id, req.body);

    res.status(200).json(success('User updated successfully', 200, user));
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const user = await UserService.deleteUser(req.params.id);
    if (!user) {
      res.status(404).json(apiError('User not found', 404, {}));
      return;
    }
    res.status(200).json(success('User deleted successfully', 200, {}));
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const { matchData, sortData } = await getMatchAndSortData(req);
    const { page = 1, perPage = 10 } = req.query;
    const search = req.query.search;
    if (search) {
      matchData.$or = [{ name: { $regex: search, $options: 'i' } }];
    }
    const users = await UserService.getUsers(
      matchData,
      sortData,
      Number(page),
      Number(perPage),
    );
    res.status(200).json(success('Users retrieved successfully', 200, users));
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const user = await AuthService.authenticateUser(email, password);
    if (!user) {
      res.status(401).json(await apiError('Invalid credentials', 401, {}));
      return;
    }
    const tokens = AuthService.generateTokens(user);
    res
      .status(200)
      .json(success('User logged in successfully', 200, { user, ...tokens }));
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { refreshToken } = req.body;
    const newAccessToken = AuthService.refreshAccessToken(refreshToken);
    res.status(200).json(
      success('Access token refreshed successfully', 200, {
        accessToken: newAccessToken,
      }),
    );
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    if (!req.user) {
      res.status(401).json(apiError('Unauthorized', 401, {}));
      return;
    }

    const userId = (req.user as UserPayload).id;

    const user = await UserService.getUserById(userId);
    if (!user) {
      res.status(404).json(apiError('User not found', 404, {}));
      return;
    }
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json(apiError('Current password is incorrect', 400, {}));
      return;
    }
    user.password = await hashPassword(newPassword);
    await user.save();
    res.status(200).json(success('Password changed successfully', 200, user));
  }
}

export default new UserController();
