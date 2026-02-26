import { css } from '@emotion/react';
import { useGetProgressBar } from '~DevelopmentPlan/hooks/useGetProgressBar';
import { useParams } from 'react-router-dom';
import { PersonalDevelopmentPlanDetailsParams } from '~DevelopmentPlan/components/Layouts/ViewDetail/PersonalDevelopmentPlanDetails';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PlotPoint, ProgressBar } from '~DevelopmentPlan/const/types';
import { getPersonalDevelopmentTypeIcon } from '~DevelopmentPlan/const/functions';
import moment from 'moment';
import { palette } from '~Common/styles/colors';
import { faFlagCheckered, faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { CompletedStatuses } from '~DevelopmentPlan/const/defaults';

const styles = {
  completedIcon: (isCompleted: boolean) => css({
    color: isCompleted ? palette.brand.indigo : palette.neutrals.gray400,
    fontSize: '1.5rem',
    alignSelf: 'flex-start',
    paddingLeft: '1rem',
    marginTop: '.3125rem',
  }),
  timeline: (planHasStarted: boolean, planIsCompleted: boolean) => css({
    position: 'relative',
    marginBottom: 0,
    padding: '.5625rem 1rem .6875rem 1rem',

    '.MuiTimelineItem-root:before': {
      display: 'none',
    },
    '.MuiTimelineContent-root': {
      display: 'flex',
      alignItems: 'center',
    },
    ':before': {
      background: planHasStarted ? palette.brand.indigo : palette.neutrals.gray400,
      display: 'block',
      content: '""',
      top: '.25rem',
      left: '.875rem',
      transform: 'translateY(-50%)',
      width: '1.875rem',
      height: '.375rem',
      position: 'absolute',
    },
    ':after': {
      background: planIsCompleted ? palette.brand.indigo : palette.neutrals.gray400,
      display: 'block',
      content: '""',
      bottom: 0,
      left: '.875rem',
      transform: 'translateY(-50%)',
      width: '1.875rem',
      height: '.375rem',
      position: 'absolute',
    },
  }),
  timelineDot: (isCompleted: boolean) => css({
    backgroundColor: isCompleted ? palette.brand.indigo : palette.neutrals.gray400,
    color: palette.neutrals.white,

    svg: {
      minWidth: '.8125rem',
    },
  }),
  itemContent: css({
    fontWeight: 700,
    color: palette.neutrals.gray800,
    fontSize: '.75rem',
  }),
  itemContentDate: css({
    marginRight: '.5rem',
    fontWeight: 400,
  }),
  timelineItem: (shouldBeFilled: boolean) => css({
    '.MuiTimelineConnector-root': {
      backgroundColor: shouldBeFilled ? palette.brand.indigo : palette.neutrals.gray400,
      width: '.375rem',
    },
  }),
  wrapper: css({
    position: 'relative',
    marginTop: '1.5rem',
  }),
  timelineDate: css({
    position: 'absolute',
    left: '3.125rem',
    fontSize: '.75rem',
    fontWeight: 700,
    color: palette.neutrals.gray800,
  }),
  startDate: css({
    top: '-.25rem',
  }),
  endDate: css({
    bottom: '1.75rem',
  }),
  time: css({
    fontWeight: 400,
    marginRight: '.5rem',
  }),
};

interface ViewProps {
  progressBarLoading: boolean,
  planIsCompleted: boolean,
  progressPercentage: number,
  sortedPlotPoints: PlotPoint[] | undefined,
  planHasStarted: boolean,
  progressBar: ProgressBar | undefined,
  hasPlotPoints: boolean | undefined,
}

const View = ({
  progressBarLoading,
  planIsCompleted,
  progressPercentage,
  sortedPlotPoints,
  planHasStarted,
  progressBar,
  hasPlotPoints,
}: ViewProps): JSX.Element => (
  <>
    {progressBarLoading && (
    <p>We loading</p>
    )}
    {!progressBarLoading && (
    <>
      <div css={styles.wrapper}>
        <div css={[styles.timelineDate, styles.startDate]}>
          <span css={styles.time}>{moment(progressBar?.startDate).format('MMM DD')}</span>
          Start
        </div>
        <Timeline css={styles.timeline(planHasStarted, planIsCompleted)}>
          {!hasPlotPoints && (
          <TimelineItem
            css={styles.timelineItem(false)}
          >
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot css={styles.timelineDot(false)}>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <div css={styles.itemContent}>
                Please add a resource to your plan.
              </div>
            </TimelineContent>
          </TimelineItem>
          )}
          {hasPlotPoints && sortedPlotPoints?.map((plotPoint) => {
            const {
              competencyResource: {
                contentDueDate: DueDate,
                contentType: {
                  id: contentTypeId,
                },
                status: {
                  description: statusDescription,
                },
                contentTitle,
              },
              percentage,
            } = plotPoint;
            const isCompleted = CompletedStatuses.includes(statusDescription);
            const icon = getPersonalDevelopmentTypeIcon(contentTypeId);
            const shouldBeFilled = progressPercentage >= percentage;
            return (
              <TimelineItem
                key={plotPoint.competencyResource.id}
                css={styles.timelineItem(shouldBeFilled)}
              >
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot css={styles.timelineDot(isCompleted)}>
                    <FontAwesomeIcon
                      icon={icon}
                    />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <div css={styles.itemContent}>
                    <span css={styles.itemContentDate}>{moment(DueDate).format('MMM DD')}</span>
                    {contentTitle}
                  </div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
        <div css={[styles.timelineDate, styles.endDate]}>
          <span css={styles.time}>{moment(progressBar?.endDate).format('MMM DD')}</span>
          End
        </div>
        <FontAwesomeIcon
          css={styles.completedIcon(planIsCompleted)}
          icon={faFlagCheckered}
        />
      </div>
    </>
    )}
  </>
);

interface TimelineMobileProps {
  idToUse?: string,
}

export const TimelineMobile = ({
  idToUse,
}: TimelineMobileProps): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const {
    data: progressBar, isLoading: progressBarLoading,
  } = useGetProgressBar({ id: idToUse ?? pdpId });

  const progressPercentage = progressBar?.progress ?? 0;
  const planHasStarted = progressPercentage > 0;
  const planIsCompleted = progressPercentage === 100;

  // eslint-disable-next-line max-len
  const sortedPlotPoints = progressBar?.plotPoints?.sort((a, b) => moment(a.competencyResource.contentDueDate).valueOf() - moment(b.competencyResource.contentDueDate).valueOf());
  const hasPlotPoints = sortedPlotPoints && sortedPlotPoints?.length > 0;

  const hookProps = {
    progressBarLoading,
    planIsCompleted,
    progressPercentage,
    sortedPlotPoints,
    planHasStarted,
    progressBar,
    hasPlotPoints,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
