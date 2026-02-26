import { PersonalDevelopmentTypeOption, ResourceType } from '~DevelopmentPlan/const/types';
import { useMemo } from 'react';
import useGetPersonalDevelopmentResourceTypeLabels, { PersonalDevelopmentResourceTypeLabels } from './useGetPersonalDevelopmentResourceTypeLabels';

interface GetPersonalDevelopmentResourceTypeLabelsParams {
  resourceTypeLabels: PersonalDevelopmentResourceTypeLabels,
}

const getPersonalDevelopmentResourceTypeOptions = ({
  resourceTypeLabels,
}: GetPersonalDevelopmentResourceTypeLabelsParams): PersonalDevelopmentTypeOption[] => ([
  {
    value: ResourceType.Goal,
    text: resourceTypeLabels[ResourceType.Goal],
  },
  {
    value: ResourceType.Learning,
    text: resourceTypeLabels[ResourceType.Learning],
  },
  {
    value: ResourceType.LearningPlaylist,
    text: resourceTypeLabels[ResourceType.LearningPlaylist],
  },
  {
    value: ResourceType.Feedback,
    text: resourceTypeLabels[ResourceType.Feedback],
  },
  {
    value: ResourceType.ActionItem,
    text: resourceTypeLabels[ResourceType.ActionItem],
  },
  {
    value: ResourceType.Accomplishment,
    text: resourceTypeLabels[ResourceType.Accomplishment],
  },
  {
    value: ResourceType.Meeting,
    text: resourceTypeLabels[ResourceType.Meeting],
  },
]);

interface GetPersonalDevelopmentResourceTypeOptions {
  resourceTypeOptions: PersonalDevelopmentTypeOption[],
}

const useGetPersonalDevelopmentResourceTypeOptions = (): GetPersonalDevelopmentResourceTypeOptions => {
  const { resourceTypeLabels } = useGetPersonalDevelopmentResourceTypeLabels();

  const resourceTypeOptions = useMemo(() => getPersonalDevelopmentResourceTypeOptions({ resourceTypeLabels }), [resourceTypeLabels]);

  return {
    resourceTypeOptions,
  };
};

export default useGetPersonalDevelopmentResourceTypeOptions;
