import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { SerializedStyles, css } from '@emotion/react';
import DrawerLayout from '~Common/V3/components/Drawers/DrawerLayout';
import DrawerHeader from '~Common/V3/components/Drawers/DrawerHeader';
import IconButton from '~Common/V3/components/Buttons/IconButton';
import { DrawerProps, DRAWER_WIDTHS } from '~Common/const/drawers';
import { registerDrawer, templateType } from '~Deprecated/ui/views/DrawerManager';
import { Goals } from '@josh-hr/types';
import { BackInformation, OpenGoalStatusesV3 } from '~Goals/const/types';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { RefObject, useCallback, useRef } from 'react';
import { usePrevious } from '~Deprecated/hooks/usePrevious';
import { useUpdateEffect } from '~Common/hooks/useUpdateEffect';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { useHistory } from 'react-router-dom';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import { sortGoalStatusUpdates } from '~Goals/utils/sortGoalStatusUpdates';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import ViewGoalDetails from '../Shared/ViewGoalDetails';
import { GetGoalByIdReturn, useGetGoalById } from '../../hooks/useGetGoalById';
import MarkCompleteButton from '../Shared/MarkCompleteButton';

export const viewGoalDetailsTemplate = {
  name: 'EDIT_GOAL_STATUS_DRAWER',
  type: templateType.PRIMARY,
  width: DRAWER_WIDTHS.PRIMARY,
};

const styles = {
  footer: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.125rem',
  }),
};

export enum FormSubmittedByButton {
  UPDATE_ACTION_ITEM_BUTTON = 'UPDATE_ACTION_ITEM_BUTTON',
  COMPLETE_ACTION_ITEM_BUTTON = 'COMPLETE_ACTION_ITEM_BUTTON'
}

export interface CreateActionItemViewProps{
  isLoading: boolean,
  goal: Goals.Goal | undefined,
  closeDrawerClick: () => void,
  isReadOnly: boolean,
  showFooter: boolean,
  drawerBodyRef: RefObject<HTMLDivElement>,
  isMobile: boolean,
  handleEditGoal: () => void,
  backInformation: BackInformation,
  featureNamesText: FeatureNamesText,
  goalId: string,
}

const View = ({
  isLoading,
  goal,
  closeDrawerClick,
  isReadOnly,
  showFooter,
  isMobile,
  drawerBodyRef,
  handleEditGoal,
  backInformation,
  featureNamesText,
  goalId,
}:CreateActionItemViewProps): JSX.Element => (
  <DrawerLayout
    renderFooter={showFooter && goal ? () => (
      <div css={styles.footer}>
        <MarkCompleteButton
          goal={goal}
          size={isMobile ? 'small' : 'standard'}
        />
        <JoshButton
          variant="ghost"
          data-test-id="goalsEdit"
          onClick={handleEditGoal}
          size={isMobile ? 'small' : 'standard'}
        >
          Edit
        </JoshButton>
      </div>
    ) : undefined}
    renderHeader={() => (
      <DrawerHeader
        title={`${featureNamesText.goals.singular}`}
        renderCloseButton={(closeButtonStyles: SerializedStyles) => (
          <IconButton
            onClick={closeDrawerClick}
            tooltip="Close"
            type="button"
            icon={faTimes}
            css={closeButtonStyles}
            size="large"
          />
        )}
      />
    )}
    renderBody={(defaultBodyPadding) => (
      <div css={defaultBodyPadding} ref={drawerBodyRef}>
        {!isLoading && goal && (
          <ViewGoalDetails
            goalId={goalId}
            isDrawer
            isReadOnly={isReadOnly}
            backInformation={backInformation}
          />
        )}
      </div>
    )}
  />
);

interface CreateActionItemDrawerState {
  selectedAttendees?: string[],
  dueDate: Date,
}
interface ViewGoalDetailsDrawerProps extends DrawerProps<CreateActionItemDrawerState> {
  goalId: string,
  backInformation: BackInformation,
  isReadOnly?: boolean,
}

const ViewGoalDetailsDrawer = ({
  popDrawer,
  goalId,
  isReadOnly = false,
  backInformation,
}: ViewGoalDetailsDrawerProps): JSX.Element => {
  const { data: goal, isLoading: areGoalDetailsLoading } = useGetGoalById({
    goalId,
    select: useCallback((tempData: HttpCallReturn<GetGoalByIdReturn>) => sortGoalStatusUpdates(tempData.response), []),
  });
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();

  const drawerBodyRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  const previousGoalId = usePrevious(goalId);

  /*
    Scrolling to the top of the drawer when we reopen the drawer with a new goalId
    This specifically impacts viewing a goal in the drawer and the clicking on a Linked Goal which reopens this drawer with a new goalId
  */
  useUpdateEffect(() => {
    if (drawerBodyRef.current && previousGoalId !== goalId) {
      drawerBodyRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [goalId, previousGoalId]);

  const [isLoading] = useSkeletonLoaders(areGoalDetailsLoading);
  const isMobile = useIsMobileQuery();

  const closeDrawerClick = (): void => {
    popDrawer({ drawerName: viewGoalDetailsTemplate.name });
  };

  const handleEditGoal = (): void => {
    history.push(goalRoutes.EditById.replace(':goalId', goalId), { backInformation });
    popDrawer({ popAll: true });
  };

  const showFooter = goal?.permissions.includes(Goals.GoalPermission.CanCompleteGoal)
    && goal?.statusUpdates?.[0]?.status ? OpenGoalStatusesV3.includes(goal?.statusUpdates?.[0]?.status) : false;

  const hookProps = {
    isLoading,
    goal,
    closeDrawerClick,
    isReadOnly,
    showFooter,
    drawerBodyRef,
    isMobile,
    handleEditGoal,
    backInformation,
    featureNamesText,
    goalId,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

registerDrawer({
  templateName: viewGoalDetailsTemplate.name,
  component: ViewGoalDetailsDrawer,
});

export { View };
export default ViewGoalDetailsDrawer;
