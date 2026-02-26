import { styled } from '@mui/material';
import withLoadingSkeleton from '~Common/components/withLoadingSkeleton';
import TextSkeleton from '~Common/V3/components/Skeletons/TextSkeleton';
import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';
import { Goals } from '@josh-hr/types';
import GoalTargetValueMessage from '../../DeleteAfterGoalsV4/ResolveDependencies/GoalTargetValueMessageDeprecated';

const StyledTargetTextContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const StyledTargetHeaderText = styled('div')(({ theme }) => ({
  fontSize: theme.fontSize.extraSmall,
  lineHeight: theme.fontSize.extraSmall,
  color: theme.palette.text.tertiary,
}));

interface TargetTextProps {
  /**
   * The goal data, which can be either the result of fetching a goal by ID or a goal object.
   */
  data: GetGoalByIdReturn | Goals.Goal,
}

const TargetText = ({ data, ...props }: TargetTextProps): JSX.Element => (
  <StyledTargetTextContainer {...props}>
    <StyledTargetHeaderText>Target</StyledTargetHeaderText>
    <GoalTargetValueMessage measurementScale={data.measurementScale} />
  </StyledTargetTextContainer>
);

const TargetTextSkeleton = (): JSX.Element => (
  <TextSkeleton />
);

export default withLoadingSkeleton<GetGoalByIdReturn, TargetTextProps>(TargetText, TargetTextSkeleton);
