import { yupResolver } from '@hookform/resolvers/yup';
import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { Resolver } from 'react-hook-form';
import {
  boolean,
  object,
  string,
  array,
  number,
  mixed,
  SchemaOf,
} from 'yup';
import { MAX_EXTERNAL_LINK_LENGTH } from '~Goals/const';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import validateMeasurementScaleMetadata from './validateMeasurementScaleMetadata';

export type CreateEditGoalFormValues = Goals.Requests.CreateGoalRequestPayload;
interface RequiredMessageParams {
  featureNamesText: FeatureNamesText,
}

interface RequiredMessageReturn {
  title: string,
  description: string,
  contextType: string,
  team: string,
  owner: string,
}

const getRequiredMessage = ({ featureNamesText }: RequiredMessageParams): RequiredMessageReturn => ({
  title: 'Please enter a title.',
  description: 'The Description field is required.',
  contextType: `The ${featureNamesText.goals.singular} Type field is required.`,
  team: 'Please select a team.',
  owner: 'Please select an owner.',
});

interface CreateEditGoalFormSchemaParams {
  featureNamesText: FeatureNamesText,
}

const getCreateEditGoalFormSchema = ({ featureNamesText }: CreateEditGoalFormSchemaParams): SchemaOf<CreateEditGoalFormValues> => object({
  title: string().trim().required(getRequiredMessage({ featureNamesText }).title),
  description: string().trim(),
  participants: array().of(
    object({
      orgUserId: string().trim().required(),
      role: string().oneOf(Object.values(Goals.GoalParticipantRole)).trim().required(),
    }),
  ),
  priority: mixed<Goals.GoalPriority>()
    .oneOf(
      Object.values(Goals.GoalPriority).filter((value): value is Goals.GoalPriority => typeof value === 'number'),
    )
    .notRequired(),
  context: object({
    contextType: string().trim().required(getRequiredMessage({ featureNamesText }).contextType),
    contextId: string()
      .trim()
      .when('contextType', {
        is: Goals.GoalContextType.Team,
        then: string()
          .required(getRequiredMessage({ featureNamesText }).team).nullable(), // Require when contextType is 'Team'
        otherwise: string().nullable(), // Allow null for other types of contextType
      }),
  }),
  category: string().trim(),
  externalLink: string().trim().max(MAX_EXTERNAL_LINK_LENGTH, `The external link is limited to ${MAX_EXTERNAL_LINK_LENGTH} characters.`),
  isPrivate: boolean().required(),
  startTimeInMillis: number().required(),
  endTimeInMillis: number()
    .required()
    .test('endTime', 'The start date must be before the end date', function isEndTimeValid(value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const startTime = this.parent.startTimeInMillis;
      return startTime === undefined || value === undefined || value >= startTime;
    }),
  measurementScaleTypeId: number().required(),
  measurementUnitTypeId: number().notRequired(),
  measurementScaleMetadata: array().notRequired()
    .of(
      object({
        id: number().required(),
        value: number().required('Please enter a value.'),
      }),
    )
    .test(
      'validate-measurementScaleMetadata',
      'Invalid measurement scale values',
      // @ts-expect-error We don't pass the description to the BE for these
      (value, context) => (value ? validateMeasurementScaleMetadata(value, context) : true),
    ),
}) as unknown as SchemaOf<CreateEditGoalFormValues>;

interface GetCreateEditFormResolverParams {
  featureNamesText: FeatureNamesText,
}

interface GetCreateEditFormResolverReturn {
  schema: SchemaOf<CreateEditGoalFormValues>,
  formResolver: Resolver<CreateEditGoalFormValues>,
}

const getCreateEditFormResolver = ({ featureNamesText }: GetCreateEditFormResolverParams): GetCreateEditFormResolverReturn => {
  const schema = getCreateEditGoalFormSchema({ featureNamesText });
  const formResolver = yupResolver(schema);

  return {
    schema,
    formResolver,
  };
};

interface CreateEditFormResolver {
  schema: SchemaOf<CreateEditGoalFormValues>,
  formResolver: Resolver<CreateEditGoalFormValues>,
}

const useGetCreateEditFormResolver = (): CreateEditFormResolver => {
  const { featureNamesText } = useGetFeatureNamesText();

  const { schema, formResolver } = useMemo(() => getCreateEditFormResolver({ featureNamesText }), [featureNamesText]);

  return {
    schema,
    formResolver,
  };
};

export default useGetCreateEditFormResolver;
