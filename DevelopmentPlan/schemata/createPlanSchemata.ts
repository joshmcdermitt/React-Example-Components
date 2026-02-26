import {
  date,
  object,
  string,
  array,
  bool,
} from 'yup';
import type { InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Goals } from '@josh-hr/types';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import moment from 'moment';

const requiredMsg = {
  name: 'You must provide a plan title.',
  startDate: 'You must provide a start date.',
  endDate: 'You must provide a end date.',
  mentorId: 'You cannot be your own mentor.',
  mentorIdEmpty: 'Please select a mentor.',
};
const currentUserID = getOrganizationUserId() ?? '';

export const createPlanFormSchema = object({
  name: string().trim().required(requiredMsg.name),
  summary: string().trim(),
  startDate: date().required(requiredMsg.startDate),
  endDate: date().required(requiredMsg.endDate)
    .test('endTime', 'End Date must be equal or greater than Start Time', function isEndTimeValid(value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const startTime = this.parent.startDate;
      return startTime === undefined || value === undefined || value >= startTime;
    }),
  viewers: array().of(
    object({
      orgUserId: string().trim().required(),
      role: string().oneOf(Object.values(Goals.GoalParticipantRole)).trim().required(),
    }),
  ),
  mentorId: string().required(requiredMsg.mentorIdEmpty).test({
    name: 'check-mentor',
    message: requiredMsg.mentorId,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    test: (value, ctx) => value == null || value === '' || value !== currentUserID || ctx.parent.isMentor !== false,
  }),
  isMentor: bool().required(),
});
export const createPlanFormResolver = yupResolver(createPlanFormSchema);

export type FormValues = InferType<typeof createPlanFormSchema>;

export interface CreatePlanDTO {
  name: string,
  summary: string,
  startDate: Date,
  endDate: Date,
  viewers:string[];
  mentorId: string;
}

export function conformToDto(data: FormValues): CreatePlanDTO {
  const filteredParticipants = data?.viewers?.map((viewer) => viewer.orgUserId) ?? [];

  const startDate = moment(data.startDate);
  const endDate = moment(data.endDate);
  const isSameDay = startDate.isSame(endDate, 'day');

  const updatedEndDate = isSameDay
    ? endDate.add(1, 'day').toDate()
    : data.endDate;

  const result: CreatePlanDTO = {
    name: data.name ?? '',
    summary: data.summary ?? '',
    startDate: data.startDate ?? new Date(),
    endDate: updatedEndDate ?? new Date(),
    viewers: filteredParticipants,
    mentorId: data.mentorId ?? '',
  };
  return result;
}
