import {
  UseFormReturn,
} from 'react-hook-form';
import { Form } from '~Common/V3/components/uncontrolled';

import { FormValues } from '~DevelopmentPlan/schemata/CreateAccomplishmentSchemata';
import { Accomplishment } from '~DevelopmentPlan/const/types';
import { AccomplishmentForm } from './AccomplishmentForm';

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
    >
      <AccomplishmentForm
        formContext={formContext}
        accomplishment={accomplishment}
      />
    </Form>
  </>
);

interface AddAccomplishmentProps {
  formContext: UseFormReturn<FormValues>,
  accomplishment: Accomplishment,
}

export const AddAccomplishment = ({
  formContext,
  accomplishment,
}: AddAccomplishmentProps): JSX.Element => {
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
