import { ProjectState } from 'Pages/Cluster/pages/Cluster/components/ClusterInfo/components/ProjectStateIcon/ProjectStateIcon';

export interface ProjectFilters {
  name: string;
  states: ProjectState[];
  nFiltered: number;
}
