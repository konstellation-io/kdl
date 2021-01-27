import { ApolloCache, FetchResult, useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import {
  SetActiveProjectTools,
  SetActiveProjectToolsVariables,
} from '../mutations/types/SetActiveProjectTools';
import {
  GetProjectTools,
  GetProjectTools_project,
} from '../queries/types/GetProjectTools';

const GetProjectToolsQuery = loader('Graphql/queries/getProjectTools.graphql');
const SetActiveProjectToolsMutation = loader(
  'Graphql/mutations/setActiveProjectTools.graphql'
);

export default function useTool(projectId: string) {
  const [mutationSetActiveProjectTools, { loading }] = useMutation<
    SetActiveProjectTools,
    SetActiveProjectToolsVariables
  >(SetActiveProjectToolsMutation, {
    onError: (e) => console.error(`setActiveProjectTools: ${e}`),
    update: updateActiveProjectTools,
  });

  function updateCache(
    cache: ApolloCache<SetActiveProjectTools>,
    write: (project: GetProjectTools_project) => void
  ) {
    const cacheResult = cache.readQuery<GetProjectTools>({
      query: GetProjectToolsQuery,
      variables: {
        id: projectId,
      },
    });

    if (cacheResult !== null) {
      write(cacheResult.project);
    }
  }

  function updateActiveProjectTools(
    cache: ApolloCache<SetActiveProjectTools>,
    { data }: FetchResult<SetActiveProjectTools>
  ) {
    if (data && data.setActiveProjectTools) {
      updateCache(cache, (project) =>
        cache.writeQuery({
          query: GetProjectToolsQuery,
          variables: {
            id: projectId,
          },
          data: {
            project: {
              ...project,
              areToolsActive: data.setActiveProjectTools.areToolsActive,
            },
          },
        })
      );
    }
  }

  function updateProjectActiveTools(areToolsActive: boolean) {
    mutationSetActiveProjectTools(
      mutationPayloadHelper({ id: projectId, value: areToolsActive })
    );
  }

  return {
    updateProjectActiveTools,
    projectActiveTools: { loading },
  };
}
