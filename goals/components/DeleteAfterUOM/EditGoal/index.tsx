import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { useParams } from 'react-router';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import CreateEditGoalFormSkeletonLoader from '~Goals/components/DeleteAfterUOM/Create/CreateEditGoalFormSkeletonLoader';
import { GoalDetailsParams } from '../../../const/types';
import { useGetGoalById } from '../../../hooks/useGetGoalById';
import EditGoalForm from './EditGoalForm';

const styles = {
  container: css({
    width: '100%',
    margin: '1.875rem 1.875rem 0 1.875rem',
  }),
};

interface ViewProps {
  showSkeleton: boolean,
  goalData: Goals.Goal | undefined,
}

const View = ({
  showSkeleton,
  goalData,
}: ViewProps): JSX.Element => (
  <div css={styles.container}>
    {showSkeleton && (
      <CreateEditGoalFormSkeletonLoader />
    )}
    {!showSkeleton && !!goalData && (
      <EditGoalForm goal={goalData} />
    )}
  </div>
);

const EditGoal = (): JSX.Element => {
  const { goalId } = useParams<GoalDetailsParams>();
  const { data, isLoading } = useGetGoalById({ goalId });
  const goalData = data?.response;
  const [showSkeleton] = useSkeletonLoaders(isLoading);

  const hookProps = {
    goalData,
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
