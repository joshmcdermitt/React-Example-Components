import { SelectOption } from '~Goals/const/types';
import Autocomplete, { AutocompleteRenderOptionState } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
  HTMLAttributes,
  useMemo,
} from 'react';
import Paper from '@mui/material/Paper';
import Popper, { PopperProps } from '@mui/material/Popper';

import { colors, palette } from '~Common/styles/colorsRedesign';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { GOAL_FILTER_STYLES } from '~Goals/const/styles';
import { autoCompleteStyles } from '~Common/V4/styles/AutoComplete';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { css } from '@emotion/react';
import { forMobileObject, forTabletObject } from '~Common/styles/mixins';
import Divider from '@mui/material/Divider';
import JoshSwitch from '~Common/V3/components/JoshSwitch';

const styles = {
  ...autoCompleteStyles,
  ...GOAL_FILTER_STYLES,
  participantFilterContainer: css({
    maxWidth: '10.625rem',
  }, forMobileObject({
    maxWidth: 'unset',
    width: '100%',
  }), forTabletObject({
    maxWidth: 'unset',
    width: '100%',
  })),
  participantsInput: css({
    '& .MuiOutlinedInput-root': {
      height: '2.5rem',
      backgroundColor: palette.background.primary.default,
      overflow: 'clip',
    },
  }),
  ownerFilter: css({
    padding: '.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  ownerFilterLabel: css({
    fontSize: '.875rem',
    fontWeight: 600,
    color: palette.text.primary.default,
  }),
  divider: css({
    margin: '0',
  }),
  optionList: css({
    fontSize: '.875rem',
    overflowY: 'auto',
    padding: '.5rem 0',
  }),
  styleFix: css({ // Fixes style issues in AutoComplete.ts
    'label:not(.MuiFormLabel-filled)': {
      fontWeight: '400',
    },
    '.MuiFormControl-root': {
      height: '2.375rem !important',
    },
    border: `1px solid ${colors.primary.grayLight[300]}`,
    borderRadius: '.5rem',
    height: '2.5rem',

    '& .MuiButtonBase-root': { // Fixes issue with long name overflowing into chevron
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      justifyContent: 'flex-start',
    },

    // Hover bg color change
    '& .MuiOutlinedInput-root:hover:not(.Mui-focused)': {
      backgroundColor: `${colors.primary.grayLight[50]} !important`, // not a perfect fix. i still white around the edges
    },
  }),
  popperStyles: css({ // Targets dropdown
    width: 'max-content',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: '29.6875rem',
    maxWidth: '37.5rem',
    boxShadow: '0px .25rem .75rem rgba(0, 0, 0, 0.1)',
    borderRadius: '.5rem',
    translate: '0 .3125rem',
  }),
};

const customPopper = (props: PopperProps): JSX.Element => (
  <Popper
    {...props}
    css={styles.popperStyles}
    placement="bottom-start"
  />
);

const renderParticipantOption = (
  optionProps: HTMLAttributes<HTMLLIElement>,
  option: SelectOption,
  { selected }: AutocompleteRenderOptionState,
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
        <JoshCheckbox
          checked={selected}
          data-test-id="autoCompleteFilterCheckbox"
        />
        <div css={styles.avatarWrapper}>
          <BaseAvatar
            css={styles.tagsProfileImage}
            orgUserId={option.value ?? null}
            avatarSize={22}
          />
          {option.label}
        </div>
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

const ParticipantsAutoCompleteFilters = (): JSX.Element => {
  const {
    participantFilter,
    onParticipantChange,
    recipientList,
    ownersOnly,
    setOwnersOnly,
  } = useGoalsContext();
  const peopleMap = useMemo(() => new Map(
    recipientList?.map((recipient) => ([recipient.value, recipient])),
  ), [recipientList]);

  const participantValues = participantFilter?.reduce<SelectOption[]>((result, owner) => {
    const user = peopleMap.get(owner);

    if (user) {
      result.push(user);
    }

    return result;
  }, []);

  return (
    <>
      {/* {activeTab !== Goals.GoalContextType.Organization && ( */}
      {recipientList && participantValues && renderParticipantOption && (
        <div css={styles.participantFilterContainer}>
          <p css={styles.filterLabel()}>Participant</p>
          <Autocomplete
            data-test-id="goalsParticipantsFilterAutocomplete"
            css={[
              styles.autocomplete(true),
              styles.autocompleteTags,
              // styles.autoCompleteBorder(false),
              styles.styleFix,
              styles.participantsInput,
            ]}
            PopperComponent={customPopper}
            PaperComponent={(props): JSX.Element => (
              <Paper
                {...props}
                sx={{
                  width: 'min(475px, 100vw - 32px)',
                  minWidth: '200px',
                  maxWidth: '475px',
                }}
              >
                <div css={styles.ownerFilter}>
                  <span css={styles.ownerFilterLabel}>Owners Only</span>
                  <div
                    role="button"
                    tabIndex={0}
                    // need to stop propogation to prevent the autocomplete from closing
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOwnersOnly(!ownersOnly);
                      }
                    }}
                    aria-label="Toggle owners only filter"
                  >
                    <JoshSwitch data-test-id="goalsOwnersOnly">
                      <JoshSwitch.Switch
                        onChange={(e) => {
                          e.stopPropagation();
                          setOwnersOnly(e.target.checked);
                        }}
                        checked={ownersOnly}
                        showCheckedLabels={false}
                        size="small"
                      />
                    </JoshSwitch>
                  </div>
                </div>
                <Divider css={styles.divider} />
                <div css={styles.optionList}>
                  {props.children}
                </div>
              </Paper>
            )}
            disableCloseOnSelect
            id="goalsParticipantsFilter"
            isOptionEqualToValue={(option, value) => option.value === value.value}
            limitTags={-1}
            multiple
            onChange={(_, newValue) => onParticipantChange(newValue.map(mergeValues))}
            options={recipientList}
            renderOption={renderParticipantOption}
            value={participantValues}
            renderTags={(value) => ( // Renders multiple, comma separated items in the input field
              <div
                css={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingLeft: '.75rem',
                }}
              >
                {value.map((option, index) => (
                  <span key={option.value}>
                    {option.label}
                    {index < value.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Any Participant"
                inputProps={{
                  ...params.inputProps,
                  'data-test-id': 'goalsParticipantsFilterAutocompleteInput',
                }}
              />
            )}
            popupIcon={(
              <FontAwesomeIcon
                icon={faChevronDown}
                className="fa-thin"
                css={styles.popupIcon}
              />
            )}
          />
        </div>
      )}
    </>
  );
};

export default ParticipantsAutoCompleteFilters;
