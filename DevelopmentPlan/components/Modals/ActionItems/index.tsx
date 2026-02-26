import { ResourceType } from '~DevelopmentPlan/const/types';
import JoshSearchField from '~Common/V3/components/JoshSearchField';
import { ChangeEvent } from 'react';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { existingResourceStyles } from '~DevelopmentPlan/const/pageStyles';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import moment from 'moment';
import { TabItem } from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentModalTabs';
import { NewActionItem } from './NewActionItem';
import { ExistingActionItem } from './ExistingActionItem';

const styles = {
  ...existingResourceStyles,
};

interface ViewProps {
  showNewView: boolean,
  searchText: string,
  handleSearchTextChange: (event: ChangeEvent<HTMLInputElement>) => void,
  actionTextToUse: string,
  resourceTypeTitle: string,
  setupAddResourceValidations: (data: Promise<HttpCallReturn<string>>) => void,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  planDateString: string,
}

const View = ({
  showNewView,
  searchText,
  handleSearchTextChange,
  actionTextToUse,
  resourceTypeTitle,
  setupAddResourceValidations,
  runAddResourceValidations,
  planDateString,
}: ViewProps): JSX.Element => (
  <>
    {!showNewView && (
    <>
      <JoshSearchField
        data-test-id="addResourceSearchField"
        defaultValue={searchText}
        onChange={handleSearchTextChange}
        css={styles.searchField}
      />
      <div
        css={styles.planDateString}
      >
        {planDateString}
      </div>
    </>
    )}
    <div css={styles.resourceWrapper}>
      {showNewView && (
      <NewActionItem
        setupAddResourceValidations={setupAddResourceValidations}
      />
      )}
      {!showNewView && (
      <ExistingActionItem
        runAddResourceValidations={runAddResourceValidations}
        actionTextToUse={actionTextToUse}
        resourceTypeTitle={resourceTypeTitle}
      />
      )}
    </div>
  </>
);

interface ActionItemsModalBodyProps {
  activeTab: number,
  tabsToUse: Record<string, TabItem>,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  actionTextToUse: string,
  resourceTypeTitle: string,
}

export const ActionItemsModalBody = ({
  activeTab,
  tabsToUse,
  runAddResourceValidations,
  actionTextToUse,
  resourceTypeTitle,
}: ActionItemsModalBodyProps): JSX.Element => {
  const foundKey = Object.keys(tabsToUse).find((key) => tabsToUse[key].value === activeTab);
  const showNewView = foundKey?.toLocaleLowerCase() === 'new';

  const {
    searchText,
    setSearchText,
    planStartDate,
    planDueDate,
  } = useAddResourceModalStore((state) => ({
    searchText: state.searchText,
    setSearchText: state.setSearchText,
    planStartDate: state.planStartDate,
    planDueDate: state.planDueDate,
  }));

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  const setupAddResourceValidations = async (data: Promise<HttpCallReturn<string>>): Promise<void> => {
    const resolvedData = await data;
    const actionItemId = resolvedData.response;
    const resourceId = ResourceType.ActionItem;
    const contentId = actionItemId[0];
    if (contentId) {
      runAddResourceValidations(resourceId, contentId);
    }
  };

  const planDateString = `Action Items between ${moment(planStartDate).format('MMM D')} - ${moment(planDueDate).format('MMM D')}`;

  const hookProps = {
    showNewView,
    handleSearchTextChange,
    searchText,
    actionTextToUse,
    resourceTypeTitle,
    setupAddResourceValidations,
    runAddResourceValidations,
    planDateString,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default ActionItemsModalBody;
