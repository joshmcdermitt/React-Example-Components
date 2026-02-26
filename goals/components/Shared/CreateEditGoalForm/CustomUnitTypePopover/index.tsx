import Popover from '@mui/material/Popover';
import {
  ChangeEvent, SyntheticEvent, useEffect, useMemo, useState,
} from 'react';
import { css } from '@emotion/react';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { AutoCompleteFreeForm } from '~Common/V3/components/AutoCompleteFreeForm';
import { Goals } from '@josh-hr/types';
import { faXmark } from '@fortawesome/pro-light-svg-icons';
import { AutoCompleteOption } from '~Goals/const/types';
import { MAX_CUSTOM_UNIT_TYPE_LENGTH } from '~Goals/const';
import { MultiRadio } from '~Common/V3/components/MultiRadio';
import { palette } from '~Common/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomLabelPreview from './CustomLabelPreview';
import ShouldConfirmButton from '../../ShouldConfirmButton';

const styles = {
  popoverContainer: css({
    '.MuiPaper-root': {
      padding: '1.25rem 0rem',
      width: '19rem',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      rowGap: '.625rem',
    },
    '.MuiPopover-paper': {
      border: '.0625rem solid #E9EAEB',
      borderRadius: '.75rem',
      // eslint-disable-next-line max-len
      boxShadow: '0rem 1.25rem 1.5rem -0.25rem rgba(10, 13, 18, 0.08), 0rem .5rem .5rem -.25rem rgba(10, 13, 18, 0.03), 0rem .1875rem .1875rem -0.0938rem rgba(10, 13, 18, 0.04)',
    },
    rowGap: '.625rem',
  }),
  banner: css({
    color: '#414651',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    fontWeight: 600,
    padding: '0rem 1.5rem',
    'h2.MuiTypography-root': {
      fontSize: '.875rem',
      fontWeight: 600,
    },
  }),
  main: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.625rem',
  }),
  closeButton: css({
    padding: '.5rem',
  }),
  closeIcon: css({
  }),
  preview: css({
    color: '#717680', // REFACTOR: update branding colors
    fontSize: '.875rem',
    fontWeight: 600,
    width: '100%',
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB', // REFACTOR: update branding colors
  }),
  autoCompleteOverrides: css({
    '.MuiAutocomplete-root': {
      display: 'flex',
      width: '100%',
    },
    '.MuiFormControl-root': {
      border: '.0625rem solid transparent',
      borderRadius: '.5rem',
    },
    '.MuiOutlinedInput-root': {
      padding: '0rem 1.5rem',
    },
    '.MuiFormLabel-filled': {
      color: palette.neutrals.gray500,
      fontWeight: 400,
      left: '.1rem',
      letterSpacing: '.0313rem',
      position: 'absolute',
      top: '1.25rem',
      width: '150%',
    },
    input: {
      border: '.0625rem solid #D5D7DA',
      borderRadius: '.5rem',
      height: 'auto',
      color: '#181D27',
      fontSize: '1rem',
      fontWeight: 400,
      marginTop: 'unset',
      lineHeight: '1.5rem',
    },
    '& .MuiAutocomplete-inputRoot': {
      backgroundColor: palette.neutrals.white,
      height: 'auto',
    },
    '.MuiAutocomplete-listbox': {
      maxHeight: '12.5rem',
    },
    '.MuiPaper-root .MuiPaper-elevation': {
      width: '80% !important',
      justifySelf: 'center',
    },
  }),
  radioButtons: css({
    margin: '0rem 1.5rem',
    display: 'flex',
  }),
  confirmButton: css({
    display: 'flex',
    margin: '.5rem 1.5rem 0rem',
    padding: '.625rem .875rem',
    borderRadius: '.5rem',
    border: '.0625rem solid #D5D7DA', // REFACTOR: update branding colors
    justifyContent: 'center',
  }),
  radioStyles: css({
    width: 'unset',
    alignItems: 'flex-start',
    '& .MuiFormLabel-root': {
      display: 'none',
    },
    '& .MuiFormGroup-root': {
      width: 'unset',
      gap: '.5rem 1.5rem',
    },
    '& .MuiFormControlLabel-root': {
      display: 'flex',
      whiteSpace: 'nowrap',
      padding: '0rem',
      margin: '0rem',
      gap: '.375rem',
      border: 'none',
      backgroundColor: 'transparent',
    },
  }),
};

interface CustomUnitTypePopoverProps {
  popoverId: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  customUnitTypeOptions?: Goals.MeasurementUnit[];
  currentUnitType: Goals.MeasurementUnit;
  goalTargetValue: Goals.MeasurementScaleMetadataValue['value'];
  defaultDisplayLabel?: string;
  closeConfirmationPopover: (displayLabel: string) => void;
  handleConfirmCustomUnitType: (
    currentDisplayLabel: string,
    currentLabelPosition: Goals.LabelPositionId,
    currentUnitId: number,
  ) => void;
}

const CustomUnitTypePopover = ({
  open,
  anchorEl,
  closeConfirmationPopover,
  popoverId,
  handleConfirmCustomUnitType,
  customUnitTypeOptions,
  currentUnitType,
  goalTargetValue,
  defaultDisplayLabel,
}: CustomUnitTypePopoverProps): JSX.Element => {
  // retain created custom name when toggling between custom and system unit types
  const [currentDisplayLabel, setCurrentDisplayLabel] = useState<AutoCompleteOption | string | undefined>(defaultDisplayLabel);
  const [currentLabelPositionId, setCurrentLabelPositionId] = useState<Goals.LabelPositionId>(currentUnitType.labelPosition.id ?? Goals.LabelPositionId.Suffix);
  const [currentUnitId, setCurrentUnitId] = useState<number>(currentUnitType.id);
  const [shouldConfirmClose, setShouldConfirmClose] = useState<boolean>(false);

  useEffect(() => {
    setCurrentDisplayLabel(currentUnitType.displayLabel);
    setCurrentLabelPositionId(currentUnitType.labelPosition.id);
    setCurrentUnitId(currentUnitType.id);
  }, [currentUnitType]);

  const unitTypesAutocomplete = customUnitTypeOptions?.map((unitType) => unitType.displayLabel) || [];
  const radioButtonOptions = [
    { name: 'Display after number', value: Number(Goals.LabelPositionId.Suffix) },
    { name: 'Display before number', value: Number(Goals.LabelPositionId.Prefix) },
  ];

  const previewDefaultDisplayLabel = useMemo(() => {
    if (
      currentDisplayLabel === ''
      || !currentDisplayLabel) {
      return 'Units';
    }

    if (typeof currentDisplayLabel === 'object') return currentDisplayLabel.value;

    return currentDisplayLabel;
  }, [currentDisplayLabel]);

  const isAddSpaceSeparator = previewDefaultDisplayLabel.length > 1;

  const onAutocompleteInputChange = (
    type: 'onInputChange' | 'onChange',
    _event: SyntheticEvent<Element, Event>,
    value: AutoCompleteOption | string,
    reason: string,
  ): void => {
    const displayLabel = typeof value === 'string' ? value : value.value;

    if (type === 'onInputChange') {
      switch (reason) {
        case 'clear':
          setCurrentDisplayLabel('');
          setCurrentUnitId(0);
          return;
        case 'input':
          setCurrentDisplayLabel(displayLabel);
          setCurrentUnitId(0);
          return;
        default:
          return;
      }
    }

    if (type === 'onChange' && reason === 'selectOption') {
      setCurrentDisplayLabel(displayLabel);
      setCurrentLabelPositionId(customUnitTypeOptions?.find((unitType) => unitType.displayLabel === displayLabel)?.labelPosition.id
      ?? Goals.LabelPositionId.Suffix);
      setCurrentUnitId(customUnitTypeOptions?.find((unitType) => unitType.displayLabel === displayLabel)?.id ?? 0);
    }

    setShouldConfirmClose(true);
  };

  const onRadioInputChange = (value: Goals.LabelPositionId): void => {
    setCurrentLabelPositionId(value);
    setShouldConfirmClose(true);
  };

  const onConfirmCustomUnitType = (): void => {
    handleConfirmCustomUnitType(String(currentDisplayLabel), currentLabelPositionId, currentUnitId);
  };

  return (
    <Popover
      disableEnforceFocus
      disableEscapeKeyDown
      disableScrollLock
      css={styles.popoverContainer}
      id={open ? popoverId : undefined}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      data-test-id="customUnitTypePopover"
    >
      <div css={styles.banner} role="banner">
        <div>Custom measurement</div>
        <ShouldConfirmButton
          shouldConfirmClose={shouldConfirmClose}
          onConfirm={() => {
            setShouldConfirmClose(false);
            closeConfirmationPopover(currentDisplayLabel as string);
          }}
          renderButton={({ onClick }) => (
            <JoshButton
              css={styles.closeButton}
              variant="icon"
              data-test-id="closeCustomUnitTypePopover"
              onClick={onClick}
            >
              <FontAwesomeIcon
                icon={faXmark}
                css={styles.closeIcon}
                fontSize="1.25rem"
              />
            </JoshButton>
          )}
        />
      </div>
      <div role="main" css={styles.main}>
        <div css={styles.preview}>
          <CustomLabelPreview
            goalTargetValue={goalTargetValue}
            currentLabelPositionId={currentLabelPositionId}
            currentDisplayLabel={previewDefaultDisplayLabel}
            prefix={Number(currentLabelPositionId) === Goals.LabelPositionId.Prefix
              ? `${previewDefaultDisplayLabel}${isAddSpaceSeparator ? ' ' : ''}`
              : undefined}
            suffix={Number(currentLabelPositionId) === Goals.LabelPositionId.Suffix
              ? `${isAddSpaceSeparator ? ' ' : ''}${previewDefaultDisplayLabel}`
              : undefined}
          />
        </div>
        <AutoCompleteFreeForm
          // eslint-disable-next-line jsx-a11y/tabindex-no-positive
          tabIndex={1}
          name="customUnitType"
          styleOverrides={styles.autoCompleteOverrides}
          handleHomeEndKeys
          selectOnFocus
          defaultValue={previewDefaultDisplayLabel}
          value={currentDisplayLabel as string}
          options={unitTypesAutocomplete}
          disablePortal={false}
          onChange={onAutocompleteInputChange}
          maxCharacters={MAX_CUSTOM_UNIT_TYPE_LENGTH}
        />
        <div css={styles.radioButtons}>
          <MultiRadio
            name="unitTypePosition"
            defaultValue={currentLabelPositionId || Goals.LabelPositionId.Suffix}
            value={currentLabelPositionId}
            radios={radioButtonOptions}
            onChange={(_e: ChangeEvent<HTMLInputElement>, value: Goals.LabelPositionId | string): void => {
              onRadioInputChange(value as Goals.LabelPositionId);
            }}
            radioStyles={styles.radioStyles}
          />
        </div>
        <JoshButton
          css={styles.confirmButton}
          variant="default"
          color="light"
          data-test-id="customUnitTypePopoverConfirm"
          onClick={onConfirmCustomUnitType}
        >
          Confirm unit of measure
        </JoshButton>
      </div>
    </Popover>
  );
};

export default CustomUnitTypePopover;
