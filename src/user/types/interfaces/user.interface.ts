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
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  companies?: SubCompanyInterface[];
  createdAt?: string;
  updatedAt?: string;
}
