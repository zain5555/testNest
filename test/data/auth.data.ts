import { defaultPlan } from '../../src/common/constants';

export const populatedUser = {
  _id: '5e7be8472a863904a7cee170',
  fullName: 'Afzaal Ahmad',
  password: '$2b$10$v1I5Ptq0g4SuWC0VDtsIEe9DgJ9ti77zIbNuYwpt8CKfdS7C2mpbO',
  avatar: 'image.png',
  isActive: true,
  email: 'afzaal@creativemorph.com',
  isEmailVerified: true,
  companies: [
    {
      _id: '5e7be8472a863904a7cee171',
      company: {
        _id: '5e7be8472a863904a7cee171',
        name: 'Spacetrics',
      },
      isActive: true,
      creator: true,
      role: 'manager',
      createdAt: '2020-03-25T23:24:55.318Z',
      updatedAt: '2020-03-25T23:24:55.318Z',
    },
  ],
  createdAt: '2020-03-25T23:24:55.318Z',
  updatedAt: '2020-03-25T23:24:55.318Z',
};

export const user = {
  _id: '5e7be8472a863904a7cee170',
  fullName: 'Afzaal Ahmad',
  password: '$2b$10$v1I5Ptq0g4SuWC0VDtsIEe9DgJ9ti77zIbNuYwpt8CKfdS7C2mpbO',
  avatar: 'image.png',
  isActive: true,
  email: 'afzaal@creativemorph.com',
  isEmailVerified: true,
  companies: [
    {
      _id: '5e7be8472a863904a7cee171',
      company: '5e7be8472a863904a7cee171',
      isActive: true,
      creator: true,
      role: 'manager',
      createdAt: '2020-03-25T23:24:55.318Z',
      updatedAt: '2020-03-25T23:24:55.318Z',
    },
  ],
  createdAt: '2020-03-25T23:24:55.318Z',
  updatedAt: '2020-03-25T23:24:55.318Z',
};

export const company = {
  _id: '5e7be8472a863904a7cee16f',
  name: 'Spacetrics',
  isActive: true,
  subscription: {
    ...defaultPlan,
    startedOn: '2020-03-25T00:00:00.000Z',
    expiredAt: '2020-05-13T00:00:00.000Z',
    createdAt: '2020-03-25T23:24:55.305Z',
    updatedAt: '2020-03-25T23:24:55.305Z',
  },
  createdAt: '2020-03-25T23:24:55.318Z',
  updatedAt: '2020-03-25T23:24:55.318Z',
};
