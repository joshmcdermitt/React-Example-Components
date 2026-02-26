import {
  InferType,
  mixed,
  number,
  object,
  string,
} from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Goals } from '@josh-hr/types';

const integerValidation = (value: number | undefined): boolean => {
  if (!Number.isInteger(value) || String(value).includes('.')) {
    return false;
  }
  return true;
};

export const createStatusUpdateFormSchema = object({
  completionPercentage: number()
    .typeError('Percentage must be a whole number between 0 - 100.')
    .min(0).max(100, 'Percentage must be a whole number between 0 - 100.')
    .test('integer', 'Percentage must be a whole number between 0 - 100.', (value) => integerValidation(value))
    .required(),
  status: mixed<Goals.GoalStatus>().oneOf(Object.values(Goals.GoalStatus)).required(),
  statusCommentary: string().trim(),
});

export const createStatusUpdateFormResolver = yupResolver(createStatusUpdateFormSchema);
export type FormValues = InferType<typeof createStatusUpdateFormSchema>;
