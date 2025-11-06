interface IApiResponse<T> {
  status: string;
  message: string;
  statusCode: number;
  data?: T;
}

interface IErrorResponse {
  status: string;
  message: string;
  statusCode: number;
  error: any;
}

/**
 * Creates a success response object.a
 * @param statusCode - The HTTP status code.
 * @param message - The success message.
 * @param data - Optional data to include in the response.
 * @returns An object representing the success response.
 */
const success = <T>(
  message: string,
  statusCode: number,
  data?: T,
): IApiResponse<T> => ({
  status: 'success',
  message,
  statusCode,
  data,
});

/**
 * Creates an error response object.
 * @param statusCode - The HTTP status code.
 * @param message - The error message.
 * @param error - The error details.
 * @returns An object representing the error response.
 */
const apiError = (
  message: string,
  statusCode: number,
  error: any,
): IErrorResponse => ({
  status: 'error',
  message,
  statusCode,
  error,
});

export { success, apiError, IApiResponse, IErrorResponse };
