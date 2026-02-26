import { faCalendar } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FORM_COMPONENT_STYLES } from '~Goals/const/styles';
import { UseFormReturn } from 'react-hook-form';
import DatePicker, { OnDateSelectedHandler } from '~Common/V3/components/DatePicker';
import moment from 'moment-timezone';
import { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';
import { SerializedStyles } from '@emotion/react';

const styles = {
  ...FORM_COMPONENT_STYLES,
};

interface GoalDateSelectionProps {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  handleStartTimeChange: OnDateSelectedHandler,
  handleEndTimeChange: OnDateSelectedHandler,
  startDateStyles: SerializedStyles,
  endDateStyles: SerializedStyles,
}

const GoalDateSelection = ({
  formContext,
  handleStartTimeChange,
  handleEndTimeChange,
  startDateStyles,
  endDateStyles,
}: GoalDateSelectionProps): JSX.Element => (
  <>
    <DatePicker
      css={[styles.inputField, styles.datePicker, startDateStyles]}
      required
      initialDate={formContext.getValues('startTimeInMillis')}
      onDateSelected={handleStartTimeChange}
      renderLabel={() => (
        <div css={styles.datePickerLabel}>
          Start Date
        </div>
      )}
      leftIconType={() => <FontAwesomeIcon icon={faCalendar} />}
      name="startTimeInMillis"
      disablePast={false}
    />
    <DatePicker
      css={[styles.inputField, styles.datePicker, endDateStyles]}
      required
      initialDate={formContext.getValues('endTimeInMillis')}
      minDate={moment(formContext.watch('startTimeInMillis'))}
      onDateSelected={handleEndTimeChange}
      renderLabel={() => (
        <div css={styles.datePickerLabel}>
          End Date
        </div>
      )}
      leftIconType={() => <FontAwesomeIcon icon={faCalendar} />}
      name="endTimeInMillis"
      disablePast={false}
    />
  </>
);

export default GoalDateSelection;
