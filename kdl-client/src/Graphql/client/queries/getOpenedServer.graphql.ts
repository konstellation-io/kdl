import { Server } from 'Hooks/useServers';
import { gql } from '@apollo/client';

export interface GetOpenedServer {
  openedServer: Server;
}

export const GET_OPENED_SERVER = gql`
  {
    openedServer @client {
      id
      name
      type
      url
      state
    }
  }
`;
