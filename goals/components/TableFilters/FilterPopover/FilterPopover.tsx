import { PopoverProps } from '@mui/material/Popover';
import PopoverStructured from '~Common/V4/components/Popover/PopoverStructured';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { css } from '@emotion/react';
import { palette } from '~Common/styles/colorsRedesign';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { forMobileObject } from '~Common/styles/mixins';
import ShouldConfirmButton from '../../Shared/ShouldConfirmButton';
import { TableFilters } from '../index';

const styles = {
  popover: css({
    '.MuiPaper-root': {
      width: '27rem',
    },
  }, forMobileObject({
    '.MuiPaper-root': {
      width: '100vw',
      maxWidth: 'unset',
    },
  })),
  clearAllButton: css({
    '.MuiButton-root': {
      color: palette.foreground.brandPrimary.default,
      width: '100%',
      textAlign: 'center',
    },
  }),
  filterContainer: css({
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    gap: '1rem',
  }),
};

interface FilterPopoverProps {
  anchorEl: Element | null;
  isOpen: boolean;
  closeConfirmationPopover: () => void;
  props?: PopoverProps;
}

const FilterPopover = ({
  anchorEl,
  isOpen,
  props,
  closeConfirmationPopover,
}: FilterPopoverProps): JSX.Element => {
  const { resetFilters } = useGoalsContext();

  return (
    <div>
      <PopoverStructured
        cssOverride={styles.popover}
        disableEnforceFocus
        disableScrollLock
        title="Filter"
        isOpen={isOpen}
        dataTestId="filter"
        anchorEl={anchorEl}
        popoverId="filterPopover"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        footerContents={(
          (
            <ShouldConfirmButton
              shouldConfirmClose={false}
              onConfirm={() => {
                closeConfirmationPopover();
              }}
              renderButton={({ onClick }) => (
                <JoshButton
                  data-test-id="closeFilters"
                  variant="default"
                  onClick={onClick}
                  name="closeFilters"
                >
                  Close
                </JoshButton>
              )}
            />

          )

        )}
        buttonContents={
          (
            <ShouldConfirmButton
              shouldConfirmClose
              onConfirm={() => {
                resetFilters();
              }}
              renderButton={({ onClick }) => (
                <JoshButton
                  css={styles.clearAllButton}
                  variant="text"
                  size="small"
                  onClick={onClick}
                  data-test-id="clearAll"
                  sx={{ color: palette.utility.gray[700] }}
                  name="clearAll"
                >
                  Clear All
                </JoshButton>
              )}
            />

          )
        }
        bodyContents={<TableFilters areFiltersActive />}
        {...props}
      />
    </div>
  );
};

export default FilterPopover;
