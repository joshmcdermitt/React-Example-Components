import { Goals } from '@josh-hr/types';
import ConditionalWrapper from '~Common/components/ConditionalWrapper';
import Tooltip from '~Common/components/Tooltip';
import { ComponentType } from 'react';
import BuildingIcon from '~Assets/icons/components/BuildingIcon';
import UserIcon from '~Assets/icons/components/UserIcon';
import UsersIcon from '~Assets/icons/components/UsersIcon';
import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';

const ICON_MAP: Record<Goals.GoalContextType, ComponentType> = {
  [Goals.GoalContextType.Personal]: UserIcon,
  [Goals.GoalContextType.Organization]: BuildingIcon,
  [Goals.GoalContextType.Team]: UsersIcon,
};

const styles = {
  icon: (width: string, height: string) => css({
    width,
    height,
    color: palette.neutrals.gray700,
    marginLeft: '0rem',
  }),
};

interface GoalTypeIconProps {
  contextType: Goals.GoalContextType;
  tooltipText?: string;
  width?: string;
  height?: string;
}

const GoalTypeIcon = ({
  contextType,
  tooltipText,
  width = '1rem',
  height = '1rem',
}: GoalTypeIconProps): JSX.Element => {
  const IconComponent = ICON_MAP[contextType];

  return (
    <ConditionalWrapper
      renderWrapperCondition={!!tooltipText}
      renderWrapper={(renderChildren) => (
        <Tooltip content={tooltipText}>
          <div>
            {renderChildren()}
          </div>
        </Tooltip>
      )}
      renderContents={() => (
        <IconComponent css={styles.icon(width, height)} />
      )}
    />
  );
};

export default GoalTypeIcon;
