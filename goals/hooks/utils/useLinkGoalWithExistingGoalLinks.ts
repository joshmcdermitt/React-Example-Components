import {
  MutableRefObject, useMemo, useRef,
} from 'react';
import { toast } from '~Common/components/Toasts';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { ToastId } from '~Common/types';
import { useGetLinkedGoalsById } from '../linkGoals/useGetLinkedGoalsById';
import { UseLinkGoalParams, UseLinkGoalsReturn, useLinkGoal } from '../linkGoals/useLinkGoal';

interface UseLinkGoalWithExistingGoalLinksParams extends UseLinkGoalParams {
  goalId: string,
}

export interface UseLinkGoalWithExistingGoalLinksReturn extends Omit<UseLinkGoalsReturn, 'mutate'> {
  linkParentGoal: (parentGoalId: string | null) => void,
  unlinkParentGoal: () => void,
  linkSupportingGoals: (childGoalIds: string[]) => void,
  unlinkSupportingGoals: (childGoalIds: string[]) => void,
}

interface HandleErrorParams {
  error: Error,
  toastId: MutableRefObject<ToastId>,
  defaultError: string,
  featureNamesText: FeatureNamesText,
}

const handleError = ({
  error,
  toastId,
  defaultError,
  featureNamesText,
}: HandleErrorParams): void => {
  if (error.message === 'Encountered error error.goals.updateLinkedGoals.circular.child.goal.hierarchy.detected'
    || error.message === 'Encountered error error.goals.updateLinkedGoals.circular.parent.goal.hierarchy.detected'
  ) {
    toast.update(toastId.current, {
      render: `One of the ${featureNamesText.goals.plural.toLowerCase()} you selected is already linked in the cascade.`,
      type: toast.TYPE.ERROR,
      autoClose: 3000,
    });
  } else {
    toast.update(toastId.current, {
      render: defaultError,
      type: toast.TYPE.ERROR,
      autoClose: 3000,
    });
  }
};

export const useLinkGoalWithExistingGoalLinks = ({
  goalId,
  ...options
}: UseLinkGoalWithExistingGoalLinksParams): UseLinkGoalWithExistingGoalLinksReturn => {
  const toastId = useRef<ToastId>(null);
  const { data } = useGetLinkedGoalsById({ goalId });
  const originalParentGoalId = data?.response.parentGoal?.goalId;
  const orginalSupportingGoalIds = useMemo(() => data?.response.childGoals?.map((goal) => goal.goalId) || [], [data]);
  const { featureNamesText } = useGetFeatureNamesText();

  const {
    mutate: doLinkGoal,
    ...rest
  } = useLinkGoal({
    onMutate: () => {
      toastId.current = toast.info(`Updating your linked ${featureNamesText.goals.plural.toLowerCase()}...`, { autoClose: false });
    },
    ...options,
  });

  const linkParentGoal = (parentGoalId: string | null): void => {
    doLinkGoal({
      goalId,
      parentGoalId: parentGoalId || '',
      childGoalIds: orginalSupportingGoalIds,
    }, {
      onSuccess: () => {
        toast.update(toastId.current, {
          render: `Successfully linked the parent ${featureNamesText.goals.singular.toLowerCase()}!`,
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
        });
      },
      onError: (error) => {
        handleError({
          error,
          toastId,
          defaultError: `Failed to link the parent ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
          featureNamesText,
        });
      },
    });
  };

  const linkSupportingGoals = (childGoalIds: string[]): void => {
    const isMultipleNewGoals = childGoalIds.length > 1;

    doLinkGoal({
      goalId,
      parentGoalId: originalParentGoalId || '',
      childGoalIds,
    }, {
      onSuccess: () => {
        toast.update(toastId.current, {
          render: `Successfully linked the supporting
            ${isMultipleNewGoals ? featureNamesText.goals.plural.toLowerCase() : featureNamesText.goals.singular.toLowerCase()}!`,
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
        });
      },
      onError: (error) => {
        handleError({
          error,
          toastId,
          defaultError: `Failed to link the supporting ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
          featureNamesText,
        });
      },
    });
  };

  const unlinkParentGoal = (): void => {
    doLinkGoal({
      goalId,
      parentGoalId: '',
      childGoalIds: orginalSupportingGoalIds,
    }, {
      onSuccess: () => {
        toast.update(toastId.current, {
          render: `Successfully unlinked the parent ${featureNamesText.goals.singular.toLowerCase()}!`,
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
        });
      },
      onError: (error) => {
        handleError({
          error,
          toastId,
          defaultError: `Failed to unlink the parent ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
          featureNamesText,
        });
      },
    });
  };

  const unlinkSupportingGoals = (childGoalIds: string[]): void => {
    const isMultipleNewGoals = childGoalIds.length > 1;

    doLinkGoal({
      goalId,
      parentGoalId: originalParentGoalId || '',
      childGoalIds: orginalSupportingGoalIds.filter((id) => !childGoalIds.includes(id)),
    }, {
      onSuccess: () => {
        toast.update(toastId.current, {
          render: `Successfully unlinked the supporting
            ${isMultipleNewGoals ? featureNamesText.goals.plural.toLowerCase() : featureNamesText.goals.singular.toLowerCase()}!`,
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
        });
      },
      onError: (error) => {
        handleError({
          error,
          toastId,
          defaultError: `Failed to unlink the supporting ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
          featureNamesText,
        });
      },
    });
  };

  return {
    linkParentGoal,
    linkSupportingGoals,
    unlinkParentGoal,
    unlinkSupportingGoals,
    ...rest,
  };
};
