import { Cluster } from 'Hooks/useClusters';
import { gql } from '@apollo/client';

export interface GetOpenedCluster {
  openedCluster: Cluster;
}

export const GET_OPENED_CLUSTER = gql`
  {
    openedCluster @client {
      id
      name
      type
      url
      state
    }
  }
`;
