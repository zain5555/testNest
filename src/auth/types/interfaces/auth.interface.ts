export interface CredentialsInterface {
  email: string;
  password: string;
}

export interface RegisterInterface extends CredentialsInterface {
  firstName: string;
  lastName: string;
  companyName: string;
  avatar: string;
}
