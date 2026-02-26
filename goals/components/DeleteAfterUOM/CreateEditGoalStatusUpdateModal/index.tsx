import NiceModal, { NiceModalHandler, muiDialogV5, useModal } from '@ebay/nice-modal-react';
import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import Divider from '@mui/material/Divider';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useMemo } from 'react';
import { SubmitHandler, UseFormReturn, useForm } from 'react-hook-form';
import { toast } from '~Common/components/Toasts';
import { palette } from '~Common/styles/colors';
import { getOrganizationId } from '~Common/utils/localStorage';
import Froala from '~Common/V3/components/Froala';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import JoshModal from '~Common/V3/components/JoshModal';
import { Form, Select, TextField } from '~Common/V3/components/uncontrolled';
import { FormValues, createStatusUpdateFormResolver } from '~Goals/components/DeleteAfterUOM/CreateStatusUpdateSchema';
import { ClosedGoalStatuses, GoalStatusColor, OpenGoalStatuses } from '~Goals/const/types';
import { useCreateGoalStatusUpdate } from '~Goals/hooks/statusUpdates/useCreateGoalStatusUpdate';
import { useEditGoalStatusUpdate } from '~Goals/hooks/statusUpdates/useEditGoalStatusUpdate';
import GoalStatus from '../GoalStatus';

const styles = {
  progressBar: (status: Goals.GoalStatus) => css({
    height: '.9375rem',
    flexGrow: 1,
    borderRadius: '.5rem',
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: palette.neutrals.gray300,
    },
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: GoalStatusColor[status],
    },
  }),
  modalBody: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  }),
  percentageInput: css({
    width: '4rem',
  }),
  percentageRow: css({
    alignItems: 'center',
    columnGap: '0.25rem',
    display: 'flex',
    flexDirection: 'row',
  }),
  progressBarAdjustment: css({
    height: '1rem',
    marginLeft: '0.75rem',
    maxWidth: '14rem',

    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: palette.neutrals.gray200,
    },
  }),
  title: css({
    color: palette.brand.indigo,
  }),
};

interface ViewProps {
  enableSubmit: boolean,
  formContext: UseFormReturn<FormValues>,
  canComplete: boolean,
  handleCloseModal: (_?: object, reason?: string) => void,
  draftKey: string[],
  onSubmit: SubmitHandler<FormValues>,
  modal: NiceModalHandler<Record<string, unknown>>
  goalStatusToUse: Goals.GoalStatus,
}

const View = ({
  enableSubmit,
  formContext,
  canComplete,
  handleCloseModal,
  draftKey,
  onSubmit,
  modal,
  goalStatusToUse,
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
    <JoshModal.Header>
      <JoshModal.Title css={styles.title}>
        Status Update
      </JoshModal.Title>
    </JoshModal.Header>
    <JoshModal.Body css={styles.modalBody}>
      <Select
        name="status"
        defaultValue={goalStatusToUse}
        required
      >
        <ListSubheader>Open</ListSubheader>
        {OpenGoalStatuses.map((statusOption) => (
          <MenuItem
            key={statusOption}
            value={statusOption}
          >
            <GoalStatus status={statusOption} />
          </MenuItem>
        ))}
        {canComplete && [
          <Divider key="divider" />,
          <ListSubheader key="list-subheader">Closed</ListSubheader>,
          ClosedGoalStatuses.map((statusOption) => (
            <MenuItem
              key={statusOption}
              value={statusOption}
            >
              <GoalStatus status={statusOption} />
            </MenuItem>
          )),
        ]}
      </Select>
      <div css={styles.percentageRow}>
        <TextField
          css={styles.percentageInput}
          name="completionPercentage"
          hideLabel
          defaultValue={formContext.getValues('completionPercentage')}
          required
          error={false}
          helperText=""
        />
        <p>%</p>
        <p>/</p>
        <p>100%</p>
        <LinearProgress
          css={[styles.progressBar(formContext.watch('status')), styles.progressBarAdjustment]}
          variant="determinate"
          value={formContext.watch('completionPercentage') ?? 0}
        />
      </div>
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
      />
    </JoshModal.Body>
    <JoshModal.Footer>
      <JoshButton
        data-test-id="goalAddStatusModalSaveChanges"
        size="small"
        type="submit"
        disabled={!enableSubmit}
      >
        Save Changes
      </JoshButton>
      <JoshButton
        data-test-id="goalAddStatusModalCancelChanges"
        onClick={handleCloseModal}
        size="small"
        variant="ghost"
      >
        Cancel
      </JoshButton>
    </JoshModal.Footer>
  </JoshModal>
);

export interface CreateEditGoalStatusUpdateModalProps {
  goal: Goals.Goal,
  isEdit?: boolean,
  statusId?: string,
  initialValues?: FormValues,
  onCloseCallback?: () => void,
}

const CreateEditGoalStatusUpdateModal = ({
  goal,
  isEdit,
  statusId,
  initialValues,
  onCloseCallback,
}: CreateEditGoalStatusUpdateModalProps): JSX.Element => {
  const modal = useModal();
  const { hide: closeModal } = modal;

  const { goalId = '', isCompleted } = goal ?? {};
  const canComplete = goal?.permissions.includes(Goals.GoalPermission.CanCompleteGoal) ?? false;
  const draftKey = [getOrganizationId() ?? '', 'goals', goalId, 'statusCommentary', ...(isEdit ? ['bar'] : [])];

  const { mutate: createGoalStatusMutation, isPending: isCreatingGoalStatusUpdate } = useCreateGoalStatusUpdate({
    draftKey,
  });

  const {
    mutate: editGoalStatusMutation,
    isPending: isEditingGoalStatusUpdate,
  } = useEditGoalStatusUpdate({
    draftKey,
  });

  const defaultValues = initialValues ?? {
    status: Goals.GoalStatus.OnTrack,
    completionPercentage: 0,
    statusCommentary: '',
  };

  const formContext = useForm<FormValues>({
    defaultValues,
    resolver: createStatusUpdateFormResolver,
  });

  const goalStatusToUse = useMemo(() => (
    isCompleted ? Goals.GoalStatus.OnTrack : formContext.getValues('status')
  ), [isCompleted, formContext]);

  useEffect(() => {
    Object.values(formContext.formState.errors).forEach((error) => {
      toast.error(error.message);
    });
  }, [formContext.formState.errors]);

  const onSubmit = ({ completionPercentage, ...data }: FormValues): void => {
    if (isEdit && statusId) {
      editGoalStatusMutation({
        goalId,
        statusId,
        payload: {
          ...data,
          value: completionPercentage,
          // We made the statusCommentary optional from the user, so we are defaulting to 'Progress Updated' if it is empty
          statusCommentary: data.statusCommentary || 'Progress Updated',
        },
      }, { onSuccess });
    } else {
      createGoalStatusMutation({
        goalId,
        statusUpdate: {
          ...data,
          value: completionPercentage,
          // We made the statusCommentary optional from the user, so we are defaulting to 'Progress Updated' if it is empty
          statusCommentary: data.statusCommentary || 'Progress Updated',
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

  const enableSubmit = !isCreatingGoalStatusUpdate && !isEditingGoalStatusUpdate;

  const hookProps = {
    enableSubmit,
    formContext,
    canComplete,
    onSubmit,
    handleCloseModal,
    draftKey,
    modal,
    goalStatusToUse,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export default NiceModal.create(CreateEditGoalStatusUpdateModal);
