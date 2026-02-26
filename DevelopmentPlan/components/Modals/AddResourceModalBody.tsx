import { css } from '@emotion/react';
import TabNavItem from '~Common/V3/components/Drawers/TabNavItem';
import { palette } from '~Common/styles/colors';
import { ResourceType } from '~DevelopmentPlan/const/types';
import { addResourceModalStore, useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import {
  DEFAULT_DATE, DEFAULT_RESOURCE_TITLE, DUPLICATE_RESOURCE_TEXT,
} from '~DevelopmentPlan/const/defaults';
import { toast } from 'react-toastify';
import {
  CreateResourceDTO, FormValues, conformToDto, createResourceFormSchema,
} from '~DevelopmentPlan/schemata/addResourceSchemata';
import { useCreateResource } from '~DevelopmentPlan/hooks/useCreateResource';
import { ValidationErrors } from '~Goals/const/types';
import { checkShouldCreateResource } from '~DevelopmentPlan/const/functions';
import useGetPersonalDevelopmentResourceTypeLabels from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentResourceTypeLabels';
import useGetPersonalDevelopmentModalTabs, { TabItem } from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentModalTabs';
import GoalModalBody from './Goals';
import { CompetencySelect } from '../Shared/CompetencySelect';
import AccomplishmentModalBody from './Accomplishment';
import MeetingModalBody from './Meetings';
import ActionItemsModalBody from './ActionItems';

const styles = {
  tabWrapper: css({
    backgroundColor: palette.neutrals.gray100,
    display: 'flex',
    height: '3.125rem',
    alignItems: 'flex-end',
    marginLeft: '-1.5rem',
    marginRight: '-1.5rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
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
  bodyContents: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.625rem',
    '& .goalFormFooter': {
      display: 'none',
    },
  }),
};

interface ViewProps {
  activeTab: number,
  setActiveTab: (tab: number) => void,
  tabsToUse: Record<string, TabItem>,
  pdpId: string,
  resourceId: ResourceType | undefined,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  actionTextToUse: string,
  resourceTypeTitle: string,
  hideTabsBar: boolean,
}

const View = ({
  activeTab,
  setActiveTab,
  tabsToUse,
  pdpId,
  resourceId,
  runAddResourceValidations,
  actionTextToUse,
  resourceTypeTitle,
  hideTabsBar,
}: ViewProps): JSX.Element => (
  <div
    css={styles.modalBodyWrapper}
  >
    {!hideTabsBar && (
      <div css={styles.tabWrapper}>
        {Object.keys(tabsToUse).map((tab) => (
          <TabNavItem
            key={tabsToUse[tab].value}
            css={styles.tabNavItem}
            isActive={activeTab === tabsToUse[tab].value}
            onClick={() => setActiveTab(tabsToUse[tab].value)}
            renderNavItem={() => (
              <div>{tabsToUse[tab].label}</div>
            )}
          />
        ))}
      </div>
    )}
    <CompetencySelect
      pdpId={pdpId}
    />
    <div
      css={styles.bodyContents}
    >
      {resourceId === ResourceType.Goal && (
        <GoalModalBody
          activeTab={activeTab}
          tabsToUse={tabsToUse}
          runAddResourceValidations={runAddResourceValidations}
          actionTextToUse={actionTextToUse}
        />
      )}
      {resourceId === ResourceType.Accomplishment && (
        <AccomplishmentModalBody
          runAddResourceValidations={runAddResourceValidations}
        />
      )}
      {resourceId === ResourceType.Meeting && (
        <MeetingModalBody
          runAddResourceValidations={runAddResourceValidations}
          actionTextToUse="Link"
          resourceTypeTitle={resourceTypeTitle}
        />
      )}
      {resourceId === ResourceType.ActionItem && (
        <ActionItemsModalBody
          activeTab={activeTab}
          tabsToUse={tabsToUse}
          runAddResourceValidations={runAddResourceValidations}
          actionTextToUse={actionTextToUse}
          resourceTypeTitle={resourceTypeTitle}
        />
      )}
    </div>
  </div>
);

interface AddResourceModalBodyProps {
  setActiveTab: (tab: number) => void,
  activeTab: number,
  pdpId: string,
}

export const AddResourceModalBody = ({
  setActiveTab,
  activeTab,
  pdpId,
}: AddResourceModalBodyProps): JSX.Element => {
  const {
    resourceId,
    competencyId,
    closeAddResourceModal,
    setResourceContentDueDate,
    setResourceContentTitle,
  } = useAddResourceModalStore((state) => ({
    resourceId: state.resourceId,
    competencyId: state.competencyId,
    closeAddResourceModal: state.closeAddResourceModal,
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
  }));

  const { modalTabs } = useGetPersonalDevelopmentModalTabs();

  const { mutate: createResourceMutation } = useCreateResource();

  const runValidations = (data: CreateResourceDTO): void => {
    const resourceFound = checkShouldCreateResource(data, pdpId);

    if (!resourceFound) {
      createResourceFormSchema
        .validate(data, { abortEarly: false })
        .then(() => {
          const resourceDataDTO = conformToDto(data as FormValues);
          createResourceMutation({ id: pdpId, resource: resourceDataDTO }, { onSuccess: onSuccessfulCreate });
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
    closeAddResourceModal();
  };
  const tabsToUse = modalTabs[resourceId ?? ResourceType.All];
  const foundKey = Object.keys(tabsToUse).find((key) => tabsToUse[key].value === activeTab);
  const actionTextToUse = foundKey?.toLocaleLowerCase() === 'new' ? 'Save' : 'Add';

  const { resourceTypeLabels } = useGetPersonalDevelopmentResourceTypeLabels();
  const resourceTypeTitle = resourceTypeLabels[resourceId ?? ResourceType.All];

  const runAddResourceValidations = (resourceIdClicked: ResourceType, contentId: string | number): void => {
    const { resourceContentTitle, resourceContentDueDate, resourceContentStatus } = addResourceModalStore.getState();
    const fallBackDate = resourceContentDueDate?.getTime() === DEFAULT_DATE.getTime();

    const addResourceDataToValidate = {
      contentId,
      contentTypeId: resourceIdClicked,
      competencyId,
      contentTitle: resourceContentTitle ?? DEFAULT_RESOURCE_TITLE,
      contentDueDate: fallBackDate ? undefined : resourceContentDueDate,
      contentStatus: resourceContentStatus,
    };
    // Need to run these validations as a faux form submission
    runValidations(addResourceDataToValidate);
  };

  const hideTabsBar = resourceId === ResourceType.Accomplishment
  || resourceId === ResourceType.Meeting;

  const hookProps = {
    setActiveTab,
    tabsToUse,
    activeTab,
    pdpId,
    resourceId,
    runAddResourceValidations,
    actionTextToUse,
    resourceTypeTitle,
    hideTabsBar,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
