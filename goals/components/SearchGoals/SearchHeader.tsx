import { css } from '@emotion/react';
import {
  KeyboardEvent, ChangeEvent, MouseEvent, useState,
  useEffect, useRef, MutableRefObject,
} from 'react';
import { useIsDesktopQuery, useIsMobileQuery, useIsTabletQuery } from '~Common/hooks/useMediaListener';
import { useEnableCascadingGoals } from '~Goals/hooks/utils/useEnableCascadingGoals';
import { useSetUserLevelEnableCascadingGoals } from '~Goals/stores/useUserLevelEnableCascadingGoals';
import JoshSearchField from '~Common/V3/components/JoshSearchField';
import { Typography } from '@mui/material';
import { forMobileObject, forMobileTinyObject } from '~Common/styles/mixins';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { palette } from '~Common/styles/colors';
import { palette as paletteRedesign } from '~Common/styles/colorsRedesign';
import { MAX_SEARCH_TERM_LENGTH, MAX_SEARCH_TERMS } from '~Goals/const';
import SearchIcon from '~Assets/icons/components/V4/SearchIcon';
import SearchShortCut from '~Assets/icons/components/V4/SearchShortCut';
import CascadeViewToggle from '../Shared/CascadeViewToggle';
import FilterButton from '../TableFilters/FilterButton';
import FilterPopover from '../TableFilters/FilterPopover/FilterPopover';
import SearchTerms from './SearchTerms';

const styles = {
  searchHeaderContainer: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem 2.5rem',
    borderBottom: '1px solid #E9EAEB',
  }, forMobileObject({
    padding: '1rem 1.5rem',
  }), forMobileTinyObject({
    padding: '1rem 1.5rem',
  })),
  topRow: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }, forMobileObject({
    width: '100%',
  })),
  bottomRow: css({
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5rem',
    flexWrap: 'wrap',
  }),
  searchField: css({
    width: '22rem',
    height: '2.5rem',
  }),
  fullWidthMobile: css({
  }, forMobileObject({
    width: '100%',
  }), forMobileTinyObject({
    width: '100%',
  })),
  searchFieldContainer: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: '0.5rem',
    flexWrap: 'nowrap',
  }, forMobileObject({
    width: '100%',
  })),
  maxSearchTerms: css({
    color: palette.brand.red,
  }),
  leftIcon: css({
    width: '1.25rem',
    height: '1.25rem',
    color: paletteRedesign.foreground.quaternary.default,
  }),
  rightIcon: css({
    height: '24px',
    width: '28px',
    color: paletteRedesign.text.quartnerary.default,
    border: '1px solid #E9EAEB',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
  }),
};

interface ViewProps {
  isMobile: boolean,
  isTablet: boolean,
  isDesktop: boolean,
  handleCascadeViewChange: (event: ChangeEvent<HTMLInputElement>) => void,
  enableCascadingGoals: boolean,
  showCascadingGoalsToggle: boolean,
  handleSearchTextChange: (event: ChangeEvent<HTMLInputElement>) => void,
  handleSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void,
  searchInput: string,
  searchTerms: string[],
  setSearchTerms: (terms: string[]) => void,
  isLoading: boolean,
  isPopoverOpen: boolean,
  showFilterPopover: (event: MouseEvent<HTMLElement>) => void,
  anchorEl: HTMLElement | null,
  closeConfirmationPopover: () => void,
  inputRef: MutableRefObject<HTMLInputElement | null>,
}

const View = ({
  isTablet = false,
  isDesktop = false,
  handleCascadeViewChange,
  enableCascadingGoals,
  showCascadingGoalsToggle,
  handleSearchTextChange,
  handleSearchKeyDown,
  searchInput,
  searchTerms,
  isLoading,
  showFilterPopover,
  anchorEl,
  isPopoverOpen,
  closeConfirmationPopover,
  inputRef,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.searchHeaderContainer}
    {...props}
  >
    <div css={styles.topRow}>
      <div css={styles.searchFieldContainer}>
        <JoshSearchField
          data-test-id="goalsTopBarSearchField"
          value={searchInput}
          onChange={handleSearchTextChange}
          onKeyDown={handleSearchKeyDown}
          css={[styles.searchField, styles.fullWidthMobile]}
          inputProps={{
            maxLength: MAX_SEARCH_TERM_LENGTH,
          }}
          inputRef={inputRef}
          renderLeftIcon={() => <SearchIcon css={styles.leftIcon} />}
          renderRightIcon={() => <SearchShortCut css={styles.rightIcon} />}
          disabled={isLoading}
        />
        {searchTerms.length >= MAX_SEARCH_TERMS && (
          <Typography variant="textXs" css={styles.maxSearchTerms}>Maximum search terms</Typography>
        )}
      </div>
      {showCascadingGoalsToggle && isDesktop && (
        <CascadeViewToggle
          handleCascadeViewChange={handleCascadeViewChange}
          enableCascadingGoals={enableCascadingGoals}
          disabled={isLoading}
          showCheckedLabels={false}
        />
      )}
      {isTablet && (
        <FilterButton handleClick={(event: MouseEvent<HTMLElement>): void => showFilterPopover(event)} />
      )}
    </div>
    {searchTerms.length > 0 && (
      <div css={[styles.bottomRow, styles.fullWidthMobile]}>
        {SearchTerms()}
      </div>
    )}
    {!isDesktop && (
      <FilterPopover
        anchorEl={anchorEl}
        isOpen={isPopoverOpen}
        closeConfirmationPopover={closeConfirmationPopover}
      />
    )}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SearchHeaderProps {
}

const SearchHeader = ({
  ...props
}: SearchHeaderProps): JSX.Element => {
  const [searchInput, setSearchInput] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    searchTerms, setSearchTerms, handleResetGoalsQuery, isLoading,
  } = useGoalsContext();
  const isMobile = useIsMobileQuery();
  const isTablet = useIsTabletQuery();
  const isDesktop = useIsDesktopQuery();
  const { orgLevelEnableCascadingGoals, userLevelEnableCascadingGoals } = useEnableCascadingGoals();
  const showCascadingGoalsToggle = orgLevelEnableCascadingGoals;
  const setEnable = useSetUserLevelEnableCascadingGoals();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isDesktop && anchorEl) closeConfirmationPopover();
  }, [anchorEl, isDesktop]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      // Since we're on the goals page, always handle cmd+k/ctrl+k
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(event.target.value);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && !searchInput.length) return;
    if (event.key === 'Enter' && searchTerms.length < MAX_SEARCH_TERMS) {
      setSearchTerms([...searchTerms, searchInput]);
      setSearchInput('');
    }
  };

  const handleCascadeViewChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEnable(event.target.checked);
    handleResetGoalsQuery(event.target.checked);
  };

  const showFilterPopover = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const closeConfirmationPopover = (): void => {
    setAnchorEl(null);
  };

  const hookProps = {
    isMobile,
    isTablet,
    isDesktop,
    handleCascadeViewChange,
    enableCascadingGoals: userLevelEnableCascadingGoals,
    showCascadingGoalsToggle,
    handleSearchTextChange,
    handleSearchKeyDown,
    searchInput,
    searchTerms,
    setSearchTerms,
    isLoading,
    showFilterPopover,
    anchorEl,
    isPopoverOpen: Boolean(anchorEl),
    closeConfirmationPopover,
    inputRef: searchInputRef,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default SearchHeader;
