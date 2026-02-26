import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import {
  SyntheticEvent,
  useState,
} from 'react';
import { PersonDisplayInformation } from '~Common/const/interfaces';
import { useDrawerActions } from '~Common/hooks/useDrawers';
import { palette } from '~Common/styles/colors';
import { forTabletObject } from '~Common/styles/mixins';
import JoshTabs from '~Common/V3/components/JoshTabs';
import { PARTICIPANT_TABS } from '~Goals/const/defaults';
import { baseballCardDrawerTemplate } from '~People/BaseballCard/Drawers/BaseballCardDrawer';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { useShowCreateEditTeamModal } from '~People/components/Teams/stores/useShowCreateEditTeamModal';
import Tooltip from '~Common/components/Tooltip';
import { Plus } from '@josh-hr/icons';
import { ParticipantAvatar } from './ParticipantAvatar';

const styles = {
  avatars: css({
    marginTop: '.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    gridGap: '.5rem',
    minWidth: '22.8125rem',
  }, forTabletObject({
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    minWidth: '11.375rem',
  })),
  avatar: css({
    '&:not(:last-of-type)': {
      marginRight: '.25rem',
    },
  }),
  defaultMessage: css({
    color: palette.neutrals.gray700,
    fontSize: '.875rem',
    marginTop: '.5rem',
  }),
  participantsContainer: css({
    position: 'relative',
  }),
  tabsAndButtonContainer: css({
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '1rem',
  }),
  tabsContainer: css({
    flex: 1,
  }),
  createTeamButton: css({
    borderRadius: '3px',
    padding: '6px 14px',
    border: '1px solid #335AA8',
    fontSize: '12px',
  }),
  tabsWithoutBorder: css({
    borderBottom: 'none !important',
  }),
};

interface TabRecord {
  label: string,
  value: string,
  ['data-test-id']: string,
}

interface ViewProps {
  collaborators: Goals.GoalParticipant[] | undefined,
  viewers: Goals.GoalParticipant[] | undefined,
  tabs: TabRecord[],
  activeTab: Goals.GoalParticipantRole,
  handleTabChange: (event: SyntheticEvent, newTab: Goals.GoalParticipantRole) => void,
  collaboratorsCount: number | undefined,
  viewersCount: number | undefined,
  isDrawer: boolean,
  onPersonClick: (orgUserId: string) => void,
  featureNamesText: FeatureNamesText,
  objectivesUnitOfMeasure: boolean,
  canEditGoal: boolean,
  handleCreateTeamClick: () => void,
  goalHasTeamLink: boolean,
}

const View = ({
  collaborators,
  viewers,
  tabs,
  activeTab,
  handleTabChange,
  collaboratorsCount,
  viewersCount,
  isDrawer,
  onPersonClick,
  featureNamesText,
  objectivesUnitOfMeasure,
  canEditGoal,
  handleCreateTeamClick,
  goalHasTeamLink,
}: ViewProps): JSX.Element => {
  const enableCreateTeamInObjectivesMeetings = useFeatureFlag('enableCreateTeamInObjectivesMeetings');

  return (
    <>
      <div
        css={styles.participantsContainer}
      >
        <div css={styles.tabsAndButtonContainer}>
          <div css={styles.tabsContainer}>
            <JoshTabs
              value={activeTab}
              handleChange={handleTabChange}
              css={styles.tabsWithoutBorder}
            >
              {tabs.map((tab) => (
                <JoshTabs.Tab
                  label={`${tab.label}s (${tab.label === Goals.GoalParticipantRole.Collaborator ? collaboratorsCount ?? 0 : viewersCount ?? 0})`}
                  value={tab.value}
                  key={tab.value}
                  data-test-id={tab['data-test-id']}
                />
              ))}
            </JoshTabs>
          </div>
          {enableCreateTeamInObjectivesMeetings && collaborators && collaborators.length > 0 && canEditGoal && !goalHasTeamLink && (
            <Tooltip content="Create a new team with these users">
              <JoshButton
                name="createTeamInObjectives"
                data-test-id="createTeamInObjectives"
                size="small"
                variant="ghost"
                onClick={handleCreateTeamClick}
                color="primary"
                css={styles.createTeamButton}
              >
                <JoshButton.SvgAndText
                  icon={Plus}
                  text="Create Team"
                />
              </JoshButton>
            </Tooltip>
          )}
        </div>
        {activeTab === Goals.GoalParticipantRole.Collaborator && (
          <>
            {(!collaboratorsCount && collaboratorsCount === 0) && (
              <p css={styles.defaultMessage}>{`No collaborators have been added to this ${featureNamesText.goals.singular.toLowerCase()}.`}</p>
            )}
            <ParticipantAvatar
              isDrawer={isDrawer}
              usersInfo={collaborators as PersonDisplayInformation[]}
              usersCount={collaboratorsCount ?? 0}
              numberOfUsersToShow={isDrawer ? 9 : 8}
              onPersonClick={onPersonClick}
            />
          </>
        )}
        {activeTab === Goals.GoalParticipantRole.Viewer && !objectivesUnitOfMeasure && (
          <>
            {(!viewersCount || viewersCount === 0) && (
              <p css={styles.defaultMessage}>{`No viewers have been added to this ${featureNamesText.goals.singular.toLowerCase()}.`}</p>
            )}
            <ParticipantAvatar
              isDrawer={isDrawer}
              usersInfo={viewers as PersonDisplayInformation[]}
              usersCount={viewersCount ?? 0}
              numberOfUsersToShow={isDrawer ? 9 : 8}
              onPersonClick={onPersonClick}
            />
          </>
        )}
      </div>
    </>
  );
};

interface GoalParticipantsProps {
  collaborators: Goals.GoalParticipant[] | undefined,
  viewers: Goals.GoalParticipant[] | undefined,
  isDrawer?: boolean,
  permissions?: Goals.GoalPermission[],
  goalHasTeamLink?: boolean,
}

export const GoalParticipants = ({
  collaborators,
  viewers,
  isDrawer = false,
  permissions = [],
  goalHasTeamLink = false,
}: GoalParticipantsProps): JSX.Element => {
  const { pushDrawer } = useDrawerActions();
  const { featureNamesText } = useGetFeatureNamesText();
  const collaboratorsCount = collaborators?.length;
  const viewersCount = viewers?.length;

  const objectivesUnitOfMeasure = useFeatureFlag('objectivesUnitOfMeasure');
  const setDefaultTab = (collaboratorsCount === 0 && viewersCount !== 0) ? Goals.GoalParticipantRole.Viewer : Goals.GoalParticipantRole.Collaborator;
  const [activeTab, setActiveTab] = useState<Goals.GoalParticipantRole>(setDefaultTab);

  // Check if current user can edit the goal (typically the owner or someone with edit permissions)
  const canEditGoal = permissions.includes(Goals.GoalPermission.CanEditGoal);

  // Get modal store functions
  const setShowModal = useShowCreateEditTeamModal((state) => state.setShowModal);

  const handleCreateTeamClick = (): void => {
    setShowModal(true);
  };

  const handleTabChange = (event: SyntheticEvent, newTab: Goals.GoalParticipantRole): void => {
    setActiveTab(newTab);
  };
  const tabs = (objectivesUnitOfMeasure) ? PARTICIPANT_TABS.filter((tab) => tab.value === Goals.GoalParticipantRole.Collaborator) : PARTICIPANT_TABS;
  const onPersonClick = (orgUserId: string): void => {
    pushDrawer({
      drawer: {
        ...baseballCardDrawerTemplate,
        args: {
          id: orgUserId,
        },
      },
    });
  };

  const hookProps = {
    collaborators,
    viewers,
    tabs,
    activeTab,
    handleTabChange,
    collaboratorsCount,
    viewersCount,
    isDrawer,
    onPersonClick,
    featureNamesText,
    objectivesUnitOfMeasure,
    canEditGoal,
    handleCreateTeamClick,
    goalHasTeamLink,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
