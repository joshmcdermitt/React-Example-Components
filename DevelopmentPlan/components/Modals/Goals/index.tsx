import moment from 'moment';
import { ChangeEvent } from 'react';
import {
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import JoshSearchField from '~Common/V3/components/JoshSearchField';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import { existingResourceStyles } from '~DevelopmentPlan/const/pageStyles';
import { CompetencyResourceStatusEnum, ResourceType } from '~DevelopmentPlan/const/types';
import { TabItem } from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentModalTabs';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { CreateGoalResponse, useCreateGoal } from '~Goals/components/DeleteAfterUOM/useCreateGoal';
import CreateEditGoalForm from '~Goals/components/Shared/CreateEditGoalForm';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import useGetCreateEditFormResolver, { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { getDefaultGoalValues } from '~Goals/utils/getDefaultGoalValues';
import { css } from '@emotion/react';
import { CreateMeasurementUnitTypePayload, useCreateMeasurementUnitType } from '~Goals/hooks/useCreateMeasurementUnitType';
import { ExistingGoal } from './ExistingGoal';

const styles = {
  ...existingResourceStyles,
  resourceWrapperUpdate: css({
    paddingBottom: '0rem',
  }),
};

interface ViewProps {
  showNewView: boolean,
  searchText: string,
  handleSearchTextChange: (event: ChangeEvent<HTMLInputElement>) => void,
  actionTextToUse: string,
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  planDateString: string,
  handleSubmit: (newGoal: CreateEditGoalFormValues, customUnitType: CreateMeasurementUnitTypePayload | null) => void,
}

const View = ({
  showNewView,
  searchText,
  handleSearchTextChange,
  actionTextToUse,
  formContext,
  runAddResourceValidations,
  planDateString,
  handleSubmit,
}: ViewProps): JSX.Element => (
  <>
    {!showNewView && (
      <>
        {/* The goal here is to use this for all the modals - I'd like to update this to pass in the components below into this file if this works out */}
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
    <div css={[styles.resourceWrapper, styles.resourceWrapperUpdate]}>
      {showNewView && (
        <CreateEditGoalForm
          formContext={formContext}
          handleOnSubmit={handleSubmit}
          actionTextToUse={actionTextToUse}
          isModal
        />
      )}
      {!showNewView && (
        <ExistingGoal
          runAddResourceValidations={runAddResourceValidations}
          actionTextToUse={actionTextToUse}
        />
      )}
    </div>
  </>
);

interface GoalModalBodyProps {
  activeTab: number,
  tabsToUse: Record<string, TabItem>,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  actionTextToUse: string,
}

export const GoalModalBody = ({
  activeTab,
  tabsToUse,
  runAddResourceValidations,
  actionTextToUse,
}: GoalModalBodyProps): JSX.Element => {
  const foundKey = Object.keys(tabsToUse).find((key) => tabsToUse[key].value === activeTab);
  const showNewView = foundKey?.toLocaleLowerCase() === 'new';

  const {
    searchText,
    setSearchText,
    planStartDate,
    planDueDate,
    setResourceContentDueDate,
    setResourceContentTitle,
    closeAddResourceModal,
    setResourceContentStatus,
  } = useAddResourceModalStore((state) => ({
    searchText: state.searchText,
    setSearchText: state.setSearchText,
    planStartDate: state.planStartDate,
    planDueDate: state.planDueDate,
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
    closeAddResourceModal: state.closeAddResourceModal,
    setResourceContentStatus: state.setResourceContentStatus,
  }));
  const { formResolver } = useGetCreateEditFormResolver();

  const { featureNamesText } = useGetFeatureNamesText();

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  const planDateString = `${featureNamesText.goals.plural} between ${moment(planStartDate).format('MMM D')} - ${moment(planDueDate).format('MMM D')}`;

  const defaultGoal = getDefaultGoalValues();

  const formContext = useForm<CreateEditGoalFormValues>({
    defaultValues: defaultGoal,
    resolver: formResolver,
  });

  const { mutate: createGoalMutation } = useCreateGoal();

  const setupAddResourceValidations = (data: HttpCallReturn<CreateGoalResponse>): void => {
    const { goalId } = data.response;
    const resourceId = ResourceType.Goal;
    const contentId = goalId;
    runAddResourceValidations(resourceId, contentId);
  };

  const { mutate: createMeasurementUnitType } = useCreateMeasurementUnitType();

  const handleSubmit = (newGoal: CreateEditGoalFormValues, customUnitType: CreateMeasurementUnitTypePayload | null): void => {
    // REFACTOR: Add yup validation, remove disable check on button
    if (customUnitType !== null) {
      createMeasurementUnitType({ payload: customUnitType }, {
        onSuccess: (unitTypeData) => {
          const { id } = unitTypeData.response;
          const updatedGoal = { ...newGoal, measurementUnitTypeId: id };
          createGoalMutation({ goal: updatedGoal }, {
            onSuccess: (data) => {
              setResourceContentStatus(CompetencyResourceStatusEnum.OnTrack);
              setResourceContentDueDate(moment(updatedGoal.endTimeInMillis).toDate());
              setResourceContentTitle(updatedGoal.title);
              setupAddResourceValidations(data);
            },
          });
        },
      });
    } else {
      createGoalMutation({ goal: newGoal }, {
        onSuccess: (data) => {
          setResourceContentStatus(CompetencyResourceStatusEnum.OnTrack);
          setResourceContentDueDate(moment(newGoal.endTimeInMillis).toDate());
          setResourceContentTitle(newGoal.title);
          setupAddResourceValidations(data);
        },
      });
    }
  };

  const hookProps = {
    showNewView,
    handleSearchTextChange,
    searchText,
    actionTextToUse,
    formContext,
    runAddResourceValidations,
    planDateString,
    closeAddResourceModal,
    handleSubmit,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default GoalModalBody;
