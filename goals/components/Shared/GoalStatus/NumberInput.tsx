import { styled } from '@mui/material';
import { get } from 'lodash';
import {
  Control,
  Controller,
  Path,
  useFormContext,
} from 'react-hook-form';
import { css } from '@emotion/react';
import { NumericFormat } from 'react-number-format';
import { FORM_COMPONENT_STYLES } from '~Goals/const/styles';
import StyledRequiredIcon from '~Goals/components/Shared/RequiredIcon';
import { CreateEditStatusUpdateFormValues } from '~Goals/schemata/CreateEditGoalStatusUpdateSchema';
import { MAX_GOAL_VALUE_LENGTH } from '~Goals/const';

const styles = {
  ...FORM_COMPONENT_STYLES,
  errorTextContainer: (showErrorState: boolean) => css({
    visibility: showErrorState ? 'visible' : 'hidden',
  }),
  inputContainer: css({
    rowGap: '.375rem',
    minWidth: '4.375rem',
  }),
};

const StyledLabel = styled('label')<{ $isLabelHidden?: boolean }>(({ theme, $isLabelHidden }) => ({
  display: $isLabelHidden ? 'none' : 'flex',
  flexDirection: 'column',
  gap: theme.spacings.small,
  color: theme.palette.text.secondary,
  fontWeight: 400,
  fontSize: theme.fontSize.extraSmall,
  margin: 0,
  marginBottom: '.375rem',
  letterSpacing: '.0313rem',
}));

const StyledErrorTextContainer = styled('div')({});

interface StyledNumberInputProps {
  showErrorState: boolean,
}

const StyledNumberInput = styled('div', {
  shouldForwardProp: (prop) => prop !== 'showErrorState',
})<StyledNumberInputProps>(({ theme, showErrorState }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.medium,
  padding: `calc(${theme.spacings.medium} + .0625rem)`,
  borderRadius: theme.radius.medium,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.placeholder,
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
  minWidth: 'fit-content',
  width: 'fit-content',
  '&:focus-within': {
    padding: theme.spacings.medium,
    border: `.125rem solid ${showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.brand}`,
  },
}));

const StyledErrorText = styled('span')(({ theme }) => ({
  color: theme.palette.text.errorPrimary,
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
  whiteSpace: 'nowrap',
}));

const StyledNumericFormat = styled(NumericFormat)(({ theme }) => ({
  width: '3ch',
  maxWidth: '12ch',
  border: 0,
  color: theme.palette.text.primary,
  textAlign: 'center',
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
  control: Control<CreateEditStatusUpdateFormValues, number>,
  label?: string | undefined,
  dataTestId: string,
  name: Path<CreateEditStatusUpdateFormValues>,
  showErrorState: boolean,
  errorText: string | undefined,
  required: boolean,
  handleKeyDown: (event: React.KeyboardEvent) => void,
  isLabelHidden?: boolean,
}

const View = ({
  control,
  label,
  dataTestId,
  name,
  showErrorState,
  errorText,
  required,
  handleKeyDown,
  isLabelHidden = false,
  ...props
}: ViewProps): JSX.Element => (
  <div {...props} css={styles.inputContainer}>
    <StyledLabel
      data-test-id={`${dataTestId}Label`}
      className="number-input-label"
      $isLabelHidden={isLabelHidden}
    >
      {label && (
        <div>
          {`${label} `}
          {required && showErrorState && <StyledRequiredIcon />}
        </div>
      )}
    </StyledLabel>
    <StyledNumberInput
      className={`number-input ${dataTestId}`}
      css={styles.buttonInputFields}
      showErrorState={showErrorState}
    >
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
          <StyledNumericFormat
            ref={ref}
            value={value ? value.toString() : '0'}
            onValueChange={({ value: newValue }) => {
              onChange(parseFloat(newValue) ?? 0);
            }}
            size={Math.max(3, (value ? value.toString() : '0').length + 2)}
            onKeyDown={handleKeyDown}
            thousandSeparator=","
            decimalSeparator="."
            valueIsNumericString
            maxLength={MAX_GOAL_VALUE_LENGTH + 2} // Account for decimals
            data-test-id={`${dataTestId}Input`}
          />
        )}
      />
    </StyledNumberInput>
    <StyledErrorTextContainer css={styles.errorTextContainer(showErrorState)}>
      {errorText?.includes('value must be a `number` type') ? (
        <StyledErrorText>
          Please enter a valid number.
        </StyledErrorText>
      ) : (
        errorText && <StyledErrorText>{errorText}</StyledErrorText>
      )}
    </StyledErrorTextContainer>
  </div>
);

type NumberInputProps = Pick<ViewProps,
  'label'
  | 'dataTestId'
  | 'name'
  | 'required'
  | 'isLabelHidden'
>;

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
  } = useFormContext<CreateEditStatusUpdateFormValues>();

  // Lodash get is not typed
  const errorText = (get(errors, name) as { message: string })?.message;
  const showErrorState = !!errorText;

  const getInputSelectedValue = (currentTarget: HTMLInputElement): string => {
    const { value, selectionStart, selectionEnd } = currentTarget;
    const selectedValue = value.substring(selectionStart ?? 0, selectionEnd ?? 0);
    return selectedValue;
  };

  const handleDecimal = (event: React.KeyboardEvent): void => {
    const target = event.target as HTMLInputElement;
    const oldValue = String(getValues(name)); // force string to compare with selectedValue
    const selectedValueString = getInputSelectedValue(target);
    const selectedValue = String(selectedValueString.replace(/,/g, '')); // strip thousand separator
    const unselectedValue = String(oldValue.replace(selectedValue, ''));

    // Prevent multiple decimal points
    if (oldValue.includes('.') && unselectedValue.includes('.')) {
      event.preventDefault();
      return;
    }

    // Update value with decimal point, including replacing selection
    if (selectedValue !== '' && oldValue !== selectedValue) {
      const selectorLocation = target.selectionStart ?? 0;
      const replacementString = oldValue.replace(selectedValue, '.');
      setValue(name, replacementString);
      target.setSelectionRange(selectorLocation + 1, selectorLocation + 1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === '.' && (event.target as HTMLInputElement)) {
      handleDecimal(event);
      return;
    }

    // Allow navigation and editing keys. Exclude Enter to prevent saving form
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
      '.',
    ];

    // Allow navigation keys and decimal point
    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Block any other keys that aren't numbers
    // REFACTOR: Extract to common utils
    if (!/^-?\d*\.?\d*$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const hookProps = {
    control,
    name,
    showErrorState,
    errorText,
    required,
    handleKeyDown,
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
