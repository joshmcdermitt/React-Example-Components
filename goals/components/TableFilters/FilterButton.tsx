import { css, SerializedStyles } from '@emotion/react';
import { MouseEvent } from 'react';
import FilterLines from '~Assets/icons/components/FilterLines';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import {
  Theme, useTheme,
} from '@mui/material';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { forMobileObject } from '~Common/styles/mixins';
import { palette } from '~Common/styles/colorsRedesign';

const buttonStyle = (theme: Theme): SerializedStyles => css({
  padding: '.625rem',
  lineHeight: theme.lineHeight.small,
  borderRadius: theme.radius.medium,
  border: `1px solid ${palette.border.secondary}`,
}, forMobileObject({
  boxShadow: theme.palette.shadow.extraSmall,
  height: '2.5rem',
  width: '2.5rem',
}));

const styles = {
  iconAndText: css({
  }, forMobileObject({
    height: '1.25rem',
    weight: '1.25rem',
  })),
};

type FilterButtonProps = {
  handleClick: (event: MouseEvent<HTMLElement>) => void,
};

const FilterButton = ({ handleClick }: FilterButtonProps): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const theme = useTheme();

  return (
    <JoshButton
      data-test-id="filterSort"
      variant="ghost"
      onClick={handleClick}
      size="standard"
      css={buttonStyle(theme)}
    >
      {isMobile && (
        <FilterLines fontSize="small" />
      )}
      {!isMobile && (
        <JoshButton.SvgAndText
          icon={FilterLines}
          text="Filter/Sort"
          css={styles.iconAndText}
        />
      )}
    </JoshButton>
  );
};

export default FilterButton;
