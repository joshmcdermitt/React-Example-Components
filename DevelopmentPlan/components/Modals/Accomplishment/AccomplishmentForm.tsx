import { css } from '@emotion/react';
import {
  UseFormReturn,
} from 'react-hook-form';
import { Form, TextField } from '~Common/V3/components/uncontrolled';

import { FormValues } from '~DevelopmentPlan/schemata/CreateAccomplishmentSchemata';
import { Accomplishment } from '~DevelopmentPlan/const/types';
import DatePicker from '~Common/V3/components/DatePicker';
import { palette } from '~Common/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/pro-light-svg-icons';
import Froala from '~Common/V3/components/Froala';
import RequiredIcon from '~Common/V3/components/RequiredIcon';

const styles = {
  accomplishmentForm: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.375rem',
  }),
  datePickerLabel: css({
    fontWeight: 400,
    color: palette.neutrals.gray700,
    fontSize: '.75rem',
    marginBottom: '-0.65rem',
    paddingTop: '.25rem',
    '& svg': {
      marginTop: '0.5rem',
      fontSize: '1.125rem',
    },
    '& input': {
      marginTop: '-2rem !important',
    },
  }),
  datePicker: css({
    width: '100%',
    '& input': {
      marginTop: '-1rem',
      paddingLeft: '1.5rem',
      fontSize: '1rem',
      fontWeight: '500 !important',
    },
  }),
  inputField: css({
    marginTop: '.5rem',
    fontSize: '1rem',
    color: palette.neutrals.gray900,
    borderRadius: '.5rem',
    border: 'none',
    position: 'relative',
    width: '49%',

    '& input': {
      fontWeight: '600 !important',
      fontSize: '.875rem',
      minHeight: 'auto',
      lineHeight: '1.5rem',
    },
    '& textarea': {
      fontSize: '.875rem',
    },
    '& label': {
      color: `${palette.neutrals.gray700} !important`,
      width: '100%',
      borderRadius: '.5rem',
      fontWeight: '400',
    },
  }),
  froala: css({
    fontSize: '1rem',
    fontWeight: '500',
    color: palette.neutrals.gray700,

    '.fr-toolbar .fr-btn-grp': {
      padding: '0',
    },
  }),
  test: css({
    svg: {
      marginRight: 0,
    },
  }),
};

interface ViewProps {
  formContext: UseFormReturn<FormValues>,
  accomplishment: Accomplishment,
}

const View = ({
  formContext,
  accomplishment,
}: ViewProps): JSX.Element => (
  <>
    <Form
      formContext={formContext}
      onSubmit={() => null}
      css={styles.accomplishmentForm}
    >
      <DatePicker
        required
        initialDate={accomplishment?.date}
        onDateSelected={({ date: newDate }) => formContext.setValue('date', newDate?.toDate() ?? new Date())}
        renderLabel={() => (
          <div css={styles.datePickerLabel}>
            <div>Date</div>
            <FontAwesomeIcon icon={faCalendar} />
          </div>
        )}
        name="date"
        disablePast
        css={[styles.inputField, styles.datePicker]}
      />
      <TextField
        name="title"
        label="Title"
        data-test-id="accomplishmentTitle"
        required
      />
      <Froala
        styleOverrides={styles.froala}
        enableEmojis={false}
        label="Description"
        name="description"
        froalaConfigProps={{
          charCounterCount: true,
          charCounterMax: 5000,
          placeholderText: '',
        }}
        richTextEditorProps={{
          name: 'description',
          onChange: ({ value: newText }) => formContext.setValue('description', newText, { shouldDirty: true }),
          initialValue: accomplishment.description,
        }}
        renderRightIcon={(): JSX.Element => <RequiredIcon css={styles.test} />}
      />
    </Form>
  </>
);

interface AccomplishmentFormProps {
  formContext: UseFormReturn<FormValues>,
  accomplishment: Accomplishment,
}

export const AccomplishmentForm = ({
  formContext,
  accomplishment,
}: AccomplishmentFormProps): JSX.Element => {
  const hookProps = {
    formContext,
    accomplishment,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
