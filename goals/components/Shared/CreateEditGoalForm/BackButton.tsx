import { styled } from '@mui/material';
import { LocationDescriptorObject } from 'history';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import ArrowLeftIcon from '~Assets/icons/components/ArrowLeftIcon';
import ConfirmExitButton from './Shared/ConfirmExitButton';

const StyledConfirmExitButton = styled(ConfirmExitButton)({
  alignSelf: 'start',
});

const StyledBackButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.medium,
  color: theme.palette.text.tertiary,
  fontSize: theme.fontSize.large,
  lineHeight: theme.lineHeight.large,
  border: 0,
  fontWeight: 600,
  background: 'none',
}));

interface ViewProps {
  returnRoute: LocationDescriptorObject,
  shouldConfirmClose: boolean,
}

const View = ({
  returnRoute,
  shouldConfirmClose,
  ...props
}: ViewProps): JSX.Element => (
  <StyledConfirmExitButton
    toLocation={returnRoute}
    shouldConfirmClose={shouldConfirmClose}
    renderButton={({ onClick }) => (
      <StyledBackButton onClick={onClick}>
        <ArrowLeftIcon />
        <span>
          Back
        </span>
      </StyledBackButton>
    )}
    {...props}
  />
);

interface BackButtonProps extends Omit<ViewProps, 'goalRoutes' | 'shouldConfirmClose'> {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
}

const BackButton = ({
  formContext,
  ...props
}: BackButtonProps): JSX.Element => {
  const shouldConfirmClose = useMemo(() => formContext.formState.isDirty, [formContext.formState.isDirty]);

  const hookProps = {
    shouldConfirmClose,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default BackButton;
