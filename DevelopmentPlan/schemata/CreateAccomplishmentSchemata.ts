import {
  object,
  date,
  string,
} from 'yup';
import type { InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const requiredMsg = {
  date: 'Please select a date.',
  title: 'You must add a title',
  description: 'You must add a description',
};

export const createAccomplishmentFormSchema = object({
  date: date().required(requiredMsg.date),
  title: string().required(requiredMsg.title),
  description: string().trim().required(requiredMsg.description),
  orgUserId: string(),
});
export const createAccomplishmentFormResolver = yupResolver(createAccomplishmentFormSchema);

export type FormValues = InferType<typeof createAccomplishmentFormSchema>;

export interface CreateAccomplishmentDTO {
  date: Date,
  title: string,
  description: string,
  orgUserId: string,
}

export function conformToDto(data: FormValues): CreateAccomplishmentDTO {
  const result: CreateAccomplishmentDTO = {
    date: data.date,
    title: data.title,
    description: data.description ?? '',
    orgUserId: data.orgUserId ?? '',
  };
  return result;
}
