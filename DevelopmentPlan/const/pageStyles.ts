import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { forMobileObject, withLineClamp } from '~Common/styles/mixins';

export const PAGE_STYLES = {
  listSectionSkeleton: css({
    margin: '2rem 0',
  }),
};

export const PERSONAL_DEVELOPMENT_FILTER_STYLES = {
  filterWrapper: (isMobileView: boolean) => css({

  }, isMobileView && {
    width: '100%',
  }),
  filterLabel: (hasValue: boolean, isMobileView: boolean) => css({
    color: palette.neutrals.gray700,
    fontSize: '0.75rem',
  }, hasValue && {
    color: palette.brand.indigo,
  }, isMobileView && {
    display: 'none',
  }),
  dropdown: (hasValue: boolean, isMobileView: boolean) => css({
    border: '1px solid transparent',
    height: '2rem',
    padding: 0,
    width: '11rem',

    '.MuiSelect-select': {
      fontSize: '0.75rem',
      paddingLeft: '0.75rem',
    },

    // ToDo: Fix the placement of the dropdown arrow inside the common Dropdown component
    '.MuiSelect-icon': {
      right: '0.75rem',
    },
  }, hasValue && {
    borderColor: palette.brand.indigo,
  }, isMobileView && {
    width: '100%',
  }),
  dropdownItemBoy: css({
    display: 'flex',
    alignItems: 'center',
    color: palette.neutrals.gray700,
  }),
};

export const ACCORDION_STYLES = {
  accordion: css({
    padding: '.875rem 1.125rem',
    borderRadius: '.5rem',
    boxShadow: '0px 4px 8px -2px rgba(28, 42, 55, 0.2)',
    width: '100%',

    '.MuiAccordionSummary-content': {
      margin: 0,
    },
    '.MuiCollapse-hidden': {
      width: '1px',
    },
    '.MuiAccordionSummary-root, .MuiAccordionDetails-root': {
      padding: 0,
    },
    '.MuiAccordionDetails-root': {
      display: 'flex',
      flexDirection: 'column',
      gap: '.625rem',
    },
    '.MuiAccordionSummary-root': {
      minHeight: '1.875rem  !important',
    },
    '.MuiAccordionSummary-root.Mui-expanded': {
      minHeight: '1.875rem  !important',
    },
    ':before': {
      display: 'none',
    },
  }),
  title: css({
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.125rem',
    gap: '.625rem',
    color: palette.neutrals.gray800,
    fontWeight: 600,
  }),
  titleIcon: css({
    fontSize: '1.5rem',
  }),
  caretDownIcon: css({
    color: palette.brand.indigo,
  }),
};

export const tableStyles = {
  personalDevelopmentTable: (hasData: boolean) => css({
    color: palette.neutrals.gray800,
    border: 0,

    '.linearProgress': {
      backgroundColor: palette.brand.blue,
      '.MuiLinearProgress-bar1': {
        backgroundColor: palette.brand.indigo,
      },
      '.MuiLinearProgress-bar2': {
        backgroundColor: palette.brand.indigo,
      },
    },
    '& .MuiDataGrid-row:hover': {
      cursor: 'pointer',
    },
    '.MuiDataGrid-columnSeparator': {
      display: 'none',
    },

    '.MuiDataGrid-columnHeaders': {
      backgroundColor: palette.neutrals.gray100,
      border: 0,
      borderRadius: 0,
    },
    '.MuiDataGrid-cell, .MuiDataGrid-row': {
      minHeight: '4.375rem  !important',
      maxHeight: '5.625rem !important',
    },
  }, !hasData && {
    '& .MuiDataGrid-virtualScrollerContent': {
      height: '400px !important',
    },
  }),
};

export const FORM_LAYOUT_STYLES = {
  contextButtonsWrap: (isMobile: boolean) => css({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '.75rem',
    width: '100%',
  }, isMobile && {
    justifyContent: 'space-between',
  }),
  title: css({
    fontSize: '1.5rem',
    lineHeight: '1.5rem',
    fontWeight: '600',
    color: palette.brand.indigo,
  }, withLineClamp(2)),
  titleContainer: css({
    display: 'flex',
    alignItems: 'center',
  }),
  subTitle: css({
    fontSize: '1.125rem',
    lineHeight: '1.3125rem',
    fontWeight: '600',
    color: palette.brand.indigo,
  }),
  description: css({
    fontSize: '1rem',
    lineHeight: '1.3125rem',
    fontWeight: '400',
    color: palette.neutrals.gray800,
    marginBottom: '1.125rem',
  }),
  formContainer: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.375rem',
  }),
  dateWrappper: css({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: '1.5rem',
  }),
  titleWrapper: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '.5rem',
    justifyContent: 'space-between',
    marginBottom: '.5rem',
  }),
  note: css({
    fontSize: '.875rem',
    lineHeight: '1.3125rem',
    fontWeight: '400',
    color: palette.neutrals.gray800,
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: '33%',
  }),
  chip: css({
    height: 'auto',
    padding: '.125rem .75rem',
    marginLeft: '.5rem',
    backgroundColor: palette.neutrals.gray200,

    span: {
      padding: 0,
      fontSize: '0.75rem',
      fontWeight: '600',
      color: palette.neutrals.gray800,
    },
  }),
  invisibleInput: css({
    display: 'none',
  }),
  datePicker: css({
    fontSize: '.75rem',
    fontWeight: '400',
    color: palette.neutrals.gray700,

    input: {
      fontSize: '1rem',
      fontWeight: '500',
      color: palette.neutrals.gray700,
    },
  }),
  formInput: css({
    '.MuiInputBase-input': {
      fontSize: '1rem',
      fontWeight: '500',
      color: palette.neutrals.gray700,
    },
  }),
  froala: css({
    fontSize: '1rem',
    fontWeight: '500',
    color: palette.neutrals.gray700,

    '.fr-toolbar .fr-btn-grp': {
      padding: '0',
    },
  }),
  competencyWrapper: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1.125rem',
    flexWrap: 'wrap',
  }),
  emptyCompetencies: css({
    width: '100%',
  }),
  emptyStateImage: css({
    width: '13.5rem',
  }),
  competencyTitle: css({
    fontSize: '13px',
    fontWeight: '600',
    color: palette.neutrals.gray800,
    padding: '.25rem .75rem',
    lineHeight: '1.3125rem',
    backgroundColor: palette.neutrals.gray100,
    width: '100%',
  }),
  competencyCardSkeletonWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
    width: '100%',
  }),
  competencyCardSkeleton: css({
    maxWidth: '100%',
    height: '4rem',
  }),
};

export const modalExistingItemStyles = {
  skeletonWrapper: css({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '.375rem',
  }),
  cardSkeleton: css({
    width: '100%',
    height: '3.75rem',
    maxWidth: '100%',
  }),
  isFetchingBar: css({
    color: palette.brand.indigo,
    width: '100%',
    marginBottom: '-.375rem',
  }),
  title: (isSelected: boolean) => css({
    color: isSelected ? 'inherit' : palette.neutrals.gray800,
    fontSize: '1rem',
    fontWeight: 600,
  }, withLineClamp(1)),
  subText: (isSelected: boolean) => css({
    color: isSelected ? 'inherit' : palette.neutrals.gray500,
    fontSize: '.8125rem',
    fontWeight: 600,
  }, withLineClamp(2)),
  resource: (isSelected: boolean, white?: boolean) => css({
    padding: '.75rem 1rem',
    border: `1px solid ${palette.neutrals.gray100}`,
    background: white ? palette.neutrals.white : palette.neutrals.gray100,
    borderRadius: '.3125rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    ':hover button': {
      display: 'block',
    },
  }, isSelected && {
    border: `1px solid ${palette.brand.blue}`,
    color: palette.brand.blue,

    ':hover': {
      border: `1px solid ${palette.brand.red}`,
      color: palette.brand.red,

      button: {
        background: 'none',
      },
    },
  }),
  button: (isSelected?: boolean) => css({
    display: 'none',
  }, isSelected && {
    border: 'none',
  }),
};

export const existingResourceStyles = {
  searchField: css({
    width: '100%',
  }),
  resourceWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.375rem',
    width: '100%',
    maxHeight: 'unset',
    overflowY: 'hidden',
    overflowX: 'hidden',
    padding: '.25rem',
  }, forMobileObject({
    maxHeight: 'unset',
  })),
  planDateString: css({
    fontSize: '.625rem',
    fontWeight: 400,
    color: palette.neutrals.gray700,
    textTransform: 'uppercase',
    letterSpacing: '.125rem',
  }),
};

export const competencyDrawerSelect = {
  '& .MuiFormLabel-root ': {
    top: '.15rem',
  },
  '& .MuiInputBase-input': {
    padding: '1rem 1rem 0.5rem 1rem !important',
  },
};
