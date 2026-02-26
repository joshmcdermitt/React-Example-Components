import { useParams } from 'react-router-dom';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { useEffect } from 'react';
import {
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import {
  FormValues, conformToDto, createCompetencyResolver, createCompetencyFormSchema,
} from '~DevelopmentPlan/schemata/createCompetencySchemata';
import { DEFAULT_COMPETENCY, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import {
  Form, TextField,
} from '~Common/V3/components/uncontrolled';
import Froala from '~Common/V3/components/Froala';
import { css } from '@emotion/react';
import { FORM_LAYOUT_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { ValidationErrors } from '~Goals/const/types';
import { toast } from 'react-toastify';
import { useCreateCompetency } from '~DevelopmentPlan/hooks/useCreateCompetency';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Competency } from '~DevelopmentPlan/const/types';
import { useUpdateCompetency } from '~DevelopmentPlan/hooks/useUpdateCompetency';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { SaveIndicator } from '~Common/V3/components/SaveIndicator';
import RequiredIcon from '~Common/V3/components/RequiredIcon';
import { PersonalDevelopmentPlanDetailsParams } from '../ViewDetail/PersonalDevelopmentPlanDetails';

const styles = {
  ...FORM_LAYOUT_STYLES,
  addCompetencyWrap: (isEditing: boolean) => css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
    maxWidth: '32.5rem',
    width: '100%',
  }, isEditing && {
    maxWidth: '40.625rem',
  }),
  addCompetencyForm: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.375rem',
  }),
  buttonSpace: css({
    marginRight: '.625rem',
  }),
  buttonsWrap: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  footerArea: (hasButton: boolean) => css({
    width: '100%',
    display: 'flex',
    justifyContent: hasButton ? 'space-between' : 'flex-end',
    gap: '1rem',
    marginTop: '.75rem',
  }),
  requiredIcon: css({
    svg: {
      marginRight: '0',
      width: '.375rem',
      height: '.375rem',
    },
  }),
};

interface ViewProps {
  isOpen: boolean,
  runValidations: () => void,
  formContext: UseFormReturn<FormValues>,
  planDescription: string,
  resetForm: () => void,
  isEditing: boolean,
  disableAddCompetenciesButton: boolean,
  showButton: boolean,
  isSaving: boolean,
  onAddCompteency: () => void,
}

const View = ({
  isOpen,
  runValidations,
  formContext,
  planDescription,
  resetForm,
  isEditing,
  disableAddCompetenciesButton,
  showButton,
  isSaving,
  onAddCompteency,
}: ViewProps): JSX.Element => (
  <>
    {isOpen && (
    <>
      <div css={styles.addCompetencyWrap(isEditing)}>
        <Form
          formContext={formContext}
          onSubmit={() => null}
          css={styles.addCompetencyForm}
        >
          <TextField
            name="name"
            label="Desired Competency"
            required
            inputProps={{ maxLength: 100 }}
          />
          <Froala
            styleOverrides={styles.froala}
            required
            label="Description"
            name="summary"
            froalaConfigProps={{
              charCounterCount: true,
              charCounterMax: 500,
            }}
            richTextEditorProps={{
              name: 'description',
              onChange: ({ value: newText }) => formContext.setValue('description', newText, { shouldDirty: true }),
              initialValue: planDescription,
            }}
            renderRightIcon={(): JSX.Element => <RequiredIcon css={styles.requiredIcon} />}
          />
        </Form>
        <div css={styles.buttonsWrap}>
          <div>
            <JoshButton
              onClick={runValidations}
              data-test-id="personalDevelopmentSaveCompetency"
              size="small"
              css={styles.buttonSpace}
            >
              Save
            </JoshButton>
            <JoshButton
              variant="ghost"
              onClick={resetForm}
              data-test-id="personalDevelopmentCancelCompetency"
              size="small"
            >
              Cancel
            </JoshButton>
          </div>
        </div>
      </div>
    </>
    )}
    <div
      css={styles.footerArea(showButton)}
    >
      {showButton && (
        <div data-test-id="">
          <JoshButton
            variant="ghost"
            onClick={onAddCompteency}
            data-test-id="personalDevelopmentAddCompetency"
            size="small"
            disabled={disableAddCompetenciesButton}
          >
            <JoshButton.IconAndText
              icon={faPlus}
              text="Add Competency"
            />
          </JoshButton>
        </div>
      )}
      {isSaving && (
      <SaveIndicator isSaving={isSaving} isDirty={isEditing} />
      )}
    </div>
  </>
);

interface AddCompetencyProps {
  isEditing?: boolean,
  competency?: Competency,
  setCompetencyIdToEdit?: (competencyId: number | undefined) => void,
  isInitialForm?: boolean,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  resetForm: () => void,
}

const AddCompetency = ({
  isEditing = false,
  competency,
  setCompetencyIdToEdit,
  isInitialForm = false,
  isOpen,
  setIsOpen,
  resetForm,
}: AddCompetencyProps): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();

  const planDescription = competency?.description ?? '';
  const isFetchingCompetencies = useIsFetching({ queryKey: pdpPlanKeys.competencies(pdpId) });
  const isMutatingCompetencies = useIsMutating({ mutationKey: pdpPlanKeys.competencies(pdpId) });
  const isFetchingResources = useIsFetching({ queryKey: pdpPlanKeys.competencyResources(pdpId) });
  const isMutatingResources = useIsMutating({ mutationKey: pdpPlanKeys.competencyResources(pdpId) });
  const disableAddCompetenciesButton = isFetchingCompetencies > 0 || isMutatingCompetencies > 0;
  const isSaving = disableAddCompetenciesButton || isFetchingResources > 0 || isMutatingResources > 0;
  const showButton = !isOpen && !isEditing;

  useEffect(() => {
    if (setIsOpen) {
      setIsOpen(isInitialForm);
    }
  }, [isInitialForm, setIsOpen]);
  useEffect(() => {
    if (setIsOpen) {
      setIsOpen(isEditing);
    }
  }, [isEditing, setIsOpen]);

  function defaultValues(): FormValues {
    const {
      name,
      description,
    } = competency ?? DEFAULT_COMPETENCY;

    return {
      name,
      description,
    };
  }
  const formContext = useForm<FormValues>({
    defaultValues: defaultValues(),
    resolver: createCompetencyResolver,
  });

  const { mutate: createCompetencyMutation } = useCreateCompetency();
  const { mutate: updateCompetencyMutation } = useUpdateCompetency();

  const runValidations = (): void => {
    const data = formContext.getValues();
    createCompetencyFormSchema
      .validate(data, { abortEarly: false })
      .then(() => {
        closeForm();
        const formData = conformToDto(data);
        const competencyId = competency?.id ?? OPTIMISTIC_ID;
        if (isEditing) {
          setCompetencyIdToEdit?.(undefined);
          updateCompetencyMutation({ id: pdpId, competency: formData, competencyId }, { onSuccess: onCreateSuccess });
        } else {
          createCompetencyMutation({ pdpId, competency: formData }, { onSuccess: onCreateSuccess });
        }
      })
      .catch((err: ValidationErrors) => {
        err.errors.forEach((error) => {
          toast.error(error);
        });
        setIsOpen(true);
      });
  };

  const {
    setShowAddCompetencyForm,
  } = useAddResourceModalStore((state) => ({
    setShowAddCompetencyForm: state.setShowAddCompetencyForm,
  }));

  const onCreateSuccess = (): void => {
    formContext.reset();
  };

  const onAddCompteency = (): void => {
    setIsOpen(!isOpen);
    setShowAddCompetencyForm(true);
  };

  const closeForm = (): void => {
    setIsOpen(false);
  };

  const hookProps = {
    isOpen,
    runValidations,
    formContext,
    planDescription,
    resetForm,
    isEditing,
    disableAddCompetenciesButton,
    showButton,
    isSaving,
    onAddCompteency,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, AddCompetency };
export default AddCompetency;
