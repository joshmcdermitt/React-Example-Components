import { useMemo } from 'react';
import { ResourceType } from '~DevelopmentPlan/const/types';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

interface GetPersonalDevelopmentLinkingResourceTextParams {
  featureNamesText: FeatureNamesText,
}

interface LinkingResourceTextItem {
  error: string,
  success: string,
}

interface PersonalDevelopmentLinkingResourceText {
  [ResourceType.All]: LinkingResourceTextItem,
  [ResourceType.ActionItem]: LinkingResourceTextItem,
  [ResourceType.Learning]: LinkingResourceTextItem,
  [ResourceType.LearningPlaylist]: LinkingResourceTextItem,
  [ResourceType.Meeting]: LinkingResourceTextItem,
  [ResourceType.Feedback]: LinkingResourceTextItem,
  [ResourceType.Goal]: LinkingResourceTextItem,
  [ResourceType.Recognition]: LinkingResourceTextItem,
  [ResourceType.Accomplishment]: LinkingResourceTextItem,
}

const getPersonalDevelopmentLinkingResourceText = ({
  featureNamesText,
}: GetPersonalDevelopmentLinkingResourceTextParams): PersonalDevelopmentLinkingResourceText => ({
  [ResourceType.All]: {
    error: 'An error occurred while attaching the resource to your plan.',
    success: 'The resource was successfully added to your plan.',
  },
  [ResourceType.ActionItem]: {
    error: 'An error occurred while attaching the action item to your plan.',
    success: 'The action item was successfully added to your plan.',
  },
  [ResourceType.Learning]: {
    error: 'An error occurred while attaching the learning assignment to your plan.',
    success: 'The learning assignment was successfully added to your plan.',
  },
  [ResourceType.LearningPlaylist]: {
    error: 'An error occurred while attaching the learning assignment to your plan.',
    success: 'The learning assignment was successfully added to your plan.',
  },
  [ResourceType.Meeting]: {
    error: 'An error occurred while attaching the meeting to your plan.',
    success: 'Your meeting was successfully added to your plan.',
  },
  [ResourceType.Feedback]: {
    error: 'An error occurred while attaching the feedback to your plan.',
    success: 'The feedback was successfully added to your plan.',
  },
  [ResourceType.Goal]: {
    error: `An error occurred while attaching the ${featureNamesText.goals.singular.toLowerCase()} to your plan.`,
    success: `The ${featureNamesText.goals.singular.toLowerCase()} was successfully added to your plan.`,
  },
  [ResourceType.Recognition]: {
    error: 'An error occurred while attaching the recognition to your plan.',
    success: 'The recognition was successfully added to your plan.',
  },
  [ResourceType.Accomplishment]: {
    error: 'An error occurred while attaching your accomplishment to your plan.',
    success: 'The accomplishment was successfully added to your plan.',
  },
});

interface GetPersonalDevelopmentLinkingResourceTextReturn {
  linkingResourceText: PersonalDevelopmentLinkingResourceText,
}

const useGetPersonalDevelopmentLinkingResourceText = (): GetPersonalDevelopmentLinkingResourceTextReturn => {
  const { featureNamesText } = useGetFeatureNamesText();
  const linkingResourceText = useMemo(() => getPersonalDevelopmentLinkingResourceText({ featureNamesText }), [featureNamesText]);

  return {
    linkingResourceText,
  };
};

export default useGetPersonalDevelopmentLinkingResourceText;
