export interface AddInvitationResponseInterface {
  email: string;
  invitationId: string;
  message: string;
}

export interface InvitationJwtInterface {
  email: string;
  invitationId: string;
  company: {
    _id: string;
    name: string;
  };
}
