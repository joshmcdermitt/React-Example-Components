import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { SelectChangeEvent, Skeleton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SelectOption } from '~Common/components/PeopleTagPicker/usePeopleTagPicker';
import { forMobileObject } from '~Common/styles/mixins';
import { Select } from '~Common/V3/components/uncontrolled';
import { DEFAULT_TEAM_ID } from '~Goals/const/defaults';
import { FORM_COMPONENT_STYLES } from '~Goals/const/styles';
import useGetCreateGoalPermissions from '~Goals/hooks/useGetCreateGoalPermissions';
import { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';
import useGetGoalOptionTypeItems from '~Goals/hooks/utils/useGetGoalOptionScopeItems';
import NoTeamsEmptyState from './NoTeamsEmptyState';

const styles = {
  ...FORM_COMPONENT_STYLES,
  goalType: css({
    gridColumn: 'span 2',
  }, forMobileObject({
    gridColumn: 'span 4',
  })),
  teamContainer: css({
    gridColumn: 'span 2',
  }, forMobileObject({
    gridColumn: 'span 4',
  })),
  teamSelect: css({
    width: '100%',
  }),
  icon: css({
    marginLeft: '.5rem',
  }),
  teamNote: css({
    marginTop: '.5rem',
  }),
  menuItem: css({
    maxWidth: '26rem !important',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: 'block',
  }),
  additionalInfo: css({
    gap: '1.5rem',
  }),
};

interface GoalOptionType {
  value: Goals.GoalContextType,
  text: string,
  disabled: boolean,
}

interface ViewProps {
  isEdit: boolean,
  areTeamsLoading: boolean,
  teamsList: SelectOption[],
  selectedGoalType: Goals.GoalContextType | undefined,
  selectedTeamId: string | undefined,
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  formattedGoalOptionTypes: GoalOptionType[],
}

const View = ({
  isEdit,
  areTeamsLoading,
  teamsList,
  selectedGoalType,
  selectedTeamId,
  formContext,
  formattedGoalOptionTypes,
}: ViewProps): JSX.Element => (
  <>
    {!selectedGoalType && (
      <Skeleton
        css={styles.goalType}
        variant="rectangular"
        width="100%"
        height={80}
      />
    )}
    {selectedGoalType && (
      <Select
        containerStyles={styles.goalType}
        id="type"
        name="contextType"
        onChange={(event: SelectChangeEvent<Goals.GoalContextType>) => {
          formContext.setValue('context.contextType', event.target.value as Goals.GoalContextType);
          formContext.setValue('context.contextId', DEFAULT_TEAM_ID);
          formContext.setValue('context.contextName', undefined);
        }}
        defaultValue={selectedGoalType}
        label="Type"
        required
      >
        {formattedGoalOptionTypes.map((goalOptionType) => (
          <MenuItem
            key={goalOptionType.value}
            value={goalOptionType.value}
            disabled={goalOptionType.disabled}
          >
            {goalOptionType.text}
          </MenuItem>
        ))}
      </Select>
    )}
    {!areTeamsLoading && selectedGoalType === Goals.GoalContextType.Team && (
      <div css={styles.teamContainer}>
        <Select
          containerStyles={styles.teamSelect}
          id="team"
          name="team"
          onChange={(event) => {
            formContext.setValue('context.contextId', event.target.value);
          }}
          defaultValue={selectedTeamId}
          label="Team"
          required
          showRequiredIcon
          disabled={teamsList.length === 0}
        >
          <MenuItem
            key={DEFAULT_TEAM_ID}
            value={DEFAULT_TEAM_ID}
          >
            Select Team
          </MenuItem>
          {teamsList.map((team) => (
            <MenuItem
              css={styles.menuItem}
              key={team.value}
              value={team.value}
            >
              {team.label}
            </MenuItem>
          ))}
        </Select>
        {!isEdit && teamsList.length === 0 && (
          <NoTeamsEmptyState />
        )}
      </div>
    )}
  </>
);

interface GoalTypeSelectionProps extends Omit<
  ViewProps,
  'selectedGoalType'
  | 'selectedTeamId'
  | 'formattedGoalOptionTypes'
  | 'handleObjTypeChange'
> {
  allowedContextTypes?: Goals.GoalContextType[],
}

const GoalTypeSelection = ({
  formContext,
  allowedContextTypes = [Goals.GoalContextType.Personal, Goals.GoalContextType.Team, Goals.GoalContextType.Organization],
  ...props
}: GoalTypeSelectionProps): JSX.Element => {
  const { allowedGoalOptionScopes } = useGetCreateGoalPermissions();
  const { optionScopeItems } = useGetGoalOptionTypeItems();

  const formattedGoalOptionTypes = useMemo(() => optionScopeItems.map((goalOptionType) => {
    let disabled = false;

    if (!allowedGoalOptionScopes.includes(goalOptionType.value) || !allowedContextTypes.includes(goalOptionType.value)) {
      disabled = true;
    }

    return {
      ...goalOptionType,
      disabled,
    };
  }), [allowedGoalOptionScopes, allowedContextTypes, optionScopeItems]);

  const selectedGoalType = formContext.watch('context.contextType');
  const selectedTeamId = formContext.watch('context.contextId');

  const hookProps = {
    selectedGoalType,
    selectedTeamId,
    formContext,
    formattedGoalOptionTypes,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default GoalTypeSelection;
