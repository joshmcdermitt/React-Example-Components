import { css, styled } from '@mui/material';
import { LocationDescriptorObject } from 'history';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { BackInformation } from '~Goals/const/types';
import { CreateGoalResponse, useCreateGoal } from '~Goals/hooks/useCreateGoal';
import useGetCreateEditFormResolver, { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import useGetCreateGoalDefaultValues, { CreateGoalWorkflow } from '~Goals/hooks/utils/useGetCreateGoalDefaultValues';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { FORM_COMPONENT_STYLES, FORM_COMPONENT_WRAPPER_STYLES } from '~Goals/const/styles';
import { CreateMeasurementUnitTypePayload, useCreateMeasurementUnitType } from '~Goals/hooks/useCreateMeasurementUnitType';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import useAIDraftingStore from '~Goals/stores/useAIDraftingStore';
import { colors } from '~Common/styles/colors';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { Goals } from '@josh-hr/types';
import { useDraftedObjectiveStore } from '~Goals/hooks/aiDrafting/useDraftedObjectiveStore';
import { useEffect } from 'react';
import { usePersistedChat } from '~Goals/hooks/aiDrafting/usePersistedChat';
import { getOrganizationId, getOrganizationUserId } from '~Common/utils/localStorage';
import { useOrgDetailsContext } from '~Common/V3/components/OrgDetailsContext';
import { MagicWand_02 as MagicWandIcon } from '@josh-hr/icons';
import BackButton from '../Shared/CreateEditGoalForm/BackButton';
import CreateEditGoalForm from '../Shared/CreateEditGoalForm';

const styles = {
  ...FORM_COMPONENT_STYLES,
  ...FORM_COMPONENT_WRAPPER_STYLES,
  headerButtons: css({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  }),
  helpIcon: css({
    marginRight: '.5rem',
    height: '1rem',
    width: '1rem',
    '& path': {
      fill: 'url(#magic-wand-gradient)',
    },
  }),
  helpButtonText: css({
    fontSize: '.875rem',
    fontWeight: 600,
    backgroundImage: `linear-gradient(45deg, ${colors.brand[550]} 0%, ${colors.orange[350]} 100%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
  }),
  helpButton: css({
    borderRadius: '.5rem',
    padding: '0.625rem .875rem',
    backgroundColor: 'transparent !important',
    border: 'solid 1px transparent',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 0,
    height: 'min-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 1px #FFF',

    // Gradient Border - Always Visible
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: '.5rem',
      padding: '1px', // This creates the border thickness
      background: `linear-gradient(45deg, ${colors.brand[550]} 0%, ${colors.orange[350]} 100%)`,
      WebkitMask: `
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0)
      `,
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      zIndex: -1,
      opacity: 1, // Always visible
    },

    '&:hover': {
      backgroundColor: 'transparent !important',
    },
    '&:focus': {
      backgroundColor: 'transparent !important',
      outline: 'none',
    },
    '&:active': {
      backgroundColor: 'transparent !important',
    },
  }),
};

const StyledCreateGoal = styled('div')(() => ({}));

const StyledBackButton = styled(BackButton)({});

const StyledHelpButton = styled(JoshButton)(styles.helpButton);

const StyledCreateGoalFormContainer = styled('div')({});

const StyledHeaderText = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

interface ViewProps {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  handleSubmit: (
    data: CreateEditGoalFormValues,
    customUnitType: CreateMeasurementUnitTypePayload | null,
    isCreateNewUnitType: boolean,
  ) => void,
  featureNamesText: FeatureNamesText,
  returnRoute: LocationDescriptorObject,
  handleHelpMe: () => void,
  enableObjectivesAiDrafting: boolean,
}

const View = ({
  formContext,
  handleSubmit,
  featureNamesText,
  returnRoute,
  handleHelpMe,
  enableObjectivesAiDrafting,
}: ViewProps): JSX.Element => (
  <StyledCreateGoal css={styles.createEditContainer}>
    <div css={styles.headerButtons}>
      <StyledBackButton
        css={styles.backButton}
        formContext={formContext}
        returnRoute={returnRoute}
      />
    </div>
    <StyledCreateGoalFormContainer
      css={[styles.createEditContainer, styles.formBreakpoints]}
    >
      <StyledHeaderText
        css={styles.headerText}
        data-test-id="goalsCreateGoalHeaderText"
      >
        {`New ${featureNamesText.goals.singular.toLowerCase()}`}

        {enableObjectivesAiDrafting && (
        <>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="magic-wand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.brand[550]} />
                <stop offset="100%" stopColor={colors.orange[350]} />
              </linearGradient>
            </defs>
          </svg>
          <StyledHelpButton
            data-test-id="goalsCreateGoalHelpButton"
            variant="ghost"
            onClick={handleHelpMe}
          >
            <MagicWandIcon css={styles.helpIcon} />
            <span css={styles.helpButtonText}>Help me</span>
          </StyledHelpButton>
        </>
        )}
      </StyledHeaderText>
      <CreateEditGoalForm
        css={styles.createEditForm}
        formContext={formContext}
        handleOnSubmit={handleSubmit}
        returnRoute={returnRoute}
      />
    </StyledCreateGoalFormContainer>
  </StyledCreateGoal>
);

const CreateGoal = (): JSX.Element => {
  const history = useHistory();
  const { goalRoutes } = useGetGoalRoutes();
  const { featureNamesText } = useGetFeatureNamesText();
  const { state: locationState } = useLocation<{
    backInformation: BackInformation,
    initialGoal: Goals.Goal,
    workflow: CreateGoalWorkflow,
    teamId: string,
    preselectedCategory: Goals.GoalCategory,
  }>();
  const { createGoalDefaultValues, workflow } = useGetCreateGoalDefaultValues(
    locationState?.teamId,
    locationState?.preselectedCategory,
  );
  const { formResolver } = useGetCreateEditFormResolver();
  const { showObjectivesAIDraftingTool, setShowObjectivesAIDraftingTool } = useAIDraftingStore();
  const enableObjectivesAiDrafting = useFeatureFlag('enableObjectivesAiDrafting');
  const { draftedObjective, setDraftedObjective } = useDraftedObjectiveStore();
  const { clearStoredChat } = usePersistedChat();
  const {
    orgSettings: {
      enableAIFeatures,
    },
  } = useOrgDetailsContext();

  const returnRoute: LocationDescriptorObject = {
    pathname: locationState?.backInformation?.location ?? goalRoutes.Dashboard,
  };

  const { mutate: createGoalMutation } = useCreateGoal({
    ...((workflow && workflow === CreateGoalWorkflow.Clone) && {
      errorText: `There was an error cloning your ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
    }),
  });
  const { mutate: createMeasurementUnitType } = useCreateMeasurementUnitType({
    ...((workflow && workflow === CreateGoalWorkflow.Clone) && {
      errorText: 'There was an error creating your custom unit type. Please try again.',
    }),
  });

  const formContext = useForm<CreateEditGoalFormValues>({
    defaultValues: {
      ...createGoalDefaultValues,
      ...draftedObjective,
    },
    resolver: formResolver,
  });

  useEffect(() => {
    if (draftedObjective) {
      const copiedDraftedObjective = { ...draftedObjective };
      delete copiedDraftedObjective.customLabelPosition;
      delete copiedDraftedObjective.customUnit;
      formContext.reset({
        ...createGoalDefaultValues,
        ...copiedDraftedObjective,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftedObjective]);

  const {
    customUnit,
    customLabelPosition,
  } = draftedObjective ?? {};
  useEffect(() => {
    if (customUnit && customLabelPosition && draftedObjective) {
      const customUnitType = {
        displayLabel: customUnit,
        labelPositionId: customLabelPosition ?? Goals.LabelPositionId.Suffix,
        organizationOwned: true,
        organizationId: getOrganizationId() ?? '',
        orgUserId: getOrganizationUserId() ?? '',
      };

      if (customUnit !== undefined && customLabelPosition !== undefined) {
        createMeasurementUnitType({ payload: customUnitType }, {
          onSuccess: (unitTypeData) => {
            const { id } = unitTypeData.response;
            setDraftedObjective({
              ...draftedObjective,
              measurementUnitTypeId: id,
            });
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customUnit, customLabelPosition]);

  const handleHelpMe = (): void => {
    setShowObjectivesAIDraftingTool(!showObjectivesAIDraftingTool);
  };

  const createGoal = (goal: Goals.Requests.CreateGoalRequestPayload): void => {
    createGoalMutation({ goal }, {
      onSuccess: (goalData: HttpCallReturn<CreateGoalResponse>) => {
        const { goalId } = goalData.response;
        if (showObjectivesAIDraftingTool && draftedObjective) {
          clearStoredChat();
          setShowObjectivesAIDraftingTool(false);
          setDraftedObjective(null);
        }
        history.push(goalRoutes.ViewById.replace(':goalId', goalId));
      },
    });
  };

  const handleSubmit = (
    newGoal: CreateEditGoalFormValues,
    customUnitType: CreateMeasurementUnitTypePayload | null,
    isCreateNewUnitType: boolean,
  ): void => {
    if (customUnitType !== null && isCreateNewUnitType) {
      createMeasurementUnitType({ payload: customUnitType }, {
        onSuccess: (unitTypeData) => {
          const { id } = unitTypeData.response;
          const updatedGoal = { ...newGoal, measurementUnitTypeId: id };
          createGoal(updatedGoal);
        },
      });
    } else {
      createGoal(newGoal);
    }
  };

  const hookProps = {
    formContext,
    handleSubmit,
    featureNamesText,
    returnRoute,
    handleHelpMe,
    enableObjectivesAiDrafting: enableObjectivesAiDrafting && enableAIFeatures,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default CreateGoal;
