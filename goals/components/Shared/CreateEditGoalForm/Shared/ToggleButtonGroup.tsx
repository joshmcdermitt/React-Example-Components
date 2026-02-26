import { SerializedStyles } from '@emotion/react';
import {
  styled,
  ToggleButton,
  ToggleButtonGroup as MUIToggleButtonGroup,
  ToggleButtonGroupProps as MUIToggleButtonGroupProps,
  css,
} from '@mui/material';
import { forwardRef, MouseEvent } from 'react';
import { FORM_COMPONENT_STYLES } from '~Goals/const/styles';

const styles = {
  ...FORM_COMPONENT_STYLES,
  buttonInputExtend: css({
    maxWidth: '216px',
    justifyContent: 'flex-start',
  }),
};

const StyledToggleButtonGroup = styled(MUIToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: theme.spacings.large,
  '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
    borderTopRightRadius: theme.radius.medium,
    borderBottomRightRadius: theme.radius.medium,
  },
  '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
    borderTopLeftRadius: theme.radius.medium,
    borderBottomLeftRadius: theme.radius.medium,
    marginLeft: 0,
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.extraSmall,
  background: theme.palette.background.primary,
  color: theme.palette.text.secondary,
  fontWeight: 600,
  lineHeight: theme.lineHeight.small,
  border: `1px solid ${selected ? theme.palette.border.brand : theme.palette.border.primary} !important`,
  borderRadius: theme.radius.medium,
  textTransform: 'none',
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.background.primary,
  },
  ...(selected && {
    backgroundColor: `${theme.palette.background.primary} !important`,
    '::before': {
      content: "''",
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      border: `2px solid ${theme.palette.border.brand}`,
      borderRadius: theme.radius.extraLarge,
      boxSizing: 'content-box',
    },
  }),
}));

const StyledIconContainer = styled('div')<{ $iconSize?: number }>(({ $iconSize }) => ({
  width: $iconSize ? `${$iconSize}rem` : '1.25rem',
  height: $iconSize ? `${$iconSize}rem` : '1.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    height: '100%',
    width: '100%',
  },
}));

export interface ToggleButtonOption extends MUIToggleButtonGroupProps {
  value: string | number,
  ['data-test-id']: string,
  text?: string,
  buttonCss?: SerializedStyles,
  onClick?: (event: MouseEvent<HTMLElement>) => void,
  icon?: JSX.Element,
  iconRemSize?: number,
  iconCss?: SerializedStyles,
}

interface ToggleButtonGroupProps extends MUIToggleButtonGroupProps {
  options: ToggleButtonOption[],
}

const ToggleButtonGroup = forwardRef(({ options, ...props }: ToggleButtonGroupProps, ref): JSX.Element => (
  <StyledToggleButtonGroup exclusive ref={ref} {...props}>
    {options.map((option) => (
      <StyledToggleButton
        css={[styles.buttonInputFields, styles.buttonInputExtend, option.buttonCss]}
        key={option.value}
        value={option.value}
        aria-label={option.text}
        data-test-id={option['data-test-id']}
        className={`toggle-button-unit-type-${option.text || option.value}`}
        onClick={option.onClick}
      >
        {option.icon && (
          <StyledIconContainer
            $iconSize={option.iconRemSize}
            className="toggle-button-unit-type-icon"
            css={option.iconCss}
          >
            {option.icon}
          </StyledIconContainer>
        )}
        {option.text && <span>{option.text}</span>}
      </StyledToggleButton>
    ))}
  </StyledToggleButtonGroup>
));

export default ToggleButtonGroup;
