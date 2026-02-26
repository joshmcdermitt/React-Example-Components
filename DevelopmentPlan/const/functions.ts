import {
  IconDefinition, faCircle, faSquare,
} from '@fortawesome/pro-solid-svg-icons';
import {
  faBooks, faBullseyeArrow, faCalendar, faFlag, faListCheck, faMessages, faClose,
  faPencil, faSquareCheck, faTrash, faRotateRight, faLinkSlash, faStar, faBriefcase, faBook,
} from '@fortawesome/pro-light-svg-icons';
import { MenuItem } from '~Meetings/components/shared/ActionMenu';
import { ActionItemDataAssignee } from '~ActionItems/hooks/useCreateActionItems';
import { ParticipantWithRole } from '~Common/V3/components/ParticipantAndRoleSelector';
import { Person } from '~Common/const/interfaces';
import { Goals, OrgUser } from '@josh-hr/types';
import { SyntheticEvent } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import moment from 'moment';
import { CreateResourceDTO } from '~DevelopmentPlan/schemata/addResourceSchemata';
import { queryClient } from '~Common/const/queryClient';
import {
  PDPPermissions, PDPStatusEnum, ResourceType, PersonalDevelopmentTypeOption, PlotPoint, ActionMenuActions,
  Competency, FoundCompetencyResult, Comment, AnalyzeFinalThoughtsProps,
  CompetencyResourceStatusDescriptionType,
} from './types';
import { DEFAULT_ID, LabelType, TIMELINE_THRESHOLD } from './defaults';
import { pdpPlanKeys } from './queryKeys';

export function getPersonalDevelopmentStatusIcon(status: number): IconDefinition {
  if (status === PDPStatusEnum.Completed) {
    return faSquare;
  }

  return faCircle;
}
export function getResourceStatusIcon(status: CompetencyResourceStatusDescriptionType): IconDefinition {
  const squareStatuses = [
    CompetencyResourceStatusDescriptionType.Completed,
    CompetencyResourceStatusDescriptionType.PartiallyCompleted,
    CompetencyResourceStatusDescriptionType.Complete,
    CompetencyResourceStatusDescriptionType.Missed,
    CompetencyResourceStatusDescriptionType.Cancelled,
  ];

  if (squareStatuses.includes(status)) {
    return faSquare;
  }

  return faCircle;
}

export function getPersonalDevelopmentTypeIcon(status: number): IconDefinition {
  switch (status) {
    case ResourceType.All:
      return faFlag;
    case ResourceType.Goal:
      return faBullseyeArrow;
    case ResourceType.Learning:
      return faBooks;
    case ResourceType.Feedback:
      return faMessages;
    case ResourceType.ActionItem:
      return faListCheck;
    case ResourceType.Accomplishment:
      return faStar;
    case ResourceType.Meeting:
      return faBriefcase;
    case ResourceType.LearningPlaylist:
      return faBook;
    default:
      return faFlag;
  }

  return faCircle;
}

export const setDetailMenuItems = (
  permissions: PDPPermissions[],
  handleActionmenuClick: (type: ActionMenuActions, id: number, event?: SyntheticEvent<HTMLElement, Event>) => void,
  pdpId: number,
  isDraft = false,
): MenuItem[][] => {
  const canEdit = permissions?.includes(PDPPermissions.CanEdit) ?? false;
  const canComplete = permissions?.includes(PDPPermissions.CanComplete) ?? false;
  const canDelete = permissions?.includes(PDPPermissions.CanDelete) ?? false;
  const canUnlink = permissions?.includes(PDPPermissions.CanUnlink) ?? false;
  const canClose = permissions?.includes(PDPPermissions.CanClose) ?? false;
  const canReopen = permissions?.includes(PDPPermissions.canReopen) ?? false;

  const items: MenuItem[] = [];

  if (canUnlink) {
    items.push({
      text: 'Unlink',
      icon: faLinkSlash,
      onClick: (e) => handleActionmenuClick(ActionMenuActions.Unlink, pdpId, e),
    });
  }

  if (canComplete) {
    items.push(
      {
        text: 'Mark Complete',
        icon: faSquareCheck,
        onClick: () => handleActionmenuClick(ActionMenuActions.MarkComplete, pdpId),
      },
    );
  }
  if (canReopen) {
    items.push({
      text: 'Reopen Plan',
      icon: faRotateRight,
      onClick: () => handleActionmenuClick(ActionMenuActions.ReOpenPlan, pdpId),
    });
  }

  if (canEdit) {
    items.push(
      {
        text: 'Edit Competencies',
        icon: faPencil,
        onClick: () => handleActionmenuClick(ActionMenuActions.EditCompetencies, pdpId),
      },
      {
        text: 'Edit Details',
        icon: faCalendar,
        onClick: () => handleActionmenuClick(ActionMenuActions.EditDetails, pdpId),
      },
    );
  }
  if (canClose) {
    items.push({
      text: 'Close Plan',
      icon: faClose,
      onClick: () => handleActionmenuClick(ActionMenuActions.ClosePlan, pdpId),
    });
  }

  if (canDelete) {
    items.push({
      text: 'Delete Plan',
      icon: faTrash,
      onClick: () => handleActionmenuClick(ActionMenuActions.DeletePlan, pdpId),
    });
  }

  if (isDraft) {
    return [items.filter((item) => item.text === 'Delete Plan')];
  }
  return [items];
};

interface GenerateCompetencyFilterDataReturn {
  competencyLabels: LabelType;
  transformedArray: PersonalDevelopmentTypeOption[];
}

export type CompetencySelectObj = {
  id: number;
  name: string;
};
export const GenerateCompetencyFilterData = (uniqueCompetencyNames: CompetencySelectObj[]): GenerateCompetencyFilterDataReturn => {
  // Create CompetencyLabels object dynamically
  const competencyNameToLabelMapping: LabelType = uniqueCompetencyNames.reduce((acc: LabelType, competency: CompetencySelectObj) => {
    const newAcc = { ...acc };
    newAcc[competency.id] = competency.name;
    return newAcc;
  }, {});

  // Transform into object array
  const transformedArray: PersonalDevelopmentTypeOption[] = uniqueCompetencyNames.map((competencyObj) => ({
    value: competencyObj.id,
    text: competencyObj.name,
  })) as PersonalDevelopmentTypeOption[];

  // Create CompetencyLabels object
  const competencyLabels: LabelType = transformedArray.reduce((acc: LabelType, { value, text }: PersonalDevelopmentTypeOption) => {
    const newAcc = { ...acc };
    newAcc[value] = competencyNameToLabelMapping[text] || text; // Use the mapping if available, otherwise use the original text
    return newAcc;
  }, {});

  return {
    competencyLabels,
    transformedArray,
  };
};

export const groupByPercentageDifference = (data: PlotPoint[] | undefined, threshold: number): { groupedData: PlotPoint[][], ungroupedData: PlotPoint[] } => {
  if (!data || data.length === 0) {
    return { groupedData: [], ungroupedData: [] };
  }

  const filteredArray = data
    .filter((obj) => {
      const percentageValue = Math.round(obj.percentage);
      return data.some((otherObj) => otherObj !== obj && Math.abs(Math.round(otherObj.percentage) - percentageValue) <= TIMELINE_THRESHOLD);
    })
    .sort((a, b) => {
    // Parse contentDueDate into Moment objects before comparing
      const dateA = moment(a.competencyResource.contentDueDate);
      const dateB = moment(b.competencyResource.contentDueDate);
      return dateA.diff(dateB);
    });

  const result: PlotPoint[][] = [];
  const ungrouped: PlotPoint[] = [];

  filteredArray.forEach((obj) => {
    const existingGroup = result.find((group) => group.some((item) => Math.abs(Math.round(item.percentage) - Math.round(obj.percentage)) <= threshold));

    if (existingGroup) {
      existingGroup.push(obj);
    } else {
      result.push([obj]);
    }
  });

  const ungroupedItem = result.find((group) => group.length === 1);

  if (ungroupedItem) {
    const closestGroup = result.reduce((closest, group) => {
      const closestItem = group[0];
      const currentDiff = Math.abs(Math.round(closestItem.percentage) - Math.round(ungroupedItem[0].percentage));
      const newDiff = Math.abs(Math.round(group[0].percentage) - Math.round(ungroupedItem[0].percentage));
      return newDiff < currentDiff ? group : closest;
    }, []);

    closestGroup.push(...ungroupedItem);
  }

  result.forEach((group) => ungrouped.push(...group));
  const uniqueUngrouped = data.filter((item) => !ungrouped.includes(item));
  return { groupedData: result, ungroupedData: uniqueUngrouped };
};

// eslint-disable-next-line max-len
export const getActionItemPeopleData = (participants: ParticipantWithRole<Goals.GoalParticipantRole.Viewer>[], peopleObject: Record<string, Person>): ActionItemDataAssignee[] => {
  const resultArray = [] as ActionItemDataAssignee[];

  participants.forEach((item) => {
    const match = peopleObject[item.orgUserId];
    if (match) {
      resultArray.push({
        userId: match.userId,
        orgUserId: match.orgUserId,
      });
    }
  });

  return resultArray;
};

export const convertStringToAddSpacesToCapitalLetters = (inputString: string): string => {
  if (!inputString) {
    return '';
  }

  return inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
};
export const findCompetencyInfo = (competencies: Competency[], resourceId: number): FoundCompetencyResult => {
  const foundCompetency = competencies.find((competency) => competency.resources && competency.resources.some((resource) => resource.id === resourceId));

  if (foundCompetency) {
    return { name: foundCompetency.name, id: foundCompetency.id };
  }
  return { name: 'Not Found', id: -1 };
};

interface getStartDateAndEndDateReturn {
  startDate: string | undefined;
  endDate: string | undefined;
}

// I noticed that we are calling the endpoint on invalid dates. So if the user is slow enough, they can get an error. This function will prevent that.
export const getDateRangeDates = (dateRangeValue: DateRange<Date> | undefined): getStartDateAndEndDateReturn => {
  if (dateRangeValue && dateRangeValue.length === 2) {
    const startDate = moment(dateRangeValue[0]).format('YYYY-MM-DD');
    const endDate = moment(dateRangeValue[1]).format('YYYY-MM-DD');
    if (moment(startDate, 'YYYY-MM-DD', true).isValid() && moment(endDate, 'YYYY-MM-DD', true).isValid()) {
      return { startDate, endDate };
    }
  }

  return { startDate: undefined, endDate: undefined };
};

export const openInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noreferrer');
};

export const findCompetencyId = (mainObj: PlotPoint[], contentIdToFind: string): number => {
  const competency = mainObj[0]?.competencyResource?.competencies?.find((comp) => (
    comp.resources?.some((resource) => resource.contentId === contentIdToFind)
  ));

  return competency ? competency.id : DEFAULT_ID;
};

export const checkForFinalThought = (finalThoughts:Comment[] | undefined, userId: string): boolean => {
  if (finalThoughts?.some((comment) => comment.createdBy.orgUserId === userId)) {
    return true;
  }
  return false;
};

export const analyzeFinalThoughts = (
  finalThoughts: Comment[] | undefined,
  mentor: OrgUser | undefined,
  owner: OrgUser | undefined,
): AnalyzeFinalThoughtsProps => {
  const ownerId = owner?.orgUserId ?? '';
  const mentorId = mentor?.orgUserId ?? '';
  const hasMentor = (finalThoughts?.some((item) => item.createdBy.orgUserId === mentorId)) || false;
  const hasOwner = (finalThoughts?.some((item) => item.createdBy.orgUserId === ownerId)) || false;

  let missingPerson: OrgUser | undefined;

  if (hasMentor && !hasOwner) {
    missingPerson = owner;
  } else if (!hasMentor && hasOwner) {
    missingPerson = mentor;
  }

  const hasBothComments = hasMentor && hasOwner;

  return {
    showBlankState: !hasBothComments,
    hasOwner,
    hasMentor,
    missingPerson,
  };
};

export const checkShouldCreateResource = (data: CreateResourceDTO, pdpId: string): boolean => {
  const { competencyId, contentId } = data;
  const previousReceivedCompetencyList = queryClient.getQueryData(pdpPlanKeys.competencies(pdpId));
  // @ts-expect-error TODO: THis is there
  const competencyList = previousReceivedCompetencyList?.response as Competency[];

  const matchingCompetency = competencyList.find((item) => item.id === competencyId);

  if (matchingCompetency && matchingCompetency.resources) {
    return matchingCompetency.resources.some((resource) => resource.contentId === contentId);
  }

  return false;
};

export const truncateTitle = (string = '', maxLength = 50): string => (string.length > maxLength
  ? `${string.substring(0, maxLength)}…`
  : string);
