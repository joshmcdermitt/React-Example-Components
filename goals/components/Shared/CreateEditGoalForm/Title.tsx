import {
  useInput,
  UseInputInputSlotProps,
  UseInputParameters,
  UseInputRootSlotProps,
} from '@mui/base';
import { styled } from '@mui/material';
import { ComponentProps } from 'react';
import { useFormContext, UseFormRegister } from 'react-hook-form';
import InfoCircleIcon from '~Assets/icons/components/InfoCircleIcon';
import StyledRequiredIcon from '~Goals/components/Shared/RequiredIcon';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { FORM_COMPONENT_STYLES } from '~Goals/const/styles';

const styles = {
  ...FORM_COMPONENT_STYLES,
};

const StyledLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacings.small,
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: theme.fontSize.small,
  margin: 0,
}));

interface StyledInputContainerProps {
  showErrorState: boolean;
}

const StyledInputContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'showErrorState',
})<StyledInputContainerProps>(({ theme, showErrorState }) => ({
  backgroundColor: theme.palette.background.primary,
  border: `1px solid ${showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.primary}`,
  borderRadius: theme.radius.medium,
  padding: `${theme.spacings.medium} ${theme.spacings.large}`,
  lineHeight: theme.lineHeight.medium,
  fontSize: theme.fontSize.medium,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.medium,
  '&:focus-within': {
    padding: `${theme.spacings.medium} ${theme.spacings.large}`,
    border: `2px solid ${
      showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.brand
    }`,
  },
}));

const StyledInput = styled('input')(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.primary,
  border: 0,
  color: theme.palette.text.primary,
  '&::placeholder': {
    color: theme.palette.text.placeholder,
  },
}));

const StyledInfoCircle = styled(InfoCircleIcon)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.foreground.errorPrimary,
}));

const StyledBottomContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const StyledErrorText = styled('span')(({ theme }) => ({
  color: theme.palette.text.errorPrimary,
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
}));

const StyledCharacterCounter = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
  fontWeight: 400,
  marginLeft: 'auto',
  zIndex: 1,
}));

const MAX_LENGTH = 70;
type InputProps = Omit<ComponentProps<'input'>, 'maxLength'>;

interface ViewProps {
  rootProps: UseInputRootSlotProps,
  inputProps: UseInputInputSlotProps | InputProps,
  characterCount: number,
  showErrorState: boolean,
  register: UseFormRegister<CreateEditGoalFormValues>
  errorText?: string,
}

const View = ({
  rootProps,
  inputProps,
  characterCount,
  showErrorState,
  errorText,
  register,
  ...props
}: ViewProps): JSX.Element => (
  <div {...props}>
    <StyledLabel data-test-id="goalsTitleLabel">
      <div>
        {'Title '}
        <StyledRequiredIcon />
      </div>
      <StyledInputContainer css={styles.buttonInputFields} showErrorState={showErrorState} {...rootProps}>
        <StyledInput
          placeholder="Add a clear, concise title to define your objective"
          maxLength={MAX_LENGTH}
          data-test-id="goalsTitle"
          {...inputProps}
          {...register('title')}
          onKeyDown={(e: React.KeyboardEvent): void => {
            if (e.key === 'Enter') e.preventDefault();
          }}
        />
        {!!showErrorState && (
          <StyledInfoCircle />
        )}
      </StyledInputContainer>
      <StyledBottomContainer>
        {errorText && <StyledErrorText>{errorText}</StyledErrorText>}
        <StyledCharacterCounter>{`${characterCount} / ${MAX_LENGTH}`}</StyledCharacterCounter>
      </StyledBottomContainer>
    </StyledLabel>
  </div>
);

interface TitleProps extends UseInputParameters {
  inputProps?: InputProps,
  defaultValue?: string,
}

const Title = ({
  inputProps = {},
  defaultValue,
  ...props
}: TitleProps): JSX.Element => {
  const { register, formState: { errors }, watch } = useFormContext<CreateEditGoalFormValues>();

  const {
    getRootProps,
    getInputProps,
  } = useInput({
    defaultValue,
    ...props,
  });

  const combinedInputProps = { ...getInputProps(), ...inputProps };
  const rootProps = getRootProps();

  const showErrorState = !!errors.title;

  const characterCount = watch('title')?.length || 0;
  const errorText = errors.title?.message;

  const hookProps = {
    inputProps: combinedInputProps,
    characterCount,
    rootProps,
    errorText,
    showErrorState,
    register,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default Title;
