import {
  boolean,
  mixed,
  number,
  object,
  SchemaOf,
  string,
} from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Goals } from '@josh-hr/types';

export type CreateEditStatusUpdateFormValues = Goals.Requests.CreateGoalStatusUpdateRequestPayload;

export const createStatusUpdateFormSchema = object({
  value: number().required('Please enter current value'),
  status: mixed<Goals.GoalStatus>().oneOf(Object.values(Goals.GoalStatus)).required(),
  statusCommentary: string().trim(),
  isAchieved: boolean(),
}) as unknown as SchemaOf<CreateEditStatusUpdateFormValues>;

export const createEditStatusUpdateFormResolver = yupResolver(createStatusUpdateFormSchema);
