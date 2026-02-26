import { Goals } from '@josh-hr/types';
import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { mobileMediaQuery, tabletMediaQuery, desktopMediaQuery } from '~Common/styles/variables';
import { GoalDetailsParams } from '~Goals/const/types';
import { useGetGoalById } from '~Goals/hooks/useGetGoalById';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import EditGoalForm from './EditGoalForm';

interface ViewProps {
  goalDetailQuery: UseQueryResult<HttpCallReturn<Goals.Goal>, Error>,
  showSkeleton: boolean,
}

const styles = {
  container: (showSkeleton: boolean) => css({
    [`@media ${mobileMediaQuery}`]: {
      width: showSkeleton ? '20.4375rem' : '100%',
    },
    [`@media ${tabletMediaQuery}`]: {
      width: showSkeleton ? '43rem' : '100%',
    },
    [`@media ${desktopMediaQuery}`]: {
      width: showSkeleton ? '54.9375rem' : '100%',
    },
  }),
};

const View = ({
  goalDetailQuery,
  showSkeleton,
}: ViewProps): JSX.Element => (
  <div css={styles.container(showSkeleton)}>
    <EditGoalForm
      query={goalDetailQuery}
    />
  </div>
);

const EditGoal = (): JSX.Element => {
  const { goalId } = useParams<GoalDetailsParams>();
  const goalDetailQuery = useGetGoalById({
    goalId,
  });

  const { isLoading } = goalDetailQuery;
  const [showSkeleton] = useSkeletonLoaders(isLoading);

  const hookProps = {
    goalDetailQuery,
    showSkeleton,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default EditGoal;
