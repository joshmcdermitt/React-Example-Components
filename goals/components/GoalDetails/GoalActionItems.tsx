import { css } from '@emotion/react';
import { ActionItem, ActionItemContextType, NewActionItemStatus } from '~ActionItems/const/interfaces';
import { useGoalActionItems } from '~ActionItems/hooks/useGoalActionItems';
import EmptyStateWithImage from '~Common/components/EmptyStates/EmptyStateWithImage';
import { palette } from '~Common/styles/colors';
import emptyGoalsV3 from '~Goals/assets/images/emptyGoalsV3.png';
import { createEditActionItemTemplate } from '~ActionItems/components/Drawers/CreateEditActionItemDrawer';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { FormControlLabel } from '@mui/material';
import { Goals } from '@josh-hr/types';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNewPeople } from '~Deprecated/hooks/peoplePicker/useNewPeople';
import { Person } from '~Common/const/interfaces';
import { forMobileObject } from '~Common/styles/mixins';
import { useDrawerActions } from '~Common/hooks/useDrawers';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import withLoadingSkeleton from '~Common/components/withLoadingSkeleton';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';
import useGetFilteredGoalParticipants from '~Goals/hooks/utils/useGetFilteredGoalParticipants';
import GoalDetailsActionItemsTable from './GoalDetailsActionItemsTable';

const styles = {
  heading: css({
    color: palette.neutrals.gray800,
    fontSize: '1.125rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  }),
  emptyStateContainer: css({
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',

    h6: {
      textTransform: 'unset',
    },
  }),
  emptyStateImage: css({
    height: '15rem',
  }, forMobileObject({
    height: '7rem',
  })),
  addActionItemButton: css({
    marginRight: '.1875rem',
    fontWeight: 600,
  }),
  checkboxWrap: css({
    marginLeft: '0.75rem',
    fontSize: '.875rem',
    fontWeight: 500,
    color: palette.neutrals.gray700,
  }),
  addButtonSkelly: css({
    maxWidth: '6.25rem',
    height: '2.5rem',
  }),
  formControlLabel: css({
    gap: '0.5rem',
    margin: 0,
  }),
  skeleton: css({
    minWidth: '100%',
    height: '12.5rem',
  }),
};

interface ViewProps {
  actionItems: ActionItem[] | undefined,
  onCreateActionItem: () => void,
  hideCompleted: boolean,
  handleClick: () => void,
  page: number,
  setPage: (page: number) => void,
  canAddItems: boolean,
  goalCreatorId: string,
  goalOwnerId: string | undefined,
  actionItemsResponse: ActionItem[] | undefined,
  participants: Goals.GoalParticipant[] | undefined,
  featureNamesText: FeatureNamesText,
}

const View = ({
  actionItems,
  onCreateActionItem,
  hideCompleted,
  handleClick,
  participants,
  page,
  setPage,
  canAddItems,
  goalCreatorId,
  goalOwnerId,
  actionItemsResponse,
  featureNamesText,
}: ViewProps): JSX.Element => (
  <div>
    <span
      css={styles.heading}
    >
      Action Items
      {actionItemsResponse?.length !== 0 && (
      <span css={styles.checkboxWrap}>
        <FormControlLabel
          css={styles.formControlLabel}
          control={(
            <JoshCheckbox
              data-test-id="goalsActionItemsHideCompleted"
              checked={hideCompleted}
              onChange={handleClick}
              size={20}
            />
              )}
          label="Hide completed"
        />
      </span>
      )}
    </span>
    {actionItems?.length === 0 && (
    <EmptyStateWithImage
      css={styles.emptyStateContainer}
      renderImage={() => (
        <img
          css={styles.emptyStateImage}
          src={emptyGoalsV3}
          alt="Empty Action Items"
          data-tet-id="goalsEmptyActionItems"
        />
      )}
      renderText={() => (
        <>
          {actionItemsResponse?.length === 0 && (
          <>
            {!canAddItems && (
            <p>{`There are no action items on this ${featureNamesText.goals.singular.toLowerCase()}.`}</p>
            )}
            {canAddItems && (
            <>
              <JoshButton
                variant="text"
                textButtonColor={palette.brand.indigo}
                onClick={onCreateActionItem}
                data-test-id="actionItemsEmptyStateCreateActionItem"
              >
                Add the first Action Item
              </JoshButton>
              {`to this ${featureNamesText.goals.singular}.`}
            </>
            )}
          </>
          )}
        </>
      )}
    />
    )}
    <GoalDetailsActionItemsTable
      actionItems={actionItems}
      isLoading={actionItems === undefined}
      page={page}
      setPage={setPage}
      goalCreatorId={goalCreatorId}
      goalOwnerId={goalOwnerId}
      participants={participants}
    />
    {canAddItems && (
    <JoshButton
      name="actionItemCreateButton"
      data-test-id="actionItemCreateButton"
      type="submit"
      size="small"
      variant="ghost"
      onClick={onCreateActionItem}
      color="primary"
    >
      <JoshButton.IconAndText
        icon={faPlus}
        text="Action Item"
      />
    </JoshButton>
    )}
  </div>
);

const GoalActionItemsSkeleton = (): JSX.Element => (
  <>
    <span css={styles.heading}>Action Items</span>
    <SkeletonLoader css={styles.skeleton} renderComponent={() => <></>} />
  </>
);

interface GoalActionItemsProps {
  data: GetGoalByIdReturn,
  validAssignees?: Goals.GoalParticipant[],
  goalOwnerId: string | undefined,
  isReadOnly: boolean,
}

const GoalActionItems = ({
  data: goal,
  validAssignees,
  goalOwnerId,
  isReadOnly,
}: GoalActionItemsProps): JSX.Element => {
  const { goalId, creator, permissions } = goal;

  const { orgUserId: goalCreatorId } = creator;
  const canAddItems = permissions.includes(Goals.GoalPermission.CanEditGoal) && !isReadOnly;
  const { participants } = useGetFilteredGoalParticipants({ goal });

  const { pushDrawer } = useDrawerActions();
  const { data: actionItemData } = useGoalActionItems({ goalId });
  const [hideCompleted, setHideCompleted] = useState(true);
  const [page, setPage] = useState(1);
  const { featureNamesText } = useGetFeatureNamesText();

  const handleClick = (): void => {
    setHideCompleted(!hideCompleted);
  };
  const actionItemsResponse = actionItemData?.response;
  const actionItems = actionItemsResponse?.sort((a, b) => {
    if (a.dueDateInMillis !== null && b.dueDateInMillis !== null) {
      return a.dueDateInMillis - b.dueDateInMillis;
    } if (a.dueDateInMillis === null && b.dueDateInMillis !== null) {
      return 1;
    } if (a.dueDateInMillis !== null && b.dueDateInMillis === null) {
      return -1;
    }
    return a.createdInMillis - b.createdInMillis;
  });

  const notCompletedActionItems = useMemo(() => (
    actionItems?.filter((actionItem) => actionItem.status !== NewActionItemStatus.Completed)
  ), [actionItems]);

  const { peopleData } = useNewPeople({}) as unknown as Record<string, Record<string, Person>>;

  const filteredValidAssigneesOrgIds = useMemo(() => {
    if (!validAssignees) return [];
    return validAssignees.map((assignee) => assignee.orgUserId);
  }, [validAssignees]);

  const getUserIdForInputArray = (orgIds: string[] | undefined, data: Record<string, Person>): string[] => {
    const userIds = [] as string[];
    if (!data) {
      return []; // Return an empty array if data is undefined or null
    }
    if (orgIds) {
      orgIds.forEach((inputString) => {
        if (Object.prototype.hasOwnProperty.call(data, inputString)) {
          userIds.push(data[inputString].userId);
        }
      });

      return userIds;
    }
    return [];
  };

  const ids = getUserIdForInputArray(filteredValidAssigneesOrgIds, peopleData);
  const onCreateActionItem = (): void => {
    pushDrawer({
      drawer: {
        ...createEditActionItemTemplate,
        args: {
          description: '',
          alwaysShowCloseButton: true,
          allowSelf: false,
          validAssignees: ids ?? [],
          context: {
            type: ActionItemContextType.Goal,
            id: goalId,
          },
        },
      },
    });
  };

  useEffect(
    () => {
      setPage(1);
    },
    [hideCompleted],
  );

  useEffect(() => {
    if (notCompletedActionItems && notCompletedActionItems?.length === 0) {
      setHideCompleted(false);
    } else {
      setHideCompleted(true);
    }
  }, [notCompletedActionItems]);

  const hookProps = {
    actionItems: hideCompleted ? notCompletedActionItems : actionItems,
    onCreateActionItem,
    participants,
    hideCompleted,
    handleClick,
    page,
    setPage,
    canAddItems,
    goalCreatorId,
    goalOwnerId,
    actionItemsResponse,
    featureNamesText,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export default withLoadingSkeleton<GetGoalByIdReturn, GoalActionItemsProps>(GoalActionItems, GoalActionItemsSkeleton);
