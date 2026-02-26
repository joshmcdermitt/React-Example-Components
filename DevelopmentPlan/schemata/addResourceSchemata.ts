import {
  object,
  number,
  string,
  date,
} from 'yup';
import type { InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DEFAULT_DATE, DEFAULT_RESOURCE_TITLE } from '~DevelopmentPlan/const/defaults';
import { CompetencyResourceStatusEnum, ResourceType } from '~DevelopmentPlan/const/types';

const requiredMsg = {
  competency: 'Please select a competency.',
  content: 'You must select a resource',
  type: 'Seems the resource type is missing. Please close this and try again.',
  contentTitle: 'Seems the resource title is missing. Please close this and try again.',
};

export const createResourceFormSchema = object({
  competencyId: number().required(requiredMsg.competency),
  contentTypeId: number().required(requiredMsg.type),
  contentId: string().trim().required(requiredMsg.content),
  contentTitle: string().trim()
    .test('contentTitle', 'Did not get the resource title. Please check the existing tab and try again', (value) => value !== DEFAULT_RESOURCE_TITLE)
    .required(requiredMsg.contentTitle),
  contentDueDate: date(),
  contentStatus: number(),
});
export const createResourceFormResolver = yupResolver(createResourceFormSchema);

export type FormValues = InferType<typeof createResourceFormSchema>;

export interface CreateResourceDTO {
  competencyId: number | undefined,
  contentTypeId: ResourceType,
  contentId: string | number,
  contentTitle: string,
  contentDueDate?: Date,
  contentStatus?: CompetencyResourceStatusEnum,
}

export function conformToDto(data: FormValues): CreateResourceDTO {
  const result: CreateResourceDTO = {
    competencyId: data.competencyId,
    contentTypeId: data.contentTypeId,
    contentId: data.contentId,
    contentStatus: data.contentStatus,
    contentDueDate: data.contentDueDate,
    contentTitle: data.contentTitle,
  };
  // Since we are resetting to default values, we need to check to make sure they are not the default values
  if (data.contentTitle !== DEFAULT_RESOURCE_TITLE && data.contentTitle !== undefined) {
    result.contentTitle = data.contentTitle;
  }
  if (data.contentDueDate !== DEFAULT_DATE && data.contentTitle !== undefined) {
    result.contentDueDate = data.contentDueDate;
  }
  return result;
}
