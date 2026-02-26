import { css, keyframes } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import {
  CompetencyResourceStatusEnum, PDPMobileModals, PlotPoint, ResourceType,
} from '~DevelopmentPlan/const/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlagCheckered } from '@fortawesome/pro-solid-svg-icons';
import moment from 'moment';
import {
  findCompetencyId, getPersonalDevelopmentTypeIcon, groupByPercentageDifference, openInNewTab, truncateTitle,
} from '~DevelopmentPlan/const/functions';
import {
  TIMELINE_THRESHOLD, TIMELINE_ITEM_WIDTH, TIMELINE_FADE_PERCENTAGE,
  DEFAULT_TRUNCATE_TIMELINE_TITLE_LENGTH, DEFAULT_PDP_PATHNAME, TIMELINE_ITEM_WIDTH_GROUPED,
  CompletedStatuses,
} from '~DevelopmentPlan/const/defaults';
import { useEffect, useMemo, useState } from 'react';
import { rgba } from 'polished';
import { useHistory, useParams } from 'react-router-dom';
import { useGetProgressBar } from '~DevelopmentPlan/hooks/useGetProgressBar';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { CardSkeleton } from '~Common/V3/components/Card';
import { useGetPlanById } from '~DevelopmentPlan/hooks/useGetPlanById';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { faClock, faComment } from '@fortawesome/pro-light-svg-icons';
import { PersonalDevelopmentPlanDetailsParams } from '../Layouts/ViewDetail/PersonalDevelopmentPlanDetails';
import { useResourceDetailsDrawer } from '../Drawers/Resource/ResourceDetails';
import { ViewResourceModal } from '../Modals/ViewResourceModal';
import { PdpMobileModal } from '../Modals/PdpMobileModal';

const loaderAnimation = keyframes(
  Array.from({ length: 101 }, (_, index) => ({
    [`${index}%`]: {
      '--fill-percentage': `${index}%`,
      background: `linear-gradient(
        to right,
        ${palette.neutrals.gray400} 0%,
        ${palette.neutrals.gray400} ${index - 5}%,
        ${palette.brand.indigo} ${index - 5}%,
        ${palette.brand.indigo} ${index + 5}%,
        ${palette.neutrals.gray400} ${index + 5}%,
        ${palette.neutrals.gray400} 100%
      )`,
    },
  })),
);
const pulsateAnimation = keyframes`
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`;

const styles = {
  timeline: (planHasStarted: boolean, shouldFadeOut: boolean, isMobile: boolean) => css({
    position: 'relative',
    width: 'calc(100% - 2.2rem)',
    height: '6.25rem',
    margin: '1.25rem auto',
    transition: 'all 0.3s ease',
    padding: '0 .4375rem',

    ':before': {
      background: planHasStarted ? palette.brand.indigo : palette.neutrals.gray400,
      display: 'block',
      content: '""',
      top: '50%',
      left: 0,
      transform: 'translateY(-50%)',
      width: '.375rem',
      height: '1.5625rem',
      position: 'absolute',
      opacity: shouldFadeOut ? TIMELINE_FADE_PERCENTAGE : 1,
    },
  }, isMobile && {
    display: 'none',
  }),
  timelineItem: (isCompleted: boolean, shouldFadeOut: boolean, hideResource: boolean, flipContent: boolean) => css({
    position: 'absolute',
    width: '1.75rem',
    height: '1.75rem',
    backgroundColor: isCompleted ? palette.brand.indigo : palette.neutrals.gray400,
    color: palette.neutrals.white,
    textAlign: 'center',
    lineHeight: '1.75rem',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '.875rem',
    top: '50%',
    left: 'var(--left)',
    transform: 'translateX(-50%) translateY(-50%)',
    zIndex: 1,
    transition: 'all 0.3s ease',
    border: `2px solid ${palette.neutrals.white}`,
    padding: '0',
    opacity: shouldFadeOut ? TIMELINE_FADE_PERCENTAGE : 1,

    ':after': {
      content: 'attr(data-content)',
      position: 'absolute',
      top: flipContent ? '-1rem' : 'calc(100% + .3125rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '.75rem',
      color: palette.neutrals.gray800,
      width: '3rem',
      lineHeight: '.75rem',
      background: palette.neutrals.white,
    },
    ':hover': {
      ':before': {
        display: 'block',
      },
    },
    ':before': {
      content: 'attr(data-content-title)',
      position: 'absolute',
      top: flipContent ? '-2rem' : 'calc(100% + 1.5rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '.75rem',
      color: palette.neutrals.gray800,
      width: '7.25rem',
      lineHeight: '.75rem',
      background: palette.neutrals.white,
      display: 'none',
      fontWeight: 700,
    },
  }, hideResource && {
    display: 'none',
  }),

  timelineLine: (shouldFadeOut: boolean, isFetching: boolean) => css({
    position: 'absolute',
    width: 'calc(100% - .875rem)',
    height: '.3125rem',
    background: `linear-gradient(
          to right,
          ${palette.brand.indigo} 0%,
          ${palette.brand.indigo} var(--fill-percentage, 0%),
          ${palette.neutrals.gray400} var(--fill-percentage, 0%),
          ${palette.neutrals.gray400} 100%
        )`,
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'all 0.3s ease',
    opacity: shouldFadeOut ? TIMELINE_FADE_PERCENTAGE : 1,
    animation: isFetching ? `${loaderAnimation}  2s ease-in infinite, ${pulsateAnimation} 2s linear infinite` : 'none',
  }),

  expandedItem: (isSelected: boolean, groupIsCompleted: boolean, notSelected: boolean) => css({
    all: 'unset',
    position: 'absolute',
    width: '1.5rem',
    height: '1.5rem',
    backgroundColor: groupIsCompleted ? palette.brand.indigo : palette.neutrals.gray400,
    borderRadius: '50%',
    cursor: 'pointer',
    top: '50%',
    left: 'var(--left)',
    transform: 'translateX(-50%) translateY(-50%)',
    zIndex: 2,
    overflow: 'visible',
    transition: 'all 0.3s ease, width 0.3s ease',
    display: 'flex',
    justifyContent: 'space-between',
  }, isSelected && {
    width: 'var(--width)',
    display: 'flex',
    background: 'none',

    ':after': {
      background: rgba(palette.brand.indigo, 0.10),
      content: '""',
      width: '150%',
      position: 'absolute',
      top: '125%',
      left: '50%',
      zIndex: '-1',
      display: 'block',
      height: 'calc(150% + 4rem)',
      borderRadius: '5px',
      transform: 'translateX(-50%) translateY(-50%)',
    },
  }, notSelected && {
    display: 'none',
  }),

  expandedItemContent: (isSelected: boolean) => css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: palette.neutrals.white,
    cursor: 'pointer',
    border: 'none',
  }, isSelected && {
    display: 'none',
  }),

  expandedTimelineItem: (isSelected: boolean, isCompleted: boolean) => css({
    all: 'unset',
    width: '1.5rem',
    height: '1.5rem',
    backgroundColor: isCompleted ? palette.brand.indigo : palette.neutrals.gray400,
    color: palette.neutrals.white,
    textAlign: 'center',
    lineHeight: '1.5rem',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '.875rem',
    zIndex: 3,
    display: 'none',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',

    ':after': {
      content: 'attr(data-content)',
      position: 'absolute',
      top: 'calc(100% + .3125rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '.75rem',
      color: palette.neutrals.black,
      width: '3rem',
      lineHeight: '.75rem',
    },
    ':hover': {
      ':before': {
        display: 'block',
      },
    },
    ':before': {
      content: 'attr(data-content-title)',
      position: 'absolute',
      top: 'calc(100% + 1.5rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '.75rem',
      color: palette.neutrals.gray800,
      width: '3.5rem',
      lineHeight: '.75rem',
      display: 'block',
      fontWeight: 700,
      overflow: 'hidden',
    },
  }, isSelected && {
    display: 'flex',
  }),
  completedIcon: (isCompleted: boolean) => css({
    position: 'absolute',
    top: '50%',
    right: '-1.3125rem',
    color: isCompleted ? palette.brand.indigo : palette.neutrals.gray400,
    fontSize: '1.5rem',
    transform: 'translateY(-50%)',
  }),
  timelineDate: (shouldFadeOut: boolean) => css({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '.75rem',
    width: '3.75rem',
    position: 'absolute',
    transform: 'translateY(-80%)',
    top: '100%',
    opacity: shouldFadeOut ? TIMELINE_FADE_PERCENTAGE : 1,
  }),
  dateName: css({
    fontWeight: 600,
  }),
  startDate: css({
    left: '-1.125rem',
  }),
  endDate: css({
    right: '-1.125rem',
  }),
  cardSkeleton: css({
    height: '6.25rem',
    maxWidth: '100%',
    margin: '1.25rem 0',
  }),
  timelineItemContainer: css({
    width: 'calc(100% - 3rem)',
    height: '100%',
    margin: '0 auto',
    position: 'relative',
  }),
  mobileTimeline: (hideBorder: boolean) => css({
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    borderTop: hideBorder ? 'none' : `1px solid ${palette.neutrals.gray200}`,
    paddingTop: '.75rem',
    marginTop: '.75rem',
  }),
};

function calculatePercentage(doNotShift: boolean, selectedItemFirstItemPercentage: number, firstItemPercentage: number, shiftDistance: number): number {
  if (doNotShift && selectedItemFirstItemPercentage !== 0) {
    return firstItemPercentage;
  }
  if (!doNotShift) {
    return 50 - shiftDistance;
  }

  return firstItemPercentage;
}

interface ViewProps {
  progressPercentage: number,
  planIsCompleted: boolean,
  planHasStarted: boolean,
  groupedData: PlotPoint[][] | undefined,
  ungroupedData: PlotPoint[] | undefined,
  handleElementClick: (itemId: number) => void,
  selectedItemId: number | null,
  shouldFadeOut: boolean,
  startDate: Date | undefined,
  endDate: Date | undefined,
  handleResourceClick: (resourceId: number, contentTypeId: ResourceType, contentId: string) => void,
  showSkeleton: boolean,
  isFetching: boolean,
  isMobile: boolean,
  modalToShow: PDPMobileModals | undefined,
  setModalToShow: (modal: PDPMobileModals) => void,
  openPdpMobileModal: () => void,
  idToUse?: string,
  inCreatePlan?: boolean,
}

const View = ({
  progressPercentage,
  planIsCompleted,
  planHasStarted,
  groupedData,
  ungroupedData,
  handleElementClick,
  selectedItemId,
  shouldFadeOut,
  startDate,
  endDate,
  handleResourceClick,
  showSkeleton,
  isFetching,
  isMobile,
  modalToShow,
  setModalToShow,
  openPdpMobileModal,
  idToUse,
  inCreatePlan,
}: ViewProps): JSX.Element => (
  <>
    {showSkeleton && (
    <CardSkeleton css={styles.cardSkeleton} />
    )}
    {!showSkeleton && (
    <>
      {isMobile && !inCreatePlan && (
      <div css={styles.mobileTimeline(Boolean(idToUse))}>
        <JoshButton
          onClick={() => {
            openPdpMobileModal();
            setModalToShow(PDPMobileModals.Discussion);
          }}
          size="small"
          variant="text"
          data-test-id="pdpOpenDiscussionModal"
        >
          <JoshButton.IconAndText
            icon={faComment}
            text="Discussion"
          />
        </JoshButton>
        <JoshButton
          onClick={() => {
            openPdpMobileModal();
            setModalToShow(PDPMobileModals.Timeline);
          }}
          size="small"
          variant="text"
          data-test-id="pdpOpenTimelineModal"
        >
          <JoshButton.IconAndText
            icon={faClock}
            text="Timeline"
          />
        </JoshButton>
      </div>
      )}
      {/* @ts-expect-error It hates the fact that we're using a CSS variable here */}
      <div css={styles.timeline(planHasStarted, shouldFadeOut, isMobile)} style={{ '--width': `${TIMELINE_ITEM_WIDTH}` }}>
        <FontAwesomeIcon
          css={styles.completedIcon(planIsCompleted)}
          icon={faFlagCheckered}
        />
        <div
          css={[styles.timelineDate(shouldFadeOut), styles.startDate]}
        >
          {moment(startDate).format('MMM DD')}
          <span
            css={styles.dateName}
          >
            Start
          </span>
        </div>
        <div
          css={[styles.timelineDate(shouldFadeOut), styles.endDate]}
        >
          {moment(endDate).format('MMM DD')}
          <span
            css={styles.dateName}
          >
            End
          </span>
        </div>
        {/* @ts-expect-error It hates the fact that we're using a CSS variable here */}
        <div css={styles.timelineLine(shouldFadeOut, isFetching)} style={{ '--fill-percentage': `${progressPercentage}%` }} />
        <div css={styles.timelineItemContainer}>
          {ungroupedData?.map((plotPoint) => {
            const {
              competencyResource: {
                id: resourceId,
                contentDueDate: DueDate,
                contentType: {
                  id: contentTypeId,
                },
                contentId,
                status: {
                  description: statusDescription,
                },
                contentTitle,
              },
              percentage,
            } = plotPoint;

            // TODO: Will be ripping this out next sprint as a part of LW-16040
            const dueDateIsPast = moment(DueDate).isBefore(new Date());
            const isMeetingResource = contentTypeId === ResourceType.Meeting;
            const isCompleted = isMeetingResource
              ? dueDateIsPast
              : CompletedStatuses.includes(statusDescription);
            const icon = getPersonalDevelopmentTypeIcon(contentTypeId);
            const groupWithSelectedItem = groupedData?.find((group) => group.some((obj) => obj.competencyResource.id === selectedItemId));
            const selectedItemFirstItemPercentage = groupWithSelectedItem ? groupWithSelectedItem[0].percentage : 0;

            const selectedItemArrayGroupCount = groupWithSelectedItem ? groupWithSelectedItem.length : 0;
            const shiftDistance = (selectedItemArrayGroupCount * TIMELINE_ITEM_WIDTH) / 2;

            const doNotShift = shiftDistance === 0;
            const percentageToUse = calculatePercentage(doNotShift, selectedItemFirstItemPercentage, percentage, shiftDistance);
            const hideResource = selectedItemId !== null;
            const flipContent = percentage >= 95 || percentage <= 5;

            return (
              <button
                key={resourceId}
                css={styles.timelineItem(isCompleted, shouldFadeOut, hideResource, flipContent)}
                data-content={moment(DueDate).format('MMM DD')}
                data-content-title={truncateTitle(contentTitle, DEFAULT_TRUNCATE_TIMELINE_TITLE_LENGTH)}
                 // @ts-expect-error It hates the fact that we're using a CSS variable here
                style={{ '--left': `${percentageToUse}%` }}
                onClick={() => handleResourceClick(resourceId, contentTypeId, contentId)}
              >
                <FontAwesomeIcon
                  icon={icon}
                />
              </button>
            );
          })}

          {groupedData?.map((group) => {
            const firstItemPercentage = Math.round(group[0].percentage);
            const firstItemId = group[0].competencyResource.id;
            const isSelected = selectedItemId === firstItemId;
            const notSelected = selectedItemId !== null && selectedItemId !== firstItemId;
            const groupLength = group.length;
            const groupIsCompleted = group.every((item) => item.competencyResource.status.id === CompetencyResourceStatusEnum.Complete);

            const groupWithSelectedItem = groupedData?.find((groups) => groups.some((obj) => obj.competencyResource.id === selectedItemId));
            const selectedItemFirstItemPercentage = groupWithSelectedItem ? groupWithSelectedItem[0].percentage : 0;

            const selectedItemArrayGroupCount = groupWithSelectedItem ? groupWithSelectedItem.length : 0;
            const shiftDistance = (selectedItemArrayGroupCount * TIMELINE_ITEM_WIDTH) / 3;

            const doNotShift = shiftDistance === 0;
            const percentageToUse = calculatePercentage(doNotShift, selectedItemFirstItemPercentage, firstItemPercentage, shiftDistance);

            return (
              <>
                <button
                  key={firstItemId}
                  css={styles.expandedItem(isSelected, groupIsCompleted, notSelected)}
              // @ts-expect-error It hates the fact that we're using a CSS variable here
                  style={{ '--left': `${percentageToUse}%`, '--width': `${groupLength * TIMELINE_ITEM_WIDTH_GROUPED}rem` }}
                  onClick={() => handleElementClick(firstItemId)}
                >

                  <div css={styles.expandedItemContent(isSelected)}>{`+${groupLength}`}</div>
                  {group.map((item) => {
                    const {
                      competencyResource: {
                        id: resourceId,
                        contentDueDate: dueDate,
                        contentId,
                        contentType: {
                          id: contentTypeId,
                        },
                        status: {
                          description: statusDescription,
                        },
                        contentTitle,
                      },
                    } = item;
                    const dueDateIsPast = moment(dueDate).isBefore(new Date());
                    const isMeetingResource = contentTypeId === ResourceType.Meeting;
                    // TODO: Will be ripping this out next sprint as a part of LW-16040
                    const isCompleted = isMeetingResource
                      ? dueDateIsPast
                      : CompletedStatuses.includes(statusDescription);
                    const strippedContentId = contentId.replace(/,/g, '');
                    const icon = getPersonalDevelopmentTypeIcon(contentTypeId);

                    return (
                      <button
                        css={styles.expandedTimelineItem(isSelected, isCompleted)}
                        data-content={moment(dueDate).format('MMM DD')}
                        data-content-title={truncateTitle(contentTitle, DEFAULT_TRUNCATE_TIMELINE_TITLE_LENGTH)}
                        key={item.competencyResource.id}
                        onClick={() => handleResourceClick(resourceId, contentTypeId, strippedContentId)}
                      >
                        <FontAwesomeIcon
                          icon={icon}
                        />
                      </button>
                    );
                  })}
                </button>
              </>
            );
          })}
        </div>
      </div>
      <ViewResourceModal />
      {modalToShow && (
      <PdpMobileModal
        modalToShow={modalToShow}
        idToUse={idToUse}
      />
      )}
    </>
    )}
  </>
);

interface ProgressBarTimelineProps {
  idToUse?: string,
}

export const ProgressBarTimeline = ({
  idToUse,
}: ProgressBarTimelineProps): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const [modalToShow, setModalToShow] = useState<PDPMobileModals>();
  const isMobile = useIsMobileQuery();
  const {
    data: progressBar, isLoading: progressBarLoading, isFetching, isError: progressBarError,
  } = useGetProgressBar({ id: idToUse ?? pdpId });
  const { data: plan } = useGetPlanById({ id: pdpId });

  const hasErrors = progressBarError;

  const [showSkeleton] = useSkeletonLoaders(progressBarLoading);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { plotPoints: unfilteredPlotPoints, startDate, endDate } = progressBar ?? {};
  const plotPoints = unfilteredPlotPoints?.filter((plotPoint) => plotPoint?.competencyResource?.contentType?.id !== ResourceType.Recognition);

  const progressPercentage = progressBar?.progress ?? 0;
  const planHasStarted = progressPercentage > 0;
  const planIsCompleted = progressPercentage === 100;
  const { owner } = plan ?? {};
  const { groupedData, ungroupedData } = useMemo(() => groupByPercentageDifference(plotPoints, TIMELINE_THRESHOLD), [plotPoints]);

  const history = useHistory();
  useEffect(() => {
    const inPDPs = history.location.pathname.includes(`${DEFAULT_PDP_PATHNAME}`);
    if (hasErrors && inPDPs) {
      history.push(DevelopmentPlanRoutes?.PermissionsDenied);
    }
  }, [history, hasErrors]);

  const handleElementClick = (itemId: number): void => {
    setSelectedItemId((prevSelectedItemId) => (prevSelectedItemId === itemId ? null : itemId));
  };

  const {
    openViewResourceModal,
    openPdpMobileModal,
  } = useAddResourceModalStore((state) => ({
    openViewResourceModal: state.openViewResourceModal,
    openPdpMobileModal: state.openPdpMobileModal,
  }));

  const { openDrawer: openResourceDetailsDrawer } = useResourceDetailsDrawer();
  const handleResourceClick = (resourceId: number, contentTypeId: ResourceType, contentId: string): void => {
    const competencyId = findCompetencyId(plotPoints ?? [], contentId);
    switch (contentTypeId) {
      case ResourceType.Meeting:
        openInNewTab(`/meetings?orgId=0x2f7fbc&meetingId=${contentId}`);
        break;
      case ResourceType.Accomplishment:
        openViewResourceModal(contentTypeId, competencyId, contentId, true);
        break;
      default:
        openResourceDetailsDrawer({
          resourceType: contentTypeId,
          subjectUid: contentId,
          ownerId: owner?.userId as string ?? '',
          ownerOrgID: owner?.orgUserId ?? '',
        });
    }
  };
  const inCreatePlan = history.location.pathname.includes('createDevelopmentPlan');

  const shouldFadeOut = selectedItemId !== null;

  const hookProps = {
    progressPercentage,
    planIsCompleted,
    planHasStarted,
    groupedData,
    ungroupedData,
    handleElementClick,
    selectedItemId,
    shouldFadeOut,
    startDate,
    endDate,
    handleResourceClick,
    showSkeleton,
    isFetching,
    isMobile,
    modalToShow,
    setModalToShow,
    openPdpMobileModal,
    idToUse,
    inCreatePlan,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
