export interface CredentialsInterface {
  email: string;
  password: string;
}

export interface RegisterInterface extends CredentialsInterface {
  firstName: string;
  lastName: string;
  companyName?: string;
  avatar?: string;
}

export interface RegisterByInvitationInterface {
  jwt: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterUserInterface {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  companyId: string;
}

export interface ActivationJwtInterface {
  email: string;
}

