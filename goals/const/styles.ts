import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import {
  forTabletObject,
  forMobileObject,
  forMobileTinyObject,
} from '~Common/styles/mixins';

export const FORM_COMPONENT_WRAPPER_STYLES = {
  createEditContainer: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%',
  }),
  backButton: css({
    margin: '0rem',
    padding: '1rem 1.375rem 1rem 0',
    '> button': {
      padding: '0rem',
    },
  }),
  creatEditFormContainer: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '0rem .5rem',
    margin: '0rem',
    background: palette.neutrals.white,
    borderRadius: '.5rem',
  }),
  createEditForm: css({
    width: '100%',
  }),
  headerText: css({
    color: palette.neutrals.gray900,
    fontSize: '1.5rem',
    lineHeight: '2rem',
    fontWeight: 600,
    width: '100%',
  }),
  skeletonLoader: css({
    borderRadius: '.5rem',
    minWidth: '100%',
    maxWidth: '87.5rem',
    height: '80vh',
  }),
};

export const FORM_COMPONENT_STYLES = {
  buttonInputFields: css({
    height: '2.5rem !important',
    borderRadius: '.5rem',
    padding: '.5rem .75rem',
    gap: '.5rem',
  }),
  inputField: css({
    fontSize: '1rem',
    color: palette.neutrals.gray900,
    borderRadius: '.5rem',
    border: 'none',
    position: 'relative',

    '& input': {
      fontWeight: '600 !important',
      fontSize: '.875rem',
      minHeight: 'auto',
      lineHeight: '1.5rem',
    },
    '& textarea': {
      fontSize: '.875rem',
    },
    '& label': {
      color: `${palette.neutrals.gray700} !important`,
      width: '100%',
      borderRadius: '.5rem',
      fontWeight: '400',
    },
  }),
  datePickerLabel: css({
    fontWeight: 400,
    color: palette.neutrals.gray700,
    fontSize: '.75rem',
    paddingTop: '.25rem',
  }),
  datePicker: css({
    '& input': {
      fontSize: '1rem',
      fontWeight: '500 !important',
    },
  }),
  checkboxContainer: css({
    display: 'flex',
    alignItems: 'center',

    label: {
      margin: 0,
    },
  }),
  lockIcon: (isMobile: boolean) => css({
    color: palette.neutrals.gray400,
    marginLeft: '.5rem',
  }, isMobile && {
    display: 'none',
  }),
  tagsProfileImage: css({
    marginRight: '.5rem',
    '& > :first-of-type': {
      marginRight: '0',
    },
  }),
  autocompleteOptionText: css({
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: '0 !important',
    padding: '0 !important',

    '.MuiCheckbox-root': {
      padding: '0 .75rem !important',
    },
  }, forMobileObject({
    fontSize: '.875rem',
  })),
  autocompleteOptionTextChip: css({
    marginRight: '.5rem !important',
  }),
  jobTitle: css({
    marginLeft: 'auto',
    color: palette.neutrals.gray700,
    fontSize: '.75rem',
  }),
  formSpacing: css({
    marginBottom: '.75rem',
  }),
  formSpacingTop: css({
    marginTop: '.75rem',
  }),
  froalaSpacing: css({
    marginBottom: '.25rem',
  }),
  formBorderSpacer: css({
    paddingBottom: '.75rem',
    borderBottom: `.0625rem solid ${palette.neutrals.gray200}`,
  }),
  formBreakpoints: css({
    maxWidth: '61.875rem',
    width: '100%',
  }, forTabletObject({
    minWidth: '43rem',
  }), forMobileObject({
    paddingBottom: '1rem',
  }), forMobileTinyObject({
    paddingBottom: '1rem',
    minWidth: '20.4375rem',
  })),
};

// Updates the redesign styles for wrapper of create/edit forms
// May expand to apply to other pages as redesign expands
export const PAGE_WRAPPER_STYLES = {
  createEditLandingPageWrapper: css({
    justifyContent: 'center',
    justifyItems: 'center',
    display: 'block',
    backgroundColor: palette.neutrals.white,
    '& .landingPageContentsContainer': {
      backgroundColor: palette.neutrals.white,
      maxWidth: '91.5rem',
      padding: '2rem',
      borderRadius: '2.5rem',
      height: 'fit-content',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1.875rem',
    },
  }, forMobileObject({
    '& .landingPageContentsContainer': {
      margin: '0rem',
      borderRadius: '0rem',
      padding: '1.5rem',
    },
  }), forMobileTinyObject({
    justifyContent: 'left',
    backgroundColor: palette.neutrals.white,
  })),
  goalsLandingPageWrapper: css({
    '& .landingPageContentsContainer': {
      margin: '0 auto',
      maxWidth: '1216px',
      padding: '2.125rem 0rem',
      '[class*=topBarContainer]': {
        marginBottom: '1.5rem',
      },
    },
  }, forTabletObject({
    '& .landingPageContentsContainer': {
      padding: '2.125rem 2.5rem',
    },
  }), forMobileObject({
    '& .landingPageContentsContainer': {
      padding: '0rem 2.5rem',
      minWidth: '23.0625rem',
      overflow: 'visible',
    },
  }), forMobileTinyObject({
    '& .landingPageContentsContainer': {
      minWidth: '23.0625rem',
      padding: '0rem 1rem',
      justifyContent: 'left',
      overflow: 'visible',
    },
  })),
};

export const GOAL_DETAIL_STYLES = {
  subHeading: css({
    fontSize: '.75rem',
    color: palette.neutrals.gray700,
    fontWeight: 400,
    display: 'block',
  }),
};

export const GOAL_FILTER_STYLES = {
  filterLabel: (hasValue?: boolean) => css({
    color: palette.neutrals.gray700,
    paddingBottom: '.5rem',
    fontSize: '.875rem',
  }, hasValue && {
    color: palette.brand.indigo,
  }),
};

export const DROPDOWNSTYLES = {
  base: {
    '& .check': {
      display: 'none',
    },
    '&:MuiSelect-popper .check': {
      display: 'inline-block',
    },
  },
  dropdown: (hasValue: boolean, isNotDesktop: boolean, isTextLarge?: boolean) => css({
    width: '100%',
    border: '.0625px solid transparent',
    padding: 0,

    '.MuiSelect-select': {
      fontSize: '0.75rem',
      paddingLeft: '0.75rem',
    },
    // TODO: Fix the placement of the dropdown arrow inside the common Dropdown component
    '.MuiSelect-icon': {
      right: '0.75rem',
    },

  }, hasValue && {
  }, isNotDesktop && {
    width: '100%',
    height: '2.75rem',
  }, isTextLarge && {
    '.MuiSelect-select': {
      fontSize: '1rem',
    },
  }),
  dropdownItemBody: (isNotDesktop: boolean) => css({
    display: 'flex',
    alignItems: 'center',
    color: palette.neutrals.gray700,
    gap: '.75rem',
  }, isNotDesktop && {
    height: '2.75rem',
  }),
};

// GoalsTable V4 EP
export const GOALS_TABLE_STYLES = {
  goalsTable: ((isDesktop: boolean) => css({
    '.joshGridCell': {
      fontSize: '.875rem',
    },
    '.MuiDataGrid-cell': {
      padding: isDesktop ? '.75rem 1rem .75rem 1.5rem' : '.75rem .5rem .75rem 1rem',
      lineHeight: 'unset',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '&:last-of-type': {
        padding: isDesktop ? '1rem .25rem 1rem .5rem' : '1rem .25rem',
      },
      '&:focus, &:focus-within': {
        outline: 'none',
      },
    },

    '.MuiDataGrid-columnHeaders': {
      padding: 0,
    },
    '.MuiDataGrid-columnHeader': {
      padding: isDesktop ? '.75rem 1rem .75rem 1.5rem' : '.75rem .5rem .75rem 1rem',
      '&:last-of-type': {
        padding: isDesktop ? '.75rem .25rem .75rem .5rem' : '.75rem .25rem',
      },
      'MuiDataGrid-columnSeparator': {
        display: 'none',
      },
    },
  })),
};
