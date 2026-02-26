import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { ResourceType } from '~DevelopmentPlan/const/types';
import { addResourceModalStore, useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import {
  CreateResourceDTO, FormValues, conformToDto, createResourceFormSchema,
} from '~DevelopmentPlan/schemata/addResourceSchemata';
import { ValidationErrors } from '~Goals/const/types';
import { toast } from '~Common/components/Toasts';
import { useCreateResource } from '~DevelopmentPlan/hooks/useCreateResource';
import { DEFAULT_DATE, DEFAULT_RESOURCE_TITLE, DUPLICATE_RESOURCE_TEXT } from '~DevelopmentPlan/const/defaults';
import { checkShouldCreateResource } from '~DevelopmentPlan/const/functions';
import AccomplishmentModalBody from './Accomplishment';

const styles = {
  tabWrapper: css({
    backgroundColor: palette.neutrals.gray100,
    display: 'flex',
    height: '3.125rem',
    alignItems: 'flex-end',
    position: 'relative',

    ':before': {
      width: '300%',
      height: '100%',
      content: '""',
      background: 'inherit',
      position: 'absolute',
      top: 0,
      left: '-100%',
      zIndex: -1,
    },
  }),
  tabNavItem: css({
    display: 'flex',
    alignItems: 'center',
  }),
  modalBodyWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.75rem',
  }),
  formContainer: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'flex-start',

    '.MuiFormControl-root': {
      width: '100%',
    },
  }),
  bodyContents: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.625rem',
    alignItems: 'flex-start',
    width: '100%',
    overflowY: 'auto',
  }),
};

interface ViewProps {
  resourceId: ResourceType | undefined,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
}

const View = ({
  resourceId,
  runAddResourceValidations,
}: ViewProps): JSX.Element => (
  <>
    <div
      css={styles.modalBodyWrapper}
    >
      <div
        css={styles.bodyContents}
      >
        {resourceId === ResourceType.Accomplishment && (
          <AccomplishmentModalBody
            runAddResourceValidations={runAddResourceValidations}
          />
        )}
      </div>
    </div>
  </>
);

export const ViewResourceModalBody = (): JSX.Element => {
  const {
    resourceId,
    setResourceContentDueDate,
    setResourceContentTitle,
    closeViewResourceModal,
    competencyId,
    pdpId,
  } = useAddResourceModalStore((state) => ({
    resourceId: state.resourceId,
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
    closeViewResourceModal: state.closeViewResourceModal,
    competencyId: state.competencyId,
    pdpId: state.pdpId,
    resourceContentId: state.resourceContentId,
  }));

  const runAddResourceValidations = (resourceIdClicked: ResourceType, contentId: string | number): void => {
    const { resourceContentTitle, resourceContentDueDate } = addResourceModalStore.getState();
    const addResourceDataToValidate = {
      contentId,
      contentTypeId: resourceIdClicked,
      competencyId,
      contentTitle: resourceContentTitle ?? DEFAULT_RESOURCE_TITLE,
      contentDueDate: resourceContentDueDate,
    };

    // Need to run these validations as a faux form submission
    runValidations(addResourceDataToValidate);
  };
  const { mutate: createResourceMutation } = useCreateResource();

  const runValidations = (data: CreateResourceDTO): void => {
    const resourceFound = checkShouldCreateResource(data, pdpId ?? '');
    if (!resourceFound) {
      createResourceFormSchema
        .validate(data, { abortEarly: false })
        .then(() => {
          const resourceDataDTO = conformToDto(data as FormValues);
          createResourceMutation({ id: pdpId ?? '', resource: resourceDataDTO }, { onSuccess: onSuccessfulCreate });
        })
        .catch((err: ValidationErrors) => {
          if (err.errors) {
            err.errors.forEach((error) => {
              toast.error(error);
            });
          } else {
            toast.error('There was an issue creating this resource. Please try again.');
          }
        });
    } else {
      toast.error(DUPLICATE_RESOURCE_TEXT);
    }
  };

  const onSuccessfulCreate = (): void => {
    setResourceContentDueDate(DEFAULT_DATE);
    setResourceContentTitle(DEFAULT_RESOURCE_TITLE);
    closeViewResourceModal();
  };

  const hookProps = {
    resourceId,
    runAddResourceValidations,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
