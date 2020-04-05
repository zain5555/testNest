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
  COMPANY_NOT_FOUND = 'Company Not Found!',
  MAX_USER_LIMIT_REACHED = 'Maximum users limit reached! Please upgrade your subscription plan to add more users!',
  ALREADY_INVITED = '? is already invited!',
  ALREADY_MEMBER = '? is already part of your company!',
  INVITATION_NOT_FOUND = 'Invitation Not Found!',
  ALREADY_ACCEPTED = 'Already Accepted!',
  INVITATION_REVOKED = 'Your invitation has been revoked!',
  INVALID_JWT = 'Invalid jwt token!',
  REGISTER_FIRST = 'Please sign up first to activate your account!',
  ALREADY_VERIFIED = 'Your account is already activated!',
  LOGIN_TO_ACCEPT_INVITE = 'You already have an account! Please login to accept an invite!',
  TOUCHDOWN_NOT_FOUND = 'Touchdown Not Found!',
  TOUCHDOWN_INSERTION_NOT_ALLOWED = 'Your previous touchdown is still active!',
  LAST_TOUCHDOWN_NOT_FOUND = 'No Previous Touchdown Found!',
  CANNOT_UPDATE_COMMENT = 'You cannot update your comment and rating after sending it!',
  CANNOT_LEAVE_COMMENT_ON_YOUR_OWN_TOUCHDOWN = 'You cannot leave comment on your own touchdown!',
  USER_NOT_FOUND = 'Account with given email doesn\'t exist!'
}

export const enum ResponseMessages {
  FORGOT_PASSWORD = 'An email has been sent with reset password instructions! Please check your email!',
  INVITED_SUCCESSFULLY = '? has been invited!',
  SUCCESS = 'Success!',
  REGISTER_SUCCESS = 'We have sent you an activation email! Please check your email to activate your account!'
}
