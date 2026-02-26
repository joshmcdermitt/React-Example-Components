import React from 'react';
import { css } from '@emotion/react';
import { Chip } from '@mui/material';
import { MAX_SEARCH_TERM_LABEL_LENGTH } from '~Goals/const';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { palette } from '~Common/styles/colorsRedesign';
import XCloseIcon from '~Assets/icons/components/V4/XCloseIcon';
import DotIcon from '~Assets/icons/components/DotIcon';

const styles = {
  chip: css({
    margin: '0rem',
    padding: '.25rem .375rem .25rem .625rem',
    border: `1px solid ${palette.border.secondary}`,
    backgroundColor: palette.background.primary.hover,
    gap: '.375rem',
    '.MuiChip-label': {
      fontSize: '.875rem',
      padding: '0rem',
      color: palette.text.placeholder.default,
      fontWeight: 500,
    },
    '.MuiChip-icon': {
      fontSize: '.5rem',
      color: palette.foreground.tertiary.default,
      width: '.5rem',
      margin: '0rem',
    },
    '.MuiChip-deleteicon': {
      fontSize: '.75rem',
      color: palette.text.placeholder.default,
      width: '.75rem',
      margin: '0rem',
    },
  }),
};

const truncatedLabel = (label: string): string => (
  label.length > MAX_SEARCH_TERM_LABEL_LENGTH
    ? `${label.slice(0, MAX_SEARCH_TERM_LABEL_LENGTH)}…`
    : label
);

const SearchTerms = (): JSX.Element => {
  const { searchTerms, setSearchTerms } = useGoalsContext();

  return (
    <>
      {searchTerms.map((term) => (
        <React.Fragment key={term}>
          <Chip
            css={styles.chip}
            label={truncatedLabel(term)}
            variant="outlined"
            size="small"
            onDelete={() => setSearchTerms(searchTerms.filter((t) => t !== term))}
            deleteIcon={(
              <XCloseIcon
                css={css({
                  width: '.75rem !important',
                  height: '.75rem !important',

                })}
              />
            )}
            icon={<DotIcon />}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default SearchTerms;
