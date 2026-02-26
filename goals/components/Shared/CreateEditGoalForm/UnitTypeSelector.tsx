import { Goals } from '@josh-hr/types';
import {
  MouseEvent, useEffect, useMemo, useState,
} from 'react';
import { css } from '@emotion/react';
import { styled, Theme, useTheme } from '@mui/material/styles';
import {
  Control, Controller, useFormContext,
} from 'react-hook-form';
import CurrencyDollarCircleIcon from '~Assets/icons/components/CurrencyDollarCircleIcon';
import PercentIcon from '~Assets/icons/components/PercentIcon';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { useGetMeasurementUnitTypes } from '~Goals/hooks/useGetMeasurementUnitTypes';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import {
  unitTypeOwnershipIds,
  MeasurementUnitOwnershipId,
} from '~Goals/const/types';
import DotIcon from '~Assets/icons/components/DotIcon';
import ToggleButtonGroup, { ToggleButtonOption } from '~Goals/components/Shared/CreateEditGoalForm/Shared/ToggleButtonGroup';
import { DEFAULT_CUSTOM_UNIT_TYPE } from '~Goals/const/defaults';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import useGetGoalMeasurementScaleEnumData from '~Goals/hooks/utils/useGetGoalMeasurementScaleEnumData';
import { useDraftedObjectiveStore } from '~Goals/hooks/aiDrafting/useDraftedObjectiveStore';
import CustomUnitTypePopover from './CustomUnitTypePopover';

const styles = {
  buttonInputIconWrapper: (isCustomDisplayed: boolean) => css({
    flexWrap: isCustomDisplayed ? 'wrap' : 'nowrap',
    minWidth: '13.75rem',
    '.MuiButtonBase-root > span': {
      whiteSpace: 'nowrap',
    },
  }),
  customButton: css({
    justifyContent: 'center',
  }),
  customButtonIcon: css({
    display: 'flex',
  }),
};

const StyledLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacings.small,
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: theme.fontSize.small,
  margin: 0,
}));

const StyledSkeletonLoader = styled(SkeletonLoader)(({ theme }) => ({
  minWidth: '100%',
  height: '2.625rem',
  borderRadius: theme.radius.medium,
}));

interface ViewProps {
  isLoading: boolean,
  control: Control<CreateEditGoalFormValues, Goals.GoalCategory>,
  systemOwnedUnitTypes: ToggleButtonOption[],
  open: boolean,
  popoverId: string,
  anchorEl: HTMLElement | null,
  organizationUserOwnedUnitTypes: Goals.MeasurementUnit[] | undefined,
  currentCustomUnitType: Goals.MeasurementUnit;
  goalTargetValue: Goals.MeasurementScaleMetadataValue['value'];
  closeConfirmationPopover: (displayLabel: string) => void,
  handleConfirmCustomUnitType: (displayLabel: string, labelPositionId: Goals.LabelPositionId, unitId: number) => void,
  handleCustomUnitUnselected: () => void,
  objectivesAllowCustomUnitTypes: boolean,
  defaultDisplayLabel?: string,
}

const View = ({
  isLoading,
  control,
  systemOwnedUnitTypes,
  popoverId,
  open,
  anchorEl,
  organizationUserOwnedUnitTypes,
  currentCustomUnitType,
  goalTargetValue,
  closeConfirmationPopover,
  handleConfirmCustomUnitType,
  handleCustomUnitUnselected,
  objectivesAllowCustomUnitTypes,
  defaultDisplayLabel,
  ...props
}: ViewProps): JSX.Element => (
  <StyledLabel data-test-id="goalUnitTypeSelectorLabel" {...props}>
    <div data-test-id="goalUnitTypeSelectorLabelName">
      Unit
    </div>
    {isLoading && (
      <StyledSkeletonLoader
        variant="rectangular"
        renderComponent={() => <></>}
        {...props}
      />
    )}
    {!isLoading && (
      <>
        <Controller
          control={control}
          name="measurementUnitTypeId"
          render={({
            field: {
              onChange,
              value,
              ref,
            },
          }) => (
            <ToggleButtonGroup
              css={styles.buttonInputIconWrapper(objectivesAllowCustomUnitTypes)}
              aria-label="unit type selector"
              onChange={(_, selectedValue) => {
                if (systemOwnedUnitTypes.find((unitType) => unitType.value === selectedValue)) {
                  handleCustomUnitUnselected();
                }
                return (
                  selectedValue != null
                    ? onChange(selectedValue)
                    : null
                );
              }}
              value={value}
              ref={ref}
              options={systemOwnedUnitTypes}
            />
          )}
        />
        {/**
         * Need to keep this in order to allow component to evaluate if there is
         * a custom displayLabel available. Otherwise Popover will set defaultDisplayLabel
         * to empty string in first render before it is evaluated
        */}
        {defaultDisplayLabel !== undefined && (
          <CustomUnitTypePopover
            popoverId={popoverId}
            open={open}
            anchorEl={anchorEl}
            customUnitTypeOptions={organizationUserOwnedUnitTypes}
            currentUnitType={currentCustomUnitType}
            goalTargetValue={goalTargetValue}
            defaultDisplayLabel={defaultDisplayLabel}
            closeConfirmationPopover={closeConfirmationPopover}
            handleConfirmCustomUnitType={handleConfirmCustomUnitType}
          />
        )}
      </>
    )}
  </StyledLabel>
);

const StyledPercentIcon = styled(PercentIcon)(({ theme }) => ({
  color: theme.palette.text.tertiary,
}));

const StyledCurrencyDollarCircleIcon = styled(CurrencyDollarCircleIcon)(({ theme }) => ({
  color: theme.palette.text.tertiary,
}));

const getUnitIcon = (unitTypeId: number, theme: Theme): JSX.Element => {
  switch (unitTypeId) {
    case 1:
      return (
        <StyledPercentIcon />
      );
    case 2:
      return (
        <StyledCurrencyDollarCircleIcon />
      );
    default:
      return (
        <DotIcon
          sx={{ color: theme.palette.utility.success500, padding: '.0625rem' }}
          fontSize="small"
        />
      );
  }
};

const getUnitDataTestId = (unitTypeId: number): string => {
  switch (unitTypeId) {
    case 1:
      return 'goalsUnitTypeSelectorOptionPercentage';
    case 2:
      return 'goalsUnitTypeSelectorOptionDollar';
    default:
      return 'goalsUnitTypeSelectorOptionCustom';
  }
};

interface UnitTypeSelectorProps {
  handlecustomunittypepayloadchange: (customUnitType: Goals.MeasurementUnit, isCreateNew: boolean) => void,
  initialMeasurementUnitType: number,
}

const UnitTypeSelector = ({
  handlecustomunittypepayloadchange, initialMeasurementUnitType, ...props
}: UnitTypeSelectorProps): JSX.Element => {
  const [currentCustomUnitType, setCurrentCustomUnitType] = useState<Goals.MeasurementUnit>(DEFAULT_CUSTOM_UNIT_TYPE);
  const { control, watch, setValue } = useFormContext<CreateEditGoalFormValues>();
  const { data, isLoading: isLoadingMeasurementUnitTypes } = useGetMeasurementUnitTypes();
  const { contextTargetValueIndex } = useGetGoalMeasurementScaleEnumData();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isLoading] = useSkeletonLoaders(isLoadingMeasurementUnitTypes);
  const objectivesAllowCustomUnitTypes = useFeatureFlag('objectivesAllowCustomUnitTypes');
  const [defaultDisplayLabel, setDefaultDisplayLabel] = useState<string>();
  const { draftedObjective } = useDraftedObjectiveStore();

  const theme = useTheme();

  const customButtonPopoverId = 'customUnitTypePopover';

  const goalTargetValue = watch(`measurementScaleMetadata.${contextTargetValueIndex}.value`);

  useEffect(() => {
    if (!data?.response) return;

    if (!initialMeasurementUnitType) {
      setDefaultDisplayLabel('');
      return;
    }

    const currentUnitType = data?.response.find((unitType) => unitType.id === initialMeasurementUnitType);
    if (draftedObjective && draftedObjective.customUnit !== undefined && draftedObjective.customLabelPosition !== undefined) {
      const unit = {
        id: draftedObjective.measurementUnitTypeId ?? 0,
        displayLabel: draftedObjective.customUnit,
        labelPosition: { id: draftedObjective.customLabelPosition, description: '' },
      };
      setCurrentCustomUnitType(unit);
      setDefaultDisplayLabel(unit.displayLabel);
    } else if (currentUnitType && currentUnitType.ownership?.id !== Number(MeasurementUnitOwnershipId.System)) {
      setCurrentCustomUnitType(currentUnitType);
      setDefaultDisplayLabel(currentUnitType.displayLabel);
    } else {
      setDefaultDisplayLabel('');
    }
  }, [data?.response, defaultDisplayLabel, initialMeasurementUnitType, draftedObjective]);

  const customButton = useMemo(() => {
    const text = currentCustomUnitType.displayLabel !== ''
      ? currentCustomUnitType.displayLabel
      : 'Custom';

    return ({
      'aria-haspopup': true,
      'aria-expanded': Boolean(anchorEl),
      'aria-controls': customButtonPopoverId,
      popoverTarget: customButtonPopoverId,
      alt: 'Create custom unit type',
      defaultValue: currentCustomUnitType.id,
      value: currentCustomUnitType.id,
      text,
      'data-test-id': getUnitDataTestId(currentCustomUnitType.id),
      onClick: (event: MouseEvent<HTMLElement>) => {
        showCustomUnitTypePopover(event);
      },
      buttonCss: styles.customButton,
      iconRemSize: 0.625,
      icon: getUnitIcon(currentCustomUnitType.id, theme),
      iconCss: styles.customButtonIcon,
    });
  }, [
    currentCustomUnitType.displayLabel,
    currentCustomUnitType.id,
    anchorEl,
    theme,
  ]);

  const systemOwnedUnitTypes: ToggleButtonOption[] = useMemo(() => {
    const tmp = data?.response.reduce<ToggleButtonOption[]>((acc, unitType) => {
      if (unitType.ownership?.id === unitTypeOwnershipIds.System) {
        acc.push({
          value: unitType.id,
          icon: getUnitIcon(unitType.id, theme),
          'data-test-id': getUnitDataTestId(unitType.id),
        });
      }
      return acc;
    }, []) ?? [];

    if (objectivesAllowCustomUnitTypes) tmp.push(customButton);

    return tmp;
  }, [
    customButton,
    data?.response,
    objectivesAllowCustomUnitTypes,
    theme,
  ]);

  const organizationUserOwnedUnitTypes = useMemo((): Goals.MeasurementUnit[] | undefined => {
    if (data) {
      return data.response.filter((unitType) => unitType.ownership?.id !== unitTypeOwnershipIds.System)
        .sort((a, b) => a.displayLabel.localeCompare(b.displayLabel)) ?? [];
    }
    return undefined;
  }, [data]);

  const showCustomUnitTypePopover = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const closeConfirmationPopover = (displayLabel: string, unitId?: number): void => {
    if (displayLabel === '') setValue('measurementUnitTypeId', systemOwnedUnitTypes[0].value as number);
    if (unitId) setValue('measurementUnitTypeId', unitId);
    setAnchorEl(null);
  };

  const isNewCustomUnitType = (displayLabel: string, labelPositionId: Goals.LabelPositionId): boolean => {
    if (displayLabel === '') return false;

    if (!organizationUserOwnedUnitTypes) return true;

    const isExisting = organizationUserOwnedUnitTypes?.some((unitType) => unitType.displayLabel === displayLabel
      && unitType.labelPosition.id === labelPositionId);

    return !isExisting;
  };

  const handleConfirmCustomUnitType = (displayLabel: string, labelPositionId: Goals.LabelPositionId, unitId: number): void => {
    const isPreviousCustomUnit = displayLabel === currentCustomUnitType.displayLabel
      && labelPositionId === currentCustomUnitType.labelPosition.id;

    const createNewCustomUnitType = isNewCustomUnitType(displayLabel, labelPositionId);

    if (isPreviousCustomUnit) {
      closeConfirmationPopover(displayLabel);
      return;
    }

    const updatedCustomUnitType = {
      ...currentCustomUnitType,
      id: unitId,
      displayLabel,
      labelPosition: {
        id: labelPositionId,
        description: labelPositionId === Goals.LabelPositionId.Prefix ? 'Prefix' : 'Suffix',
      },
    };
    setCurrentCustomUnitType(updatedCustomUnitType);
    handlecustomunittypepayloadchange(updatedCustomUnitType, createNewCustomUnitType);
    closeConfirmationPopover(displayLabel, unitId);
  };

  const handleCustomUnitUnselected = (): void => {
    handlecustomunittypepayloadchange(DEFAULT_CUSTOM_UNIT_TYPE, false);
  };

  const hookProps = {
    isLoading,
    control,
    systemOwnedUnitTypes,
    popoverId: customButtonPopoverId,
    open: Boolean(anchorEl),
    anchorEl,
    organizationUserOwnedUnitTypes,
    currentCustomUnitType,
    goalTargetValue,
    closeConfirmationPopover,
    handleConfirmCustomUnitType,
    handleCustomUnitUnselected,
    objectivesAllowCustomUnitTypes,
    defaultDisplayLabel,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default UnitTypeSelector;
