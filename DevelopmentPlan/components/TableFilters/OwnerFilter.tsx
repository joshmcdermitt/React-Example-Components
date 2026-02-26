import { css } from '@emotion/react';
import CustomCheckbox from '~Common/V3/components/Form/CustomCheckbox';
import MuiAutocomplete, { AutocompleteRenderOptionState } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { palette } from '~Common/styles/colors';
import { autoCompleteStyles } from '~Common/V3/styles/AutoComplete';
import { HTMLAttributes, ReactNode, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { PERSONAL_DEVELOPMENT_FILTER_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { SelectOption } from '~DevelopmentPlan/const/types';
import { customPopper } from '~Goals/components/DeleteAfterGoalsV4/AutoCompleteFilters';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';

const styles = {
  ...autoCompleteStyles,
  ...PERSONAL_DEVELOPMENT_FILTER_STYLES,
  autocompleteTags: css({
    minWidth: '9.375rem',
    '& .MuiAutocomplete-popper': {
      backgroundColor: 'black !important',
    },
    '&[data-shrink=true]': {
      top: '0',
    },
    'label[data-shrink=true]': {
      display: 'none !important',
      marginTop: '-0.5rem',
    },
    'label:not(.MuiFormLabel-filled)': {
      position: 'absolute',
      top: '50%',
      left: '8px',
      transform: 'translate(0, -50%)',
      fontSize: '0.75rem',
      color: palette.neutrals.gray800,
      margin: '0',
      fontWeight: '500',

      '& ~ .MuiInputBase-formControl': {
        padding: '0 !important',
      },
    },
    '.MuiAutocomplete-tag + div.MuiAutocomplete-tag': {
      display: 'none',
    },
    '& .MuiOutlinedInput-root.MuiInputBase-adornedStart': {
      paddingTop: '2rem !important',
    },
    '& .MuiOutlinedInput-root': {
      height: '2rem',
      overflow: 'clip',
    },
    '.MuiAutocomplete-option': {
      textOverflow: 'ellipsis',
      display: 'inline-block',
      overflow: 'hidden',
    },
    '.MuiAutocomplete-inputRoot': {
      overflowY: 'auto',
      maxHeight: '150px',
    },
    '.MuiAutocomplete-input': {
      marginTop: '0 !important',
    },
    '.MuiOutlinedInput-root .MuiAutocomplete-input': {
      padding: 0,
      width: '.625rem',
    },
    '.MuiAutocomplete-tag': {
      background: 'none',
      fontSize: '0.75rem !important',
      margin: '0',

      svg: {
        display: 'none',
      },
    },
    'span.MuiAutocomplete-tag': {
      marginRight: '0.75rem',
    },
    '.MuiAutocomplete-clearIndicator': {
      scale: '0.6',
    },
    '.MuiChip-root': {
      height: 'unset',
    },
  }),
  formInput: css({
    marginBottom: '.625rem',
  }),
  tagsProfileImage: css({
    marginRight: '.5rem',

    '& > :first-of-type': {
      marginRight: '0',
    },
  }),
  autocompleteOptionTextChip: css({
    marginRight: '.5rem !important',
  }),
  autocompleteOptionText: css({
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    width: '100%',
    flexDirection: 'row',
  }),
  person: css({
    display: 'flex',
    alignItems: 'center',
    marginRight: '.5rem',
    flex: 'auto',
  }),
  jobtitle: css({
    marginLeft: 'auto',
    color: palette.neutrals.gray700,
    fontSize: '.75rem',
    flex: '1',
    textAlign: 'right',
  }),
  icon: css({
    fontSize: '1rem',
  }),
  optionLabel: css({
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  autoCompleteBorder: (hasValue: boolean) => css({
    '.MuiOutlinedInput-root': {
      border: `1px solid ${hasValue ? palette.brand.indigo : 'transparent'}`,
      borderRadius: '0.5rem',
    },
  }),
};

const renderParticipantOption: ((props: HTMLAttributes<HTMLLIElement>, option: SelectOption, state: AutocompleteRenderOptionState) => ReactNode) = (
  optionProps: HTMLAttributes<HTMLLIElement>,
  option: SelectOption,
  { selected },
): JSX.Element => (
  <li
    {...optionProps}
    key={option.value}
  >
    <div
      css={styles.autocompleteOptionText}
    >
      <span
        css={styles.person}
      >
        <CustomCheckbox
          checked={selected}
        />
        <BaseAvatar
          css={styles.tagsProfileImage}
          orgUserId={option.value}
          avatarSize={22}
        />
        {option.label}
      </span>
      <span
        css={styles.jobtitle}
      >
        {option.jobTitle}
      </span>
    </div>
  </li>
);

const mergeValues = (newOption: SelectOption | string): string => (typeof newOption === 'object' ? newOption.value : newOption);

interface OwnerFilterProps {
  onOwnerChange: (newOwnerValue: string[]) => void,
  ownerList?: string[],
  recipientList: SelectOption[],
  isMobileView: boolean,
}

const OwnerFilter = ({
  onOwnerChange,
  ownerList = [],
  recipientList,
  isMobileView,
}: OwnerFilterProps): JSX.Element => {
  const peopleMap = useMemo(() => new Map(
    recipientList.map((recipient) => ([recipient.value, recipient])),
  ), [recipientList]);
  const ownerValues = ownerList.reduce<SelectOption[]>((result, owner) => {
    const user = peopleMap.get(owner);

    if (user) {
      result.push(user);
    }

    return result;
  }, []);

  return (
    <>
      <div
        css={styles.filterWrapper(isMobileView)}
      >
        <p css={styles.filterLabel(ownerValues.length > 0, isMobileView)}>Owner</p>
        <MuiAutocomplete
          css={[styles.autocomplete, styles.autocompleteTags, styles.autoCompleteBorder(ownerValues.length > 0)]}
          PopperComponent={customPopper}
          disableCloseOnSelect
          id="personalDevelopmentOwnersFilter"
          isOptionEqualToValue={(option, value) => option.value === value.value}
          limitTags={1}
          multiple
          onChange={(_, newValue) => onOwnerChange(newValue.map(mergeValues))}
          options={recipientList}
          renderOption={renderParticipantOption}
          value={ownerValues}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Any Owner"
            />
          )}
          popupIcon={(
            <FontAwesomeIcon
              icon={faCaretDown}
              css={styles.icon}
            />
          )}
        />
      </div>
    </>
  );
};

export default OwnerFilter;
