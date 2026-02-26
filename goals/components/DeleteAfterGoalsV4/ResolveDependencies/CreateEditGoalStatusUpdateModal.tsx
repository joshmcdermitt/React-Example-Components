import NiceModal, { NiceModalHandler, muiDialogV5, useModal } from '@ebay/nice-modal-react';
import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import { useCallback } from 'react';
import { css } from '@emotion/react';
import { SubmitHandler, UseFormReturn, useForm } from 'react-hook-form';
import { getOrganizationId } from '~Common/utils/localStorage';
import Froala from '~Common/V3/components/Froala';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import JoshModal from '~Common/V3/components/JoshModal';
import { Form } from '~Common/V3/components/uncontrolled';
import { useCreateGoalStatusUpdate } from '~Goals/hooks/statusUpdates/useCreateGoalStatusUpdate';
import { useEditGoalStatusUpdate } from '~Goals/hooks/statusUpdates/useEditGoalStatusUpdate';
import useGetGoalMeasurementScaleTypeCategory, {
  GoalMeasurementScaleTypeCategory,
} from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import { CreateEditStatusUpdateFormValues, createEditStatusUpdateFormResolver } from '~Goals/schemata/CreateEditGoalStatusUpdateSchema';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { CloseModalResponse } from '~Common/const/constants';
import { AchievedNotToggle } from '~Goals/const/types';
import { palette } from '~Common/styles/colors';
import ShouldConfirmButton from '../../Shared/ShouldConfirmButton';
import GoalTargetValueMessage from './GoalTargetValueMessageDeprecated';
import StatusUpdateSelectors from '../StatusUpdateSelectorsDeprecated';

const styles = {
  froala: css({
    '.fr-box.fr-basic .fr-wrapper, .fr-toolbar, .fr-second-toolbar, .froalaLabelContainer': {
      background: palette.neutrals.cardBackground,
    },
    'fr-toolbar fr-mobile fr-top fr-basic': {
      paddingRight: '.75rem',
      paddingLeft: '.75rem',
    },
  }),
};

const StyledJoshModalTitle = styled(JoshModal.Title)(({ theme }) => ({
  color: theme.palette.text.brand,
}));

const StyledJoshModalBody = styled(JoshModal.Body)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
});

const StyledTargetContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  'MuiLinearProgress-root': {
    maxWidth: '16.625rem',
    flexGrow: 1,
  },
});

const StyledTargetText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.fontSize.extraSmall,
  lineHeight: theme.lineHeight.extraSmall,
}));

const StyledJoshModalFooter = styled(JoshModal.Footer)({
  gap: '.5rem',
});

interface ViewProps {
  enableSubmit: boolean,
  formContext: UseFormReturn<CreateEditStatusUpdateFormValues>,
  canComplete: boolean,
  handleCloseModal: (_?: object, reason?: string) => void,
  draftKey: string[],
  onSubmit: SubmitHandler<CreateEditStatusUpdateFormValues>,
  modal: NiceModalHandler<Record<string, unknown>>
  goal: Goals.Goal,
  shouldConfirmClose: boolean,
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
  objectivesUnitOfMeasure: boolean,
  handleStatusChanged: (value: Goals.GoalStatus) => void,
  handleAchievedChanged: (value: string) => void,
}

const View = ({
  enableSubmit,
  formContext,
  canComplete,
  handleCloseModal,
  draftKey,
  onSubmit,
  modal,
  goal,
  shouldConfirmClose,
  goalMeasurementScaleTypeCategory,
  objectivesUnitOfMeasure,
  handleStatusChanged,
  handleAchievedChanged,
}: ViewProps): JSX.Element => (
  <JoshModal
    PaperProps={{
      component: Form,
      formContext,
      // @ts-expect-error MUI being mad over nothing
      onSubmit,
    }}
    {...muiDialogV5(modal)}
    onClose={handleCloseModal}
  >
    <JoshModal.Header
      shouldConfirmClose={shouldConfirmClose}
      confirmationCancelText={CloseModalResponse.No}
      confirmationConfirmText={CloseModalResponse.Yes}
      confirmationQuestionText={CloseModalResponse.ConfirmUnsavedChanges}
    >
      {/* Objectives > specific goal details > Status Update modal */}
      <StyledJoshModalTitle>
        Status Update
      </StyledJoshModalTitle>
    </JoshModal.Header>
    <StyledJoshModalBody>
      {/* REFACTOR: sections, extract goal.measurementScale */}
      {objectivesUnitOfMeasure && (
        <>
          {goal.measurementScale
            && (goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.IncreaseDecrease
              || goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.AboveBelow)
            && (
              <StyledTargetContainer>
                <StyledTargetText data-test-id="objectiveTargetTypeLabel">Target</StyledTargetText>
                <GoalTargetValueMessage measurementScale={goal.measurementScale} />
              </StyledTargetContainer>
            )}
        </>
      )}
      <StatusUpdateSelectors
        onStatusChanged={handleStatusChanged}
        onAchievedChanged={handleAchievedChanged}
        goalMeasurementScaleTypeCategory={goalMeasurementScaleTypeCategory}
        goal={goal}
        objectivesUnitOfMeasure={objectivesUnitOfMeasure}
        canComplete={canComplete}
        formContext={formContext}
      />
      <Froala
        enableEmojis
        label="Description"
        name="statusCommentary"
        froalaConfigProps={{
          charCounterCount: true,
          charCounterMax: 1500,
        }}
        richTextEditorProps={{
          name: 'statusCommentary',
          onChange: ({ value: newText }) => formContext.setValue('statusCommentary', newText, { shouldDirty: true }),
          draftKey,
          preferDraftValue: true,
          initialValue: formContext.getValues('statusCommentary'),
        }}
        styleOverrides={styles.froala}
      />
    </StyledJoshModalBody>
    <StyledJoshModalFooter>
      <JoshButton
        data-test-id="goalAddStatusModalSaveChanges"
        size="small"
        type="submit"
        disabled={!enableSubmit}
      >
        Save Changes
      </JoshButton>
      <ShouldConfirmButton
        shouldConfirmClose={shouldConfirmClose}
        onConfirm={handleCloseModal}
        renderButton={({ onClick }) => (
          <JoshButton
            data-test-id="goalAddStatusModalCancelChanges"
            onClick={onClick}
            size="small"
            variant="ghost"
          >
            Cancel
          </JoshButton>
        )}
      />
    </StyledJoshModalFooter>
  </JoshModal>
);

export interface CreateEditGoalStatusUpdateModalProps {
  goal: Goals.Goal,
  isEdit?: boolean,
  statusId?: string,
  initialValues?: CreateEditStatusUpdateFormValues,
  onCloseCallback?: () => void,
  measurementScale: Goals.MeasurementScale,
}

const CreateEditGoalStatusUpdateModal = ({
  goal,
  isEdit,
  statusId,
  initialValues,
  onCloseCallback,
  measurementScale,
}: CreateEditGoalStatusUpdateModalProps): JSX.Element => {
  const objectivesUnitOfMeasure = useFeatureFlag('objectivesUnitOfMeasure');
  const modal = useModal();
  const { hide: closeModal } = modal;

  const { goalId = '' } = goal ?? {};
  const canComplete = goal.permissions.includes(Goals.GoalPermission.CanCompleteGoal) ?? false;
  const draftKey = [getOrganizationId() ?? '', 'goals', goalId, 'statusCommentary', ...(isEdit ? ['bar'] : [])];

  // POST
  const { mutate: createGoalStatusMutation, isPending: isCreatingGoalStatusUpdate } = useCreateGoalStatusUpdate({
    draftKey,
  });

  // PATCH
  const {
    mutate: editGoalStatusMutation,
    isPending: isEditingGoalStatusUpdate,
  } = useEditGoalStatusUpdate({
    draftKey,
  });

  const defaultValues = initialValues ?? {
    status: Goals.GoalStatus.OnTrack,
    value: 0,
    statusCommentary: '',
  };

  const formContext = useForm<CreateEditStatusUpdateFormValues>({
    defaultValues,
    resolver: createEditStatusUpdateFormResolver,
  });

  const enableSubmit = !isCreatingGoalStatusUpdate && !isEditingGoalStatusUpdate;
  const shouldConfirmClose = formContext.formState.isDirty;
  const { goalMeasurementScaleTypeCategory } = useGetGoalMeasurementScaleTypeCategory({ measurementScaleTypeId: measurementScale.type.id });

  const onSubmit = ({ statusCommentary, ...values }: CreateEditStatusUpdateFormValues): void => {
    if (isEdit && statusId) {
      editGoalStatusMutation({ // PATCH
        goalId,
        statusId,
        payload: {
          ...values,
          // We made the statusCommentary optional from the user, so we are defaulting to 'Progress Updated' if it is empty
          statusCommentary: statusCommentary || 'Progress Updated',
        },
      }, { onSuccess });
    } else {
      createGoalStatusMutation({ // POST
        goalId,
        statusUpdate: {
          ...values,
          // We made the statusCommentary optional from the user, so we are defaulting to 'Progress Updated' if it is empty
          statusCommentary: statusCommentary || 'Progress Updated',
        },
      }, { onSuccess });
    }
  };

  const onClose = (): void => {
    onCloseCallback?.();
    void closeModal();
  };

  const onSuccess = (): void => {
    onClose();
  };

  const handleCloseModal = (_?: object, reason?: string): void => {
    if (reason !== 'escapeKeyDown' && reason !== 'backdropClick') {
      onClose();
    }
  };

  const handleStatusChanged = useCallback((value: Goals.GoalStatus): void => {
    switch (value) {
      case Goals.GoalStatus.Completed:
        formContext.setValue('isAchieved', AchievedNotToggle.Achieved);
        break;
      case Goals.GoalStatus.OnTrack:
        formContext.setValue('isAchieved', AchievedNotToggle.NotAchieved);
        break;
      default:
        break;
    }

    formContext.setValue('status', value);
  }, [formContext]);

  // MultiRadio onChange: ChangeEvent auto casts value to string, but need to set as boolean for EP
  const handleAchievedChanged = useCallback((value: string): void => {
    switch (value) {
      case String(AchievedNotToggle.Achieved):
        formContext.setValue('status', Goals.GoalStatus.Completed);
        break;
      case String(AchievedNotToggle.NotAchieved):
        formContext.setValue('status', Goals.GoalStatus.OnTrack);
        break;
      default:
        break;
    }

    formContext.setValue(
      'isAchieved',
      value === String(AchievedNotToggle.Achieved)
        ? AchievedNotToggle.Achieved
        : AchievedNotToggle.NotAchieved,
    );
  }, [formContext]);

  const hookProps = {
    enableSubmit,
    formContext,
    canComplete,
    onSubmit,
    handleCloseModal,
    draftKey,
    modal,
    goal,
    shouldConfirmClose,
    goalMeasurementScaleTypeCategory,
    objectivesUnitOfMeasure,
    handleStatusChanged,
    handleAchievedChanged,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export default NiceModal.create(CreateEditGoalStatusUpdateModal);
