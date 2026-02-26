import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { getPersonalDevelopmentTypeIcon } from '~DevelopmentPlan/const/functions';
import { faClose, IconDefinition } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  MouseEvent, SyntheticEvent,
} from 'react';
import { CompetencyResource as CompetencyResourceType } from '~DevelopmentPlan/const/types';
import { HoverState, useHoverState } from '~Common/hooks/useHoverState';
import JoshDueDate from '~Common/V3/components/JoshDueDate';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';

const styles = {
  competencyResource: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '&:hover': {
      cursor: 'pointer',
    },
  }),
  resourceWrap: css({
    padding: '0.5rem 0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '.625rem',
    backgroundColor: palette.neutrals.gray50,
    borderRadius: '.5rem',
    fontSize: '.75rem',
    color: palette.neutrals.gray800,
    flex: 1,
  }),
  icon: css({
    verticalAlign: 0,
    color: palette.neutrals.gray700,
    marginRight: '.5rem',
  }),
  resourceTitle: css({
    flex: 1,
  }),
  deleteButton: (isHovering: boolean) => css({
    visibility: isHovering ? 'visible' : 'hidden',
  }),
};

interface ViewProps extends HoverState {
  handleResourceClick: (resource: CompetencyResourceType) => void,
  resource: CompetencyResourceType,
  icon: IconDefinition,
  dueDate: string,
  id: number,
  setResourceToBeDeleted: (resourceId: number) => void,
  openConfirmationPopover: (event: SyntheticEvent<HTMLElement, Event>) => void,
  showDueDate: boolean,
}

const View = ({
  handleResourceClick,
  handleMouseEnter,
  handleMouseLeave,
  isHovering,
  resource,
  icon,
  dueDate,
  id,
  setResourceToBeDeleted,
  openConfirmationPopover,
  showDueDate,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.competencyResource}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onClick={() => handleResourceClick(resource)}
    onKeyDown={() => handleResourceClick(resource)}
    role="button"
    tabIndex={0}
    {...props}
  >
    <div
      css={styles.resourceWrap}
    >
      <FontAwesomeIcon
        icon={icon}
        css={styles.icon}
      />
      <div
        css={styles.resourceTitle}
      >
        {resource.contentTitle}
      </div>
      {showDueDate && (
        <JoshDueDate dueDate={dueDate} showIcon={false} />
      )}
      <JoshButton
        variant="icon"
        color="danger"
        data-test-id="pdpsDeleteCompetencyResource"
        onClick={(event: MouseEvent<HTMLElement>) => {
          openConfirmationPopover(event);
          setResourceToBeDeleted(id);
        }}
        css={styles.deleteButton(isHovering)}
      >
        <FontAwesomeIcon
          icon={faClose}
        />
      </JoshButton>
    </div>
  </div>
);

interface CompetencyResourceProps extends Pick<ViewProps, 'handleResourceClick' | 'openConfirmationPopover' | 'setResourceToBeDeleted'> {
  resource: CompetencyResourceType,
}

const CompetencyResource = ({
  resource,
  ...props
}: CompetencyResourceProps): JSX.Element => {
  const {
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
  } = useHoverState();
  const isMobile = useIsMobileQuery();

  const {
    id,
    contentType: {
      id: contentTypeId,
    },
    contentDueDate: dueDate,
  } = resource;
  const icon = getPersonalDevelopmentTypeIcon(contentTypeId);

  const showDueDate = !isMobile;

  const hookProps = {
    dueDate,
    icon,
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    resource,
    id,
    showDueDate,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default CompetencyResource;
