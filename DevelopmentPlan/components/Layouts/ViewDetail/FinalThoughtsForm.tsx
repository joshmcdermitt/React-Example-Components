import { css } from '@emotion/react';
import JoshCard from '~Common/V3/components/JoshCard';
import { Comment, PDPStatus, PDPStatusEnum } from '~DevelopmentPlan/const/types';
import { palette } from '~Common/styles/colors';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { checkForFinalThought } from '~DevelopmentPlan/const/functions';
import AddComment from './AddComment';

const styles = {
  title: css({
    color: palette.brand.indigo,
    fontWeight: 600,
    fontSize: '1.125rem',
  }),
  content: css({
    color: palette.neutrals.gray700,
    fontSize: '1rem',
    fontWeight: 400,
    marginBottom: '1.5rem',
  }),
};

interface ViewProps {
  showform: boolean,
}

const View = ({
  showform,
}: ViewProps): JSX.Element => (
  <>
    {showform && (
    <JoshCard>
      <p css={styles.title}>Final Thoughts</p>
      <p css={styles.content}>Share your thoughts on your development plan process.</p>
      <AddComment
        finalThought
      />
    </JoshCard>
    )}
  </>
);

interface FinalThoughtsFormProps {
  finalThoughts: Comment[] | undefined,
  planStatus: PDPStatus | undefined,
  showSkeleton: boolean,
}

export const FinalThoughtsForm = ({
  finalThoughts,
  planStatus,
  showSkeleton,
}: FinalThoughtsFormProps): JSX.Element => {
  const userId = getOrganizationUserId() ?? '';
  const hasFinalThought = checkForFinalThought(finalThoughts, userId);
  const status = planStatus?.id;
  const showform = status === PDPStatusEnum.Completed && !hasFinalThought && !showSkeleton;

  const hookProps = {
    finalThoughts,
    showform,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
