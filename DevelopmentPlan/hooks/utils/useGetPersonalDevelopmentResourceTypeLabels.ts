import { useMemo } from 'react';
import { ResourceType } from '~DevelopmentPlan/const/types';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

export interface PersonalDevelopmentResourceTypeLabels {
  [ResourceType.All]: string;
  [ResourceType.Goal]: string;
  [ResourceType.Learning]: string;
  [ResourceType.Feedback]: string;
  [ResourceType.ActionItem]: string;
  [ResourceType.Recognition]: string;
  [ResourceType.Accomplishment]: string;
  [ResourceType.Meeting]: string;
  [ResourceType.LearningPlaylist]: string;
}

const getPersonalDevelopmentResourceTypeLabels = ({
  featureNamesText,
}: { featureNamesText: FeatureNamesText }): PersonalDevelopmentResourceTypeLabels => ({
  [ResourceType.All]: 'All',
  [ResourceType.Goal]: featureNamesText.goals.singular,
  [ResourceType.Learning]: 'Learning',
  [ResourceType.Feedback]: 'Feedback',
  [ResourceType.ActionItem]: 'Action Item',
  [ResourceType.Recognition]: 'Recognition',
  [ResourceType.Accomplishment]: 'Accomplishment',
  [ResourceType.Meeting]: 'Meeting',
  [ResourceType.LearningPlaylist]: 'Learning Playlist',
});

interface GetPersonalDevelopmentResourceTypeLabels {
  resourceTypeLabels: PersonalDevelopmentResourceTypeLabels,
}

const useGetPersonalDevelopmentResourceTypeLabels = (): GetPersonalDevelopmentResourceTypeLabels => {
  const { featureNamesText } = useGetFeatureNamesText();

  const resourceTypeLabels = useMemo(() => getPersonalDevelopmentResourceTypeLabels({ featureNamesText }), [featureNamesText]);

  return {
    resourceTypeLabels,
  };
};

export default useGetPersonalDevelopmentResourceTypeLabels;
