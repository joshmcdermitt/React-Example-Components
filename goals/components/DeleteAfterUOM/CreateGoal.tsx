// FEATURE: Remove File after UoM FF removed
import { css } from '@emotion/react';
import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Goals } from '@josh-hr/types';
import {
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from '~Common/components/Toasts';
import { palette } from '~Common/styles/colors';
import { forMobileObject } from '~Common/styles/mixins';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { Form } from '~Common/V3/components/uncontrolled';
import useGetCreateGoalDefaultValues, { CreateGoalWorkflow } from '~Goals/components/DeleteAfterUOM/useGetCreateGoalDefaultValues';
import useGetCreateEditFormResolver, { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '~Goals/hooks/utils/useGetGoalRoutes';
import {
  conformToDto,
} from '~Goals/schemata/CreateEditGoalSchema';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { CreateGoalForm } from '~Goals/components/DeleteAfterUOM/Create';
import { InteriorTopBar } from '../GoalsTopBar/InteriorTopBar';
import { BackInformation, ValidationErrors } from '../../const/types';
import { useCreateGoal } from './useCreateGoal';

const styles = {
  container: css({
    width: '100%',
    margin: '1.875rem 1.875rem 0 1.875rem',
  }, forMobileObject({
    margin: '.875rem .875rem 0 .875rem',
    overflow: 'hidden',
  })),
  textBackButton: css({
    fontSize: '1rem',
    fontWeight: 400,
    color: palette.neutrals.gray800,
  }),
  icon: css({
    marginRight: '0.5rem',
  }),
  buttonSpacing: css({
    marginRight: '.625rem',
  }),
  rightSide: css(forMobileObject({
    display: 'flex',
    justifyContent: 'space-between',
  })),
};

interface ViewProps {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  runValidations: () => void,
  allowedContextTypes?: Goals.GoalContextType[],
  backLink: string,
  backText: string,
  goalRoutes: GetGoalRoutesReturn['goalRoutes'],
}

const View = ({
  formContext,
  runValidations,
  allowedContextTypes,
  backLink,
  backText,
  goalRoutes,
}: ViewProps): JSX.Element => (
  <div css={styles.container}>
    <Form
      formContext={formContext}
      onSubmit={() => null}
    >
      <InteriorTopBar
        renderLeftSide={() => (
          <JoshButton
            component={Link}
            to={backLink}
            variant="text"
            css={styles.textBackButton}
            textButtonColor={palette.neutrals.gray700}
            data-test-id="goalsBackToGoalsList"
          >
            <FontAwesomeIcon
              css={styles.icon}
              icon={faArrowLeft}
            />
            {`Back to ${backText}`}
          </JoshButton>
        )}
        renderRightSide={() => (
          <div css={styles.rightSide}>
            <JoshButton
              data-test-id="goalsCancelCreateGoal"
              variant="ghost"
              css={styles.buttonSpacing}
              component={Link}
              to={goalRoutes?.Dashboard}
            >
              Cancel
            </JoshButton>
            <JoshButton
              type="submit"
              data-test-id="goalsSaveCreateGoal"
              onClick={runValidations}
            >
              Save
            </JoshButton>
          </div>
        )}
      />
      <CreateGoalForm
        formContext={formContext}
        allowedContextTypes={allowedContextTypes}
      />
    </Form>
  </div>
);

const CreateGoal = (): JSX.Element => {
  const { state: locationState } = useLocation<{ backInformation: BackInformation }>();
  const { createGoalDefaultValues, workflow } = useGetCreateGoalDefaultValues();
  const { schema, formResolver } = useGetCreateEditFormResolver();
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const { backInformation } = locationState ?? {};
  const backLink = backInformation?.location ?? goalRoutes.Dashboard;
  const backText = backInformation?.backText ?? featureNamesText.goals.plural;

  const formContext = useForm<CreateEditGoalFormValues>({
    defaultValues: createGoalDefaultValues,
    resolver: formResolver,
  });

  const history = useHistory();

  const { mutate: createGoalMutation } = useCreateGoal({
    ...((workflow && workflow === CreateGoalWorkflow.Clone) && {
      errorText: `There was an error cloning your ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
    }),
  });

  const runValidations = (): void => {
    const data = formContext.getValues();
    schema
      .validate(data, { abortEarly: false })
      .then(() => {
        const formData = conformToDto(data);
        createGoalMutation({ goal: formData }, {
          onSuccess: (successData) => {
            const { goalId } = successData.response;

            history.push(goalRoutes.ViewById.replace(':goalId', goalId), { backInformation });
          },
        });
      })
      .catch((validationError: ValidationErrors) => {
        validationError.errors.forEach((error) => {
          toast.error(error);
        });
      });
  };

  const hookProps = {
    formContext,
    runValidations,
    backLink,
    backText,
    goalRoutes,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };

export default CreateGoal;
