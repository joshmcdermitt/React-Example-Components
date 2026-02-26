import {
  bool,
  object,
  string,
} from 'yup';
import type { InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getOrganizationUserId } from '~Common/utils/localStorage';

const requiredMsg = {
  content: 'Please add your comment.',
};

export const createCommentFormSchema = object({
  content: string().trim().required(requiredMsg.content),
  isFinalThought: bool().default(false),
});
export const createCommentResolver = yupResolver(createCommentFormSchema);

export type FormValues = InferType<typeof createCommentFormSchema>;

export interface CreateCommentDTO {
  content: string,
  commenterId: string,
  isFinalThought: boolean,
}

export function conformToDto(data: FormValues): CreateCommentDTO {
  const result: CreateCommentDTO = {
    content: data.content ?? '',
    commenterId: getOrganizationUserId() ?? '',
    isFinalThought: data.isFinalThought ?? false,
  };
  return result;
}
