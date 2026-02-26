import { FORM_LAYOUT_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { css } from '@emotion/react';
import { PDP, ViewPersonalDevelopmentPlanPerspective } from '~DevelopmentPlan/const/types';
import {
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import {
  Checkbox,
  Form, TextField,
} from '~Common/V3/components/uncontrolled';
import {
  FormValues, conformToDto, createPlanFormResolver, createPlanFormSchema,
} from '~DevelopmentPlan/schemata/createPlanSchemata';
import { DEFAULT_PDP } from '~DevelopmentPlan/const/defaults';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import Froala from '~Common/V3/components/Froala';
import DatePicker from '~Common/V3/components/DatePicker';
import moment from 'moment';
import { SingleParticipantSelect } from '~Common/V3/components/SingleParticipantSelect';
import { ParticipantAndRoleSelector } from '~Common/V3/components/ParticipantAndRoleSelector';
import { Goals } from '@josh-hr/types';
import { useCreatePlan } from '~DevelopmentPlan/hooks/useCreatePlan';
import { useUpdatePlan } from '~DevelopmentPlan/hooks/useUpdatePlan';
import { useHistory } from 'react-router-dom';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { toast } from '~Common/components/Toasts';
import { ValidationErrors } from '~Goals/const/types';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';

export type ViewerParticipant = {
    orgUserId: string,
    role: string,
  };

const styles = {
  ...FORM_LAYOUT_STYLES,
  cardSkeleton: css({
    maxWidth: '100%',
    marginBottom: '.4rem',
  }),
  checkbox: css({
    display: 'none',
  }),
  largeSkeleton: css({
    height: '22rem',
    maxWidth: '100%',
  }),
};

interface ViewProps {
  formContext: UseFormReturn<FormValues>,
  planDescription: string,
  plan: PDP,
  handleMentorChange: (newOrgUserId: string) => void,
  isEditing: boolean,
  runValidations: () => void,
  disabledOrgIds: string[],
  disabledMentorIds: string[],
}

const View = ({
  formContext,
  planDescription,
  plan,
  handleMentorChange,
  isEditing,
  runValidations,
  disabledOrgIds,
  disabledMentorIds,
}: ViewProps): JSX.Element => (
  <>
    <ContextButtons
      renderContents={() => (
        <>
          <JoshButton
            onClick={runValidations}
            data-test-id="personalDevelopment SetupSaveAndContinue"
          >
            {isEditing ? 'Save Edits' : 'Save & Continue'}
          </JoshButton>
        </>
      )}
    />
    <Form
      formContext={formContext}
      onSubmit={() => null}
      css={styles.formContainer}
    >
      <TextField
        name="name"
        label="PDP Title"
        required
        inputProps={{ maxLength: 150 }}
        css={styles.formInput}
      />
      <Froala
        styleOverrides={styles.froala}
        enableEmojis
        label="Description"
        name="summary"
        froalaConfigProps={{
          charCounterCount: true,
          charCounterMax: 5000,
        }}
        richTextEditorProps={{
          name: 'description',
          onChange: ({ value: newText }) => formContext.setValue('summary', newText, { shouldDirty: true }),
          initialValue: planDescription,
        }}
      />
      <div
        css={styles.dateWrappper}
      >
        <DatePicker
          required
          initialDate={plan?.startDate}
          onDateSelected={({ date: newDate }) => formContext.setValue('startDate', newDate?.toDate() ?? new Date())}
          css={styles.datePicker}
          renderLabel={() => (
            <div>Start Date</div>
          )}
          name="startDate"
          disablePast={false}
        />
        <DatePicker
          required
          initialDate={plan?.endDate ?? moment().add(90, 'day').toDate()}
          css={styles.datePicker}
          // @ts-expect-error Typing is weird here - This date picker needs to be fixed
          minDate={moment(formContext.watch('startDate')).add(1, 'day')}
          onDateSelected={({ date: newDate }) => formContext.setValue('endDate', newDate?.toDate() ?? new Date())}
          renderLabel={() => (
            <div>End Date</div>
          )}
          name="endDate"
          data-test-id="pdpSetupFormEndDate"
          disablePast={false}
        />
      </div>
      <SingleParticipantSelect
        label="Mentor"
        onChange={handleMentorChange}
        value={formContext.watch('mentorId')}
        disabledIds={disabledMentorIds}
        disableLimitedAccessUsers
        data-test-id="pdpSetupFormMentor"
        required
      />
      <ParticipantAndRoleSelector
        disabledIds={disabledOrgIds}
        label="Viewers"
        disableLimitedAccessUsers
        onChange={(newValues: ViewerParticipant[]) => formContext.setValue('viewers', newValues)}
        participants={formContext.watch('viewers')}
        disableRoleSelection
        data-test-id="pdpSetupFormViewers"
        roles={[
          {
            label: 'Viewer',
            value: Goals.GoalParticipantRole.Viewer,
          },
        ]}
      />
      <div
        css={styles.checkbox}
      >
        <Checkbox
          css={styles.checkbox}
          name="isMentor"
          checked={false}
          data-test-id="pdpSelectMentor"
          size={20}
        />
      </div>
    </Form>
  </>
);

interface CreatePlanSetupFormProps {
  plan: PDP | undefined,
  mentorId: string | undefined,
  pdpId: string,
  loggedInUserOrgId: string,
}

const CreatePlanSetupForm = ({
  plan,
  mentorId,
  pdpId,
  loggedInUserOrgId,
}: CreatePlanSetupFormProps): JSX.Element => {
  const history = useHistory();
  const isEditing = history.location.pathname.includes('edit');
  const planDescription = plan?.summary ?? '';
  const planOwnerId = plan?.owner.orgId ?? '';

  const disabledMentorIds = [planOwnerId, loggedInUserOrgId];

  function defaultValues(): FormValues {
    const {
      name,
      summary,
      startDate,
      endDate,
      viewers: planViewers,
      mentor,
    } = plan ?? DEFAULT_PDP;

    const isMentor = isEditing && mentor.orgUserId === loggedInUserOrgId;

    const transformedViewers = planViewers.map((item) => ({
      orgUserId: item.orgUserId,
      role: Goals.GoalParticipantRole.Viewer,
    }));

    return {
      name,
      summary,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      mentorId: mentorId ?? '',
      viewers: transformedViewers,
      isMentor,
    };
  }

  const formContext = useForm<FormValues>({
    defaultValues: defaultValues(),
    resolver: createPlanFormResolver,
  });

  const {
    mutate: createPlanMutation,
  } = useCreatePlan();
  const {
    mutate: updatePlanMutation,
  } = useUpdatePlan();

  const runValidations = (): void => {
    const data = formContext.getValues();
    createPlanFormSchema
      .validate(data, { abortEarly: false })
      .then(() => {
        const formData = conformToDto(data);
        if (pdpId || isEditing) {
          updatePlanMutation({ id: pdpId, plan: formData }, { onSuccess: handleOnSuccessNavigation });
        } else {
          createPlanMutation({ plan: formData });
        }
      })
      .catch((err: ValidationErrors) => {
        err.errors.forEach((error) => {
          toast.error(error);
        });
      });
  };
  const {
    setViewPerspective,
  } = useStoreParams((state) => ({
    setViewPerspective: state.setViewPerspective,
  }));

  const handleOnSuccessNavigation = (): void => {
    if (isEditing) {
      history.push(DevelopmentPlanRoutes.ViewById.replace(':pdpId', pdpId));
    } else {
      setViewPerspective(ViewPersonalDevelopmentPlanPerspective.Create_Plan);
      history.push(DevelopmentPlanRoutes.ContinueToCreate.replace(':pdpId', pdpId));
    }
  };

  const handleMentorChange = (newOrgUserId: string): void => {
    const participants = formContext.getValues('viewers') ?? [];
    const ownerIndex = participants?.findIndex((participant) => participant.orgUserId === newOrgUserId);

    if (ownerIndex !== -1) {
      const newParticipants = [...participants];
      newParticipants.splice(ownerIndex, 1);
      formContext.setValue('viewers', newParticipants);
    }

    formContext.setValue('mentorId', newOrgUserId);
  };

  const disabledOrgIds = [formContext.watch('mentorId'), loggedInUserOrgId];

  const hookProps = {
    formContext,
    planDescription,
    plan: plan ?? DEFAULT_PDP,
    handleMentorChange,
    isEditing,
    runValidations,
    disabledOrgIds,
    disabledMentorIds,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, CreatePlanSetupForm };
export default CreatePlanSetupForm;
