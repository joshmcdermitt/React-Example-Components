import { SerializedStyles } from '@emotion/react';
import {
  css,
  styled,
  Theme,
  useTheme,
} from '@mui/material';
import {
  DateRangePicker,
  DateRangePickerDay,
  dateRangePickerDayClasses,
  DateRangePickerProps,
  LocalizationProvider,
  SingleInputDateRangeField,
} from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';
import moment, { Moment } from 'moment';
import { memo } from 'react';
import { useFormContext, UseFormSetValue } from 'react-hook-form';
import CalendarIcon from '~Assets/icons/components/CalendarIcon';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import StyledRequiredIcon from '~Goals/components/Shared/RequiredIcon';
import { FORM_COMPONENT_STYLES } from '~Goals/const/styles';
import CustomActionBar from './CustomActionBar';

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

const StyledCalendarIcon = styled(CalendarIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1.25rem',
}));

/*
  This is not using styled because MUI breaks when you pass this as a styled component to the slot
  It will add a random "end" label that is not usually there and the calendar popup will not be tied to the input anymore
*/
const dateRangePickerStyles = (theme: Theme, showErrorState: boolean): SerializedStyles => css({
  backgroundColor: theme.palette.background.primary,
  border: `1px solid ${showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.primary}`,
  outline: '1px solid transparent',
  padding: `${theme.spacings.medium} ${theme.spacings.large}`,
  color: theme.palette.text.primary,
  borderRadius: theme.radius.medium,
  ':focus-within': {
    padding: `${theme.spacings.medium} ${theme.spacings.large}`,
    border: `2px solid ${showErrorState ? theme.palette.border.errorSubtle : theme.palette.border.brand}`,
  },
  '.MuiInput-root': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacings.small,
    lineHeight: theme.lineHeight.medium,
    fontSize: theme.fontSize.small,
    '::before': {
      content: 'none',
      display: 'none',
    },
    '::after': {
      content: 'none',
      display: 'none',
    },
  },
  '.MuiInput-input': {
    fontWeight: 600,
    '&::placeholder': {
      color: theme.palette.text.placeholder,
      opacity: 1,
      fontWeight: 400,
    },
  },
  '.MuiInputBase-input, .MuiOutlinedInput-root': {
    minWidth: '10rem',
  },
  testDay: {
    background: 'black',
  },
});

const StyledErrorText = styled('span')(({ theme }) => ({
  color: theme.palette.text.errorPrimary,
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
}));

const StyledDateRangePickerDay = styled(DateRangePickerDay<Moment>)(
  ({
    theme,
    isStartOfHighlighting,
    isEndOfHighlighting,
  }) => ({
    ...((isStartOfHighlighting || isEndOfHighlighting) && {
      [`.${dateRangePickerDayClasses.rangeIntervalPreview} button`]: {
        backgroundColor: theme.palette.background.brand,
      },
    }),
  }),
);

interface ViewProps {
  theme: Theme,
  showErrorState: boolean,
  setValue: UseFormSetValue<CreateEditGoalFormValues>,
  dateRangePickerProps?: Omit<DateRangePickerProps<Moment>, 'name' | 'slots' | 'slotProps'>,
  errorText?: string,
  startTimeInMillis: number,
  endTimeInMillis: number,
}

const View = memo(({
  theme,
  errorText,
  showErrorState,
  dateRangePickerProps = {},
  setValue,
  startTimeInMillis,
  endTimeInMillis,
  ...props
}: ViewProps): JSX.Element => (
  <div
    {...props}
  >
    <StyledLabel data-test-id="goalsTargetRangeLabel">
      <div>
        {'Target range '}
        <StyledRequiredIcon />
      </div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateRangePicker
          css={[dateRangePickerStyles(theme, showErrorState), styles.buttonInputFields]}
          closeOnSelect={false}
          slots={{
            field: SingleInputDateRangeField,
            day: StyledDateRangePickerDay,
            actionBar: CustomActionBar,
          }}
          slotProps={{
            textField: {
              variant: 'outlined',
              InputProps: {
                startAdornment: <StyledCalendarIcon />,
                'data-test-id': 'goalsTargetRangeInput',
              },
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiOutlinedInput-root, .MuiInputBase-root, .MuiOutlinedInput-input': {
                  padding: '0rem',
                  gap: theme.spacings.medium,
                  lineHeight: theme.lineHeight.medium,
                },
              },
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  borderRadius: theme.radius.extraLarge,
                },
              },
            },
            actionBar: {
              actions: ['cancel', 'accept'],
            },
          }}
          onChange={([startTime, endTime]) => {
            setValue('startTimeInMillis', startTime?.valueOf() ?? startTimeInMillis);
            setValue('endTimeInMillis', endTime?.valueOf() ?? endTimeInMillis);
          }}
          name="targetRange"
          {...dateRangePickerProps}
          value={[moment(startTimeInMillis), moment(endTimeInMillis)]}
          format="MM/DD/YY"
        />
      </LocalizationProvider>
      {errorText && <StyledErrorText>{errorText}</StyledErrorText>}
    </StyledLabel>
  </div>
), (prevProps, nextProps) => (
  prevProps.showErrorState === nextProps.showErrorState
  && prevProps.errorText === nextProps.errorText
  && prevProps.startTimeInMillis === nextProps.startTimeInMillis
  && prevProps.endTimeInMillis === nextProps.endTimeInMillis
));

type TargetRangeProps = Pick<ViewProps, 'dateRangePickerProps'>;

const TargetRange = ({ ...props }: TargetRangeProps): JSX.Element => {
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<CreateEditGoalFormValues>();

  const theme = useTheme();

  const showErrorState = !!errors.startTimeInMillis || !!errors.endTimeInMillis;
  const errorText = errors.startTimeInMillis?.message ?? errors.endTimeInMillis?.message;
  const {
    startTimeInMillis,
    endTimeInMillis,
  } = getValues();

  const hookProps = {
    theme,
    errorText,
    showErrorState,
    setValue,
    startTimeInMillis,
    endTimeInMillis,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default TargetRange;
