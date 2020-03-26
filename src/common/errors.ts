export enum HttpErrors {
  CONFLICT = 'Conflict',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  UNSUPPORTED_MEDIA_TYPE = 'Unsupported Media Type',
  NOT_FOUND = 'Not Found',
  FORBIDDEN = 'Forbidden',
  PAYMENT_REQUIRED = 'Payment Required',
  NOT_ACCEPTABLE = 'Not Acceptable',
  REQUEST_TIMEOUT = 'Request Timeout',
  PRECONDITION_FAILED = 'Precondition Failed'
}

export enum ErrorMessages {
  INVALID_CREDENTIALS = 'Invalid Credentials',
  SESSION_EXPIRED = 'Session Expired! Please login again!',
  EMAIL_ALREADY_EXISTS = 'An account with given email already exists!',
  GENERIC_FORBIDDEN = 'You do not have necessary permissions to execute this request!',
  GENERIC_CONFLICT = 'Conflict',
  GENERIC_NOT_FOUND = 'Resource Not Found!',
}

export const enum ResponseMessages {
  FORGOT_PASSWORD = 'An email has been sent with reset password instructions! Please check your email!',
  INVITED_SUCCESSFULLY = 'Invited Successfully!',
  SUCCESS = 'Success!',
  REGISTER_SUCCESS = 'We have sent you an activation email! Please check your email to activate your account!'
}
