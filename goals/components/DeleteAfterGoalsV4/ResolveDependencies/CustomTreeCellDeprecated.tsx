import { SerializedStyles, css } from '@emotion/react';
import { faCaretDown, faCaretRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Goals } from '@josh-hr/types';
import {
  GridRenderCellParams,
  gridFilteredDescendantCountLookupSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { SyntheticEvent } from 'react';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { MAX_CASCADING_GOALS_TABLE_DEPTH } from '~Goals/const';
import { AchievedNotToggleType, GoalRow } from '~Goals/const/types';
import { forMobileObject } from '~Common/styles/mixins';
import GoalTypeIcon from '~Goals/components/Shared/GoalTypeIcon';
import NameCell from './NameCellDeprecated';

// Styling expanded layers, see StyledGoalsTable .joshGridCellDepth[#]
const styles = {
  customTreeCell: (depth: number) => css({
    display: 'flex',
    alignItems: 'center',
    marginLeft: `${depth * 1}rem`,
    overflow: 'hidden',
    width: '100%',
  }),
  expandButton: (showExpand: boolean) => css({
    visibility: showExpand ? 'visible' : 'hidden',
    paddingLeft: '0rem',
    paddingRight: '0rem',
  }, forMobileObject({
    paddingLeft: '0',
  })),
  goalTypeIcon: css({
    width: '.75rem',
    height: '.75rem',
    marginLeft: '0rem',
  }),
  nameCell: css({
    marginLeft: '0.5rem',
    flex: 1,
  }),
  icon: css({
    fontSize: '1rem',
  }),
  iconContainer: css({
    display: 'flex',
    alignItems: 'center',
    gap: '.25rem',
  }),
};

interface ViewProps {
  subText: string | undefined,
  handleToggle: (event: SyntheticEvent<HTMLButtonElement>) => void,
  title: string,
  isPrivate: boolean | undefined,
  percentage: number,
  status: Goals.GoalStatus,
  isExpanded: boolean,
  depth: number,
  showExpand: boolean,
  totalChildGoals: number,
  showProgressBar: boolean,
  contextType: Goals.GoalContextType,
  contextName?: string,
  buttonStyles?: SerializedStyles,
  measurementScale: Goals.MeasurementScale,
  isAchieved: AchievedNotToggleType | null,
}

const View = ({
  subText,
  handleToggle,
  title,
  isPrivate,
  percentage,
  status,
  isExpanded,
  depth,
  showExpand,
  totalChildGoals,
  buttonStyles,
  showProgressBar,
  contextName,
  contextType,
  measurementScale,
  isAchieved,
  ...props
}: ViewProps): JSX.Element => (
  <div css={styles.customTreeCell(depth)} {...props}>
    <div css={styles.iconContainer}>
      <JoshButton
        css={[styles.expandButton(showExpand), buttonStyles]}
        data-test-id="goalsExpandSubGoals"
        disabled={!showExpand}
        onClick={handleToggle}
        variant="icon"
      >
        <FontAwesomeIcon css={styles.icon} icon={isExpanded ? faCaretDown : faCaretRight} />
      </JoshButton>
      <GoalTypeIcon
        css={styles.goalTypeIcon}
        contextType={contextType}
        tooltipText={contextName}
      />
    </div>
    <NameCell
      css={styles.nameCell}
      title={title}
      isPrivate={isPrivate}
      totalChildGoals={totalChildGoals}
      subText={subText}
      percentage={percentage}
      status={status}
      showProgressBar={showProgressBar}
      contextType={contextType}
      contextName={contextName}
      showGoalTypeIcon={false}
      measurementScale={measurementScale}
      isAchieved={isAchieved}
    />
  </div>
);

interface CustomTreeCellProps extends GridRenderCellParams<GoalRow>, Pick<ViewProps, 'buttonStyles'> {
  showProgressBar?: boolean,
}

/**
 * @deprecated Use goals/components/Tables/GoalsTable/CustomTreeCell instead
 */

const CustomTreeCell = ({
  row,
  id,
  rowNode,
  field,
  showProgressBar = true,
  ...props
}: CustomTreeCellProps): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const apiRef = useGridApiContext();
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );

  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const isExpanded = rowNode.type === 'group' && !!rowNode.childrenExpanded;

  const handleToggle = (event: SyntheticEvent<HTMLButtonElement>): void => {
    if (rowNode.type !== 'group') {
      return;
    }

    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  const {
    isPrivate,
    subText,
    title,
    totalChildGoals,
    contextType,
    contextName,
  } = row;

  const {
    percentage,
    status,
    measurementScale,
    isAchieved,
  } = row.progress;

  const hookProps = {
    handleToggle,
    subText,
    title,
    isPrivate,
    percentage,
    status,
    isExpanded,
    depth: rowNode.depth,
    showExpand: filteredDescendantCount > 0 && rowNode.depth < MAX_CASCADING_GOALS_TABLE_DEPTH,
    totalChildGoals: totalChildGoals ?? 0,
    showProgressBar: !!showProgressBar && isMobile,
    contextType,
    contextName,
    measurementScale,
    isAchieved,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default CustomTreeCell;
