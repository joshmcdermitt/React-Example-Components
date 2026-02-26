import { ComponentProps, useMemo } from 'react';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { TeamsListScope } from '~People/components/Teams/const/types';
import { useGetTeams } from '~People/components/Teams/hooks/useGetTeams';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { styled } from '@mui/material';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { palette } from '~Common/styles/colors';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import Dropdown, { DropdownItem } from '../Shared/Dropdown/Dropdown';

const styles = {
  dropdown: css({
    maxWidth: '17.875rem',
    '.MuiSelect-listbox': {
      minWidth: '17.875rem',
    },
    '.MuiSelect-popper': {
      maxWidth: '17.875rem',
    },
  }),
};

const StyledSkeletonLoader = styled(SkeletonLoader)(({ theme }) => ({
  minWidth: '12.5rem',
  height: '2.625rem',
  borderRadius: theme.radius.medium,
}));

interface ViewProps extends ComponentProps<'div'> {
  isLoading: boolean,
  teamsList: DropdownItem<string>[],
  required?: boolean,
}

const View = ({
  isLoading,
  teamsList,
  required,
  ...props
}: ViewProps): JSX.Element => (
  <div {...props}>
    {isLoading && (
      <StyledSkeletonLoader
        variant="rectangular"
        renderComponent={() => <></>}
      />
    )}
    {!isLoading && (
      <Dropdown
        css={styles.dropdown}
        name="context.contextId"
        label="Team"
        dataTestId="goalTypeSelectorTeamSelect"
        placeholder="Select a team"
        options={teamsList}
        required={required}
      />
    )}
  </div>
);

type TeamSelectDropdownProps = Omit<ViewProps, 'teamsList' | 'isLoading'>;

const TeamSelectDropdown = ({ required, ...props }: TeamSelectDropdownProps): JSX.Element => {
  const { isAdmin } = useUserPermissions();
  const useQualityOfLifeUpdates = useFeatureFlag('teamsQualityOfLifeUpdates');

  const listScope = isAdmin ? TeamsListScope.AllTeams : TeamsListScope.MyTeams;

  const { data: teamsData, isLoading: areTeamsLoading } = useGetTeams({
    page: 0,
    count: 1000, // REFACTOR: Need to make this NOT a predefined number - Should update this to pull everything or change the select box to be a searchfilter or something
    listScope,
  });

  const [isLoading] = useSkeletonLoaders(areTeamsLoading);

  const teamsList = useMemo(() => (teamsData?.response.teams.map((team) => ({
    value: team.teamId,
    text: team.name,
    leftIcon: useQualityOfLifeUpdates && team.isFavorited ? <FontAwesomeIcon icon={faStar} color={palette.brand.yellow} /> : undefined,
  })) ?? []), [teamsData?.response.teams, useQualityOfLifeUpdates]);

  const hookProps = {
    isLoading,
    teamsList,
    required,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default TeamSelectDropdown;
