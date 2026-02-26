import { useMemo, useRef } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { toast } from '~Common/components/Toasts';
import { ToastId } from '~Common/types';
import { useCreateGoal } from '~Goals/components/DeleteAfterUOM/useCreateGoal';
import CreateEditGoalForm from '~Goals/components/Shared/CreateEditGoalForm';
import { LinkedGoalType } from '~Goals/const/types';
import { useGetLinkedGoalsById } from '~Goals/hooks/linkGoals/useGetLinkedGoalsById';
import { CreateMeasurementUnitTypePayload, useCreateMeasurementUnitType } from '~Goals/hooks/useCreateMeasurementUnitType';
import useGetCreateEditFormResolver, { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { UseLinkGoalWithExistingGoalLinksReturn } from '~Goals/hooks/utils/useLinkGoalWithExistingGoalLinks';
import { useShowLinkGoalModal } from '~Goals/hooks/utils/useShowLinkGoalModal';
import { getDefaultGoalValues } from '~Goals/utils/getDefaultGoalValues';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';

interface ViewProps {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  handleSubmit: (newGoal: CreateEditGoalFormValues, customUnitType: CreateMeasurementUnitTypePayload | null) => void,
}

const View = ({
  formContext,
  handleSubmit,
  ...props
}: ViewProps): JSX.Element => (
  <div
    {...props}
  >
    <CreateEditGoalForm
      formContext={formContext}
      handleOnSubmit={handleSubmit}
      isModal
    />
  </div>
);

interface LinkNewGoalProps extends Pick<UseLinkGoalWithExistingGoalLinksReturn, 'linkParentGoal' | 'linkSupportingGoals'> {
  goalId: string,
  linkedGoalType: LinkedGoalType,
}

const LinkNewGoal = ({
  goalId,
  linkedGoalType,
  linkParentGoal,
  linkSupportingGoals,
  ...props
}: LinkNewGoalProps): JSX.Element => {
  const { closeModal } = useShowLinkGoalModal();
  const { data: linkedGoalsData } = useGetLinkedGoalsById({ goalId });
  const { featureNamesText } = useGetFeatureNamesText();
  const { formResolver } = useGetCreateEditFormResolver();
  const orginalSupportingGoalIds = useMemo(() => linkedGoalsData?.response.childGoals?.map((goal) => goal.goalId) || [], [linkedGoalsData]);

  const defaultGoal = getDefaultGoalValues();

  const formContext = useForm<CreateEditGoalFormValues>({
    defaultValues: defaultGoal,
    resolver: formResolver,
  });

  const linkGoal = (linkedGoalId: string): void => {
    if (linkedGoalType === LinkedGoalType.Parent) {
      linkParentGoal(linkedGoalId);
    } else {
      linkSupportingGoals([...orginalSupportingGoalIds, linkedGoalId]);
    }

    closeModal();
  };

  const toastId = useRef<ToastId>(null);
  const { mutate: createGoalMutation } = useCreateGoal({
    onMutate: () => {
      toastId.current = toast.info(`Creating your ${featureNamesText.goals.singular.toLowerCase()}...`, { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: `There was an error creating your ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (responseData) => {
      toast.update(toastId.current, {
        render: `Successfully created your ${featureNamesText.goals.singular.toLowerCase()}.`,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      linkGoal(responseData.response.goalId);
    },
  });

  const { mutate: createMeasurementUnitType } = useCreateMeasurementUnitType();

  const handleSubmit = (newGoal: CreateEditGoalFormValues, customUnitType: CreateMeasurementUnitTypePayload | null): void => {
    if (customUnitType !== null) {
      createMeasurementUnitType({ payload: customUnitType }, {
        onSuccess: (unitTypeData) => {
          const { id } = unitTypeData.response;
          const updatedGoal = { ...newGoal, measurementUnitTypeId: id };
          createGoalMutation({ goal: updatedGoal }, {
            onSuccess: () => {
              closeModal();
            },
          });
        },
      });
    } else {
      createGoalMutation({ goal: newGoal }, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  const hookProps = {
    formContext,
    handleSubmit,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default LinkNewGoal;
