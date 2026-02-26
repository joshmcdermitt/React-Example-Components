import {
  faCheck,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  OptionUnstyled,
  optionUnstyledClasses,
  PopperUnstyled,
  SelectUnstyled,
} from '@mui/base';
import { styled, Theme } from '@mui/material';
import { get } from 'lodash';
import {
  Control,
  Controller,
  Path,
  useFormContext,
} from 'react-hook-form';
import { withTruncateObject } from '~Common/styles/mixins';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { DROPDOWNSTYLES, FORM_COMPONENT_STYLES } from '~Goals/const/styles';
import DropdownButton from './DropdownButton';

const styles = { ...FORM_COMPONENT_STYLES };

const StyledLabel = styled('label')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacings.small,
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: theme.fontSize.small,
  margin: 0,
}));

const StyledListbox = styled('ul')(({ theme }: { theme: Theme }) => ({
  fontWeight: 500,
  fontSize: theme.fontSize.medium,
  borderRadius: theme.radius.medium,
  listStyle: 'none',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.primary,
  maxWidth: '20rem',
  maxHeight: '12.5rem',
  height: 'auto',
  margin: 0,
  padding: `${theme.spacings.extraSmall} ${theme.spacings.small}`,
  overflowY: 'auto',
}));

const StyledOption = styled(OptionUnstyled)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.large,
  padding: theme.spacings.medium,
  borderRadius: theme.radius.medium,
  cursor: 'pointer',
  [`&.${optionUnstyledClasses.selected}`]: {
    backgroundColor: theme.palette.background.active,
  },
}));

const StyledText = styled('span')(() => ({
  flex: 1,
  display: 'block',
  textAlign: 'left',
  ...withTruncateObject(),
}));

const StyledCheckIcon = styled(FontAwesomeIcon)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.background.brand,
  width: '1.25rem',
  height: '1.25rem',
}));

const StyledErrorText = styled('span')(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.errorPrimary,
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
}));

const StyledRequiredIndicator = styled('span')(({ theme }) => ({
  color: theme.palette.text.errorPrimary,
}));

const StyledPopper = styled(PopperUnstyled)({
  zIndex: 1,
  boxShadow: '0px 3px 5px -1.5008px rgba(0,0,0,0.03),0px 8px 8px -4px rgba(0,0,0,0.04),0px 20px 24px -4px rgba(0,0,0,0.08)',
  borderRadius: '.5rem',
  border: '1px solid #e9eaeb',
  marginTop: '.25rem !important',
});

export interface DropdownItem<T> {
  value: T,
  text: string,
  leftIcon?: JSX.Element,
}

interface ViewProps<T extends string | number> {
  label: string,
  dataTestId: string,
  name: Path<CreateEditGoalFormValues>,
  control: Control<CreateEditGoalFormValues, unknown>,
  options: DropdownItem<T>[],
  placeholder?: string,
  required?: boolean,
  onChange?: (value: T) => void,
}

const View = <T extends string | number, >({
  label,
  dataTestId,
  control,
  name,
  placeholder,
  options,
  required,
  onChange,
  ...props
}: ViewProps<T>): JSX.Element => (
  <StyledLabel data-test-id={`${dataTestId}Label`} {...props}>
    <div data-test-id={`${dataTestId}LabelName`}>
      {label}
      {required && <StyledRequiredIndicator> *</StyledRequiredIndicator>}
    </div>
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? 'This field is required' : false }}
      render={({
        field: {
          onChange: controllerOnChange,
          value,
          ref,
        },
        formState: { errors },
      }) => (
        <>
          <SelectUnstyled
            slots={{
              listbox: StyledListbox,
              root: DropdownButton,
              popper: StyledPopper,
            }}
            slotProps={{
              root: {
                // @ts-expect-error It takes the data-test-id and showErrorState
                'data-test-id': `${dataTestId}Button`,
                showErrorState: !!get(errors, name),
              },
            }}
            css={[DROPDOWNSTYLES.base, styles.buttonInputFields]}
            name={name}
            value={value}
            ref={ref}
            onChange={(_, newValue) => {
              if (onChange) {
                onChange(newValue as T);
              }
              controllerOnChange(newValue);
            }}
            renderValue={(option) => {
              if (!option) {
                return placeholder;
              }
              return option.label;
            }}
          >
            {options && options.map((option) => (
              <StyledOption
                key={option.value}
                value={option.value}
                data-test-id={`${dataTestId}Option-${option.value}`}
              >
                {option.leftIcon && (
                  <div>
                    {option.leftIcon}
                  </div>
                )}
                <StyledText>
                  {option.text}
                </StyledText>
                {value === option.value && (
                  <StyledCheckIcon className="check" icon={faCheck} />
                )}
              </StyledOption>
            ))}
          </SelectUnstyled>
          {get(errors, name) && (
            <StyledErrorText>
              { /* Accessing the message on the errors from react-hook-forms */ }
              { /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */ }
              {get(errors, name).message}
            </StyledErrorText>
          )}
        </>
      )}
    />
  </StyledLabel>
  );

export type DropdownProps<T extends string | number> = Omit<ViewProps<T>, 'control'>;

const Dropdown = <T extends string | number, >({ ...props }: DropdownProps<T>): JSX.Element => {
  const { control } = useFormContext<CreateEditGoalFormValues>();

  const hookProps = {
    control,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default Dropdown;
