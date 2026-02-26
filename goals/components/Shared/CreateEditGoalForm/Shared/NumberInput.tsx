import { styled } from '@mui/material';
import { get } from 'lodash';
import {
  Control,
  Controller,
  Path,
  useFormContext,
} from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { FORM_COMPONENT_STYLES } from '~Goals/const/styles';
import StyledRequiredIcon from '~Goals/components/Shared/RequiredIcon';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { MAX_GOAL_VALUE_LENGTH } from '~Goals/const';

const styles = { ...FORM_COMPONENT_STYLES };

const StyledLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacings.small,
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: theme.fontSize.small,
  margin: 0,
}));

interface StyledNumberInputProps {
  showErrorState: boolean,
}

const StyledNumberInput = styled('div', {
  shouldForwardProp: (prop) => prop !== 'showErrorState',
})<StyledNumberInputProps>(({ theme, showErrorState }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.medium,
  padding: theme.spacings.medium,
  borderRadius: theme.radius.medium,
  border: `1px solid ${showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.primary}`,
  backgroundColor: theme.palette.background.primary,
  color: theme.palette.text.placeholder,
  fontSize: theme.fontSize.medium,
  lineHeight: theme.lineHeight.medium,
  outline: 'none',
  flexWrap: 'nowrap',
  minWidth: 'fit-content',
  '&:focus-within': {
    outline: `2px solid ${showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.brand}`,
    outlineOffset: '-1px',
  },
}));

const StyledButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  outline: 0,
  border: `1px solid ${theme.palette.border.secondary}`,
  borderRadius: theme.radius.small,
  width: '1.5rem',
  height: '1.5rem',
  fontSize: '1.25rem',
  color: theme.palette.text.placeholder,
}));

const StyledErrorText = styled('span')(({ theme }) => ({
  color: theme.palette.text.errorPrimary,
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
}));

const StyledInputContainer = styled('div')({
  position: 'relative',
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  overflow: 'hidden',
});

const StyledNumericFormat = styled(NumericFormat)(({ theme }) => ({
  width: '3ch',
  maxWidth: '12ch',
  border: 0,
  color: theme.palette.text.primary,
  textAlign: 'right',
  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
    appearance: 'none',
    margin: 0,
  },
  '&[size]': {
    width: 'auto',
    textAlign: 'center',
  },
}));

interface ViewProps {
  adjustValue: (delta: number) => void,
  control: Control<CreateEditGoalFormValues, number>,
  label: string,
  dataTestId: string,
  name: Path<CreateEditGoalFormValues>,
  showErrorState: boolean,
  errorText: string | undefined,
  required: boolean,
}

const View = ({
  adjustValue,
  control,
  label,
  dataTestId,
  name,
  showErrorState,
  errorText,
  required,
  ...props
}: ViewProps): JSX.Element => (
  <div {...props}>
    <StyledLabel data-test-id={`${dataTestId}Label`}>
      <div data-test-id={`${dataTestId}LabelName`}>
        {`${label} `}
        {required && <StyledRequiredIcon />}
      </div>
      <StyledNumberInput
        className={`number-input ${dataTestId}`}
        css={styles.buttonInputFields}
        showErrorState={showErrorState}
      >
        <StyledButton onClick={() => adjustValue(-1)} type="button">
          -
        </StyledButton>
        <Controller
          control={control}
          name={name}
          render={({
            field: {
              onChange,
              value,
              ref,
            },
          }) => (
            <StyledInputContainer>
              <StyledNumericFormat
                ref={ref}
                value={typeof value === 'number' ? value.toString() : '0'}
                onValueChange={({ value: newValue }: { value: string }) => {
                  onChange(newValue ? parseFloat(newValue) : 0);
                }}
                size={Math.max(3, (typeof value === 'number' ? value.toString() : '0').length)}
                onKeyDown={(e: React.KeyboardEvent): void => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                thousandSeparator=","
                decimalSeparator="."
                valueIsNumericString
                maxLength={MAX_GOAL_VALUE_LENGTH}
                data-test-id={`${dataTestId}Input`}
              />
            </StyledInputContainer>
          )}
        />
        <StyledButton onClick={() => adjustValue(1)} type="button">
          +
        </StyledButton>
      </StyledNumberInput>
    </StyledLabel>
    {errorText && <StyledErrorText>{errorText}</StyledErrorText>}
  </div>
);

type NumberInputProps = Pick<ViewProps, 'label' | 'dataTestId' | 'name' | 'required'>;

const NumberInput = ({
  name,
  required,
  ...props
}: NumberInputProps): JSX.Element => {
  const {
    getValues,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateEditGoalFormValues>();

  const adjustValue = (delta: number): void => {
    const oldValue = getValues(name) as number;
    const updatedValue = oldValue + delta;
    setValue(name, updatedValue);
  };

  // Lodash get is not typed
  const errorText = (get(errors, name) as { message: string })?.message;
  const showErrorState = !!errorText;

  const hookProps = {
    adjustValue,
    control,
    name,
    showErrorState,
    errorText,
    required,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default NumberInput;
