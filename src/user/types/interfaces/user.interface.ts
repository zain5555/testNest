interface CompanyPopulatedInterface {
  _id: string;
  name: string;
}

interface SubCompanyInterface {
  _id?: string;
  company?: CompanyPopulatedInterface;
  isActive?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MeInterface {
  _id?: string;
  fullName: string;
  avatar?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  companies?: SubCompanyInterface[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllCompanyJoinedUsersInterface{
  userId: string;
  fullName: string;
  email: string;
}

export interface GetAllCompanyInvitedUsersInterface{
  invitationId: string;
  fullName: string;
  email: string;
}

export interface GetAllCompanyUsersInterface {
  joinedUsers: Array<GetAllCompanyJoinedUsersInterface>;
  invitedUsers: Array<GetAllCompanyInvitedUsersInterface>;
}
