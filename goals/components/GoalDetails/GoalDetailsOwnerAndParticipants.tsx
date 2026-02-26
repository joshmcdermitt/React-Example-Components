import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { useEnableCascadingGoals } from '~Goals/hooks/utils/useEnableCascadingGoals';
import { forTabletObject } from '~Common/styles/mixins';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';
import withLoadingSkeleton from '~Common/components/withLoadingSkeleton';
import useGetFilteredGoalParticipants from '~Goals/hooks/utils/useGetFilteredGoalParticipants';
import CreateEditTeamModal from '~People/components/Teams/components/CreateEditTeamModal';
import { VisibilityType } from '~People/components/Teams/const/types';
import useUpdateGoal from '~Goals/hooks/useUpdateGoal';
import { useMemo } from 'react';
import { GoalParticipants } from './GoalParticipants';
import LinkedGoals from './LinkedGoals';

const styles = {
  participantsContainer: (isDrawer: boolean) => css({
    maxWidth: '25rem',
  }, forTabletObject({
    minWidth: '15rem',
  }), isDrawer && {
    maxWidth: '100%',
  }),
  linkedGoals: css({
    marginTop: '1.5rem',
  }),
  skeleton: css({
    height: '8.75rem',
    minWidth: '100%',
  }),
};

interface ViewProps {
  collaborators: Goals.GoalParticipant[] | undefined,
  viewers: Goals.GoalParticipant[] | undefined,
  canLinkParentGoal: boolean,
  canLinkSupportingGoals: boolean,
  showLinkedGoals: boolean,
  goal?: Goals.Goal,
  isDrawer?: boolean,
  permissions: Goals.GoalPermission[],
}

const View = ({
  collaborators,
  viewers,
  isDrawer = false,
  goal,
  canLinkParentGoal,
  canLinkSupportingGoals,
  showLinkedGoals,
  permissions,
}: ViewProps): JSX.Element => {
  const { updateGoal } = useUpdateGoal();
  const handleEditGoalContextType = async (teamId: string): Promise<void> => {
    if (!goal) {
      return;
    }

    await updateGoal({
      participantsPayload: {
        participants: goal.participants.map((participant) => ({
          orgUserId: participant.orgUserId,
          role: participant.role,
        })),
      },
      goalPayload: {
        context: {
          contextId: teamId,
          contextType: Goals.GoalContextType.Team,
          // contextName: goal!.context.contextName, // needed?
        },
      },
      goalId: goal.goalId,
    });
  };

  const initialData = useMemo(() => {
    if (!goal) {
      return undefined;
    }

    const creatorOrgUserId = goal.creator.orgUserId;

    // Get existing owners
    const ownerOrgUserIds = goal.participants
      ?.filter((p) => p.role === Goals.GoalParticipantRole.Owner)
      .map((p) => p.orgUserId) || [];

    // If the creator is not the owner, add both the creator and owner to the ownerOrgUserIds
    if (!ownerOrgUserIds.includes(creatorOrgUserId)) {
      ownerOrgUserIds.push(creatorOrgUserId);
    }

    const memberOrgUserIds = goal.participants
      ?.filter((p) => p.role === Goals.GoalParticipantRole.Collaborator)
      .map((p) => p.orgUserId) || [];

    return {
      teamId: '',
      name: `New Team from Objective ${goal.title}`,
      description: '',
      ownerOrgUserIds,
      memberOrgUserIds,
      teamClarityQuestionList: [],
      visibilityType: VisibilityType.Private,
      thematicGoalQuestionRank: 0,
    };
  }, [goal]);

  const goalHasTeamLink = goal?.context.contextId !== '' && goal?.context.contextType === Goals.GoalContextType.Team;

  return (
    <>
      <div
        css={styles.participantsContainer(isDrawer)}
      >
        <GoalParticipants
          collaborators={collaborators}
          viewers={viewers}
          isDrawer={isDrawer}
          permissions={permissions}
          goalHasTeamLink={goalHasTeamLink}
        />
        {goal && showLinkedGoals && (
          <LinkedGoals
            css={styles.linkedGoals}
            goal={goal}
            canLinkParentGoal={canLinkParentGoal}
            canLinkSupportingGoals={canLinkSupportingGoals}
            isDrawer={isDrawer}
          />
        )}
      </div>
      <CreateEditTeamModal
        initialData={initialData}
        onTeamCreated={handleEditGoalContextType}
      />
    </>
  );
};

const GoalDetailsOwnerAndParticipantsSkeleton = (): JSX.Element => (
  <SkeletonLoader css={styles.skeleton} renderComponent={() => <></>} />
);

interface GoalDetailsOwnerAndParticipantsProps extends Pick<ViewProps, 'goal' | 'isDrawer'> {
  data: GetGoalByIdReturn,
}

const GoalDetailsOwnerAndParticipants = ({
  data: goal,
  ...props
}: GoalDetailsOwnerAndParticipantsProps): JSX.Element => {
  const { permissions } = goal;
  const { participants } = useGetFilteredGoalParticipants({ goal });
  // Leave this in place - this removes and solves any user that was hard deleted
  // This should not happen but it is at least in the lower environments
  const participantsToSort = participants.filter((participant) => participant.firstName !== undefined);
  const collaborators = participantsToSort
    ?.filter((participant) => participant.role === Goals.GoalParticipantRole.Collaborator)
    .sort((a, b) => a.firstName.localeCompare(b.firstName));
  const viewers = participantsToSort
    ?.filter((participant) => participant.role === Goals.GoalParticipantRole.Viewer)
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  const {
    orgLevelEnableCascadingGoals,
  } = useEnableCascadingGoals();

  const showLinkedGoals = orgLevelEnableCascadingGoals;

  const canLinkParentGoal = permissions.includes(Goals.GoalPermission.CanLinkParentGoal);
  const canLinkSupportingGoals = permissions.includes(Goals.GoalPermission.CanLinkSupportingGoals);

  const hookProps = {
    collaborators,
    viewers,
    canLinkParentGoal,
    canLinkSupportingGoals,
    showLinkedGoals,
    permissions,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default withLoadingSkeleton<GetGoalByIdReturn, GoalDetailsOwnerAndParticipantsProps>(
  GoalDetailsOwnerAndParticipants,
  GoalDetailsOwnerAndParticipantsSkeleton,
);
