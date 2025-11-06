export class DynamicMessages {
  static createMessage(name: string): string {
    return `${name} created successfully`;
  }

  static fetchedMessage(name: string): string {
    return `${name} fetched successfully`;
  }

  static deleteMessage(name: string): string {
    return `${name} deleted successfully`;
  }

  static updateMessage(name: string): string {
    return `${name} updated successfully`;
  }

  static notFoundMessage(name: string): string {
    return `${name} not found`;
  }

  static doesNotExistMessage(name: string): string {
    return `${name} does not exist`;
  }

  static alreadyExistMessage(name: string): string {
    return `${name} already exist`;
  }

  static invalidMessage(name: string): string {
    return ` Invalid ${name}`;
  }

  static badRequestMessage(name: string): string {
    return `Bad request for ${name}. Please verify the submitted data.`;
  }
}

export const EmailSubject = {
  passwordReset: 'Password Reset Request',
  accountCreated: 'Account Created Successfully',
};

export const PLAIN_RESPONSE_MSG = {
  serverError: 'Internal Server Error',
  unAuthenticated: 'You are not login. Please login first.',
  unauthorized: 'Unauthorized',
  loginFail: 'Login failed, please check your credentials',
  loginSuccess: 'Login successful',
  failToSendOtp: 'Failed to send OTP',
  otpsentMessage: 'OTP sent successfully',
  otpVerifiedMessage: 'OTP verified successfully',
  otpInvalidMessage: 'Invalid OTP',
  otpExpiredMessage: 'OTP has expired',
  userNotFound: 'User not found',
  userAlreadyExists: 'User already exists',
  emailAlreadyExists: 'Email Already Exists',
  passwordNotMatch: 'Password and Confirm Password does not match',
  passwordIncorrect: 'Incorrect current Password',
  passwordReset: 'Password Reset Successfully',
  passwordChanged: 'Password Changed Successfully',
  failedToChangePassword: 'Failed to change password',
  refreshTokenExpired: 'Refresh token expired',
  refreshTokenInvalid: 'Refresh token is invalid',
  refreshTokenSuccess: 'Refresh token generated successfully',
  refreshTokenRequired: 'Refresh token is required',
  refreshTokenFailed: ' Failed to generate refresh token',
  accessToken: 'Access token generated successfully',
  accessDenied: 'Access denied',
  accessGranted: 'Access granted',
  userAccountDeactivated: 'User account is deactivated by admin',
  invalidInput: 'Invalid input provided',
};
