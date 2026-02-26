import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import { SelectChangeEvent, styled } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import { UseFormReturn } from 'react-hook-form';
import {
  AchievedNotToggle,
  AchievedNotToggleType,
  ClosedGoalStatuses,
  OpenGoalStatuses,
} from '~Goals/const/types';
import { Select } from '~Common/V3/components/uncontrolled';
import { palette } from '~Common/styles/colors';
import {
  GoalMeasurementScaleTypeCategory,
  GoalMeasurementScaleTypeSubCategory,
} from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import { CreateEditStatusUpdateFormValues } from '~Goals/schemata/CreateEditGoalStatusUpdateSchema';
import { MultiRadio } from '~Common/V3/components/uncontrolled/MultiRadio';
import GoalStatusIndicatorIcon from '../Shared/GoalStatus/GoalStatusIndicatorIcon';
import GoalStatusText from '../Shared/GoalStatus/GoalStatusText';
import IncreaseOrDecreaseValueSelector from './IncreaseOrDecreaseValueSelector';

const StyledSelect = styled(Select)({
  '.MuiSelect-select, .MuiInputBase-input': {
    backgroundColor: palette.neutrals.cardBackground,
  },
});

const StyledMultiRadio = styled(MultiRadio)({
  display: 'flex',
});

const StyledGoalStatusContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.medium,
}));

const StyledGoalStatusText = styled(GoalStatusText)(({ theme }) => ({
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
}));

const styles = {
  radioStyles: css({
    width: 'unset',
    alignItems: 'flex-start',
    '& .MuiFormLabel-root': {
      display: 'none',
    },
    '& .MuiFormGroup-root': {
      width: 'unset',
      gap: '8px 24px',
    },
    '& .MuiFormControlLabel-root': {
      display: 'flex',
      whiteSpace: 'nowrap',
      padding: '0px 8px',
      margin: '0px',
      gap: '6px',
      border: 'none',
      backgroundColor: 'transparent',
    },
  }),
};

interface RadioButtonItem {
  name: string,
  value: AchievedNotToggleType,
}

interface ViewProps {
  formContext: UseFormReturn<CreateEditStatusUpdateFormValues>,
  canComplete: boolean,
  goal: Goals.GoalV4 | Goals.GoalV4Cascading,
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
  radioButtonOptions: RadioButtonItem[],
  onStatusChanged: (value: Goals.GoalStatus) => void,
  onAchievedChanged: (value: string) => void,
}

const View = ({
  formContext,
  canComplete,
  goal,
  goalMeasurementScaleTypeCategory,
  radioButtonOptions,
  onStatusChanged,
  onAchievedChanged,
}: ViewProps): JSX.Element => (
  <>
    <StyledSelect
      name="status"
      defaultValue={Goals.GoalStatus[goal.currentStatusUpdate.status as keyof typeof Goals.GoalStatus] ?? formContext.getValues('status')}
      value={formContext.watch('status')}
      required
      onChange={(e: SelectChangeEvent<Goals.GoalStatus | unknown>): void => {
        onStatusChanged(e.target.value as Goals.GoalStatus);
      }}
    >
      <ListSubheader>Open</ListSubheader>
      {OpenGoalStatuses.map((statusOption) => (
        <MenuItem
          key={statusOption}
          value={statusOption}
        >
          <StyledGoalStatusContainer>
            <GoalStatusIndicatorIcon
              status={statusOption}
              size={12}
            />
            <StyledGoalStatusText
              status={statusOption}
            />
          </StyledGoalStatusContainer>
        </MenuItem>
      ))}
      {canComplete && [
        <Divider key="divider" />,
        <ListSubheader key="list-subheader">Closed</ListSubheader>,
        ClosedGoalStatuses.map((statusOption) => (
          <MenuItem
            key={statusOption}
            value={statusOption}
          >
            <StyledGoalStatusContainer>
              <GoalStatusIndicatorIcon
                status={statusOption}
                size={12}
              />
              <StyledGoalStatusText
                status={statusOption}
              />
            </StyledGoalStatusContainer>
          </MenuItem>
        )),
      ]}
    </StyledSelect>
    {goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.Achieved && (
      <StyledMultiRadio
        name="isAchieved"
        defaultValue={goal.currentStatusUpdate.isAchieved as boolean}
        value={formContext.watch('isAchieved') ?? goal.currentStatusUpdate.isAchieved as boolean}
        radios={radioButtonOptions}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          onAchievedChanged(e.target.value);
        }}
        radioStyles={styles.radioStyles}
      />
    )}
    {(goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.IncreaseDecrease
      || goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.AboveBelow
    )
      && (
        <IncreaseOrDecreaseValueSelector
          measurementScale={goal.measurementScale}
          statusUpdate={goal.currentStatusUpdate}
        />
      )}
  </>
);

interface StatusUpdateSelectorsProps {
  onStatusChanged: (value: Goals.GoalStatus) => void;
  onAchievedChanged: (value: string) => void;
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory;
  goal: Goals.GoalV4 | Goals.GoalV4Cascading;
  canComplete: boolean;
  formContext: UseFormReturn<CreateEditStatusUpdateFormValues>;
}

const StatusUpdateSelectors = ({
  onStatusChanged,
  onAchievedChanged,
  goalMeasurementScaleTypeCategory,
  goal,
  canComplete,
  formContext,
}: StatusUpdateSelectorsProps): JSX.Element => {
  const radioButtonOptions = [
    { name: `${GoalMeasurementScaleTypeSubCategory.NotAchieved}`, value: AchievedNotToggle.NotAchieved },
    { name: `${GoalMeasurementScaleTypeSubCategory.Achieved}`, value: AchievedNotToggle.Achieved },
  ];

  const hookProps = {
    onStatusChanged,
    onAchievedChanged,
    formContext,
    canComplete,
    goal,
    goalMeasurementScaleTypeCategory,
    radioButtonOptions,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export default StatusUpdateSelectors;
