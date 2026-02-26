import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

interface GetPrivateGoalTooltipTextParams {
  featureNamesText: FeatureNamesText,
}

interface GetPrivateGoalTooltipTextReturn {
  [Goals.GoalContextType.Personal]: string,
  [Goals.GoalContextType.Team]: string,
  [Goals.GoalContextType.Organization]: string,
}

const getPrivateGoalTooltipText = ({ featureNamesText }: GetPrivateGoalTooltipTextParams): GetPrivateGoalTooltipTextReturn => ({
  [Goals.GoalContextType.Personal]: `
    Public ${featureNamesText.goals.plural.toLowerCase()} are visible to participants
    in the ${featureNamesText.goals.singular.toLowerCase()}, as well as your manager and executives.
    Private ${featureNamesText.goals.plural.toLowerCase()} are only visible to the participants in the ${featureNamesText.goals.singular.toLowerCase()}.
  `,
  [Goals.GoalContextType.Team]: `
    Public team ${featureNamesText.goals.plural.toLowerCase()} are visible to all team members and participants
    in the ${featureNamesText.goals.singular.toLowerCase()}, as well as executives.
    Private team ${featureNamesText.goals.plural.toLowerCase()} are visible only to specified collaborators and viewers.
  `,
  [Goals.GoalContextType.Organization]: `
    Public organization ${featureNamesText.goals.plural.toLowerCase()} are visible to everyone.
    Private organization ${featureNamesText.goals.plural.toLowerCase()} are visible only to specified participants.
  `,
});

interface PrivateGoalTooltipText {
  tooltipText: GetPrivateGoalTooltipTextReturn,
}

const useGetPrivateGoalTooltipText = (): PrivateGoalTooltipText => {
  const { featureNamesText } = useGetFeatureNamesText();

  const tooltipText = useMemo(() => getPrivateGoalTooltipText({ featureNamesText }), [featureNamesText]);

  return {
    tooltipText,
  };
};

export default useGetPrivateGoalTooltipText;
