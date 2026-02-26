import { css } from '@emotion/react';
import { Accomplishment, CompetencyResourceStatusEnum, ResourceType } from '~DevelopmentPlan/const/types';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import {
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import {
  FormValues, conformToDto, createAccomplishmentFormResolver, createAccomplishmentFormSchema,
} from '~DevelopmentPlan/schemata/CreateAccomplishmentSchemata';
import { toast } from 'react-toastify';
import { ValidationErrors } from '~Goals/const/types';
import { DEFAULT_ACCOMPLISHMENT } from '~DevelopmentPlan/const/defaults';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { existingResourceStyles } from '~DevelopmentPlan/const/pageStyles';
import { palette } from '~Common/styles/colors';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/pro-light-svg-icons';
import { useUpdateAccomplishment } from '~DevelopmentPlan/hooks/useUpdateAccomplishment';
import { queryClient } from '~Common/const/queryClient';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { useCreateAccomplishment } from '~DevelopmentPlan/hooks/useCreateAccomplishment';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';
import { AddAccomplishment } from './AddAccomplishment';

const styles = {
  ...existingResourceStyles,
  accomplishmentWrap: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  }),
  sectionTitle: css({
    fontSize: '.75rem',
    color: palette.neutrals.gray700,
    fontWeight: 400,
    display: 'block',
    letterSpacing: '.5px',
    lineHeight: '.5rem',
  }),
  dateIcon: css({
    color: palette.neutrals.gray700,
    marginRight: '.5rem',
  }),
  data: css({
    color: palette.neutrals.gray800,
    fontSize: '1rem',
    fontWeight: 500,
  }),
  skellyWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  }),
  cardSkeleton: css({
    maxWidth: '100%',
    maxHeight: '2rem',
  }),
};

interface ViewProps {
  formContext: UseFormReturn<FormValues>,
  accomplishment: Accomplishment,
  runAccomplishmentValidations: () => void,
  isViewingAccomplishment: boolean,
  handleViewingToggle: () => void,
  handleCloseModal: () => void,
}

const View = ({
  runAccomplishmentValidations,
  accomplishment,
  formContext,
  isViewingAccomplishment,
  handleViewingToggle,
  handleCloseModal,
}: ViewProps): JSX.Element => (
  <>
    <ContextButtons
      portalIds={isViewingAccomplishment ? ['viewModalButtons'] : ['modalButtons']}
      renderContents={() => (
        <>
          {!isViewingAccomplishment && (
          <>
            <JoshButton
              data-test-id="addResourceModalSaveChanges"
              size="small"
              type="submit"
              onClick={runAccomplishmentValidations}
            >
              Save
            </JoshButton>
            <JoshButton
              data-test-id="addResourceModalCancelChanges"
              onClick={handleCloseModal}
              size="small"
              variant="ghost"
            >
              Cancel
            </JoshButton>
          </>
          )}
        </>
      )}
    />
    <div css={styles.resourceWrapper}>
      {isViewingAccomplishment && (
      <div css={styles.accomplishmentWrap}>
        <div>
          <span css={styles.sectionTitle}>Date</span>
          <span css={styles.data}>
            <FontAwesomeIcon
              css={styles.dateIcon}
              icon={faCalendar}
            />
            {moment(accomplishment?.date).format('LL')}
          </span>
        </div>
        <div>
          <span css={styles.sectionTitle}>Title</span>
          <span css={styles.data}>{accomplishment?.title}</span>
        </div>
        <div>
          <span css={styles.sectionTitle}>Description</span>
          {accomplishment.description && (
            <HTMLRenderer css={styles.data} htmlText={accomplishment.description} />
          )}
        </div>
        <div>
          <JoshButton
            size="small"
            onClick={handleViewingToggle}
            data-test-id="pdpEditAccomplishment"
          >
            Edit Accomplishment
          </JoshButton>
        </div>
      </div>
      )}
      {!isViewingAccomplishment && (
      <AddAccomplishment
        formContext={formContext}
        accomplishment={accomplishment}
      />
      )}
    </div>
  </>
);

interface AccomplishmentDetailsProps {
  accomplishment: Accomplishment,
  isViewingAccomplishment: boolean,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  isEditing: boolean,
}

export const AccomplishmentDetails = ({
  accomplishment,
  isViewingAccomplishment,
  runAddResourceValidations,
  isEditing,
}: AccomplishmentDetailsProps): JSX.Element => {
  const {
    closeViewResourceModal,
    closeAddResourceModal,
    setResourceContentDueDate,
    setResourceContentTitle,
    setResourceContentStatus,
    resourceContentId,
    setIsViewing,
    pdpId,
  } = useAddResourceModalStore((state) => ({
    closeViewResourceModal: state.closeViewResourceModal,
    closeAddResourceModal: state.closeAddResourceModal,
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
    setResourceContentStatus: state.setResourceContentStatus,
    isViewing: state.isViewing,
    resourceContentId: state.resourceContentId,
    setIsViewing: state.setIsViewing,
    pdpId: state.pdpId,
  }));

  function defaultValues(): FormValues {
    const {
      date,
      title,
      description,
    } = accomplishment ?? DEFAULT_ACCOMPLISHMENT;

    return {
      date,
      title,
      description,
      orgUserId: '',
    };
  }

  const formContext = useForm<FormValues>({
    defaultValues: defaultValues(),
    resolver: createAccomplishmentFormResolver,
  });

  const { mutate: updateAccomplishmentMutation } = useUpdateAccomplishment();
  const { mutate: createAccomplishmentMutation } = useCreateAccomplishment();

  const runAccomplishmentValidations = (): void => {
    const data = formContext.getValues();
    setResourceContentDueDate(data.date);
    setResourceContentTitle(data.title);
    setResourceContentStatus(CompetencyResourceStatusEnum.Complete);

    createAccomplishmentFormSchema
      .validate(data, { abortEarly: false })
      .then(() => {
        const formData = conformToDto(data);
        const addedData = {
          ...formData,
          orgUserId: getOrganizationUserId() ?? '',
        };
        if (isEditing) {
          updateAccomplishmentMutation(
            { accomplishment: addedData, accomplishmentId: resourceContentId.toString() },
            { onSuccess: completeUpdateAccomplishment },
          );
        } else {
          createAccomplishmentMutation({ accomplishment: addedData }, { onSuccess: setupAddResourceValidations });
        }
      })
      .catch((err: ValidationErrors) => {
        if (err.errors) {
          err.errors.forEach((error) => {
            toast.error(error);
          });
        } else {
          toast.error('There was an issue creating your accomplishment. Please try again.');
        }
      });
  };

  const setupAddResourceValidations = (data: HttpCallReturn<Accomplishment>): void => {
    const resolvedData = data;
    const accomplishmentId = resolvedData.response.id;
    const resourceId = ResourceType.Accomplishment;
    if (accomplishmentId) {
      runAddResourceValidations(resourceId, accomplishmentId);
    }
  };
  const completeUpdateAccomplishment = (): void => {
    void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencyResources(pdpId ?? '') });
    void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.progressBar(pdpId ?? '') });
    void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencies(pdpId ?? '') });
    closeViewResourceModal();
  };

  const handleViewingToggle = (): void => {
    setIsViewing(false);
  };

  const handleCloseModal = (): void => {
    closeAddResourceModal();
    closeViewResourceModal();
  };

  const hookProps = {
    formContext,
    accomplishment,
    runAccomplishmentValidations,
    runAddResourceValidations,
    isViewingAccomplishment,
    handleViewingToggle,
    handleCloseModal,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default AccomplishmentDetails;
