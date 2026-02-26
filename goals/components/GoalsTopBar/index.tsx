import ModuleTopbar from '~Common/V3/components/ModuleTopbar';
import CreateButton from '~Common/V4/components/ModuleTopbar/CreateButton';
import { css } from '@emotion/react';
import { MouseEvent, useEffect, useState } from 'react';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '~Goals/hooks/utils/useGetGoalRoutes';
import { useTheme } from '@mui/material';
import { forMobileObject } from '~Common/styles/mixins';
import FilterButton from '../TableFilters/FilterButton';
import FilterPopover from '../TableFilters/FilterPopover/FilterPopover';

const styles = {
  topBar: css({
    alignItems: 'center',
    justifyContent: 'space-between',
  }, forMobileObject({
    marginTop: '1.5rem',
  })),
  rightSection: css({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '.5rem',
    alignItems: 'center',
  }),
};

interface ViewProps {
  featureNamesText: FeatureNamesText,
  goalRoutes: GetGoalRoutesReturn['goalRoutes'],
  isMobile: boolean,
  showFilterPopover: (event: MouseEvent<HTMLElement>) => void,
  anchorEl: HTMLElement | null,
  isPopoverOpen: boolean,
  closeConfirmationPopover: () => void,
}

const View = ({
  featureNamesText,
  goalRoutes,
  isMobile,
  showFilterPopover,
  anchorEl,
  isPopoverOpen,
  closeConfirmationPopover,
}: ViewProps): JSX.Element => (
  <>
    <ModuleTopbar
      css={styles.topBar}
      moduleTopbarLayout="titleAndButtons"
      titleText={featureNamesText.goals.plural}
      renderRightSection={() => (
        <div css={styles.rightSection}>
          {isMobile && (
            <>
              <FilterButton handleClick={(event: MouseEvent<HTMLElement>): void => showFilterPopover(event)} />
            </>
          )}
          {isMobile && (
            <FilterPopover
              anchorEl={anchorEl}
              isOpen={isPopoverOpen}
              closeConfirmationPopover={closeConfirmationPopover}
            />
          )}
          <CreateButton
            toRoute={goalRoutes?.Create}
            itemName={featureNamesText.goals.singular}
            dataTestId="goalsCreateNew"
            isAbbreviatedText={false}
          />
        </div>
      )}
    />
  </>
);

const GoalsTopBar = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const isMobile = useIsMobileQuery();
  const theme = useTheme();

  useEffect(() => {
    if (!isMobile && anchorEl) closeConfirmationPopover();
  }, [anchorEl, isMobile]);

  const showFilterPopover = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const closeConfirmationPopover = (): void => {
    setAnchorEl(null);
  };

  const hookProps = {
    featureNamesText,
    goalRoutes,
    isMobile,
    theme,
    anchorEl,
    showFilterPopover,
    closeConfirmationPopover,
    isPopoverOpen: Boolean(anchorEl),
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };

export default GoalsTopBar;
