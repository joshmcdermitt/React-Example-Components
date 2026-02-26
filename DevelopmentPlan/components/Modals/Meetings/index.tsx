import { ResourceType } from '~DevelopmentPlan/const/types';
import JoshSearchField from '~Common/V3/components/JoshSearchField';
import { ChangeEvent } from 'react';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { existingResourceStyles } from '~DevelopmentPlan/const/pageStyles';
import moment from 'moment';
import { AddMeeting } from './AddMeeting';

const styles = {
  ...existingResourceStyles,
};

interface ViewProps {
  searchText: string,
  handleSearchTextChange: (event: ChangeEvent<HTMLInputElement>) => void,
  actionTextToUse: string,
  resourceTypeTitle: string,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  planDateString: string,
}

const View = ({
  searchText,
  handleSearchTextChange,
  actionTextToUse,
  resourceTypeTitle,
  runAddResourceValidations,
  planDateString,
}: ViewProps): JSX.Element => (
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
    <div css={styles.resourceWrapper}>
      <AddMeeting
        runAddResourceValidations={runAddResourceValidations}
        actionTextToUse={actionTextToUse}
        resourceTypeTitle={resourceTypeTitle}
      />
    </div>
  </>
);

interface MeetingModalBodyProps {
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  actionTextToUse: string,
  resourceTypeTitle: string,
}

export const MeetingModalBody = ({
  runAddResourceValidations,
  actionTextToUse,
  resourceTypeTitle,
}: MeetingModalBodyProps): JSX.Element => {
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

  const planDateString = `Meetings between ${moment(planStartDate).format('MMM D')} - ${moment(planDueDate).format('MMM D')}`;

  const hookProps = {
    handleSearchTextChange,
    searchText,
    actionTextToUse,
    resourceTypeTitle,
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
export default MeetingModalBody;
