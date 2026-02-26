import { Goals } from '@josh-hr/types';
import { useState } from 'react';
import { css } from '@emotion/react';
import {
  Divider,
  styled,
  Theme,
  useTheme,
} from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import Froala from '~Common/V3/components/Froala';
import { Form } from '~Common/V3/components/uncontrolled';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { LocationDescriptor } from 'history';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { getOrganizationId, getUserId } from '~Common/utils/localStorage';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import useGetGoalMeasurementScaleTypeCategory, { GoalMeasurementScaleTypeCategory } from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import CategorySelector from './CategorySelector';
import CollaboratorsSelector from './CollaboratorsSelector';
import Footer from './Footer';
import InitialNumberInput from './InitialNumberInput';
import LimitVisibility from './LimitVisibility';
import MeasurementTypeSelector from './MeasurementTypeSelector';
import OwnerSelector from './OwnerSelector';
import PrioritySelector from './PrioritySelector';
import TargetNumberInput from './TargetNumberInput';
import TargetRange from './TargetRange/TargetRange';
import Title from './Title';
import UnitTypeSelector from './UnitTypeSelector';
import GoalScopeSelector from './GoalTypeSelector';

const styles = {
  label: (theme: Theme) => css({
    background: theme.palette.background.primary,
  }),
  descriptionField: (theme: Theme) => css({
    '& label': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: theme.fontSize.small,
      marginLeft: '-1rem', // For some reason we can not style the labelContainer so we have to undo it here
    },
    '.fr-box.fr-basic': {
      border: `1px solid ${theme.palette.border.primary}`,
      padding: `calc(${theme.spacings.medium} + 1px)`,
      '&:focus-within': {
        padding: theme.spacings.medium,
        border: `2px solid ${theme.palette.border.brand}`,
      },
    },
    '.fr-toolbar,.fr-toolbar .fr-btn-grp': {
      background: 'none',
    },
    '.fr-toolbar .fr-btn-grp': {
      marginLeft: '0',
      paddingLeft: '0',
      opacity: '.75',
    },
    '.fr-box.fr-basic, .fr-box.fr-basic .fr-wrapper,.fr-second-toolbar': {
      background: theme.palette.background.primary,
    },
    '.fr-popup.fr-desktop': { // Removes margin-top when emoji or link is selected
      marginTop: '0 !important',
    },
  }),
};

const StyledCreateGoalForm = styled(Form<CreateEditGoalFormValues>)<{ $isModal?: boolean }>(({ theme, $isModal }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: $isModal ? theme.spacings.medium : theme.spacings.large,
}));

const StyledDescriptionContainer = styled('div')({
  overflow: 'visible',
  paddingRight: '.0313rem',
  position: 'relative',
  width: '100%',
});

const StyledScopeSelector = styled(GoalScopeSelector)(({ theme }) => ({
  '.MuiButtonBase-root .MuiToggleButton-root': {
    width: 'fit-content',
  },
  [theme.breakpoints.down('mobile')]: {
  },
  [theme.breakpoints.down('mobileTiny')]: {
    '.MuiToggleButtonGroup-root': {
      flexDirection: 'column',
    },
    '.MuiToggleButtonGroup-grouped': {
      width: 'fit-content',
    },
  },
}));

const CategoryPriorityContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '.5rem 1.5rem',
  [theme.breakpoints.up('desktop')]: {
    justifyContent: 'space-between',
  },
  [theme.breakpoints.down('mobile')]: {
  },
  [theme.breakpoints.down('mobileTiny')]: {
    flexDirection: 'column',
  },
}));

const StyledCategorySelector = styled(CategorySelector)({
  display: 'flex',
});

const StyledDividerOne = styled(Divider)({
  width: '100%',
});

const StyledMeasurementTypeSelector = styled(MeasurementTypeSelector)({
  width: 'min-content',
});

const InitialTargetContainer = styled('div')<{ $isCustomUnitDisplayed?: boolean }>(({ theme, $isCustomUnitDisplayed }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '.5rem 1.5rem',
  flexWrap: $isCustomUnitDisplayed ? 'wrap' : 'nowrap',
  [theme.breakpoints.down('mobile')]: {
  },
  [theme.breakpoints.down('mobileTiny')]: {
    flexDirection: 'column',
    '.number-input': {
      width: 'min-content',
      minWidth: '15.625rem',
    },
  },
}));

const StyledInitialNumberInput = styled(InitialNumberInput)({
  maxWidth: '12.5rem',
  display: 'flex',
  flexDirection: 'column',
});

const StyledTargetNumberInput = styled(TargetNumberInput)({
  maxWidth: '12.5rem',
  display: 'flex',
  flexDirection: 'column',
});

const StyledDividerTwo = styled(Divider)({
  width: '100%',
});

const StyledDividerThree = styled(Divider)({
  width: '100%',
});

const TitleTargetRow = styled('div')<{ $isModal?: boolean }>(({ theme, $isModal }) => ({
  display: 'flex',
  gap: $isModal ? theme.spacings.large : theme.spacings.threeExtraLarge,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  [theme.breakpoints.up('desktop')]: {
    justifyContent: $isModal ? 'flex-start' : 'space-between',
    '& > *:first-of-type': {
      flex: $isModal ? '1' : '3',
    },
    '& > *:last-of-type': {
      flex: $isModal ? '1' : '1',
      minWidth: 'fit-content',
    },
  },
  [theme.breakpoints.down('desktop')]: {
    flexDirection: 'column',
    gap: theme.spacings.medium,
  },
  [theme.breakpoints.down('mobileTiny')]: {
    flexDirection: 'column',
    gap: theme.spacings.medium,
  },
}));

const ScopeCategoryRow = styled('div')<{ $isModal?: boolean }>(({ theme, $isModal }) => ({
  display: 'flex',
  gap: $isModal ? theme.spacings.large : theme.spacings.threeExtraLarge,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  [theme.breakpoints.up('mobile')]: {
    '& > *:first-of-type': {
      flex: '1',
      minWidth: 'fit-content',
    },
    '& > *:last-of-type': {
      flex: '1',
      minWidth: 'fit-content',
    },
  },
  [theme.breakpoints.down('mobile')]: {
    flexDirection: 'column',
    gap: theme.spacings.medium,
  },
  [theme.breakpoints.down('mobileTiny')]: {
    flexDirection: 'column',
    gap: theme.spacings.medium,
  },
}));

const MeasurementRow = styled('div')<{ $isModal?: boolean }>(({ theme, $isModal }) => ({
  display: 'flex',
  gap: $isModal ? theme.spacings.large : theme.spacings.threeExtraLarge,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  [theme.breakpoints.up('mobile')]: {
    '& > *:first-of-type': {
      flex: '0 0 auto',
      minWidth: 'fit-content',
    },
    '& > *:nth-of-type(2)': {
      flex: '0 0 auto',
      minWidth: 'fit-content',
    },
    '& > *:last-of-type': {
      flex: '1',
      minWidth: 'fit-content',
    },
  },
  [theme.breakpoints.down('mobile')]: {
    flexDirection: 'column',
    gap: theme.spacings.medium,
  },
  [theme.breakpoints.down('mobileTiny')]: {
    flexDirection: 'column',
    gap: theme.spacings.medium,
  },
}));

const FullWidthContainer = styled('div')({
  width: '100%',
});

interface ViewProps {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  handleSubmit: (data: CreateEditGoalFormValues) => void,
  theme: Theme,
  returnRoute?: LocationDescriptor,
  isModal?: boolean,
  actionTextToUse?: string,
  featureNamesText?: FeatureNamesText,
  handleCustomUnitTypePayloadChange: (customUnitType: Goals.MeasurementUnit, isNew: boolean) => void,
  newUnitTypePayload?: Goals.MeasurementUnit | null,
  objectivesAllowCustomUnitTypes?: boolean,
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
}

const View = ({
  formContext,
  handleSubmit,
  theme,
  returnRoute,
  isModal = false,
  actionTextToUse,
  featureNamesText,
  handleCustomUnitTypePayloadChange,
  objectivesAllowCustomUnitTypes,
  goalMeasurementScaleTypeCategory,
  ...props
}: ViewProps): JSX.Element => (
  <>
    {isModal && actionTextToUse && featureNamesText && (
      <ContextButtons
        portalIds={['modalButtons']}
        renderContents={() => (
          <>
            <JoshButton
              data-test-id="addResourceModalSaveChanges"
              size="small"
              type="submit"
              onClick={(): void => {
                handleSubmit(formContext.getValues());
              }}
              disabled={!formContext.formState.isDirty && formContext.getValues('title') === ''}
            >
              {`${actionTextToUse} ${featureNamesText.goals.singular}`}
            </JoshButton>
          </>
        )}
      />
    )}
    <StyledCreateGoalForm formContext={formContext} onSubmit={handleSubmit} $isModal={isModal} {...props}>
      <TitleTargetRow $isModal={isModal}>
        <Title />
        <TargetRange />
      </TitleTargetRow>
      <StyledDescriptionContainer>
        <Froala
          styleOverrides={styles.descriptionField(theme)}
          labelStyleOverrides={styles.label(theme)}
          enableEmojis
          label="Description"
          name="description"
          data-test-id="goalsDescription"
          froalaConfigProps={{
            charCounterCount: true,
            charCounterMax: 5000,
          }}
          richTextEditorProps={{
            name: 'statusCommentary',
            onChange: ({ value: newText }) => formContext.setValue('description', newText, { shouldDirty: true }),
            preferDraftValue: true,
            initialValue: formContext.getValues('description'),
          }}
        />
      </StyledDescriptionContainer>
      <ScopeCategoryRow $isModal={isModal}>
        <StyledScopeSelector />
        <CategoryPriorityContainer>
          <StyledCategorySelector />
          <PrioritySelector />
        </CategoryPriorityContainer>
      </ScopeCategoryRow>
      <StyledDividerOne />
      {goalMeasurementScaleTypeCategory !== GoalMeasurementScaleTypeCategory.Achieved && (
        <MeasurementRow $isModal={isModal}>
          <StyledMeasurementTypeSelector
            previousCategory={goalMeasurementScaleTypeCategory}
          />
          <UnitTypeSelector
            handlecustomunittypepayloadchange={handleCustomUnitTypePayloadChange}
            initialMeasurementUnitType={formContext.getValues('measurementUnitTypeId') ?? Goals.SystemMeasurementUnitTypeId.Percentage}
          />
          <InitialTargetContainer $isCustomUnitDisplayed={objectivesAllowCustomUnitTypes}>
            <StyledInitialNumberInput required />
            <StyledTargetNumberInput required />
          </InitialTargetContainer>
        </MeasurementRow>
      )}
      {goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.Achieved && (
        <StyledMeasurementTypeSelector
          previousCategory={goalMeasurementScaleTypeCategory}
        />
      )}
      <StyledDividerTwo />
      <FullWidthContainer>
        <OwnerSelector />
      </FullWidthContainer>
      <FullWidthContainer>
        <CollaboratorsSelector />
      </FullWidthContainer>
      <StyledDividerThree />
      <FullWidthContainer>
        <LimitVisibility />
      </FullWidthContainer>
      <FullWidthContainer>
        <Footer className="goalFormFooter" returnRoute={returnRoute} />
      </FullWidthContainer>
    </StyledCreateGoalForm>
  </>
);

export interface CreateEditGoalFormProps extends Pick<ViewProps,
  'formContext'
  | 'returnRoute'
  | 'isModal'
  | 'actionTextToUse'
> {
  handleOnSubmit: (
    data: CreateEditGoalFormValues,
    customUnitType: Goals.Requests.CreateCustomUnitRequestPayload | null,
    isCreateNewUnitType: boolean,
  ) => void,
}

const CreateEditGoalForm = ({ handleOnSubmit, ...props }: CreateEditGoalFormProps): JSX.Element => {
  const [newUnitTypePayload, setNewUnitTypePayload] = useState<Goals.Requests.CreateCustomUnitRequestPayload | null>(null);
  const [isCreateNewUnitType, setIsCreateNewUnitType] = useState(false);
  const theme = useTheme();
  const { featureNamesText } = useGetFeatureNamesText();
  const orgUserId = getUserId();
  const organizationId = getOrganizationId();
  const objectivesAllowCustomUnitTypes = useFeatureFlag('objectivesAllowCustomUnitTypes');

  const { watch } = props.formContext;
  const measurementScaleTypeId = watch('measurementScaleTypeId');
  const { goalMeasurementScaleTypeCategory } = useGetGoalMeasurementScaleTypeCategory({ measurementScaleTypeId: measurementScaleTypeId ?? 0 });

  const handleSubmit = (data: CreateEditGoalFormValues): void => {
    handleOnSubmit(data, newUnitTypePayload, isCreateNewUnitType);
  };

  const handleCustomUnitTypePayloadChange = (customUnitType: Goals.MeasurementUnit, isCreateNew: boolean): void => {
    if (customUnitType.displayLabel === '') {
      setNewUnitTypePayload(null);
      setIsCreateNewUnitType(false);
      return;
    }
    setNewUnitTypePayload({
      displayLabel: customUnitType.displayLabel,
      organizationOwned: true,
      organizationId: organizationId ?? '',
      orgUserId: orgUserId ?? '',
      labelPositionId: customUnitType.labelPosition.id,
    });
    setIsCreateNewUnitType(isCreateNew);
  };

  const hookProps = {
    theme,
    featureNamesText,
    handleSubmit,
    handleCustomUnitTypePayloadChange,
    updatedUnitTypePayload: { ...newUnitTypePayload },
    objectivesAllowCustomUnitTypes,
    goalMeasurementScaleTypeCategory,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default CreateEditGoalForm;
