/* eslint-disable import/no-unresolved */
import { ComponentProps, useCallback, useMemo } from 'react';
import { Goals } from '@josh-hr/types';
import { useGetMeasurementScaleTypes } from '~Goals/hooks/useGetMeasurementScaleTypes';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { styled } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import {
  getGoalMeasurementScaleTypeCategory,
  GoalMeasurementScaleTypeCategory,
} from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import { MeasurementScaleType } from '~Goals/const/types';
import { defaultMeasurementScaleMetadata, defaultMeasurementUnitTypeId } from '~Goals/utils/getDefaultGoalValues';
import useGetGoalMeasurementScaleEnumData from '~Goals/hooks/utils/useGetGoalMeasurementScaleEnumData';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import Dropdown, { DropdownItem } from './Shared/Dropdown/Dropdown';

const StyledSkeletonLoader = styled(SkeletonLoader)(({ theme }) => ({
  minWidth: '15.625rem',
  height: '2.625rem',
  borderRadius: theme.radius.medium,
}));

const StyledDropdownContainer = styled('div')(() => ({
  width: '15.625rem',
  '& .MuiSelect-listbox': {
    minWidth: 'unset',
    width: '15.625rem',
  },
}));

interface ViewProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  isLoading: boolean,
  onChange: (newScaleTypeId: number) => void,
  options: DropdownItem<number>[],
}

const View = ({
  options,
  isLoading,
  onChange,
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
      <StyledDropdownContainer>
        <Dropdown
          name="measurementScaleTypeId"
          label="Measurement type"
          dataTestId="goalMeasurementTypeSelect"
          placeholder="Select a measurement type"
          options={options}
          onChange={onChange}
        />
      </StyledDropdownContainer>
    )}
  </div>
);

const excludedMeasurementScaleTypes: number[] = [
  MeasurementScaleType.KeepAbove,
  MeasurementScaleType.KeepBelow,
];

interface MeasurementTypeSelectorProps {
  previousCategory: GoalMeasurementScaleTypeCategory,
}

const MeasurementTypeSelector = ({ previousCategory, ...props }: MeasurementTypeSelectorProps): JSX.Element => {
  const objectivesUnitOfMeasurePhase3 = useFeatureFlag('objectivesUnitOfMeasurePhase3');

  const { data, isLoading: isLoadingMeasurementUnitTypes } = useGetMeasurementScaleTypes();
  const { setValue, getValues } = useFormContext<CreateEditGoalFormValues>();
  const { measurementScaleTypes, contextInitialValueIndex, contextTargetValueIndex } = useGetGoalMeasurementScaleEnumData();

  const [isLoading] = useSkeletonLoaders(isLoadingMeasurementUnitTypes);

  // FEATURE: Remove after UoM Release
  const currentTypeOptions = objectivesUnitOfMeasurePhase3
    ? measurementScaleTypes
    : measurementScaleTypes.filter((item) => !excludedMeasurementScaleTypes.includes(item));

  const options = useMemo(() => data?.response.reduce<DropdownItem<number>[]>((acc, unitType) => {
    if (currentTypeOptions.includes(unitType.id)) {
      acc.push({
        value: unitType.id,
        text: unitType.description,
      });
    }
    return acc;
  }, []) ?? [], [currentTypeOptions, data?.response]);

  const defaultMetadata: Goals.MeasurementScaleMetadataValue[] = defaultMeasurementScaleMetadata;
  const defaultMetadataSwitch: Goals.MeasurementScaleMetadataValue[] = useMemo(() => [
    { ...defaultMetadata[0], value: defaultMetadata[1].value },
    { ...defaultMetadata[1], value: defaultMetadata[0].value },
  ], [defaultMetadata]);

  const onChange = useCallback((newScaleTypeId: number): void => {
    if (data) {
      const newScaleType = data.response.find((type) => type.id === newScaleTypeId)?.id;

      if (newScaleType) {
        const newGoalMeasurementScaleTypeCategory = getGoalMeasurementScaleTypeCategory(newScaleType);
        const [initialValue, targetValue] = getValues([
          `measurementScaleMetadata.${contextInitialValueIndex}.value`,
          `measurementScaleMetadata.${contextTargetValueIndex}.value`,
        ]);

        // Checks previous selection to update/reset metadata
        switch (newGoalMeasurementScaleTypeCategory) {
          case GoalMeasurementScaleTypeCategory.IncreaseDecrease:
            if (previousCategory !== GoalMeasurementScaleTypeCategory.IncreaseDecrease) {
              if (newScaleType === MeasurementScaleType.IncreaseTo) {
                setValue('measurementScaleMetadata', defaultMetadata);
              } else {
                setValue('measurementScaleMetadata', defaultMetadataSwitch);
              }
              setValue('measurementUnitTypeId', defaultMeasurementUnitTypeId);
            } else {
              setValue(`measurementScaleMetadata.${contextInitialValueIndex}.value`, targetValue);
              setValue(`measurementScaleMetadata.${contextTargetValueIndex}.value`, initialValue);
            }
            break;
          case GoalMeasurementScaleTypeCategory.Achieved:
            setValue('measurementScaleMetadata', undefined);
            setValue('measurementUnitTypeId', undefined);
            break;
          case GoalMeasurementScaleTypeCategory.AboveBelow:
            if (previousCategory !== GoalMeasurementScaleTypeCategory.AboveBelow) {
              setValue('measurementScaleMetadata', defaultMetadata);
              setValue('measurementUnitTypeId', defaultMeasurementUnitTypeId);
            }
            break;
          default:
            break;
        }
      }
    }
  }, [
    data,
    previousCategory,
    setValue,
    getValues,
    defaultMetadata,
    defaultMetadataSwitch,
    contextInitialValueIndex,
    contextTargetValueIndex,
  ]);

  const hookProps = {
    options,
    isLoading,
    onChange,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default MeasurementTypeSelector;
