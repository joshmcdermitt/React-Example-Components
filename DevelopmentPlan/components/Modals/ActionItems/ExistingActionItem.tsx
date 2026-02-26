import { css } from '@emotion/react';
import { faClose } from '@fortawesome/pro-light-svg-icons';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import { ActionItem, NewActionItemStatus } from '~ActionItems/const/interfaces';
import { ActionItemAssigneeType, useActionItems } from '~ActionItems/hooks/useActionItems';
import { CardSkeleton } from '~Common/V3/components/Card';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { Person } from '~Common/const/interfaces';
import { palette } from '~Common/styles/colors';
import { useNewPeople } from '~Deprecated/hooks/peoplePicker/useNewPeople';
import EmptyPDPResources from '~DevelopmentPlan/assets/images/emptyPDPResources.svg';
import { ACTION_ITEMS_PAGE_SIZE, DEFAULT_DATE, DEFAULT_RESOURCE_TITLE } from '~DevelopmentPlan/const/defaults';
import { modalExistingItemStyles } from '~DevelopmentPlan/const/pageStyles';
import { CompetencyResourceStatusEnum, ResourceType } from '~DevelopmentPlan/const/types';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';

const styles = {
  ...modalExistingItemStyles,
  searchedText: css({
    color: palette.brand.indigo,
    fontWeight: 600,
  }),
  emptyStateImage: css({
    height: '7.5rem',
    marginBottom: '.875rem',
  }),
  textContainer: css({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    fontWeight: 500,
    marginTop: '2rem',
    color: palette.neutrals.gray800,
  }),
};

interface ViewProps {
  onResourceClick: (resourceId: string, resourceContentTitle: string,
    resourceContentDueDate: Date, resourceContentStatusId: CompetencyResourceStatusEnum) => void,
  resourceIdSelected: string[],
  actionTextToUse: string,
  resourceTypeTitle: string,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  closeAddResourceModal: () => void,
  isActionItemsLoading: boolean,
  isFetching: boolean,
  actionItemsData: ActionItem[],
  peopleData: Record<string, Person>,
  searchText: string,
}

const View = ({
  onResourceClick,
  resourceIdSelected,
  actionTextToUse,
  resourceTypeTitle,
  runAddResourceValidations,
  closeAddResourceModal,
  isActionItemsLoading,
  isFetching,
  actionItemsData,
  peopleData,
  searchText,
}: ViewProps): JSX.Element => (
  <>
    <ContextButtons
      portalIds={['modalButtons']}
      renderContents={() => (
        <>
          <JoshButton
            data-test-id="addResourceModalSaveChanges"
            size="small"
            type="submit"
            onClick={() => runAddResourceValidations(ResourceType.ActionItem, resourceIdSelected[0])}
            disabled={resourceIdSelected.length === 0}
          >
            {`${actionTextToUse} ${resourceTypeTitle}`}
          </JoshButton>
          <JoshButton
            data-test-id="addResourceModalCancelChanges"
            onClick={closeAddResourceModal}
            size="small"
            variant="ghost"
          >
            Cancel
          </JoshButton>
        </>
      )}
    />
    {isActionItemsLoading && (
    <MultipleSkeletonLoaders
      css={styles.skeletonWrapper}
      numberOfSkeletons={6}
      renderSkeletonItem={() => (
        <CardSkeleton css={styles.cardSkeleton} />
      )}
    />
    )}
    {isFetching && !isActionItemsLoading && (
    <div css={styles.isFetchingBar}>
      <LinearProgress
        color="inherit"
        variant="indeterminate"
      />
    </div>
    )}
    {!isActionItemsLoading && actionItemsData?.length === 0 && !isFetching && (
    <div
      css={styles.textContainer}
    >
      <EmptyPDPResources css={styles.emptyStateImage} title="No Action Items" />
      <p>
        <span
          css={styles.searchedText}
        >
          {`"${searchText}" `}
        </span>
        not found in Action Items. Try clearing search and trying again.
      </p>
    </div>
    )}
    {!isActionItemsLoading && actionItemsData && actionItemsData.length > 0 && actionItemsData.map((item) => {
      const {
        assigneeId,
        text: content,
        dueDateInMillis,
        status,
      } = item;
      const dateToUse = dueDateInMillis ? new Date(dueDateInMillis) : new Date(DEFAULT_DATE);
      const assignee = peopleData?.[assigneeId];
      const createdByName = `${assignee?.firstName ?? ''} ${assignee?.lastName ?? ''}`;
      const isSelected = resourceIdSelected.includes(item.id);

      const returnPDPStatus = (actionItemStatus: NewActionItemStatus): CompetencyResourceStatusEnum => {
        switch (actionItemStatus) {
          case NewActionItemStatus.Completed:
            return CompetencyResourceStatusEnum.Complete;
          case NewActionItemStatus.ToDo:
            return CompetencyResourceStatusEnum.ToDo;
          case NewActionItemStatus.InProgress:
            return CompetencyResourceStatusEnum.InProgress;
          case NewActionItemStatus.Blocked:
            return CompetencyResourceStatusEnum.Blocked;
          default:
            return CompetencyResourceStatusEnum.NotStarted;
        }
      };

      const currentStatus = returnPDPStatus(status);

      return (
        <div
          css={styles.resource(isSelected)}
          key={item.id}
        >
          <div>
            <div css={styles.title(isSelected)}>{content}</div>
            <div css={styles.subText(isSelected)}>{`Owned by ${createdByName}`}</div>
          </div>
          {isSelected && (
            <JoshButton
              css={styles.button(isSelected)}
              variant="ghost"
              color="danger"
              onClick={() => onResourceClick(item.id, content, dateToUse, currentStatus)}
              size="small"
              data-test-id="selectResource"
            >
              <JoshButton.IconAndText
                icon={faClose}
                text=""
              />
            </JoshButton>
          )}
          {!isSelected && (
            <JoshButton
              css={styles.button(isSelected)}
              onClick={() => onResourceClick(item.id, content, dateToUse, currentStatus)}
              size="small"
              data-test-id="selectResource"
            >
              Select
            </JoshButton>
          )}
        </div>
      );
    })}
  </>
);

interface ExistingActionItemProps {
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  actionTextToUse: string,
  resourceTypeTitle: string,
}

export const ExistingActionItem = ({
  runAddResourceValidations,
  actionTextToUse,
  resourceTypeTitle,
}: ExistingActionItemProps): JSX.Element => {
  const [resourceIdSelected, setResourceIdSelected] = useState<string[]>([]);

  const {
    closeAddResourceModal,
    setResourceContentDueDate,
    setResourceContentTitle,
    setResourceContentStatus,
  } = useAddResourceModalStore((state) => ({
    closeAddResourceModal: state.closeAddResourceModal,
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
    setResourceContentStatus: state.setResourceContentStatus,
  }));
  const onResourceClick = (
    resourceId: string,
    resourceContentTitle: string,
    resourceContentDueDate: Date,
    resourceContentStatusId: CompetencyResourceStatusEnum,
  ): void => {
    setResourceIdSelected((prevState) => {
      const isAlreadySelected = prevState.includes(resourceId);

      if (isAlreadySelected) {
        setResourceContentTitle(DEFAULT_RESOURCE_TITLE);
        setResourceContentDueDate(DEFAULT_DATE);
        setResourceContentStatus(CompetencyResourceStatusEnum.NotStarted);
        // If present, remove it
        return prevState.filter((id) => id !== resourceId);
      }
      setResourceContentTitle(resourceContentTitle);
      setResourceContentDueDate(resourceContentDueDate);
      setResourceContentStatus(resourceContentStatusId);
      return [resourceId];
    });
  };

  const {
    searchText,
    planDueDate,
    planStartDate,
  } = useAddResourceModalStore((state) => ({
    searchText: state.searchText,
    planDueDate: state.planDueDate,
    planStartDate: state.planStartDate,
  }));

  const { data, isLoading: isActionItemsLoading, isFetching } = useActionItems({
    take: ACTION_ITEMS_PAGE_SIZE,
    assigneeType: [ActionItemAssigneeType.Me],
    search: searchText ?? undefined,
    startDate: planStartDate,
    endDate: planDueDate,
  });

  const actionItemsData = data?.response.items ?? [];
  const { peopleData } = useNewPeople({}) as unknown as Record<string, Record<string, Person>>;

  const hookProps = {
    onResourceClick,
    resourceIdSelected,
    actionTextToUse,
    resourceTypeTitle,
    runAddResourceValidations,
    closeAddResourceModal,
    isActionItemsLoading,
    isFetching,
    actionItemsData,
    peopleData,
    searchText,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
