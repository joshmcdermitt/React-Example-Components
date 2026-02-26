import { Goals } from '@josh-hr/types';
import { SelectOption } from '~Goals/const/types';
import MuiAutocomplete, { AutocompleteRenderOptionState } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { autoCompleteStyles } from '~Common/V3/styles/AutoComplete';
import { HTMLAttributes, ReactNode, useMemo } from 'react';
import Popper, { PopperProps } from '@mui/material/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faStar } from '@fortawesome/pro-solid-svg-icons';
import { GOAL_FILTER_STYLES } from '~Goals/const/styles';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';

const styles = {
  ...autoCompleteStyles,
  ...GOAL_FILTER_STYLES,
  participantsInput: css({
    'label, label:not(.MuiFormLabel-filled)': {
      fontWeight: 400,
    },
    '& .MuiInputLabel-root': {
      fontWeight: 400,
    },
  }),
  favoriteIcon: css({
    marginRight: '0.5rem',
  }),
};

// TODO: Find a better place to put this
export const customPopper = (props: PopperProps): JSX.Element => (
  <Popper {...props} style={{ width: 'fit-content', maxWidth: '600px' }} placement="bottom-start" />
);

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
        <JoshCheckbox
          checked={selected}
          data-test-id="autoCompleteFilterCheckbox"
        />
        <div css={styles.avatarWrapper}>
          <BaseAvatar
            css={styles.tagsProfileImage}
            orgUserId={option.value}
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

interface AutoCompleteFiltersProps {
  activeTab: Goals.GoalContextType,
  allTeamsList: SelectOption[],
  onOwnerChange: (newOwnerValue: string[]) => void,
  onParticipantChange: (newParticipantValue: string[]) => void,
  onTeamChange: (newParticipantValue: string[]) => void,
  ownerList?: string[],
  participantList?: string[],
  recipientList: SelectOption[],
  teamList?: string[],
}

const AutoCompleteFilters = ({
  activeTab,
  allTeamsList,
  onOwnerChange,
  onParticipantChange,
  onTeamChange,
  ownerList = [],
  participantList = [],
  recipientList,
  teamList = [],
}: AutoCompleteFiltersProps): JSX.Element => {
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

  const participantValues = participantList.reduce<SelectOption[]>((result, owner) => {
    const user = peopleMap.get(owner);

    if (user) {
      result.push(user);
    }

    return result;
  }, []);

  const teamValues = teamList.reduce<SelectOption[]>((result, teamId) => {
    const team = allTeamsList.find((record) => record.value === teamId);

    if (team) {
      result.push(team);
    }

    return result;
  }, []);

  return (
    <>
      {activeTab !== Goals.GoalContextType.Organization && (
        <div>
          <p css={styles.filterLabel(participantValues.length > 0)}>Participant</p>
          <MuiAutocomplete
            css={[styles.autocomplete, styles.autocompleteTags, styles.autoCompleteBorder(participantValues.length > 0)]}
            PopperComponent={customPopper}
            disableCloseOnSelect
            id="goalsParticipantsFilter"
            isOptionEqualToValue={(option, value) => option.value === value.value}
            limitTags={1}
            multiple
            onChange={(_, newValue) => onParticipantChange(newValue.map(mergeValues))}
            options={recipientList}
            renderOption={renderParticipantOption}
            value={participantValues}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Any Participant"
              />
            )}
            popupIcon={(
              <FontAwesomeIcon
                icon={faCaretDown}
                css={styles.popupIcon}
              />
            )}
          />
        </div>
      )}

      <div>
        <p css={styles.filterLabel(ownerValues.length > 0)}>Owner</p>
        <MuiAutocomplete
          css={[styles.autocomplete, styles.autocompleteTags, styles.autoCompleteBorder(ownerValues.length > 0)]}
          PopperComponent={customPopper}
          disableCloseOnSelect
          id="goalsOwnersFilter"
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
              css={styles.popupIcon}
            />
          )}
        />
      </div>

      {activeTab === Goals.GoalContextType.Team && (
        <div>
          <p css={styles.filterLabel(teamValues.length > 0)}>Team</p>
          <MuiAutocomplete
            css={[styles.autocomplete, styles.autocompleteTags, styles.autoCompleteBorder(teamValues.length > 0)]}
            PopperComponent={customPopper}
            disableCloseOnSelect
            id="goalsTeamsFilter"
            isOptionEqualToValue={(option, value) => option.value === value.value}
            limitTags={1}
            multiple
            onChange={(_, newValue) => onTeamChange(newValue.map(mergeValues))}
            options={allTeamsList}
            value={teamValues}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Any Team"
                css={styles.participantsInput}
              />
            )}
            popupIcon={(
              <FontAwesomeIcon
                icon={faCaretDown}
                css={styles.popupIcon}
              />
            )}
            renderOption={(optionProps: HTMLAttributes<HTMLLIElement>, option: SelectOption, { selected }) => (
              <li
                {...optionProps}
                key={option.value}
              >
                <div
                  css={styles.autocompleteOptionText}
                >
                  <JoshCheckbox checked={selected} data-test-id="autoCompleteFilterCheckbox" />
                  <div css={styles.optionLabel}>
                    {option.showIcon && (
                      <FontAwesomeIcon
                        css={styles.favoriteIcon}
                        icon={faStar}
                        color={palette.brand.yellow}
                      />
                    )}
                    {option.label}
                  </div>
                </div>
              </li>
            )}
          />
        </div>
      )}
    </>
  );
};

export default AutoCompleteFilters;
