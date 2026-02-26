import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { DEFAULT_ID } from '~DevelopmentPlan/const/defaults';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { CompetencyResource } from '~DevelopmentPlan/const/types';
import { CreateResourceDTO } from '~DevelopmentPlan/schemata/addResourceSchemata';
import useGetPersonalDevelopmentLinkingResourceText from './utils/useGetPersonalDevelopmentLinkingResourceText';
import useGetPersonalDevelopmentResourceTypeLabels from './utils/useGetPersonalDevelopmentResourceTypeLabels';

interface createResourceProps {
  id: string,
  resource: CreateResourceDTO,
}

const createResource = ({ id, resource }: createResourceProps): Promise<HttpCallReturn<CompetencyResource>> => {
  const { competencyId } = resource;
  const url = {
    url: `/developmentplans/${id}/competencies/${competencyId ?? DEFAULT_ID}/competencyResources`,
  };

  return postApi(url, resource);
};

export const useCreateResource = (): UseMutationResult<HttpCallReturn<CompetencyResource>, unknown, createResourceProps, void> => {
  const toastId = useRef<ToastId>(null);
  const { resourceTypeLabels } = useGetPersonalDevelopmentResourceTypeLabels();
  const { linkingResourceText } = useGetPersonalDevelopmentLinkingResourceText();

  const mutation = useMutation({
    mutationFn: createResource,
    onMutate: (variables) => {
      const resourceTypeId = variables.resource.contentTypeId;
      const resourceTypeName = resourceTypeLabels[resourceTypeId];
      toastId.current = toast.info(`Linking your ${resourceTypeName}...`, { autoClose: false });
    },
    onError: (_, variables) => {
      const resourceTypeId = variables.resource.contentTypeId;
      toast.update(toastId.current, {
        render: linkingResourceText[resourceTypeId].error,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (_, variables) => {
      const resourceTypeId = variables.resource.contentTypeId;
      toast.update(toastId.current, {
        render: linkingResourceText[resourceTypeId].success,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencyResources(variables.id) });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.progressBar(variables.id) });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencies(variables.id) });
    },
  });

  return mutation;
};
