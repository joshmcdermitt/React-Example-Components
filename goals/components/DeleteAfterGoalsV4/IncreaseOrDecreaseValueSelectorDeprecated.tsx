import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import { styled } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { CreateEditStatusUpdateFormValues } from '~Goals/schemata/CreateEditGoalStatusUpdateSchema';
import { palette } from '~Common/styles/colors';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import useGetGoalMeasurementScaleTypeCategory, { GoalMeasurementScaleTypeCategory } from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import GoalMeasurementValue from './ResolveDependencies/GoalMeasurementValue';
import CurrentNumberInput from '../CreateEditGoalStatusUpdateModal/CurrentNumberInput';
import GoalValueFormatted from './ResolveDependencies/GoalValueFormattedDeprecated';

const styles = {
  aboveBelowContainer: css({
    display: 'flex',
    gap: '0rem',
    flexDirection: 'column',
  }),
  newValueLabel: css({
    color: '#414651',
    fontSize: '.75rem',
    fontWeight: '400',
  }),
  newValueInput: css({
    display: 'flex',
    flexDirection: 'row',
    gap: '.25rem',
  }),
  progressContainer: css({
    width: '16.625rem',
  }),
};

const StyledCurrentNumberInput = styled(CurrentNumberInput)({
  fontSize: '.875rem',
  fontWeight: '500',
  '.goalsCurrentNumber, & input': {
    backgroundColor: palette.neutrals.cardBackground,
  },
});

const StyledDisplayLabelContainer = styled('div')<{ $disableGrow?: boolean, $isVisible?: boolean }>(({ $disableGrow, $isVisible = true }) => ({
  display: $isVisible ? 'flex' : 'none',
  alignItems: 'center',
  gap: '.5rem',
  flexGrow: $disableGrow ? 'unset' : 1,
}));

const StyledProgressContainer = styled('div')<{ $disableGrow?: boolean, $isVisible?: boolean }>(({ $disableGrow, $isVisible = true }) => ({
  display: $isVisible ? 'flex' : 'none',
  alignItems: 'center',
  gap: '.5rem',
  marginTop: '2rem',
  flexGrow: $disableGrow ? 'unset' : 1,
}));

const StyledIncreaseOrDecreaseValueSelector = styled('div')({
  display: 'flex',
  gap: '.5rem',
  alignItems: 'flex-start',
});

interface ViewProps {
  defaultValue: number,
  status: Goals.GoalStatus,
  completionPercentage: number,
  measurementScale: Goals.MeasurementScale,
  adjustedWidth: number,
  NUMERIC_PERIOD_REGEX: RegExp,
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
  objectivesUnitOfMeasurePhase3: boolean,
}

const View = ({
  status,
  completionPercentage,
  measurementScale,
  adjustedWidth,
  goalMeasurementScaleTypeCategory,
  objectivesUnitOfMeasurePhase3,
  ...props
}: ViewProps): JSX.Element => (
  <StyledIncreaseOrDecreaseValueSelector {...props}>
    {goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.AboveBelow
      && objectivesUnitOfMeasurePhase3
      && (
        <div css={styles.aboveBelowContainer}>
          <div css={styles.newValueLabel}>
            New Value
          </div>
          <div css={styles.newValueInput}>
            <StyledDisplayLabelContainer
              $disableGrow
              $isVisible={measurementScale.measurementUnitType.labelPosition.id === Goals.LabelPositionId.Prefix}
            >
              {measurementScale.measurementUnitType.displayLabel}
            </StyledDisplayLabelContainer>
            <StyledCurrentNumberInput
              sx={{ maxWidth: `${adjustedWidth * 2}ch` }}
              required
              isLabelHidden
            />
            <StyledDisplayLabelContainer
              $disableGrow
              $isVisible={measurementScale.measurementUnitType.labelPosition.id === Goals.LabelPositionId.Suffix}
            >
              {measurementScale.measurementUnitType.displayLabel}
            </StyledDisplayLabelContainer>
          </div>
        </div>
      )}
    {goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.IncreaseDecrease && (
      <>
        <StyledCurrentNumberInput
          sx={{ maxWidth: `${adjustedWidth * 2}ch` }}
          required
        />
        <StyledProgressContainer>
          <p>/</p>
          {/* This is for /objectives/id page update status modal */}
          <GoalValueFormatted
            measurementScale={measurementScale}
            goalValueType={Goals.MeasurementScaleMetadataTypeId.TargetValue}
          />
          <GoalMeasurementValue
            completionPercentage={completionPercentage}
            status={status}
            isAchieved={false}
            measurementScale={measurementScale}
            isCurrentValueVisible={false}
            css={styles.progressContainer}
          />
        </StyledProgressContainer>
      </>
    )}
  </StyledIncreaseOrDecreaseValueSelector>
);

type IncreaseOrDecreaseValueSelectorProps = Pick<ViewProps, 'measurementScale'>;

const IncreaseOrDecreaseValueSelector = ({
  measurementScale,
  ...props
}: IncreaseOrDecreaseValueSelectorProps): JSX.Element => {
  const objectivesUnitOfMeasurePhase3 = useFeatureFlag('objectivesUnitOfMeasurePhase3');

  const { getValues, watch } = useFormContext<CreateEditStatusUpdateFormValues>();
  const { goalMeasurementScaleTypeCategory } = useGetGoalMeasurementScaleTypeCategory({ measurementScaleTypeId: measurementScale.type.id });

  const currentValue = watch('value') ?? 0;
  const defaultValue = getValues('value') ?? 0;
  const status = watch('status');

  const initialValue = measurementScale.metadataValues?.[0].value as number ?? 0; // REFACTOR: Use measurementEnums, dynamic?
  const targetValue = measurementScale.metadataValues?.[1].value as number ?? 0;

  const targetLength = String(targetValue).length;
  const initialLength = String(initialValue).length;
  // We Want to set the width to the legnth of the target value unless it's less than 4
  const minWidth = Math.max(4, targetLength, initialLength);
  const adjustedWidth = minWidth === 4 ? 4 : minWidth + 2;

  const completionPercentage = useMemo(() => (
    // Rounds to 2 decimal places
    Math.round(100 * ((currentValue - initialValue) / (targetValue - initialValue)) * 100) / 100
  ), [currentValue, initialValue, targetValue]);

  const NUMERIC_PERIOD_REGEX = /^[0-9.]+$/;

  const hookProps = {
    defaultValue,
    status,
    completionPercentage,
    measurementScale,
    adjustedWidth,
    NUMERIC_PERIOD_REGEX,
    goalMeasurementScaleTypeCategory,
    objectivesUnitOfMeasurePhase3,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default IncreaseOrDecreaseValueSelector;
