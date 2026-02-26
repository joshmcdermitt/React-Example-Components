import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { MY_TEAMS } from '~Common/const/routes';
import { palette } from '~Common/styles/colors';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';

const styles = {
  noTeamsEmptyState: css({
    backgroundColor: palette.neutrals.gray500,
  }),
};

type NoTeamsEmptyStateProps = ComponentProps<'div'>;

const NoTeamsEmptyState = ({ ...props }: NoTeamsEmptyStateProps): JSX.Element => (
  <div
    css={styles.noTeamsEmptyState}
    {...props}
  >
    <span>You don&apos;t lead any teams.</span>
    <JoshButton
      variant="text"
      textButtonColor={palette.neutrals.gray600}
      data-test-id="actionItemsEmptyStateCreateActionItem"
      component={Link}
      to={MY_TEAMS}
    >
      Click here to create one.
    </JoshButton>
  </div>
);

export default NoTeamsEmptyState;
