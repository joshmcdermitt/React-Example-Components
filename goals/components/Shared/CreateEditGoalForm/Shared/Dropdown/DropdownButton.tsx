import { SelectUnstyledRootSlotProps } from '@mui/base';
import { styled } from '@mui/material';
import { ForwardedRef, forwardRef } from 'react';
import ChevronDownIcon from '~Assets/icons/components/ChevronDownIcon';

interface StyledButtonProps {
  showErrorState?: boolean;
  expanded?: boolean;
}

const StyledButton = styled('button', {
  shouldForwardProp: (prop) => !['showErrorState', 'expanded'].includes(prop as string),
})<StyledButtonProps>(({ theme, showErrorState }) => ({
  padding: `${theme.spacings.medium} ${theme.spacings.large}`,
  border: `1px solid ${showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.primary}`,
  borderRadius: theme.radius.medium,
  background: theme.palette.background.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.medium,
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: theme.fontSize.medium,
  lineHeight: theme.lineHeight.medium,
  position: 'relative',
  boxShadow: theme.palette.shadow.extraSmall,
  '&:focus, &[aria-expanded="true"]': {
    padding: `${theme.spacings.medium} ${theme.spacings.large}`,
    border: `2px solid ${showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.brand}`,
    outline: 'none',
  },
}));

const StyledPlaceholder = styled('span')(({ theme }) => ({
  color: theme.palette.text.placeholder,
  flex: 1,
}));

const StyledChevronDownIcon = styled(ChevronDownIcon, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ theme, expanded }) => ({
  fontSize: '1.25rem',
  color: theme.palette.foreground.quaternary,
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s ease',
}));

// eslint-disable-next-line @typescript-eslint/ban-types
const DropdownButton = forwardRef(<T extends {}>({
  children,
  ownerState,
  ...props
}: SelectUnstyledRootSlotProps<T> & { placeholder?: string, 'data-test-id': string, showErrorState?: boolean },
  ref: ForwardedRef<HTMLButtonElement>): JSX.Element => (
    <StyledButton
      {...props}
      showErrorState={props.showErrorState}
      expanded={ownerState.open}
      type="button"
      ref={ref}
    >
      {ownerState.value != null && (
      <>{children}</>
      )}
      {ownerState.value == null && (
      <StyledPlaceholder>{children}</StyledPlaceholder>
      )}
      <StyledChevronDownIcon expanded={ownerState.open} />
    </StyledButton>
  ));

export default DropdownButton;
