import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import { memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import useGetCreateGoalPermissions from '~Goals/hooks/useGetCreateGoalPermissions';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import useGetGoalOptionScopeItems, { GoalOptionScopeItem } from '~Goals/hooks/utils/useGetGoalOptionScopeItems';
import TeamSelectDropdown from './TeamSelectDropdown';
import { GoalScopeToggleButtons } from './GoalScopeToggleButtons';

const StyledGoalScopeSelectContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem 1.5rem',
});

const StyledSkeletonLoader = styled(SkeletonLoader)(({ theme }) => ({
  minWidth: '12.5rem',
  height: '2.625rem',
  borderRadius: theme.radius.medium,
}));

const StyledTeamSelectDropdown = styled(TeamSelectDropdown)({
  whiteSpace: 'nowrap',
  width: 'min-content',
  maxWidth: '18.75rem',
});

const StyledLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacings.small,
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: theme.fontSize.small,
  margin: 0,
}));

interface ViewProps {
  isLoading: boolean,
  formattedGoalContextTypeOptions: GoalOptionScopeItem[],
  showTeamsSelect: boolean,
}

const View = memo(({
  isLoading,
  formattedGoalContextTypeOptions,
  showTeamsSelect,
  ...props
}: ViewProps): JSX.Element => {
  const { control } = useFormContext<CreateEditGoalFormValues>();

  return (
    <StyledGoalScopeSelectContainer
      data-testid="goalScopeSelector"
      {...props}
    >
      <StyledLabel
        data-testid="goalScopeSelectorLabel"
      >
        <div data-test-id="goalScopeSelectorLabelName">Scope</div>
        {isLoading && (
          <StyledSkeletonLoader
            variant="rectangular"
            renderComponent={() => <></>}
          />
        )}
        {!isLoading && (
          <GoalScopeToggleButtons
            control={control}
            options={formattedGoalContextTypeOptions}
          />
        )}
      </StyledLabel>
      {showTeamsSelect && (
        <StyledTeamSelectDropdown required />
      )}
    </StyledGoalScopeSelectContainer>
  );
}, (prevProps, nextProps) => (
  prevProps.isLoading === nextProps.isLoading
  && prevProps.showTeamsSelect === nextProps.showTeamsSelect
  && prevProps.formattedGoalContextTypeOptions === nextProps.formattedGoalContextTypeOptions
));

interface GoalScopeSelectorProps {
  allowedContextTypes?: Goals.GoalContextType[],
}

const GoalScopeSelector = ({
  allowedContextTypes = [Goals.GoalContextType.Personal, Goals.GoalContextType.Team, Goals.GoalContextType.Organization],
  ...props
}: GoalScopeSelectorProps): JSX.Element => {
  const { watch } = useFormContext<CreateEditGoalFormValues>();
  const { allowedGoalOptionScopes, isLoading: areCreateGoalPermissionsLoading } = useGetCreateGoalPermissions();
  const { optionScopeItems } = useGetGoalOptionScopeItems();

  const selectedContextType = watch('context.contextType');

  const [isLoading] = useSkeletonLoaders(areCreateGoalPermissionsLoading);

  const formattedGoalContextTypeOptions = useMemo(
    () => optionScopeItems.reduce<GoalOptionScopeItem[]>((acc, goalOptionScope) => {
      if (
        allowedGoalOptionScopes.includes(goalOptionScope.value)
        && allowedContextTypes.includes(goalOptionScope.value)
      ) {
        acc.push(goalOptionScope);
      }
      return acc;
    }, []),
    [allowedGoalOptionScopes, allowedContextTypes, optionScopeItems],
  );

  const showTeamsSelect = selectedContextType === Goals.GoalContextType.Team;

  const hookProps = { isLoading, formattedGoalContextTypeOptions, showTeamsSelect };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default GoalScopeSelector;
