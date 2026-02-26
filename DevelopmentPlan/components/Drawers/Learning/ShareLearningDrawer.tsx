import { css, SerializedStyles } from '@emotion/react';
import {
  faTimes, faLightbulb, faListCheck,
} from '@fortawesome/pro-light-svg-icons';
import { useCallback, useState } from 'react';

import DrawerOptionSelectItem from '~Learning/components/Shared/DrawerOptionSelectItem/DrawerOptionSelectItem';
import { DrawerProps, DRAWER_WIDTHS } from '~Common/const/drawers';
import DrawerLayout from '~Common/V3/components/Drawers/DrawerLayout';
import DrawerHeader from '~Common/V3/components/Drawers/DrawerHeader';
import { registerDrawer } from '~Deprecated/ui/views/DrawerManager';
import IconButton from '~Meetings/components/buttons/IconButton';
import { AssignLearningOptions } from '~Learning/const/interfaces';
import { palette } from '~Common/styles/colors';
import { createLearningTemplate } from '~Learning/components/CreateLearningDrawer';
import { createLearningPlaylistDrawerTemplate } from '~Learning/components/CreateLearningPlaylistDrawer';

const styles = {
  drawerBody: css({}),
  instructions: css({}),
  drawerOptionSelectItem: css({
    ':not(:first-of-type)': {
      marginTop: '.625rem',
    },
  }),
  subText: css({
    textTransform: 'uppercase',
    fontSize: '.625rem',
    fontWeight: 400,
    letterSpacing: '.125rem',
    color: palette.neutrals.gray700,
    paddingLeft: '1.5rem',
    marginTop: '1rem',
    marginBottom: '-1rem',
  }),
};

export const personalDevelopmentShareLearningDrawer = {
  name: 'PERSONAL_DEVELOPMENT_SHARE_LEARNING_DRAWER',
  width: DRAWER_WIDTHS.BASE,
};

const options = [
  {
    content: AssignLearningOptions.SINGLE_LEARNING_CONTENT,
    icon: faLightbulb,
    dataTestId: 'learningCreateASingleLearningButton',
  },
  {
    content: AssignLearningOptions.LEARNING_PLAYLIST,
    icon: faListCheck,
    dataTestId: 'learningCreateALearningPlaylistButton',
  },
];

const PersonalDevelopmentShareLearningDrawer = ({
  popDrawer, pushDrawer, setDrawerState,
}: DrawerProps<Record<string, unknown>>): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);

  const closeDrawerClick = (): void => {
    popDrawer({ drawerName: personalDevelopmentShareLearningDrawer.name });
  };

  const onPathwayClick = useCallback((item: AssignLearningOptions): void => {
    popDrawer({ popAll: true });
    if (item === AssignLearningOptions.SINGLE_LEARNING_CONTENT) {
      setDrawerState((prev) => ({
        ...prev,
        workflow: AssignLearningOptions.SINGLE_LEARNING_CONTENT,
        isPersonalDevelopment: true,
        activeTab,
        setActiveTab,
      }));
      pushDrawer({
        drawer: createLearningTemplate,
      });
    } else if (item === AssignLearningOptions.LEARNING_PLAYLIST) {
      setDrawerState((prev) => ({
        ...prev,
        workflow: AssignLearningOptions.LEARNING_PLAYLIST,
        isPersonalDevelopment: true,
        activeTab,
        setActiveTab,
      }));
      pushDrawer({
        drawer: createLearningPlaylistDrawerTemplate,
      });
    }
  }, [activeTab, popDrawer, pushDrawer, setDrawerState]);

  const hookProps = {
    renderHeader: () => (
      <>
        <DrawerHeader
          title="Add Learning"
          renderCloseButton={(closeButtonStyles: SerializedStyles) => (
            <IconButton onClick={closeDrawerClick} type="button" icon={faTimes} css={closeButtonStyles} tooltip="Close" />
          )}
        />
      </>
    ),
    renderBody: (defaultBodyPadding: SerializedStyles) => (
      <div
        css={defaultBodyPadding}
      >
        <div>
          {options.map((option) => (
            <DrawerOptionSelectItem
              css={styles.drawerOptionSelectItem}
              onClick={() => onPathwayClick(option.content)}
              icon={option.icon}
              content={option.content}
              data-test-id={option.dataTestId}
            />
          ))}
        </div>
      </div>
    ),
  };

  return (
    <DrawerLayout
      {...hookProps}
    />
  );
};

registerDrawer({
  templateName: personalDevelopmentShareLearningDrawer.name,
  component: PersonalDevelopmentShareLearningDrawer,
});

export default PersonalDevelopmentShareLearningDrawer;
