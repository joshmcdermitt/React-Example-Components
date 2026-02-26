import { css } from '@emotion/react';
import moment from 'moment-timezone';
import withLoadingSkeleton from '~Common/components/withLoadingSkeleton';
import { palette } from '~Common/styles/colors';
import TextSkeleton from '~Common/V3/components/Skeletons/TextSkeleton';
import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';

const styles = {
  goalCreator: css({
    color: palette.neutrals.gray600,
    fontWeight: 500,
    fontSize: '.75rem',
  }),
  textSkeleton: css({
    height: '1rem',
  }),
};

interface ViewProps {
  firstName: string,
  lastName: string,
  createdInMillis: number,
}

const View = ({
  firstName,
  lastName,
  createdInMillis,
  ...props
}: ViewProps): JSX.Element => (
  <p
    css={styles.goalCreator}
    {...props}
  >
    {`Created by ${firstName} ${lastName} on ${moment(createdInMillis).format('MMM DD, YYYY')}`}
  </p>
);

const GoalCreatorSkeleton = (): JSX.Element => (
  <TextSkeleton css={styles.textSkeleton} />
);

interface GoalCreatorProps {
  data: GetGoalByIdReturn,
}

const GoalCreator = ({
  data: goal,
  ...props
}: GoalCreatorProps): JSX.Element => {
  const { creator, createdInMillis } = goal;
  const { firstName, lastName } = creator;

  const hookProps = {
    firstName,
    lastName,
    createdInMillis,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default withLoadingSkeleton<GetGoalByIdReturn, GoalCreatorProps>(
  GoalCreator,
  GoalCreatorSkeleton,
);
