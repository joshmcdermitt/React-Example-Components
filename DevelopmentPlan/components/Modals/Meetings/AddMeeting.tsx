import { useState } from 'react';
import { css } from '@emotion/react';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { modalExistingItemStyles } from '~DevelopmentPlan/const/pageStyles';
import EmptyPDPResources from '~DevelopmentPlan/assets/images/emptyPDPResources.svg';
import {
  CompetencyResourceStatusEnum,
  GetMeetingsParams, Meeting, ResourceType,
} from '~DevelopmentPlan/const/types';
import LinearProgress from '@mui/material/LinearProgress';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';
import { DEFAULT_DATE, DEFAULT_RESOURCE_TITLE, MEETING_LIST_PAGE_SIZE } from '~DevelopmentPlan/const/defaults';
import moment from 'moment';
import { useGetMeetings } from '~DevelopmentPlan/hooks/useGetMeetings';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { CardSkeleton } from '~Common/V3/components/Card';
import { palette } from '~Common/styles/colors';
import MeetingCard from './MeetingCard';

const styles = {
  ...modalExistingItemStyles,
  skeletonCard: css({
    maxWidth: '100%',
    height: '7.5rem',
    borderRadius: '0.5rem',
  }),
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
  resourceContentDueDate: Date,
  resourceContentStatusId: CompetencyResourceStatusEnum) => void,
  resourceIdSelected: string[],
  actionTextToUse: string,
  resourceTypeTitle: string,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  closeAddResourceModal: () => void,
  meetings: Meeting[] | undefined,
  meetingsAreLoading: boolean,
  isFetching: boolean,
  meetingIdSelected: string[],
  onMeetingClick: (meetingId: string) => void,
  searchText: string,
}

const View = ({
  onResourceClick,
  resourceIdSelected,
  actionTextToUse,
  resourceTypeTitle,
  runAddResourceValidations,
  closeAddResourceModal,
  meetings,
  meetingsAreLoading,
  isFetching,
  meetingIdSelected,
  onMeetingClick,
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
            onClick={() => runAddResourceValidations(ResourceType.Meeting, resourceIdSelected[0])}
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
    {meetingsAreLoading && (
    <MultipleSkeletonLoaders
      css={styles.skeletonWrapper}
      numberOfSkeletons={6}
      renderSkeletonItem={() => (
        <CardSkeleton css={styles.cardSkeleton} />
      )}
    />
    )}
    {isFetching && !meetingsAreLoading && (
    <div css={styles.isFetchingBar}>
      <LinearProgress
        color="inherit"
        variant="indeterminate"
      />
    </div>
    )}
    {!meetingsAreLoading && meetings?.length === 0 && !isFetching && (
    <div
      css={styles.textContainer}
    >
      <EmptyPDPResources css={styles.emptyStateImage} title="No Meetings" />
      <p>
        <span
          css={styles.searchedText}
        >
          {`"${searchText}" `}
        </span>
        not found in Meetings. Try clearing search and trying again.
      </p>
    </div>
    )}
    {!meetingsAreLoading && meetings?.map((meeting) => (
      <MeetingCard
        meeting={meeting}
        key={meeting.meetingFactoryId}
        css={styles.resource(false)}
        onResourceClick={onResourceClick}
        meetingIdSelected={meetingIdSelected}
        onMeetingClick={onMeetingClick}
      />
    ))}
  </>
);

interface AddMeetingProps {
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
  actionTextToUse: string,
  resourceTypeTitle: string,
}

export const AddMeeting = ({
  runAddResourceValidations,
  actionTextToUse,
  resourceTypeTitle,
}: AddMeetingProps): JSX.Element => {
  const [resourceIdSelected, setResourceIdSelected] = useState<string[]>([]);

  const {
    setResourceContentDueDate,
    setResourceContentTitle,
    setResourceContentStatus,
    closeAddResourceModal,
    planStartDate,
    planDueDate,
    searchText,
    pdpId,
  } = useAddResourceModalStore((state) => ({
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
    setResourceContentStatus: state.setResourceContentStatus,
    closeAddResourceModal: state.closeAddResourceModal,
    planStartDate: state.planStartDate,
    planDueDate: state.planDueDate,
    searchText: state.searchText,
    pdpId: state.pdpId,
  }));

  const params = {
    skip: 0,
    take: MEETING_LIST_PAGE_SIZE,
    titleContains: searchText,
    rangeStartInMillis: moment(planStartDate).valueOf() ?? moment(DEFAULT_DATE).valueOf(),
    rangeEndInMillis: moment(planDueDate).valueOf() ?? moment(DEFAULT_DATE).valueOf(),
  } as GetMeetingsParams;

  const { data: meetingData, isLoading: meetingsAreLoading, isFetching } = useGetMeetings({ id: pdpId ?? '', params });

  const meetings = meetingData?.response;
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
  const [meetingIdSelected, setMeetingIdSelected] = useState<string[]>([]);

  const onMeetingClick = (meetingId: string): void => {
    setMeetingIdSelected((prevState) => {
      const isAlreadySelected = prevState.includes(meetingId);

      if (isAlreadySelected) {
        // If present, remove it
        return prevState.filter((id) => id !== meetingId);
      }
      return [meetingId];
    });
  };

  const hookProps = {
    onResourceClick,
    resourceIdSelected,
    actionTextToUse,
    resourceTypeTitle,
    runAddResourceValidations,
    closeAddResourceModal,
    meetings,
    meetingsAreLoading,
    isFetching,
    meetingIdSelected,
    onMeetingClick,
    searchText,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
