import { SerializedStyles, css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import JoshSearchField from '~Common/V3/components/JoshSearchField';
import { ChangeEvent, SyntheticEvent, useMemo } from 'react';
import { useSearchExistingGoalsToLink } from '~Goals/hooks/utils/useSearchExistingGoalsToLink';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { LinkedGoalType } from '~Goals/const/types';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/pro-light-svg-icons';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';
import { useShowLinkGoalModal } from '~Goals/hooks/utils/useShowLinkGoalModal';
import { UseLinkGoalWithExistingGoalLinksReturn } from '~Goals/hooks/utils/useLinkGoalWithExistingGoalLinks';
import { UseUserLinkedGoalIdsReturn } from '~Goals/stores/useUserLinkedGoalIds';
import ButtonWithConfirmation from '~Common/V3/components/ButtonWithConfirmation';
import ConfirmationButtons from '~Common/V3/components/ButtonWithConfirmation/ConfirmationButtons';
import { useGetLinkableParentGoals } from '~Goals/hooks/linkGoals/useGetLinkableParentGoals';
import { useGetLinkableChildGoals } from '~Goals/hooks/linkGoals/useGetLinkableChildGoals';
import EmptySearch from '~Common/components/EmptyStates/EmptySearch';
import { palette } from '~Common/styles/colors';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import ExistingGoalCard, { ExistingGoalCardSkeleton } from './ExistingGoalCard';

const styles = {
  linkExistingGoal: css({}),
  joshSearchField: css({
    marginBottom: '.625rem',
  }),
  existingGoalCardContainer: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.375rem',
  }),
  searchedText: css({
    color: palette.brand.indigo,
    fontWeight: 700,
  }),
  connectButton: css({
    whiteSpace: 'nowrap',
  }),
};

const findGoalOwnerFullName = (goalParticipants: Goals.GoalParticipant[]): string => {
  const owner = goalParticipants.find((participant) => participant.role === Goals.GoalParticipantRole.Owner);
  if (owner) {
    return `${owner?.firstName} ${owner?.lastName}`;
  }

  return '';
};

interface ViewProps {
  goals: Goals.LinkedGoal[] | undefined,
  onSelectOrRemoveGoal: (goalId: string, isSelected: boolean) => void,
  searchText: string,
  handleSearchTextChange: (event: ChangeEvent<HTMLInputElement>) => void,
  isLoading: boolean,
  isGoalSelected: (goalId: string) => boolean,
  selectButtonText: string,
  isSearching: boolean,
  handleConnectGoal: () => void,
  handleCancel: (e: SyntheticEvent<HTMLButtonElement>, openConfirmation: (e: SyntheticEvent<HTMLButtonElement>) => void) => void,
  closeModal: () => void,
  showEmptySearchState: boolean,
  debouncedSearchText: string,
  featureNamesText: FeatureNamesText,
}

const View = ({
  goals,
  onSelectOrRemoveGoal,
  searchText,
  handleSearchTextChange,
  isLoading,
  isGoalSelected,
  selectButtonText,
  isSearching,
  handleCancel,
  handleConnectGoal,
  closeModal,
  showEmptySearchState,
  debouncedSearchText,
  featureNamesText,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.linkExistingGoal}
    {...props}
  >
    <JoshSearchField
      css={styles.joshSearchField}
      data-test-id="goalsSearchExistingGoal"
      defaultValue={searchText}
      onChange={handleSearchTextChange}
      renderLeftIcon={isSearching ? (iconStyles) => <FontAwesomeIcon css={iconStyles} icon={faCircleNotch} spin /> : undefined}
      inputProps={{
        autoFocus: true,
      }}
    />
    {isLoading && (
      <MultipleSkeletonLoaders
        css={styles.existingGoalCardContainer}
        renderSkeletonItem={() => (
          <ExistingGoalCardSkeleton />
        )}
        numberOfSkeletons={5}
      />
    )}
    {!isLoading && (
      <div css={styles.existingGoalCardContainer}>
        {goals?.map((goal) => (
          <ExistingGoalCard
            key={goal.goalId}
            ownerFullName={findGoalOwnerFullName(goal.participants)}
            title={goal.title}
            contextType={goal.context.contextType}
            isSelected={isGoalSelected(goal.goalId)}
            renderRightButton={(buttonStyles: SerializedStyles) => (
              <>
                {isGoalSelected(goal.goalId) && (
                  <JoshButton
                    css={buttonStyles}
                    size="small"
                    data-test-id="goalsRemoveExistingGoal"
                    color="danger"
                    onClick={() => onSelectOrRemoveGoal(goal.goalId, true)}
                  >
                    Deselect
                  </JoshButton>
                )}
                {!isGoalSelected(goal.goalId) && (
                  <JoshButton
                    css={buttonStyles}
                    size="small"
                    data-test-id="goalsSelectExistingGoal"
                    onClick={() => onSelectOrRemoveGoal(goal.goalId, false)}
                  >
                    {selectButtonText}
                  </JoshButton>
                )}
              </>
            )}
          />
        ))}
        {showEmptySearchState && (
          <EmptySearch
            renderText={() => (
              <div>
                <span
                  css={styles.searchedText}
                >
                  {`"${debouncedSearchText}" `}
                </span>
                {`not found in ${featureNamesText.goals.plural}. Try clearing search and trying again.`}
              </div>
            )}
          />
        )}
      </div>
    )}
    <ContextButtons
      portalIds={['modalButtons']}
      renderContents={() => (
        <>
          <JoshButton
            css={styles.connectButton}
            data-test-id="goalsLinkGoal"
            size="small"
            type="submit"
            onClick={handleConnectGoal}
          >
            {`Connect ${featureNamesText.goals.singular}`}
          </JoshButton>
          <ButtonWithConfirmation
            onClick={handleCancel}
            renderButton={({ onClick }) => (
              <JoshButton
                data-test-id="goalsCancelLinkGoal"
                onClick={onClick}
                size="small"
                variant="ghost"
              >
                Cancel
              </JoshButton>
            )}
            renderConfirmationButtons={({
              informationStyles,
              optionStyles,
              popoverButtonStyles,
            }) => (
              <ConfirmationButtons
                onConfirm={closeModal}
                questionText="Leave without saving?"
                confirmText="Yes"
                cancelText="No"
                informationStyles={informationStyles}
                optionStyles={optionStyles}
                popoverButtonStyles={popoverButtonStyles}
              />
            )}
          />
        </>
      )}
    />
  </div>
);

interface LinkExistingGoalProps extends Omit<UseUserLinkedGoalIdsReturn, 'hasUnsavedLinkedGoals'>,
Pick<UseLinkGoalWithExistingGoalLinksReturn, 'linkParentGoal' | 'linkSupportingGoals'> {
  linkedGoalType: LinkedGoalType,
  requireCloseConfirmation: boolean,
  goalId: string,
}

const LinkExistingGoal = ({
  linkedGoalType,
  userLinkedGoalIds: linkedGoalIds,
  addLinkedGoalIds,
  removeLinkedGoalIds,
  replaceLinkedGoalIds,
  requireCloseConfirmation,
  linkParentGoal,
  linkSupportingGoals,
  goalId,
  ...props
}: LinkExistingGoalProps): JSX.Element => {
  const searchText = useSearchExistingGoalsToLink((state) => state.searchText);
  const debouncedSearchText = useSearchExistingGoalsToLink((state) => state.debouncedSearchText);
  const setSearchText = useSearchExistingGoalsToLink((state) => state.setSearchText);
  const { closeModal } = useShowLinkGoalModal();
  const { featureNamesText } = useGetFeatureNamesText();

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  const params: Goals.Requests.GetLinkableParentGoalsRequestQueryParameters = useMemo(() => ({
    take: 100,
    searchText: debouncedSearchText ?? undefined,
    searchField: debouncedSearchText ? Goals.GetGoalsSearchField.Title : undefined,
  }), [debouncedSearchText]);

  const onSelectOrRemoveGoal = (selectedGoalId: string, isSelected: boolean): void => {
    if (linkedGoalType === LinkedGoalType.Parent) {
      if (isSelected) {
        removeLinkedGoalIds([selectedGoalId]);
      } else {
        replaceLinkedGoalIds([selectedGoalId]);
      }
    } else if (linkedGoalType === LinkedGoalType.Supporting) {
      if (isSelected) {
        removeLinkedGoalIds([selectedGoalId]);
      } else {
        addLinkedGoalIds([selectedGoalId]);
      }
    }
  };

  const {
    data: parentGoalsData,
    isLoading: areLinkableParentGoalsLoading,
    isFetching: isFetchingParentGoals,
  } = useGetLinkableParentGoals({
    goalId,
    queryParameters: params,
    enabled: linkedGoalType === LinkedGoalType.Parent,
  });

  const {
    data: childGoalsData,
    isLoading: areLinkableChildGoalsLoading,
    isFetching: isFetchingChildGoals,
  } = useGetLinkableChildGoals({
    goalId,
    queryParameters: params,
    enabled: linkedGoalType === LinkedGoalType.Supporting,
  });

  const isFetching = isFetchingParentGoals || isFetchingChildGoals;
  const areGoalsLoading = areLinkableParentGoalsLoading || areLinkableChildGoalsLoading;

  const goalsToUse = useMemo(() => {
    if (linkedGoalType === LinkedGoalType.Parent) {
      return parentGoalsData?.response;
    }
    return childGoalsData?.response;
  }, [childGoalsData, linkedGoalType, parentGoalsData]);

  const [isLoading] = useSkeletonLoaders(areGoalsLoading);

  const isGoalSelected = (selectedGoalId: string): boolean => linkedGoalIds.includes(selectedGoalId);

  const isSearching = useMemo(() => searchText.length > 0 && (searchText !== debouncedSearchText || isFetching), [debouncedSearchText, isFetching, searchText]);

  const handleCancel = (event: SyntheticEvent<HTMLButtonElement>, openConfirmation: (e: SyntheticEvent<HTMLButtonElement>) => void): void => {
    if (requireCloseConfirmation) {
      openConfirmation(event);
    } else {
      closeModal();
    }
  };

  const handleConnectGoal = (): void => {
    if (linkedGoalType === LinkedGoalType.Parent) {
      linkParentGoal(linkedGoalIds[0]);
    } else if (linkedGoalType === LinkedGoalType.Supporting) {
      linkSupportingGoals(linkedGoalIds);
    }
  };

  const showEmptySearchState = !isLoading && !!debouncedSearchText && goalsToUse?.length === 0;

  const hookProps = {
    goals: goalsToUse,
    onSelectOrRemoveGoal,
    searchText,
    handleSearchTextChange,
    isLoading,
    isGoalSelected,
    selectButtonText: linkedGoalType === LinkedGoalType.Parent && linkedGoalIds.length > 0 ? 'Replace' : 'Select',
    isSearching,
    handleCancel,
    closeModal,
    handleConnectGoal,
    showEmptySearchState,
    debouncedSearchText,
    featureNamesText,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default LinkExistingGoal;
