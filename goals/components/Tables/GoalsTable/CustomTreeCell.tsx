import { SerializedStyles, css } from '@emotion/react';
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
import { GoalRowV4 } from '~Goals/const/types';
import { forMobileObject } from '~Common/styles/mixins';
import ChevronDownIcon from '~Assets/icons/components/ChevronDownIcon';
import NameCell from './NameCell';

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
  chevron: (isExpanded: boolean) => css({
  }, isExpanded && {
    rotate: '-180deg',
  }),
};

interface ViewProps {
  buttonStyles?: SerializedStyles,
  contextName?: string,
  contextType: Goals.GoalContextType,
  depth: number,
  handleToggle: (event: SyntheticEvent<HTMLButtonElement>) => void,
  isExpanded: boolean,
  isPrivate: boolean | undefined,
  showExpand: boolean,
  subText: string | undefined,
  title: string,
  totalChildGoals: number,
}

const View = ({
  buttonStyles,
  contextName,
  contextType,
  depth,
  handleToggle,
  isExpanded,
  isPrivate,
  showExpand,
  subText,
  title,
  totalChildGoals,
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
        <ChevronDownIcon aria-expanded={isExpanded} css={styles.chevron(isExpanded)} fontSize="small" />
      </JoshButton>
    </div>
    <NameCell
      css={styles.nameCell}
      contextName={contextName}
      contextType={contextType}
      isPrivate={isPrivate}
      showGoalTypeIcon={false}
      subText={subText}
      title={title}
      totalChildGoals={totalChildGoals}
    />
  </div>
);

interface CustomTreeCellProps extends GridRenderCellParams<GoalRowV4>, Pick<ViewProps, 'buttonStyles'> {
  showProgressBar?: boolean,
}

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
    goal,
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
    statusUpdate: goal.currentStatusUpdate,
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
