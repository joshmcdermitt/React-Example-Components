import { css } from '@emotion/react';
import moment, { Moment } from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { faArrowUpRightFromSquare, faListCheck } from '@fortawesome/pro-light-svg-icons';
import { Alert } from '@mui/material';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import isURL from 'validator/es/lib/isURL';

import { ActionItemFormData, createEditActionItemTemplate, FormSubmittedByButton } from '~ActionItems/components/Drawers/CreateEditActionItemDrawer';
import Tooltip from '~Common/components/Tooltip';
import DrawerInput from '~Common/V3/components/DrawerInput';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import DatePicker from '~Common/V3/components/DatePicker';
import ActionItemRecurrence from '~ActionItems/components/recurrence/ActionItemRecurrence';
import RecurrenceToggleComponent from '~ActionItems/components/recurrence/RecurrenceToggleComponent';
import ActionItemStatusDropdown from '~ActionItems/components/Drawers/ActionItemStatusDropdown';
import Froala from '~Common/V3/components/Froala';
import { Person } from '~Common/const/interfaces';
import { ActionItem, ActionItemContext, NewActionItemStatus } from '~ActionItems/const/interfaces';
import { getOrganizationUserId, getUserId } from '~Common/utils/localStorage';
import { drawerInputBackground, palette } from '~Common/styles/colors';
import { useNewPeople, useGetPeopleByList as usePeoplePickerByList } from '~Deprecated/hooks/peoplePicker/useNewPeople';
import { ActionItemData as CreateActionItemData, useCreateActionItems } from '~ActionItems/hooks/useCreateActionItems';
import { useActionItemDetails } from '~ActionItems/hooks/useActionDetails';
import { EditActionItemData, useEditActionItem } from '~ActionItems/hooks/useEditActionItem';
import { getAssociationData, AssociationData } from '~ActionItems/functions/utils';
import { updatedValues } from '~ActionItems/functions/updatedValues';
import { useUpdateEffect } from '~Common/hooks/useUpdateEffect';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import { ParticipantAndRoleSelector, ParticipantWithRole } from '~Common/V3/components/ParticipantAndRoleSelector';
import { Goals } from '@josh-hr/types';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { getActionItemPeopleData } from '~DevelopmentPlan/const/functions';
import { DEFAULT_OPACITY } from '~DevelopmentPlan/const/defaults';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { CompetencyResourceStatusEnum } from '~DevelopmentPlan/const/types';

const styles = {
  drawerInput: css({
    marginBottom: '0.5rem !important',
    padding: '0.5rem 0.75rem',

    '& input': {
      fontWeight: '400 !important',
      padding: 0,
      minHeight: 0,
    },
  }),
  description: css({
    marginBottom: '0.5rem !important',

    '.fr-element': {
      padding: '0 0.75rem !important',
    },
    '.fr-btn-grp': {
      margin: '0 0.75rem !important',
    },
  }),
  descriptionLabel: css({
    padding: '0.5rem 0.75rem',
  }),
  attendeeBox: css({
    width: '49%',
    margin: '10px 1% 10px 0',
  }),
  attendeeContainer: css({
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  }),
  dateContainer: css({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  }),
  assigneeContainer: css({
    marginBottom: '0.5rem',
    background: drawerInputBackground,
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    alignItems: 'flex-start',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    border: 0,
    cursor: 'pointer',

    '&:disabled': {
      opacity: DEFAULT_OPACITY,
      cursor: 'no-drop',
    },
  }),
  label: css({
    flex: 0,
    color: palette.neutrals.gray700,
    marginBottom: '0.25rem',
    fontWeight: 400,
  }),
  assigneeButton: css({
    padding: 0,
    marginBottom: '0.3125rem',
    background: drawerInputBackground,
    color: palette.neutrals.gray400,
    fontWeight: 600,
    fontSize: '0.875rem',
  }),
  avatarStyles: css({
    marginRight: '10px',
  }),
  icon: css({
    display: 'flex',
    alignItems: 'center',
  }),
  avatarContainer: css({
    display: 'flex',
    alignItems: 'center',
  }),
  assigneeName: css({
    fontSize: '1rem',
    color: palette.neutrals.gray800,
  }),
  drawerBody: css({
    padding: '1.25rem 1.5rem 1.5rem 1.5rem',
    flex: 1,
  }),
  buttonContainer: (isEdit: boolean) => css({
    marginTop: '1.125rem',
    display: 'flex',
    alignItems: 'center',
  }, isEdit && {
    justifyContent: 'space-between',
  }),
  leftButtonContainer: css({
    display: 'flex',
    alignItems: 'center',
  }),
  saveButton: css({
    marginRight: '0.625rem',
  }),
  contextContainer: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  createdOn: css({
    alignSelf: 'flex-end',
    color: palette.neutrals.gray600,
    fontSize: '0.75rem',
  }),
  datePicker: css({
    padding: '0.5rem 0.75rem',
    marginBottom: '0.5rem',
    flex: 1,

    '& input': {
      fontWeight: 400,
      padding: 0,
      minHeight: 0,
    },
  }),
  datePickerLabel: css({
    display: 'flex',
    gap: '0.25rem',
    color: palette.neutrals.gray700,
    fontWeight: 400,
  }),
  caretIcon: css({
    color: palette.brand.indigo,
    fontSize: '1rem',
  }),
  statusOverrides: css({
    marginBottom: '0.5rem',
    padding: '0.5rem 0.75rem',

    '& div > div > span': css({
      fontWeight: 400,
    }),
  }),
  bulkCreateNotification: css({
    marginTop: '0.5rem',
  }),
  bulkCreateNotificationBody: css({
    display: 'flex',
    alignItems: 'center',
    color: palette.neutrals.gray800,
    fontWeight: 400,
  }),
  bulkCreateNotificationIcon: css({
    marginRight: '1rem',
    fontSize: '2.25rem',
    color: palette.brand.indigo,
  }),
  contextString: css({
    color: palette.neutrals.gray600,
    fontSize: '0.75rem',
  }),
  footer: (shouldBeSticky: boolean) => css({
    padding: '1.5rem',
    backgroundColor: palette.neutrals.gray50,
  }, shouldBeSticky && {
    position: 'sticky',
    bottom: 0,
  }),
  comments: css({
    backgroundColor: palette.neutrals.gray50,
  }),
  drawerBodyContainer: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }),
};

interface ViewProps {
  description?: string,
  renderAssociationIcon: () => JSX.Element
  creatorString?: string,
  completedString?: string,
  associationData?: AssociationData,
  isReadOnly: boolean,
  actionItemId?: string,
  actionItem?: ActionItem,
  onSubmit: (e: FormEvent<HTMLFormElement>) => void,
  assignees: Person[],
  dueDate?: Moment | null,
  setDueDate: (newDate: Moment | null) => void,
  text?: string,
  isLoading: boolean,
  onRecurrenceClick: () => void,
  showRecurrence: boolean,
  useRecurrence: boolean,
  recurrenceIsValid: boolean,
  setRecurrenceIsValid: Dispatch<SetStateAction<boolean>>,
  isMobile: boolean,
  isEdit: boolean,
  assigneesSelected: ParticipantWithRole<Goals.GoalParticipantRole.Viewer>[],
  setAssigneesSelected: Dispatch<SetStateAction<ParticipantWithRole<Goals.GoalParticipantRole.Viewer>[]>>,
  closeAddResourceModal: () => void,
}

const View = ({
  description,
  renderAssociationIcon,
  creatorString,
  completedString,
  associationData,
  isReadOnly,
  actionItemId,
  actionItem,
  assignees,
  onSubmit,
  dueDate,
  setDueDate,
  text,
  isLoading,
  onRecurrenceClick,
  showRecurrence,
  useRecurrence,
  recurrenceIsValid,
  setRecurrenceIsValid,
  isMobile,
  isEdit,
  assigneesSelected,
  setAssigneesSelected,
  closeAddResourceModal,
}: ViewProps): JSX.Element => (
  <>
    <form onSubmit={onSubmit}>
      <DrawerInput
        name="text"
        // Max length will not truncate strings set via value so we need to do so ourselves
        initialValue={text?.substring(0, 150) || actionItem?.text?.substring(0, 150) || ''}
        label="Title"
        maxLength={150}
        css={styles.drawerInput}
        data-test-id="actionItemTitle"
        disabled={isReadOnly}
        required
      />

      <Froala
        name="description"
        label="Description"
        styleOverrides={styles.description}
        richTextEditorProps={{
          initialValue: description || actionItem?.description,
        }}
        froalaConfigProps={{
          charCounterMax: 5000,
          charCounterCount: true,
        }}
        labelStyleOverrides={styles.descriptionLabel}
        isDisabled={isReadOnly}
      />

      <div css={styles.dateContainer}>
        <DatePicker
          clearable
          initialDate={dueDate}
          onDateSelected={({ date: newDate }) => setDueDate(newDate)}
          label="Due By"
          name="dueDate"
          disablePast={false}
          css={styles.datePicker}
          disabled={isReadOnly}
          rightIconType={() => (
            <div css={styles.icon}>
              <FontAwesomeIcon
                icon={faCaretDown}
                size="xs"
                css={styles.caretIcon}
              />
            </div>
          )}
        />

        {useRecurrence && (
        <RecurrenceToggleComponent
          dueDate={dueDate}
          showRecurrence={showRecurrence}
          onClick={onRecurrenceClick}
          disabled={isReadOnly}
        />
        )}
      </div>

      {useRecurrence && showRecurrence && dueDate && (
      <ActionItemRecurrence
        dueDate={dueDate}
        initialRecurrenceRule={actionItem?.recurrenceRule}
        onValidityChange={(newValidity) => setRecurrenceIsValid(newValidity)}
        disabled={isReadOnly}
      />
      )}

      <ActionItemStatusDropdown
        css={styles.statusOverrides}
        name="status"
        data-test-id="actionItemStatus"
        value={actionItem?.status}
        disabled={isReadOnly}
      />

      <DrawerInput
        name="externalLink"
        initialValue={actionItem?.externalLink ?? ''}
        label="External Link"
        css={styles.drawerInput}
        data-test-id="actionItemExternalLink"
        disabled={isReadOnly}
        rightIconType={actionItem?.externalLink && isURL(actionItem.externalLink) ? () => (
          <a href={actionItem.externalLink} target="_blank" rel="noreferrer">
            <FontAwesomeIcon css={styles.icon} icon={faArrowUpRightFromSquare} />
          </a>
        ) : undefined}
      />
      <ParticipantAndRoleSelector
        label="Assignees"
        onChange={(newValues: ParticipantWithRole<Goals.GoalParticipantRole.Viewer>[]) => setAssigneesSelected(newValues)}
        participants={assigneesSelected}
        disableRoleSelection
        roles={[
          {
            label: 'Viewer',
            value: Goals.GoalParticipantRole.Viewer,
          },
        ]}
      />
      {assignees.length > 1 && (
      <Alert
        css={styles.bulkCreateNotification}
        severity="info"
        icon={false}
      >
        <div css={styles.bulkCreateNotificationBody}>
          <FontAwesomeIcon
            css={styles.bulkCreateNotificationIcon}
            icon={faListCheck}
          />

          <div>
            Selecting multiple assignees will create an independent action item for each person.
          </div>
        </div>
      </Alert>
      )}

      {actionItemId && (
      <>
        <DrawerInput
          label="Associated With"
          name="associatedWith"
          initialValue={associationData ? associationData.text : ''}
          css={styles.drawerInput}
          leftIconType={renderAssociationIcon}
          data-test-id="actionItemAssociatedWith"
          disabled
        />

        <div css={styles.contextContainer}>
          <div data-test-id="actionItemCreatorString" css={styles.contextString}>
            {creatorString}
          </div>

          <div data-test-id="actionItemCompletedString" css={styles.contextString}>
            {completedString}
          </div>
        </div>
      </>
      )}

      <div css={styles.buttonContainer(isEdit)}>
        <div css={styles.leftButtonContainer}>
          {assigneesSelected.length === 0 && (
            <Tooltip content="Please select at least one assignee">
              <div>
                <JoshButton
                  css={styles.saveButton}
                  data-test-id="actionItemsSaveButton"
                  size={isMobile ? 'small' : 'standard'}
                  disabled={(showRecurrence && !recurrenceIsValid) || isLoading || isReadOnly || assigneesSelected.length === 0}
                  type="submit"
                >
                  { actionItem ? 'Update' : 'Save' }
                </JoshButton>
              </div>
            </Tooltip>
          )}
          {assigneesSelected.length !== 0 && (
          <JoshButton
            css={styles.saveButton}
            data-test-id="actionItemsSaveButton"
            size={isMobile ? 'small' : 'standard'}
            disabled={(showRecurrence && !recurrenceIsValid) || isLoading || isReadOnly || assigneesSelected.length === 0}
            type="submit"
          >
            { actionItem ? 'Update' : 'Save' }
          </JoshButton>
          )}
          {actionItemId && (
          <JoshButton
            name={FormSubmittedByButton.COMPLETE_ACTION_ITEM_BUTTON}
            disabled={isReadOnly || isLoading}
            data-test-id="actionItemCompleteButton"
            size={isMobile ? 'small' : 'standard'}
            type="submit"
          >
            <JoshButton.IconAndText
              icon={faCheck}
              text={actionItem?.status === NewActionItemStatus.Completed ? 'Mark Incomplete' : 'Mark Complete'}
            />
          </JoshButton>
          )}
        </div>
        <JoshButton
          onClick={closeAddResourceModal}
          variant="ghost"
          size={isMobile ? 'small' : 'standard'}
          data-test-id="actionItemsCancel"
        >
          Cancel
        </JoshButton>
      </div>
    </form>
  </>
);

interface NewActionItemProps {
  id?: string,
  context?: ActionItemContext,
  text?: string,
  description?: string,
  hasAdminPermission?: boolean,
  setupAddResourceValidations: (data: Promise<HttpCallReturn<string>>) => void,
}

export const NewActionItem = ({
  id,
  context,
  text,
  description,
  hasAdminPermission = false,
  setupAddResourceValidations,
}: NewActionItemProps): JSX.Element => {
  const [dueDate, setDueDate] = useState<Moment | null>();
  const [assigneesSelected, setAssigneesSelected] = useState<ParticipantWithRole<Goals.GoalParticipantRole.Viewer>[]>([]);
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrenceIsValid, setRecurrenceIsValid] = useState(false);
  const { peopleData } = useNewPeople({}) as unknown as Record<string, Record<string, Person>>;
  const isMobile = useIsMobileQuery();
  const { featureNamesText } = useGetFeatureNamesText();

  const { mutate: doCreateActionItem, isPending: isCreatingActionItem } = useCreateActionItems();
  const { mutate: doEditActionItem, isPending: isEditingActionItem } = useEditActionItem({ drawerName: createEditActionItemTemplate.name });

  const currentUserOrgId = getOrganizationUserId();
  const currentUserId = getUserId();
  const { data: actionItemData } = useActionItemDetails({ id });
  const actionItem = actionItemData?.response;
  const isEdit = false;

  const selectedIds = [currentUserId];
  const assigneesData = usePeoplePickerByList({ selectedIds }) as Person[];

  const creator = actionItem?.creatorId ? peopleData?.[actionItem.creatorId] : undefined;
  const createdOnDate = moment(actionItem?.createdInMillis).format('MMM D, YYYY');

  const creatorString = useMemo(() => (
    `Created by ${creator?.firstName ?? ''} ${creator?.lastName ?? ''} on ${createdOnDate}`
  ), [creator, createdOnDate]);

  const completedString = useMemo(() => {
    const completer = actionItem?.completedById ? peopleData?.[actionItem.completedById] : undefined;
    const completedOnDate = moment(actionItem?.completedInMillis).format('MMM D, YYYY');

    if (actionItem?.completedInMillis) {
      return `Completed by ${completer?.firstName ?? ''} ${completer?.lastName ?? ''} on ${completedOnDate}`;
    }

    return '';
  }, [actionItem, peopleData]);

  const isReadOnly = isEdit && !(currentUserOrgId === actionItem?.creatorId || currentUserOrgId === actionItem?.assigneeId) && !hasAdminPermission;

  const filteredAssignees = useMemo(() => (assigneesData.filter((attId) => attId !== undefined)), [assigneesData]);
  const assignees = useMemo(() => (
    filteredAssignees.map((assigneeData) => ({
      userId: assigneeData.userId,
      orgUserId: assigneeData.orgUserId,
    }))
  ), [filteredAssignees]);

  useEffect(() => {
    if (actionItem) {
      if (actionItem.dueDateInMillis) {
        setDueDate(moment(actionItem.dueDateInMillis));
      }

      setShowRecurrence(!!actionItem.isRecurring);
    }
  }, [actionItem]);

  const associationData = useMemo(() => (
    getAssociationData({
      contextType: actionItem?.context,
      includeTitle: true,
      featureNamesText,
    })
  ), [actionItem?.context, featureNamesText]);

  const onRecurrenceClick = (): void => {
    setShowRecurrence(!showRecurrence);
  };

  const renderAssociationIcon = useCallback(() => (
    <>
      {associationData && (
        <FontAwesomeIcon
          icon={associationData.icon}
        />
      )}
    </>
  ), [associationData]);

  const createActionItem = useCallback((createActionItemData: CreateActionItemData): void => {
    doCreateActionItem({
      actionItems: [
        createActionItemData,
      ],
      context,
      // @ts-expect-error - This is type string but I do not want to change the hook as that could break other things
    }, { onSuccess: setupAddResourceValidations });
  }, [doCreateActionItem, context, setupAddResourceValidations]);

  const editActionItem = useCallback((editActionItemData: EditActionItemData, shouldToggleCompleted = false) => {
    if (actionItem) {
      const isCompleted = actionItem?.status === NewActionItemStatus.Completed;

      const updatedActionItem = updatedValues(actionItem, editActionItemData);

      if (shouldToggleCompleted) {
        doEditActionItem({
          id: actionItem.id,
          actionItem: {
            ...updatedActionItem,
            status: isCompleted ? NewActionItemStatus.ToDo : NewActionItemStatus.Completed,
          },
          context: actionItem.context,
        });
      } else {
        doEditActionItem({
          id: actionItem.id,
          actionItem: updatedActionItem,
          context: actionItem.context,
        });
      }
    }
  }, [
    actionItem,
    doEditActionItem,
  ]);

  const {
    setResourceContentDueDate,
    setResourceContentTitle,
    closeAddResourceModal,
    pdpOwnerId,
    setResourceContentStatus,
  } = useAddResourceModalStore((state) => ({
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
    closeAddResourceModal: state.closeAddResourceModal,
    setResourceContentStatus: state.setResourceContentStatus,
    pdpOwnerId: state.pdpOwnerId,
  }));

  const isPDPCreation: boolean = !!pdpOwnerId && pdpOwnerId !== '';

  const actionItemsStatusLookup: [NewActionItemStatus, CompetencyResourceStatusEnum][] = useMemo(() => [
    [NewActionItemStatus.ToDo, CompetencyResourceStatusEnum.ToDo],
    [NewActionItemStatus.InProgress, CompetencyResourceStatusEnum.InProgress],
    [NewActionItemStatus.Blocked, CompetencyResourceStatusEnum.Blocked],
    [NewActionItemStatus.Completed, CompetencyResourceStatusEnum.Completed],
  ], []);

  useEffect(() => {
    if (isPDPCreation) {
      const pdpAssignee: ParticipantWithRole<Goals.GoalParticipantRole.Viewer> = {
        orgUserId: pdpOwnerId || '',
        role: Goals.GoalParticipantRole.Viewer,
      };
      setAssigneesSelected([pdpAssignee]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const actionItemFormData = Object.fromEntries(formData.entries()) as unknown as ActionItemFormData;
    if (actionItemFormData.dueDate) {
      setResourceContentDueDate(new Date(actionItemFormData.dueDate));
    }
    setResourceContentStatus(actionItemsStatusLookup.find(([status]) => status === actionItemFormData.status)?.[1] || CompetencyResourceStatusEnum.ToDo);
    setResourceContentTitle(actionItemFormData.text);
    let dueDateInMillis;

    const assignedAssigneesData = getActionItemPeopleData(assigneesSelected, peopleData);

    if (actionItemFormData.dueDate) {
      dueDateInMillis = moment(actionItemFormData.dueDate, 'MM/DD/YYYY').valueOf();
    }

    const newActionItemData = {
      description: actionItemFormData?.description,
      dueDateInMillis,
      externalLink: actionItemFormData.externalLink,
      text: actionItemFormData.text,
      status: actionItemFormData.status,
      isRecurring: showRecurrence,
      recurrenceRule: actionItemFormData.recurrenceRule,
    };

    if (id) {
      editActionItem({
        assigneeId: assignees?.[0]?.orgUserId,
        assigneeUserId: assignees?.[0]?.userId,
        ...newActionItemData,
        // @ts-expect-error - nativeEvent is not defined in the type definition
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      }, e.nativeEvent.submitter.name === FormSubmittedByButton.COMPLETE_ACTION_ITEM_BUTTON);
    } else {
      createActionItem({
        assignees: assignedAssigneesData,
        ...newActionItemData,
      });
    }
  // eslint-disable-next-line max-len
  }, [setResourceContentStatus, actionItemsStatusLookup, setResourceContentTitle, assigneesSelected, peopleData, showRecurrence, id, setResourceContentDueDate, editActionItem, assignees, createActionItem]);

  // Changing this to update effect because it's causing a weird condition between loading the edited action item.
  useUpdateEffect(() => {
    if (!dueDate) {
      setShowRecurrence(false);
    }
  }, [dueDate]);

  const hookProps = {
    description,
    creatorString,
    completedString,
    renderAssociationIcon,
    associationData,
    actionItemId: '',
    isReadOnly,
    actionItem,
    assignees: filteredAssignees,
    onSubmit,
    dueDate,
    setDueDate,
    isLoading: isCreatingActionItem || isEditingActionItem,
    text,
    showRecurrence,
    onRecurrenceClick,
    useRecurrence: true,
    recurrenceIsValid,
    setRecurrenceIsValid,
    isMobile,
    isEdit,
    assigneesSelected,
    setAssigneesSelected,
    closeAddResourceModal,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
