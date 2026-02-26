import { useParams } from 'react-router-dom';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { useState } from 'react';
import {
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { DEFAULT_COMMENT, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import {
  Checkbox,
  Form,
} from '~Common/V3/components/uncontrolled';
import Froala from '~Common/V3/components/Froala';
import { css } from '@emotion/react';
import { FORM_LAYOUT_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { ValidationErrors } from '~Goals/const/types';
import { toast } from 'react-toastify';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { queryClient } from '~Common/const/queryClient';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { Comment } from '~DevelopmentPlan/const/types';
import {
  createCommentFormSchema, FormValues, conformToDto, createCommentResolver,
} from '~DevelopmentPlan/schemata/createCommentSchemata';
import { useCreateComment } from '~DevelopmentPlan/hooks/useCreateComment';
import { useApprovePlan } from '~DevelopmentPlan/hooks/useApprovePlan';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import RequiredIcon from '~Common/V3/components/RequiredIcon';
import { useUpdateComment } from '~DevelopmentPlan/hooks/useUpdateComment';
import { PersonalDevelopmentPlanDetailsParams } from './PersonalDevelopmentPlanDetails';

const styles = {
  ...FORM_LAYOUT_STYLES,
  addCommentWrap: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
    width: '100%',
  }),
  addCommentForm: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.375rem',
  }),
  buttonSpace: css({
    marginRight: '.625rem',
  }),
  addCommentButton: css({
    marginTop: '.75rem',
    alignSelf: 'flex-start',
  }),
  buttonsWrap: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  checkbox: css({
    display: 'none',
  }),
};

interface ViewProps {
  setIsOpen: (isToggled: boolean) => void,
  isOpen: boolean,
  runValidations: () => void,
  formContext: UseFormReturn<FormValues>,
  resetForm: () => void,
  disableAddCompetenciesButton: boolean,
  finalThought: boolean,
  isApprovalProcess: boolean,
  commentLabel: () => string,
  commentContent: string,
}

const View = ({
  setIsOpen,
  isOpen,
  runValidations,
  formContext,
  resetForm,
  disableAddCompetenciesButton,
  finalThought,
  isApprovalProcess,
  commentLabel,
  commentContent,
}: ViewProps): JSX.Element => (
  <>
    {(isOpen || isApprovalProcess || finalThought) && (
    <>
      <div css={styles.addCommentWrap}>
        <Form
          formContext={formContext}
          onSubmit={() => null}
          css={styles.addCommentForm}
        >
          <Froala
            styleOverrides={styles.froala}
            required
            label={commentLabel()}
            name="content"
            froalaConfigProps={{
              charCounterCount: true,
              charCounterMax: finalThought ? 1000 : 500,
            }}
            richTextEditorProps={{
              name: 'comment',
              onChange: ({ value: newText }) => formContext.setValue('content', newText, { shouldDirty: true }),
              initialValue: commentContent,
            }}
            froalaEventsProps={{
              autoFocus: true,
            }}
            renderRightIcon={(): JSX.Element => <RequiredIcon />}
          />
          <div
            css={styles.checkbox}
          >
            <Checkbox
              name="isFinalThought"
              checked={finalThought}
              data-test-id="pdpsSelectFinalThought"
              size={20}
            />
          </div>
        </Form>
        <div css={styles.buttonsWrap}>
          <div>
            <JoshButton
              onClick={runValidations}
              data-test-id="personalDevelopmentSaveComment"
              size="small"
              css={styles.buttonSpace}
            >
              {isApprovalProcess || finalThought ? 'Submit' : 'Save'}
            </JoshButton>
            {!isApprovalProcess && !finalThought && (
            <JoshButton
              variant="ghost"
              onClick={resetForm}
              data-test-id="personalDevelopmentCancelComment"
              size="small"
            >
              Cancel
            </JoshButton>
            )}
          </div>
        </div>
      </div>
    </>
    )}
    {!isOpen && !isApprovalProcess && !finalThought && (
    <JoshButton
      variant="ghost"
      onClick={() => setIsOpen(!isOpen)}
      data-test-id="personalDevelopmentAddComment"
      size="small"
      css={styles.addCommentButton}
      disabled={disableAddCompetenciesButton}
    >
      Add Comment
    </JoshButton>
    )}
  </>
);

interface AddCommentProps {
  finalThought?: boolean,
  isApprovalProcess?: boolean,
  isEditing?: boolean,
  comment?: Comment,
  setCommentIdToEdit?: (commentId: number) => void,
  onUpdateSuccess?: () => void,
}

const AddComment = ({
  finalThought = false,
  isApprovalProcess = false,
  isEditing = false,
  comment,
  setCommentIdToEdit,
  onUpdateSuccess,
}: AddCommentProps): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const [isOpen, setIsOpen] = useState(isEditing);

  const isFetchingCompetencies = useIsFetching({ queryKey: pdpPlanKeys.competencies(pdpId) });
  const isMutatingCompetencies = useIsMutating({ mutationKey: pdpPlanKeys.competencies(pdpId) });
  const disableAddCompetenciesButton = isFetchingCompetencies > 0 || isMutatingCompetencies > 0;
  const commentContent = comment?.content ?? '';

  function defaultValues(): FormValues {
    const {
      content,
      isFinalThought,
    } = comment ?? DEFAULT_COMMENT;

    return {
      content,
      isFinalThought,
    };
  }
  const formContext = useForm<FormValues>({
    defaultValues: defaultValues(),
    resolver: createCommentResolver,
  });

  const { mutate: createCommentMutation } = useCreateComment();
  const { mutate: approvePlanMutation } = useApprovePlan();
  const { mutate: updateCommentMutation } = useUpdateComment({ onUpdateSuccess });

  const runValidations = (): void => {
    const data = formContext.getValues();
    createCommentFormSchema
      .validate(data, { abortEarly: false })
      .then(() => {
        const formData = conformToDto(data);
        const commentId = comment?.id ?? OPTIMISTIC_ID;
        if (isApprovalProcess) {
          approvePlanMutation({ id: pdpId, comment: formData }, { onSuccess: onApproveSuccess });
        } else if (isEditing) {
          updateCommentMutation({ id: pdpId, comment: formData, commentId }, { onSuccess: onUpdateSuccess });
        } else {
          createCommentMutation({ id: pdpId, comment: formData, finalThoughtForm: finalThought }, { onSuccess: onCreateSuccess });
        }
        closeForm();
      })
      .catch((err: ValidationErrors) => {
        err.errors.forEach((error) => {
          toast.error(error);
        });
      });
  };

  const onCreateSuccess = (): void => {
    formContext.reset();
    void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.comments(pdpId) });
  };

  const {
    closeApprovePlanModal,
  } = useAddResourceModalStore((state) => ({
    closeApprovePlanModal: state.closeApprovePlanModal,
  }));

  const onApproveSuccess = (): void => {
    formContext.reset();
    void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.lists() });
    void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.detail(pdpId) });
    closeApprovePlanModal();
  };
  const closeForm = (): void => {
    setIsOpen(false);
    setCommentIdToEdit?.(0);
  };

  const resetForm = (): void => {
    setIsOpen(!isOpen);
    setCommentIdToEdit?.(0);
  };

  const commentLabel = (): string => {
    if (finalThought) {
      return 'Message';
    }
    if (isApprovalProcess) {
      return 'Discussion Note';
    }
    return 'Comment';
  };

  const hookProps = {
    setIsOpen,
    isOpen,
    runValidations,
    formContext,
    resetForm,
    disableAddCompetenciesButton,
    finalThought,
    isApprovalProcess,
    commentLabel,
    commentContent,
    onUpdateSuccess,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, AddComment };
export default AddComment;
