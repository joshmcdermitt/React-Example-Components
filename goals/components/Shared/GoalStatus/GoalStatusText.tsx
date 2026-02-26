import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import { memo, useMemo } from 'react';
import { getGoalStatusName } from '~Common/utils/getStatusName/getGoalStatusName';
import { useCheckPageLocation } from '~Common/hooks/usePageLocation';
import { RouteName } from '~Common/const/routeName';

/* NOTE: isViewingHome may be temporary until we have a new design. Plan to have only 2 font size options */
const StyledGoalStatusText = styled('span')<{ $showSmallText: boolean, $isViewingHome: boolean }>(({ theme, $showSmallText, $isViewingHome }) => {
  let fontSize = '.8125rem';
  if ($isViewingHome) {
    fontSize = '.75rem';
  } else if (!$isViewingHome && $showSmallText) {
    fontSize = '.6875rem';
  }
  return {
    color: theme.palette.text.secondary,
    fontSize,
    lineHeight: theme.lineHeight.extraSmall,
  };
});

interface ViewProps {
  goalStatusText: string,
  showSmallText: boolean,
  isViewingHome: boolean,
}

const View = ({
  goalStatusText,
  showSmallText = false,
  isViewingHome = false,
  ...props
}: ViewProps): JSX.Element => (
  <StyledGoalStatusText
    $showSmallText={showSmallText}
    $isViewingHome={isViewingHome}
    {...props}
  >
    {goalStatusText}
  </StyledGoalStatusText>
);

interface GoalStatusTextProps {
  status: Goals.GoalStatus | Goals.AdditionalGoalStatusFilters,
  showSmallText?: boolean,
  isViewingHome?: boolean,
}

const GoalStatusText = ({
  status,
  showSmallText = false,
  ...props
}: GoalStatusTextProps): JSX.Element => {
  const goalStatusText = useMemo(() => getGoalStatusName(status), [status]);
  const isViewingHome = useCheckPageLocation([RouteName.Home]);

  const hookProps = {
    goalStatusText,
    showSmallText,
    isViewingHome,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default memo(GoalStatusText, (prevProps, nextProps) => (
  prevProps.status === nextProps.status
));
