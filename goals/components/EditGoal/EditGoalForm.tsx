import { styled } from '@mui/material';
import { LocationDescriptorObject } from 'history';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import withLoadingSkeleton from '~Common/components/withLoadingSkeleton';
import { setupPayloads } from '~Goals/const/functions';
import { BackInformation } from '~Goals/const/types';
import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';
import useUpdateGoal from '~Goals/hooks/useUpdateGoal';
import useGetCreateEditFormResolver, { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import getFormattedGoalForEditing from '~Goals/utils/getFormattedGoalForEditing';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import {
  FORM_COMPONENT_STYLES,
  FORM_COMPONENT_WRAPPER_STYLES,
} from '~Goals/const/styles';
import { CreateMeasurementUnitTypePayload, useCreateMeasurementUnitType } from '~Goals/hooks/useCreateMeasurementUnitType';
import CreateEditGoalForm from '../Shared/CreateEditGoalForm';
import BackButton from '../Shared/CreateEditGoalForm/BackButton';

const styles = {
  ...FORM_COMPONENT_STYLES,
  ...FORM_COMPONENT_WRAPPER_STYLES,
};

const StyledCreateGoal = styled('div')(() => ({}));

const StyledBackButton = styled(BackButton)({});

const StyledEditGoalFormContainer = styled('div')({});

const StyledHeaderText = styled('div')({});

const StyledSkeletonLoader = styled(SkeletonLoader)({});

interface LocationState {
  backInformation: BackInformation,
}

type ReturnRoute = LocationDescriptorObject<LocationState>;

interface ViewProps {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  handleSubmit: (data: CreateEditGoalFormValues, customUnitType: CreateMeasurementUnitTypePayload | null) => void,
  featureNamesText: FeatureNamesText,
  returnRoute: ReturnRoute,
}

const View = ({
  formContext,
  handleSubmit,
  featureNamesText,
  returnRoute,
  ...props
}: ViewProps): JSX.Element => (
  <StyledCreateGoal css={styles.createEditContainer} {...props}>
    <StyledBackButton
      css={styles.backButton}
      formContext={formContext}
      returnRoute={returnRoute}
    />
    <StyledEditGoalFormContainer
      css={[styles.creatEditFormContainer, styles.formBreakpoints]}
    >
      <StyledHeaderText
        css={styles.headerText}
        data-test-id="goalsEditGoalHeaderText"
      >
        {`Edit ${featureNamesText.goals.singular.toLowerCase()}`}
      </StyledHeaderText>
      <CreateEditGoalForm
        css={styles.createEditForm}
        formContext={formContext}
        handleOnSubmit={handleSubmit}
        returnRoute={returnRoute}
      />
    </StyledEditGoalFormContainer>
  </StyledCreateGoal>
);

interface EditGoalFormProps {
  data: GetGoalByIdReturn,
}

const EditGoalForm = ({ data: goal, ...props }: EditGoalFormProps): JSX.Element => {
  const { formResolver } = useGetCreateEditFormResolver();
  const { updateGoal } = useUpdateGoal();
  const { featureNamesText } = useGetFeatureNamesText();
  const history = useHistory();
  const { state: locationState } = useLocation<{ backInformation: BackInformation }>();
  const { backInformation } = locationState ?? {};
  const { goalRoutes } = useGetGoalRoutes();

  const returnRoute: LocationDescriptorObject<LocationState> = {
    pathname: goalRoutes.ViewById.replace(':goalId', goal.goalId),
    state: {
      backInformation,
    },
  };

  const editGoalDefaultValues = getFormattedGoalForEditing(goal);

  const formContext = useForm<CreateEditGoalFormValues>({
    defaultValues: editGoalDefaultValues,
    resolver: formResolver,
  });

  const { mutate: createMeasurementUnitType } = useCreateMeasurementUnitType();

  const handleSubmit = async (editedGoal: CreateEditGoalFormValues, customUnitType: CreateMeasurementUnitTypePayload | null): Promise<void> => {
    const { goalPayload, participantsPayload } = setupPayloads(editedGoal);

    if (customUnitType !== null) {
      createMeasurementUnitType({ payload: customUnitType }, {
        onSuccess: async (unitTypeData) => {
          const { id } = unitTypeData.response;
          const updatedGoal = { ...goalPayload, measurementUnitTypeId: id };
          await updateGoal({
            participantsPayload,
            goalPayload: updatedGoal,
            goalId: goal.goalId,
          }).then(() => {
            history.push(returnRoute);
          });
        },
      });
    } else {
      await updateGoal({
        participantsPayload,
        goalPayload,
        goalId: goal.goalId,
      }).then(() => {
        history.push(returnRoute);
      });
    }
  };

  const hookProps = {
    formContext,
    handleSubmit,
    featureNamesText,
    returnRoute,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

const EditGoalFormSkeleton = (): JSX.Element => (
  <StyledSkeletonLoader
    css={styles.skeletonLoader}
    variant="rectangular"
    renderComponent={() => <></>}
  />
);

export { View };
export default withLoadingSkeleton<GetGoalByIdReturn, EditGoalFormProps>(EditGoalForm, EditGoalFormSkeleton);
