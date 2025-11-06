import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * @desc    Hash a plain text password
 * @param   {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * @desc    Compare a plain text password with a hashed password
 * @param   {string} password
 * @param   {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
