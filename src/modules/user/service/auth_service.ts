import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/user_model';
import { comparePassword, hashPassword } from '@utils/bcrypt';
import { generateToken } from '@utils/jwt';

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'defaultrefreshsecret';

class AuthService {
  static async authenticateUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  static generateTokens(user: any) {
    const payload = { id: user._id, email: user.email, role: user.role };

    const accessToken = generateToken(payload, '1d');

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  static verifyRefreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static refreshAccessToken(refreshToken: string) {
    const decoded = this.verifyRefreshToken(refreshToken);
    const { id, email, role } = decoded as jwt.JwtPayload;
    const newAccessToken = generateToken({ id, email, role }, '15m');
    return newAccessToken;
  }
}

export default AuthService;
