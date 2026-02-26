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
import { DEFAULT_TEAM_ID } from '~Goals/const/defaults';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

export type CreateEditGoalFormValues = Goals.Requests.CreateGoalRequestPayload;

interface RequiredMessageParams {
  featureNamesText: FeatureNamesText,
}

interface RequiredMessageReturn {
  title: string,
  titleMaxLength: string,
  description: string,
  contextType: string,
  team: string,
  owner: string,
}

const getRequiredMessage = ({ featureNamesText }: RequiredMessageParams): RequiredMessageReturn => ({
  title: 'The Title field is required.',
  titleMaxLength: 'The Title must not exceed 70 characters.',
  description: 'The Description field is required.',
  contextType: `The ${featureNamesText.goals.singular} Type field is required.`,
  team: 'Please select a team.',
  owner: 'Please select an owner.',
});

interface CreateEditGoalFormSchemaParams {
  featureNamesText: FeatureNamesText,
}

const getCreateEditGoalFormSchema = ({ featureNamesText }: CreateEditGoalFormSchemaParams): SchemaOf<CreateEditGoalFormValues> => object({
  title: string()
    .trim()
    .required(getRequiredMessage({ featureNamesText }).title)
    .max(70, getRequiredMessage({ featureNamesText }).titleMaxLength),
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
    contextId: string().trim().when('contextType', {
      is: Goals.GoalContextType.Team,
      then: string().notOneOf([DEFAULT_TEAM_ID], getRequiredMessage({ featureNamesText }).team).required(getRequiredMessage({ featureNamesText }).team),
    }),
  }),
  category: string().trim(),
  externalLink: string().trim().max(MAX_EXTERNAL_LINK_LENGTH, `The external link is limited to ${MAX_EXTERNAL_LINK_LENGTH} characters.`),
  isPrivate: boolean(),
  startTimeInMillis: number().required(),
  endTimeInMillis: number()
    .required()
    .test('endTime', 'End Time must be equal or greater than Start Time', function isEndTimeValid(value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const startTime = this.parent.startTimeInMillis;
      return startTime === undefined || value === undefined || value >= startTime;
    }),
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
