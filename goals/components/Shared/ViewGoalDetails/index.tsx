import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { UseQueryResult } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { palette } from '~Common/styles/colors';
import { forMobileObject } from '~Common/styles/mixins';
import JoshCard from '~Common/V3/components/JoshCard';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import GoalActionItems from '~Goals/components/GoalDetails/GoalActionItems';
import GoalDetails from '~Goals/components/GoalDetails/GoalDetails';
import GoalDetailsOwnerAndParticipants from '~Goals/components/GoalDetails/GoalDetailsOwnerAndParticipants';
import GoalDetailStatus from '~Goals/components/GoalDetails/GoalDetailsStatus';
import { DEFAULT_OWNER } from '~Goals/const/defaults';
import { BackInformation } from '~Goals/const/types';
import { GetGoalByIdReturn, useGetGoalById } from '~Goals/hooks/useGetGoalById';
import { sortGoalStatusUpdates } from '~Goals/utils/sortGoalStatusUpdates';
import { useActionMenu } from '~Reviews/V2/Shared/ActionMenu';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import GoalCreator from './GoalCreator';
import Header from './Header';
import TargetText from './TargetText';

const styles = {
  joshCard: (isDrawer: boolean) => css({
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
  }, forMobileObject({
    gridTemplateColumns: '1fr',
  }), isDrawer && {
    padding: 0,
    boxShadow: 'none',
    gridTemplateColumns: '1fr',
  }),
  header: css({
    marginBottom: '1rem',
    justifyContent: 'space-between',
  }),
  detailsLeftSide: (isDrawer: boolean) => css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    borderRight: `1px solid ${palette.neutrals.gray300}`,
    paddingRight: '1.875rem',
  }, forMobileObject({
    padding: 0,
    borderRight: 'none',
  }), isDrawer && {
    padding: 0,
    borderRight: 'none',
  }),
  detailsRightSide: (isDrawer: boolean) => css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    paddingLeft: '1.875rem',
  }, forMobileObject({
    padding: 0,
    marginTop: '1.5rem',
  }), isDrawer && {
    padding: 0,
    paddingBottom: '.3125rem',
    marginTop: '1.5rem',
  }),
};

interface ViewProps {
  goal: Goals.Goal | undefined,
  isDrawer?: boolean,
  isReadOnly: boolean,
  ownerOrgId: string | undefined,
  backInformation: BackInformation,
  isMobileOrDrawer: boolean,
  goalDetailQuery: UseQueryResult<Goals.Goal, Error>,
  objectivesUnitOfMeasure: boolean,
}

const View = ({
  goal,
  isDrawer = false,
  isReadOnly,
  ownerOrgId,
  backInformation,
  isMobileOrDrawer,
  goalDetailQuery,
  objectivesUnitOfMeasure,
  ...props
}: ViewProps): JSX.Element => (
  <JoshCard
    css={styles.joshCard(isDrawer)}
    {...props}
  >
    <Header
      css={styles.header}
      query={goalDetailQuery}
      isDrawer={isDrawer}
      backInformation={backInformation}
    />
    <div
      css={styles.detailsLeftSide(isDrawer)}
    >
      {isDrawer && objectivesUnitOfMeasure && (
        <TargetText query={goalDetailQuery} />
      )}
      <GoalDetailStatus
        query={goalDetailQuery}
        isDrawer={isDrawer}
        isReadOnly={isReadOnly}
      />
      {!isMobileOrDrawer && (
        <GoalActionItems
          query={goalDetailQuery}
          goalOwnerId={ownerOrgId}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
    <div
      css={styles.detailsRightSide(isDrawer)}
    >
      <GoalDetails
        query={goalDetailQuery}
        isDrawer={isDrawer}
      />
      <GoalDetailsOwnerAndParticipants
        query={goalDetailQuery}
        isDrawer={isDrawer}
        goal={goal}
      />
      {!isDrawer && (
        <GoalCreator
          query={goalDetailQuery}
        />
      )}
      {isMobileOrDrawer && (
        <GoalActionItems
          query={goalDetailQuery}
          goalOwnerId={ownerOrgId}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  </JoshCard>
);

interface ViewGoalDetailsProps {
  goalId: string,
  isDrawer?: boolean,
  isReadOnly?: boolean,
  backInformation?: BackInformation,
}

const ViewGoalDetails = ({
  goalId,
  isDrawer = false,
  isReadOnly = false,
  backInformation: passedBackInformation,
  ...props
}: ViewGoalDetailsProps): JSX.Element => {
  const goalDetailQuery = useGetGoalById({
    goalId,
    select: useCallback((tempData: HttpCallReturn<GetGoalByIdReturn>) => sortGoalStatusUpdates(tempData.response), []),
  });

  const isMobile = useIsMobileQuery();
  const isMobileOrDrawer = isDrawer || isMobile;
  const { doOpen, ...actionMenuProps } = useActionMenu();
  const { state: locationState = {} } = useLocation();
  const { backInformation } = (locationState as { backInformation: BackInformation }) || {};
  const objectivesUnitOfMeasure = useFeatureFlag('objectivesUnitOfMeasure');

  const goal = goalDetailQuery.data;

  // eslint-disable-next-line max-len
  const ownerParticipant = goal?.participants?.find((participant) => participant.role === Goals.GoalParticipantRole.Owner && participant.firstName !== undefined);
  const ownerOrgId = ownerParticipant ? ownerParticipant.orgUserId : undefined;

  const ownerToUse = ownerParticipant ?? DEFAULT_OWNER;

  const hookProps = {
    goal,
    isDrawer,
    actionMenuProps,
    doOpen,
    isReadOnly,
    ownerOrgId,
    owner: ownerToUse,
    // The backInformation will be passed in from the drawer view
    backInformation: passedBackInformation || backInformation,
    isMobileOrDrawer,
    goalDetailQuery,
    objectivesUnitOfMeasure,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default ViewGoalDetails;
