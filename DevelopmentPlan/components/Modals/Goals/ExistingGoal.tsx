import { css } from '@emotion/react';
import { faClose } from '@fortawesome/pro-light-svg-icons';
import { Goals } from '@josh-hr/types';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import { CardSkeleton } from '~Common/V3/components/Card';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { palette } from '~Common/styles/colors';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import EmptyPDPResources from '~DevelopmentPlan/assets/images/emptyPDPResources.svg';
import { DEFAULT_DATE, DEFAULT_RESOURCE_TITLE, GOALS_PAGE_SIZE } from '~DevelopmentPlan/const/defaults';
import { modalExistingItemStyles } from '~DevelopmentPlan/const/pageStyles';
import { CompetencyResourceStatusEnum, ResourceType } from '~DevelopmentPlan/const/types';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { useGetGoals } from '~Goals/hooks/useGetGoalsDeprecated';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

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
  goals: Goals.Goal[],
  goalsAreLoading: boolean,
  isFetching: boolean,
  onResourceClick: (resourceId: string, resourceContentTitle: string,
    resourceContentDueDate: Date, resourceContentStatusId: CompetencyResourceStatusEnum) => void,
  resourceIdSelected: string[],
  closeAddResourceModal: () => void,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  actionTextToUse: string,
  searchText: string,
  featureNamesText: FeatureNamesText,
}

const View = ({
  goals,
  goalsAreLoading,
  isFetching,
  onResourceClick,
  resourceIdSelected,
  closeAddResourceModal,
  runAddResourceValidations,
  actionTextToUse,
  searchText,
  featureNamesText,
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
            onClick={() => runAddResourceValidations(ResourceType.Goal, resourceIdSelected[0])}
            disabled={resourceIdSelected.length === 0}
          >
            {`${actionTextToUse} ${featureNamesText.goals.singular}`}
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
    {goalsAreLoading && (
      <MultipleSkeletonLoaders
        css={styles.skeletonWrapper}
        numberOfSkeletons={6}
        renderSkeletonItem={() => (
          <CardSkeleton css={styles.cardSkeleton} />
        )}
      />
    )}
    {isFetching && !goalsAreLoading && (
      <div css={styles.isFetchingBar}>
        <LinearProgress
          color="inherit"
          variant="indeterminate"
        />
      </div>
    )}
    {!goalsAreLoading && (
      <>
        {goals && goals.length === 0 && (
          <div
            css={styles.textContainer}
          >
            <EmptyPDPResources css={styles.emptyStateImage} title={`No ${featureNamesText.goals.plural}`} />
            <p>
              <span
                css={styles.searchedText}
              >
                {`"${searchText}" `}
              </span>
              not found in
              {' '}
              {`${featureNamesText.goals.plural}`}
              . Try clearing search and trying again.
            </p>
          </div>
        )}
        {goals && goals.length > 0 && goals.map((goal) => {
          const {
            participants,
            context: {
              contextType,
            },
            title,
            endTimeInMillis,
            statusUpdates,
          } = goal;
          const dateToUse = new Date(endTimeInMillis);
          const owner = participants.find((participant) => participant.role === Goals.GoalParticipantRole.Owner);
          const ownerName = `${owner?.firstName ?? ''} ${owner?.lastName ?? ''}`;
          const isSelected = resourceIdSelected.includes(goal.goalId);

          const returnPDPStatus = (status: Goals.GoalStatus): CompetencyResourceStatusEnum => {
            switch (status) {
              case Goals.GoalStatus.Canceled:
                return CompetencyResourceStatusEnum.Cancelled;
              case Goals.GoalStatus.Missed:
                return CompetencyResourceStatusEnum.Missed;
              case Goals.GoalStatus.Completed:
                return CompetencyResourceStatusEnum.Complete;
              case Goals.GoalStatus.OnTrack:
                return CompetencyResourceStatusEnum.InProgress;
              case Goals.GoalStatus.Caution:
                return CompetencyResourceStatusEnum.AtRisk;
              case Goals.GoalStatus.Behind:
                return CompetencyResourceStatusEnum.OffTrack;
              case Goals.GoalStatus.Blocked:
                return CompetencyResourceStatusEnum.OffTrack;
              case Goals.GoalStatus.PartiallyCompleted:
                return CompetencyResourceStatusEnum.PartiallyCompleted;
              default:
                return CompetencyResourceStatusEnum.NotStarted;
            }
          };
          const currentStatus = returnPDPStatus(statusUpdates[statusUpdates.length - 1].status);

          return (
            <div
              css={styles.resource(isSelected)}
              key={goal.goalId}
            >
              <div>
                <div
                  css={styles.title(isSelected)}
                >
                  {title}
                </div>
                <div css={styles.subText(isSelected)}>{`Owned By ${ownerName} | ${contextType} ${featureNamesText.goals.singular}`}</div>
              </div>
              {isSelected && (
                <JoshButton
                  css={styles.button(isSelected)}
                  variant="ghost"
                  color="danger"
                  onClick={() => onResourceClick(goal.goalId, title, dateToUse, currentStatus)}
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
                  onClick={() => onResourceClick(goal.goalId, title, dateToUse, currentStatus)}
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
    )}
  </>
);

interface ExistingGoalProps {
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  actionTextToUse: string,

}

export const ExistingGoal = ({
  runAddResourceValidations,
  actionTextToUse,
}: ExistingGoalProps): JSX.Element => {
  const [resourceIdSelected, setResourceIdSelected] = useState<string[]>([]);

  const {
    searchText,
    setResourceContentDueDate,
    setResourceContentTitle,
    setResourceContentStatus,
    closeAddResourceModal,
    planDueDate,
    planStartDate,
  } = useAddResourceModalStore((state) => ({
    searchText: state.searchText,
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
    setResourceContentStatus: state.setResourceContentStatus,
    closeAddResourceModal: state.closeAddResourceModal,
    planDueDate: state.planDueDate,
    planStartDate: state.planStartDate,
  }));

  const { featureNamesText } = useGetFeatureNamesText();

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

  const params: Goals.Requests.GetGoalsRequestQueryParameters = {
    take: GOALS_PAGE_SIZE,
    ownerIds: getOrganizationUserId() ?? '',
    searchText: searchText ?? undefined,
    searchField: searchText ? Goals.GetGoalsSearchField.Title : undefined,
    isCompleted: false,
    startDate: planStartDate as string,
    endDate: planDueDate as string,
  };
  const {
    data, isLoading: goalsAreLoading, isFetching,
  } = useGetGoals({ params });

  const goals = data?.response ?? [];

  const hookProps = {
    goals,
    goalsAreLoading,
    isFetching,
    onResourceClick,
    resourceIdSelected,
    closeAddResourceModal,
    runAddResourceValidations,
    actionTextToUse,
    searchText,
    featureNamesText,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
