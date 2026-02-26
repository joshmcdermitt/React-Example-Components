import { ButtonBase, styled } from '@mui/material';
import { PickersActionBarProps } from '@mui/x-date-pickers-pro';
import { palette } from '~Common/styles/colorsRedesign';

const StyledPickersActionBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  gap: theme.spacings.large,
  gridColumn: 2,
  gridRow: 3,
  padding: theme.spacings.extraLarge,
}));

const StyledCancelButton = styled(ButtonBase)(({ theme }) => ({
  borderRadius: theme.radius.medium,
  border: `1px solid ${theme.palette.border.primary}`,
  color: theme.palette.text.secondary,
  padding: '.625rem .875rem',
  fontWeight: 600,
  lineHeight: theme.lineHeight.small,
  backgroundColor: palette.foreground.white,
}));

const StyledApplyButton = styled(ButtonBase)(({ theme }) => ({
  borderRadius: theme.radius.medium,
  border: `2px solid ${theme.palette.border.brand}`,
  backgroundColor: palette.foreground.brandSecondary,
  color: theme.palette.text.white,
  padding: '.625rem .875rem',
  fontWeight: 600,
  lineHeight: theme.lineHeight.small,
}));

const CustomActionBar = ({ onAccept, onCancel }: PickersActionBarProps): JSX.Element => (
  <StyledPickersActionBar>
    <StyledCancelButton onClick={onCancel}>Cancel</StyledCancelButton>
    <StyledApplyButton onClick={onAccept}>Apply</StyledApplyButton>
  </StyledPickersActionBar>
);

export default CustomActionBar;
