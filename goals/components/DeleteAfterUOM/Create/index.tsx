import { SerializedStyles, css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { Divider } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SelectOption } from '~Common/components/PeopleTagPicker/usePeopleTagPicker';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { palette } from '~Common/styles/colors';
import { forMobileObject } from '~Common/styles/mixins';
import { OnDateSelectedHandler } from '~Common/V3/components/DatePicker';
import Froala from '~Common/V3/components/Froala';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import JoshCard from '~Common/V3/components/JoshCard';
import ListSection from '~Common/V3/components/ListSection';
import { ParticipantAndRoleSelector } from '~Common/V3/components/ParticipantAndRoleSelector';
import { SingleParticipantSelect } from '~Common/V3/components/SingleParticipantSelect';
import { TextField } from '~Common/V3/components/uncontrolled';
import GoalDateSelection from '~Goals/components/DeleteAfterUOM/GoalDateSelection';
import GoalTypeSelection from '~Goals/components/DeleteAfterUOM/GoalTypeSelection';
import ObjectiveTypeSelect from '~Goals/components/DeleteAfterUOM/GoalTypeSelection/ObjectiveTypeSelect';
import PrioritySelection from '~Goals/components/DeleteAfterUOM/PrioritySelection';
import PrivateGoalToggle from '~Goals/components/DeleteAfterUOM/PrivateGoalToggle';
import { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';
import { TeamsListScope } from '~People/components/Teams/const/types';
import { useGetTeams } from '~People/components/Teams/hooks/useGetTeams';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

const styles = {
  setupContainer: css({
    margin: '1.125rem auto 0 auto',
    padding: '1.5rem',
    maxWidth: '80%',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
  }, forMobileObject({
    maxWidth: '100%',
  })),
  sectionHeader: css({
    fontSize: '1.125rem',
    marginBottom: '1rem',
    fontWeight: 600,
    gridColumn: 'span 4',
    color: palette.neutrals.gray800,
  }),
  titleField: css({
    gridColumn: 'span 3',
  }, forMobileObject({
    gridColumn: 'span 4',
  })),
  priorityField: css({
    gridColumn: 'span 1',
  }, forMobileObject({
    gridColumn: 'span 4',
  })),
  descriptionField: css({
    gridColumn: 'span 4',
  }),
  externalLinkField: css({
    gridColumn: 'span 4',
  }),
  additionalButtonsContainer: css({
    gridColumn: 'span 4',
  }),
  divider: css({
    color: palette.neutrals.gray200,
    gridColumn: 'span 4',
  }),
  categoryField: css({
    gridColumn: 'span 2',
    '.MuiFormControl-root': {
      width: '100%',
    },
  }, forMobileObject({
    gridColumn: 'span 4',
  })),
  privateToggle: css({
    gridColumn: 'span 4',
  }),
  dateField: css({
    gridColumn: 'span 2',
  }),
  ownerField: css({
    gridColumn: 'span 4',
  }),
  participantsField: css({
    gridColumn: 'span 4',
  }),
};

interface ViewProps {
  areTeamsLoading: boolean,
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  handleOwnerChange: (newOrgUserId: string) => void,
  isEdit: boolean,
  isMobile: boolean,
  showExternalLink: boolean,
  teamsList: SelectOption[],
  toggleExternalLink: () => void,
  overrideStyles?: SerializedStyles | SerializedStyles[],
  hideHeader: boolean,
  handleStartTimeChange: OnDateSelectedHandler,
  handleEndTimeChange: OnDateSelectedHandler,
  allowedContextTypes?: Goals.GoalContextType[],
  ownerId: string | undefined,
  featureNamesText: FeatureNamesText,
  showDescription: boolean,
  toggleDescription: () => void,
}

const View = ({
  areTeamsLoading,
  formContext,
  handleOwnerChange,
  isEdit,
  isMobile,
  showExternalLink,
  teamsList,
  toggleExternalLink,
  hideHeader,
  allowedContextTypes,
  handleStartTimeChange,
  handleEndTimeChange,
  ownerId,
  featureNamesText,
  showDescription,
  toggleDescription,
  ...props
}: ViewProps): JSX.Element => (
  <JoshCard css={styles.setupContainer} {...props}>
    {!hideHeader && (
      <ListSection
        css={styles.sectionHeader}
        renderContents={() => (
          <>
            {`${isEdit ? 'Edit' : 'Create'} ${featureNamesText.goals.singular}`}
          </>
        )}
      />
    )}
    <TextField
      css={styles.titleField}
      name="title"
      label="Title"
      data-test-id="goalsTitle"
      placeholder="What do you want to accomplish?"
      required
      autoFocus
    />
    <PrioritySelection
      containerStyles={styles.priorityField}
      defaultValue={formContext.getValues('priority')}
    />
    {showDescription && (
      <Froala
        styleOverrides={styles.descriptionField}
        enableEmojis={!isMobile}
        label="Description"
        name="description"
        froalaConfigProps={{
          charCounterCount: true,
          charCounterMax: 5000,
          placeholderText: !isMobile
            ? `Add context to this ${featureNamesText.goals.singular.toLowerCase()}. Why is it important? How will you define success?` : '',
        }}
        richTextEditorProps={{
          name: 'description',
          onChange: ({ value: newText }) => formContext.setValue('description', newText, { shouldDirty: true }),
          initialValue: formContext.getValues('description'),
        }}
      />
    )}
    {showExternalLink && (
      <TextField
        css={styles.externalLinkField}
        name="externalLink"
        label="External Link"
        placeholder="https://app.josh.com/"
        autoFocus
      />
    )}
    {(!showDescription || !showExternalLink) && (
      <div css={styles.additionalButtonsContainer}>
        {!showDescription && (
          <JoshButton
            data-test-id="goalsAddDescription"
            variant="text"
            onClick={toggleDescription}
          >
            + Description
          </JoshButton>
        )}
        {!showExternalLink && (
          <JoshButton
            data-test-id="goalsAddExternalLink"
            variant="text"
            onClick={toggleExternalLink}
          >
            + Add external link
          </JoshButton>
        )}
      </div>
    )}
    <ObjectiveTypeSelect
      css={styles.categoryField}
      defaultValue={formContext.getValues('category')}
    />
    <Divider css={styles.divider} />
    <GoalTypeSelection
      isEdit={isEdit}
      areTeamsLoading={areTeamsLoading}
      teamsList={teamsList}
      formContext={formContext}
      allowedContextTypes={allowedContextTypes}
    />
    <PrivateGoalToggle
      css={styles.privateToggle}
      isPrivate={formContext.getValues('isPrivate')}
      selectedGoalType={formContext.watch('context.contextType')}
    />
    <Divider css={styles.divider} />
    <GoalDateSelection
      startDateStyles={styles.dateField}
      endDateStyles={styles.dateField}
      formContext={formContext}
      handleStartTimeChange={handleStartTimeChange}
      handleEndTimeChange={handleEndTimeChange}
    />
    <Divider css={styles.divider} />
    <SingleParticipantSelect
      css={styles.ownerField}
      label="Owner"
      onChange={handleOwnerChange}
      value={ownerId}
    />
    <ParticipantAndRoleSelector
      css={styles.participantsField}
      disabledIds={[...(ownerId ? [ownerId] : [])]}
      label="Participants"
      onChange={(newValues) => formContext.setValue('participants', newValues)}
      participants={formContext.watch('participants')}
      roles={[
        {
          label: 'Collaborator',
          value: Goals.GoalParticipantRole.Collaborator,
        },
        {
          label: 'Viewer',
          value: Goals.GoalParticipantRole.Viewer,
        },
      ]}
    />
  </JoshCard>
);

interface CreateGoalFormProps extends Pick<ViewProps, 'allowedContextTypes'> {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  isEdit?: boolean,
  hideHeader?: boolean,
}

export const CreateGoalForm = ({
  formContext,
  isEdit = false,
  hideHeader = false,
  allowedContextTypes = [Goals.GoalContextType.Personal, Goals.GoalContextType.Team, Goals.GoalContextType.Organization],
  ...props
}: CreateGoalFormProps): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const [showExternalLink, setShowExternalLink] = useState(formContext.getValues('externalLink') !== '');
  const [showDescription, setShowDescription] = useState(formContext.getValues('description') !== '');
  const { featureNamesText } = useGetFeatureNamesText();

  const toggleExternalLink = (): void => {
    if (showExternalLink) {
      formContext.resetField('externalLink');
    }
    setShowExternalLink(!showExternalLink);
  };

  const toggleDescription = (): void => {
    if (showDescription) {
      formContext.resetField('description');
    }
    setShowDescription(!showDescription);
  };

  const handleStartTimeChange: OnDateSelectedHandler = ({ date: newStartDate }) => {
    const newStartTimeInMillis = newStartDate?.valueOf() ?? new Date().getTime();
    formContext.setValue('startTimeInMillis', newStartTimeInMillis);

    if (moment(formContext.getValues('endTimeInMillis')) <= moment(newStartTimeInMillis)) {
      formContext.setValue('endTimeInMillis', newStartTimeInMillis);
    }
  };

  const handleEndTimeChange: OnDateSelectedHandler = ({ date: newEndDate }): void => {
    const newEndTimeInMillis = newEndDate?.valueOf() ?? new Date().getTime();
    formContext.setValue('endTimeInMillis', newEndTimeInMillis);
  };

  const { isAdmin } = useUserPermissions();

  const listScope = isAdmin ? TeamsListScope.AllTeams : TeamsListScope.MyTeams;
  const { data: teamsData, isLoading } = useGetTeams({
    page: 0,
    count: 1000, // TODO: Need to make this NOT a predefined number - Should update this to pull everything or change the select box to be a searchfilter or something
    listScope,
  });
  const [areTeamsLoading] = useSkeletonLoaders(isLoading);
  const teams = teamsData?.response.teams ?? [];
  const teamsList = teams.map((team) => ({
    label: team.name,
    value: team.teamId,
  }));

  const handleOwnerChange = (newOrgUserId: string): void => {
    const participants = formContext.getValues('participants') ?? [];

    const newParticipants = participants.filter(
      (participant) => participant.role !== Goals.GoalParticipantRole.Owner && participant.orgUserId !== newOrgUserId,
    );

    newParticipants.push({
      orgUserId: newOrgUserId,
      role: Goals.GoalParticipantRole.Owner,
    });

    formContext.setValue('participants', newParticipants);
  };

  const goalParticipants = formContext.watch('participants');

  const goalOwner = goalParticipants?.find((participant) => participant.role === Goals.GoalParticipantRole.Owner);

  const { orgUserId: ownerId } = goalOwner ?? {};

  const hookProps = {
    areTeamsLoading,
    formContext,
    handleOwnerChange,
    isEdit,
    isMobile,
    showExternalLink,
    teamsList,
    toggleExternalLink,
    hideHeader,
    allowedContextTypes,
    handleStartTimeChange,
    handleEndTimeChange,
    ownerId,
    featureNamesText,
    showDescription,
    toggleDescription,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};
