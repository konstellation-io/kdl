import { MemberDetails } from "../../../Server/apollo/models/MemberDetails";
import { gql } from "@apollo/client";

export interface GetMemberDetails {
  memberDetails: MemberDetails;
}

export const GET_MEMBER_DETAILS = gql`
  {
    memberDetails @client {
      id
      email
      accessLevel
      addedDate
      lastActivity
    }
  }
`;
