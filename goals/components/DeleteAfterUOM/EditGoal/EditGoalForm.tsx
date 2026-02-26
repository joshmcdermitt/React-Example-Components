import { css } from '@emotion/react';
import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Goals } from '@josh-hr/types';
import { Location } from 'history';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from '~Common/components/Toasts';
import { palette } from '~Common/styles/colors';
import { forMobileObject } from '~Common/styles/mixins';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { Form } from '~Common/V3/components/uncontrolled';
import { setupPayloads } from '~Goals/const/functions';
import { ValidationErrors } from '~Goals/const/types';
import useUpdateGoal from '~Goals/hooks/useUpdateGoal';
import useGetCreateEditFormResolver, { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import {
  conformToDto,
} from '~Goals/schemata/CreateEditGoalSchema';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { CreateGoalForm } from '~Goals/components/DeleteAfterUOM/Create';
import { InteriorTopBar } from '../../GoalsTopBar/InteriorTopBar';

const styles = {
  textBackButton: css({
    fontSize: '1rem',
    fontWeight: 400,
    color: palette.neutrals.gray800,
  }),
  icon: css({
    marginRight: '0.5rem',
  }),
  rightSide: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
  }, forMobileObject({
    justifyContent: 'space-between',
  })),
};

interface ViewProps {
  runValidations: () => void,
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  toGoalDetails: Location,
  featureNamesText: FeatureNamesText,
}

const View = ({
  runValidations,
  formContext,
  toGoalDetails,
  featureNamesText,
  ...props
}: ViewProps): JSX.Element => (
  <Form
    formContext={formContext}
    onSubmit={() => null}
    {...props}
  >
    <InteriorTopBar
      renderLeftSide={() => (
        <>
          <JoshButton
            component={Link}
            to={toGoalDetails}
            variant="text"
            css={styles.textBackButton}
            textButtonColor={palette.neutrals.gray700}
            data-test-id="goalsBackToGoalsList"
          >
            <FontAwesomeIcon
              css={styles.icon}
              icon={faArrowLeft}
            />
            Back
          </JoshButton>
        </>
      )}
      renderRightSide={() => (
        <div css={styles.rightSide}>
          <JoshButton
            data-test-id="goalsCancelCreateGoal"
            variant="ghost"
            component={Link}
            to={toGoalDetails}
          >
            Cancel
          </JoshButton>
          <JoshButton
            type="submit"
            data-test-id="goalsSaveCreateGoal"
            onClick={runValidations}
            disabled={formContext.formState.isSubmitting}
          >
            {`Save ${featureNamesText.goals.singular}`}
          </JoshButton>
        </div>
      )}
    />
    <CreateGoalForm
      formContext={formContext}
      isEdit
    />
  </Form>
);

interface EditGoalFormProps {
  goal: Goals.Goal,
}

const EditGoalForm = ({
  goal,
  ...props
}: EditGoalFormProps): JSX.Element => {
  const { schema, formResolver } = useGetCreateEditFormResolver();

  const formContext = useForm<CreateEditGoalFormValues>({
    resolver: formResolver,
    defaultValues: goal,
  });
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();

  const {
    updateGoal,
  } = useUpdateGoal();

  const submitFormData = async (data: CreateEditGoalFormValues): Promise<void> => {
    const formData = conformToDto(data);
    const { goalPayload, participantsPayload } = setupPayloads(formData);

    await updateGoal({
      participantsPayload,
      goalPayload,
      goalId: goal.goalId,
    }).then(() => {
      onSuccess();
    });
  };

  const runValidations = (): void => {
    const data = formContext.getValues();
    schema
      .validate(data, { abortEarly: false })
      .then(async () => {
        await submitFormData(data);
      })
      .catch((err: ValidationErrors) => {
        if (err && err.errors) {
          err.errors.forEach((error) => {
            toast.error(error);
          });
        } else {
          toast.error('There was an error submitting your form. Please try again.');
        }
      });
  };

  const { state: locationState } = useLocation();

  const history = useHistory();

  const onSuccess = (): void => {
    history.push(goalRoutes.ViewById.replace(':goalId', goal.goalId), locationState);
  };

  const toGoalDetails: Location = {
    pathname: goalRoutes.ViewById.replace(':goalId', goal.goalId),
    state: locationState,
    search: '',
    hash: '',
  };

  const hookProps = {
    formContext,
    runValidations,
    toGoalDetails,
    featureNamesText,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default EditGoalForm;
