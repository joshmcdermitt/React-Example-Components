import { SelectOption } from '~Goals/const/types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { autoCompleteStyles } from '~Common/V4/styles/AutoComplete';
import {
  HTMLAttributes, useEffect, useMemo, useRef,
} from 'react';
import Popper, { PopperProps } from '@mui/material/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { GOAL_FILTER_STYLES } from '~Goals/const/styles';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { Goals } from '@josh-hr/types';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { useGetTeams } from '~People/components/Teams/hooks/useGetTeams';
import { TeamsListScope } from '~People/components/Teams/const/types';
import { css } from '@emotion/react';
import { forMobileObject, forTabletObject } from '~Common/styles/mixins';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { palette } from '~Common/styles/colors';
import { colors } from '~Common/styles/colorsRedesign';

const styles = {
  ...autoCompleteStyles,
  ...GOAL_FILTER_STYLES,
  teamFilterContainer: css({
    maxWidth: '10.625rem',
  }, forMobileObject({
    maxWidth: 'unset',
    width: '100%',
  }), forTabletObject({
    maxWidth: 'unset',
    width: '100%',
  })),
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
    '.MuiAutocomplete-inputRoot': {
      overflowY: 'hidden', // removes strange tiny scroll bar on right side of input
    },
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
    width: 'fit-content',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: '29.6875rem',
    maxWidth: '37.5rem',
    boxShadow: '0px .25rem .75rem rgba(0, 0, 0, 0.1)',
    borderRadius: '.5rem',
    '& .MuiAutocomplete-option': {
      fontSize: '.875rem !important',
    },
    translate: '0 .3125rem',
  }),
};

export const customPopper = (props: PopperProps): JSX.Element => (
  <Popper
    {...props}
    css={styles.popperStyles}
    placement="bottom-start"
  />
);

// eslint-disable-next-line max-len
const mergeValues = (newOption: SelectOption | string): string => (typeof newOption === 'object' ? newOption.value as unknown as Goals.GoalContextType : newOption as unknown as Goals.GoalContextType);

const TeamAutoCompleteFilter = (): JSX.Element => {
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const {
    teamFilter, setTeamFilter, isLoading,
  } = useGoalsContext();

  useEffect(() => {
    // Wait for next tick to ensure component is mounted
    setTimeout(() => {
      const button = document.querySelector('.MuiAutocomplete-root .MuiIconButton-root');
      if (button instanceof HTMLElement) {
        button.setAttribute('data-test-id', 'goalsTeamsAutocompleteButton');
      }
    }, 0);
  }, []);

  const {
    isAdmin,
  } = useUserPermissions();
  const listScope = isAdmin ? TeamsListScope.AllTeams : TeamsListScope.MyTeams;

  const { data: teamsData } = useGetTeams({
    // we want to get the first page of teams
    page: 0,
    count: 1000, // TODO: Need to make this NOT a predefined number - Should update this to pull everything or change the select box to be a searchfilter or something
    listScope,
  });

  const useQualityOfLifeUpdates = useFeatureFlag('teamsQualityOfLifeUpdates');

  const allTeamsList: SelectOption[] = useMemo(() => {
    const allTeams = teamsData?.response.teams ?? [];

    return allTeams.map((team) => ({
      label: team.name,
      value: team.teamId,
      profileImage: undefined,
      jobTitle: undefined,
      leftIcon: useQualityOfLifeUpdates && team.isFavorited ? <FontAwesomeIcon icon={faStar} color={palette.brand.yellow} /> : undefined,
    }));
  }, [teamsData, useQualityOfLifeUpdates]);

  const teamValues = teamFilter.reduce<SelectOption[]>((result, teamId) => {
    const team = allTeamsList.find((record) => record.value === teamId);

    if (team) {
      result.push(team);
    }

    return result;
  }, []);

  const onTeamChange = (newTeamValue: string[]): void => {
    setTeamFilter(newTeamValue as Goals.GoalContextType[]);
  };

  return (
    <>
      {teamFilter && (
        <div css={styles.teamFilterContainer}>
          <p css={styles.filterLabel()}>Team</p>
          <Autocomplete
            ref={autocompleteRef}
            data-test-id="goalsTeamsFilterAutocomplete"
            css={[
              styles.autocomplete(true),
              styles.autocompleteTags, // fixing issues but causing issues with width and text overflow
              // styles.autoCompleteBorder(teamValues.length > 0),
              styles.styleFix,
            ]}
            PopperComponent={customPopper}
            disabled={isLoading}
            disableCloseOnSelect
            id="goalsTeamsFilter"
            isOptionEqualToValue={(option, value) => option.value === value.value}
            limitTags={-1}
            multiple
            onChange={(_, newValue) => onTeamChange(newValue.map(mergeValues))}
            options={allTeamsList}
            value={teamValues}
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
                label="Any Team"
                inputProps={{
                  ...params.inputProps,
                  'data-test-id': 'goalsTeamsFilterAutocompleteInput',
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
            renderOption={(optionProps: HTMLAttributes<HTMLLIElement>, option: SelectOption, { selected }) => (
              <li
                {...optionProps}
                key={option.value}
              >
                <div
                  css={styles.autocompleteOptionText}
                >
                  <JoshCheckbox checked={selected} data-test-id="autoCompleteFilterCheckbox" />
                  {option.leftIcon && (
                    <div>
                      {option.leftIcon}
                    </div>
                  )}
                  <span>{option.label}</span>
                </div>
              </li>
            )}
          />
        </div>
      )}
    </>
  );
};

export default TeamAutoCompleteFilter;
