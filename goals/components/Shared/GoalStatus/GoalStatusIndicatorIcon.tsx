import { StyledComponent } from '@emotion/styled';
import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import { memo, useMemo } from 'react';
import DotIcon from '~Assets/icons/components/DotIcon';
import SquareIcon from '~Assets/icons/components/SquareIcon';
import { ViewPerspective } from '~Goals/const/types';
import { getGoalStatusColor } from '~Goals/hooks/utils/useGetGoalStatusColor';

interface StyledIconProps {
  size: number,
  status: Goals.GoalStatus | Goals.AdditionalGoalStatusFilters,
}

const createStyledIcon: (
  Icon: typeof DotIcon | typeof SquareIcon
) => StyledComponent<StyledIconProps> = (Icon: typeof DotIcon | typeof SquareIcon) => styled(Icon, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'status',
})<StyledIconProps>(({ size, status, theme }) => ({
  fontSize: size,
  color: getGoalStatusColor({ status, theme }),
}));

const StyledDotIcon = createStyledIcon(DotIcon);
const StyledSquareIcon = createStyledIcon(SquareIcon);

interface ViewProps extends Pick<StyledIconProps, 'size' | 'status'> {
  showCompleteIcon: boolean,
}

const View = memo(({
  size,
  status,
  showCompleteIcon,
  ...props
}: ViewProps): JSX.Element => (
  <>
    {showCompleteIcon && (
      <StyledSquareIcon
        size={size}
        status={status}
        {...props}
      />
    )}
    {!showCompleteIcon && (
      <StyledDotIcon
        size={size}
        status={status}
        {...props}
      />
    )}
  </>
));

type GoalStatusIndicatorIconProps = Omit<ViewProps, 'showCompleteIcon'> & {
  viewPerspective?: ViewPerspective;
};

const GoalStatusIndicatorIcon = ({ status, viewPerspective, ...props }: GoalStatusIndicatorIconProps): JSX.Element => {
  const memoizedShowCompleteStatus = useMemo(() => {
    if (Object.values(Goals.GoalStatus).includes(status as Goals.GoalStatus)) {
      return Goals.isGoalStatusComplete(status as Goals.GoalStatus);
    }
    return false;
  }, [status]);

  let showCompleteIcon = memoizedShowCompleteStatus;
  if (viewPerspective) {
    showCompleteIcon = viewPerspective === ViewPerspective.Completed;
  }
  const hookProps = {
    status,
    showCompleteIcon,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default memo(GoalStatusIndicatorIcon, (prevProps, nextProps) => (
  prevProps.size === nextProps.size && prevProps.status === nextProps.status
));
