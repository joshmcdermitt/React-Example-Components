import { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

export const TooltipText = {
  PrivateGoal: 'Visible only to you, the owner, and assigned collaborators',
};

export const childGoalsIconTooltipText = (
  count: number,
  featureNamesText: FeatureNamesText,
): string => `${count} supporting ${featureNamesText.goals[count === 1 ? 'singular' : 'plural'].toLowerCase()}`;
