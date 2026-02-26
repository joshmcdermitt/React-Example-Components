import {
  object,
  string,
} from 'yup';
import type { InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const requiredMsg = {
  name: 'The desired competency field is required',
  decription: 'The description field is required.',
};

export const createCompetencyFormSchema = object({
  name: string().trim().required(requiredMsg.name),
  description: string().trim().required(requiredMsg.decription),
});
export const createCompetencyResolver = yupResolver(createCompetencyFormSchema);

export type FormValues = InferType<typeof createCompetencyFormSchema>;

export interface CreateCompetencyDTO {
  name: string,
  description: string,
}

export function conformToDto(data: FormValues): CreateCompetencyDTO {
  const result: CreateCompetencyDTO = {
    name: data.name ?? '',
    description: data.description ?? '',
  };
  return result;
}
