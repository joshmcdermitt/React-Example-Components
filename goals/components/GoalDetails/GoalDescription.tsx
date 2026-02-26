import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import ClampLines from '~Common/V3/components/ClampLines';

const styles = {
  descriptionTitle: css({
    color: palette.neutrals.gray700,
    fontSize: '.75rem',
    fontWeight: 400,
  }),
  goalDescriptionContainer: css({
    overflow: 'hidden',
  }),
  goalDescriptionClamp: css({
    fontWeight: 500,
    color: palette.neutrals.gray800,
    fontSize: '.875rem',
    lineHeight: 1,
    overflow: 'auto',
    height: 'auto',
    maxHeight: '200px',
    '& .readonlyInputStyles': {
      background: 'none !important',
    },
  }),
  expandButton: css({
    paddingLeft: 0,
  }),
};

interface ViewProps {
  text: string,
}

const View = ({
  text,
}: ViewProps): JSX.Element => (
  <div css={styles.goalDescriptionContainer}>
    <span css={styles.descriptionTitle}>Description</span>
    <ClampLines
      css={styles.goalDescriptionClamp}
      text={text}
      numberOfLines={4}
      showButton
      moreText="Expand"
      lessText="Collapse"
      buttonStyles={styles.expandButton}
    />
  </div>
);

interface GoalDescriptionProps {
  text: string,
}

export const GoalDescription = ({
  text,
}: GoalDescriptionProps): JSX.Element => {
  const hookProps = {
    text,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
