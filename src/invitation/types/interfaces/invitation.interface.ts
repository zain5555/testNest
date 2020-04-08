// import { InvitationInterface } from '../../../schema/invitation.schema';

export interface AddInvitationResponseInterface {
  email: string;
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

// export interface InsertedInvitationsInterface {
//   _doc: InvitationInterface;
// }
