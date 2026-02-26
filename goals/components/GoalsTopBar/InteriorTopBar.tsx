import { css } from '@emotion/react';
import { forMobileObject } from '~Common/styles/mixins';

const styles = {
  leftSide: (isCentered: boolean) => css({
    alignItems: 'center',
    display: 'flex',
    maxHeight: '2.8125rem',
    width: '75%',
  }, isCentered && {
    justifyContent: 'space-between',
  }),
  topBar: css({
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    width: '100%',
    columnGap: '0.5rem',
  }, forMobileObject({
    gridTemplateColumns: 'auto',
    rowGap: '1rem',
  })),

};

interface InteriorTopBarProps {
  renderRightSide?: () => JSX.Element,
  renderLeftSide: () => JSX.Element,
}

export const InteriorTopBar = ({
  renderRightSide,
  renderLeftSide,
  ...props
}: InteriorTopBarProps): JSX.Element => (
  <div css={styles.topBar} {...props}>
    <div css={(styles.leftSide(false))}>
      {renderLeftSide()}
    </div>
    <div>
      {renderRightSide?.()}
    </div>
  </div>
);
