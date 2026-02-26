import { css } from '@emotion/react';
import { faClose } from '@fortawesome/pro-light-svg-icons';
import LinearProgress from '@mui/material/LinearProgress';
import moment from 'moment';
import { ChangeEvent, useMemo } from 'react';
import { CardSkeleton } from '~Common/V3/components/Card';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import JoshSearchField from '~Common/V3/components/JoshSearchField';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { palette } from '~Common/styles/colors';
import emptyRequestedLearnings from '~Learning/assets/images/emptyRequestedLearnings.png';
import { DEFAULT_DATE, DEFAULT_RESOURCE_TITLE } from '~DevelopmentPlan/const/defaults';
import { modalExistingItemStyles, existingResourceStyles } from '~DevelopmentPlan/const/pageStyles';
import { CompetencyResourceStatusEnum } from '~DevelopmentPlan/const/types';
import { addResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import LearningEmptySearchOrFilters from '~Learning/components/Shared/LearningEmptySearchOrFilters';
import { LearningStatus, LearningType, ReceivedLearning } from '~Learning/const/interfaces';
import { useGetReceivedLearningsByStatus } from '~Learning/hooks/received/useGetReceivedLearningsByStatus';
import { useLearningSearch } from '~Learning/hooks/utils/useLearningSearch';

const styles = {
  ...modalExistingItemStyles,
  ...existingResourceStyles,
  resourceSpace: css({
    marginBottom: '6px',
  }),
  searchField: css({
    marginBottom: '.625rem',
  }),
  emptyStateContainer: css({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column',
  }),
  emptyStateImage: css({
    maxWidth: '18.75rem',
  }),
  emptyStateText: css({
    color: palette.neutrals.gray900,
    textAlign: 'center',
  }),
};

interface ViewProps {
  learnings: ReceivedLearning[],
  isLoading: boolean,
  isFetching: boolean,
  onResourceClick: (resourceId: string, resourceContentTitle: string,
    resourceContentDueDate: Date, resourceContentStatus: CompetencyResourceStatusEnum) => void,
  resourceIdSelected: string[],
  searchText: string,
  handleSearchTextChange: (event: ChangeEvent<HTMLInputElement>) => void,
  hasSearchOrFilters: boolean,
  planDateString: string,
}

const View = ({
  learnings,
  isLoading,
  isFetching,
  onResourceClick,
  resourceIdSelected,
  searchText,
  handleSearchTextChange,
  hasSearchOrFilters,
  planDateString,
}: ViewProps): JSX.Element => (
  <>
    {isLoading && (
    <MultipleSkeletonLoaders
      css={styles.skeletonWrapper}
      numberOfSkeletons={6}
      renderSkeletonItem={() => (
        <CardSkeleton css={styles.cardSkeleton} />
      )}
    />
    )}
    {!isLoading && (
      <>
        <JoshSearchField
          data-test-id="learningsSearchField"
          onChange={handleSearchTextChange}
          defaultValue={searchText}
          css={styles.searchField}
        />
        <div
          css={styles.planDateString}
        >
          {planDateString}
        </div>
      </>
    )}
    {isFetching && !isLoading && (
    <div css={styles.isFetchingBar}>
      <LinearProgress
        color="inherit"
        variant="indeterminate"
      />
    </div>
    )}
    {!isLoading && (
    <>
      {learnings.length === 0 && hasSearchOrFilters && (
      <LearningEmptySearchOrFilters />
      )}
      {learnings.length === 0 && !hasSearchOrFilters && (
      <div css={styles.emptyStateContainer}>
        <img css={styles.emptyStateImage} src={emptyRequestedLearnings} alt="No Learnings Assigned to you" />
        <span css={styles.emptyStateText}>You don&#39;t have any learnings assigned to you during your timeframe for your development plan.</span>
      </div>
      )}
      {learnings.map((learning) => {
        const {
          assigner,
          title,
          id,
          learningType,
          dueDate,
        } = learning;
        const dateToUse = dueDate ? new Date(dueDate) : DEFAULT_DATE;
        const learningTypeName = learningType === LearningType.SINGLE_LEARNING ? 'Single Learning' : 'Learning Playlist';
        const assignerName = `${assigner?.firstName ?? ''} ${assigner?.lastName ?? ''}`;
        const isSelected = resourceIdSelected.includes(id.toString());
        const isCompleted = learning.status === LearningStatus.COMPLETED;
        const isStarted = learning.status === LearningStatus.STARTED;

        let learningStatus: CompetencyResourceStatusEnum;

        if (isCompleted) {
          learningStatus = CompetencyResourceStatusEnum.Complete;
        } else if (isStarted) {
          learningStatus = CompetencyResourceStatusEnum.InProgress;
        } else {
          learningStatus = CompetencyResourceStatusEnum.NotStarted;
        }

        return (
          <div
            css={[styles.resource(isSelected), styles.resourceSpace]}
            key={id}
          >
            <div>
              <div css={styles.title(isSelected)}>{title}</div>
              <div css={styles.subText(isSelected)}>{`Sent By ${assignerName} | ${learningTypeName}`}</div>
            </div>
            {isSelected && (
            <JoshButton
              css={styles.button(isSelected)}
              variant="ghost"
              color="danger"
              onClick={() => onResourceClick(id.toString(), title, dateToUse, learningStatus)}
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
              onClick={() => onResourceClick(id.toString(), title, dateToUse, learningStatus)}
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

interface ExistingLearningProps {
  resourceIdSelected: string[],
  setResourceIdSelected: (resource: string[]) => void,
  filterResultsBy?: LearningType,
}

export const ExistingLearning = ({
  resourceIdSelected,
  setResourceIdSelected,
  filterResultsBy = LearningType.SINGLE_LEARNING,
}: ExistingLearningProps): JSX.Element => {
  const {
    setResourceContentDueDate, setResourceContentTitle, planDueDate, planStartDate,
    setResourceContentStatus,
  } = addResourceModalStore.getState();

  const onResourceClick = (
    resourceId: string,
    resourceContentTitle: string,
    resourceContentDueDate: Date,
    resourceContentStatus: CompetencyResourceStatusEnum,
  ): void => {
    const isAlreadySelected = resourceIdSelected.includes(resourceId);
    if (isAlreadySelected) {
      // If present, remove it
      setResourceContentTitle(DEFAULT_RESOURCE_TITLE);
      setResourceContentDueDate(DEFAULT_DATE);
      setResourceIdSelected(resourceIdSelected.filter((id) => id !== resourceId));
      setResourceContentStatus(CompetencyResourceStatusEnum.NotStarted);
    } else {
      // If not present, replace the current selection with it
      setResourceIdSelected([resourceId]);
      setResourceContentTitle(resourceContentTitle);
      setResourceContentDueDate(resourceContentDueDate);
      setResourceContentStatus(resourceContentStatus);
    }
  };
  const [searchText, setSearchText] = useLearningSearch();
  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };
  const hasSearchOrFilters = searchText !== '';
  const { learningsByStatus, isLoading, isFetching } = useGetReceivedLearningsByStatus();

  const filteredLearnings = useMemo(() => (learningsByStatus || []).flatMap((obj) => (obj.learnings || []).filter((item) => {
    const dueDate = typeof item.dueDate === 'string' ? new Date(item.dueDate) : new Date();
    return (
      item.learningType === filterResultsBy
        && moment(dueDate).valueOf() >= moment(planStartDate).valueOf()
        && moment(dueDate).valueOf() <= moment(planDueDate).valueOf()
    );
  })), [learningsByStatus, filterResultsBy, planStartDate, planDueDate]);

  const planDateString = `Learnings between ${moment(planStartDate).format('MMM D')} - ${moment(planDueDate).format('MMM D')}`;

  const hookProps = {
    learnings: filteredLearnings,
    isLoading,
    isFetching,
    onResourceClick,
    resourceIdSelected,
    searchText,
    handleSearchTextChange,
    hasSearchOrFilters,
    planDateString,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
