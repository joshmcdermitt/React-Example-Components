import { FORM_LAYOUT_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { css } from '@emotion/react';
import { PDP, PDPPermissions } from '~DevelopmentPlan/const/types';
import { DEFAULT_PDP } from '~DevelopmentPlan/const/defaults';
import { useGetPlanById } from '~DevelopmentPlan/hooks/useGetPlanById';
import { useHistory } from 'react-router-dom';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { useGetPeopleByList } from '~Deprecated/hooks/peoplePicker/useNewPeople';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { CardSkeleton } from '~Common/V3/components/Card';
import { useEffect, useMemo } from 'react';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { useSelectParticipants } from '~Common/hooks/useSelectParticipants';
import { BaseballCardPerson } from '~People/types';
import CreatePlanTitleArea from './CreatePlanTitleArea';
import CreatePlanSetupForm from './CreatePlanSetupForm';

export type ViewerParticipant = {
    orgUserId: string,
    role: string,
  };

const styles = {
  ...FORM_LAYOUT_STYLES,
  cardSkeleton: css({
    maxWidth: '100%',
    marginBottom: '.4rem',
  }),
  checkbox: css({
    display: 'none',
  }),
  largeSkeleton: css({
    height: '22rem',
    maxWidth: '100%',
  }),
};

interface ViewProps {
  plan: PDP,
  mentorId: string | undefined,
  showForm: boolean,
  pdpId: string,
  loggedInUserOrgId: string,
}

const View = ({
  plan,
  mentorId,
  showForm,
  pdpId,
  loggedInUserOrgId,
}: ViewProps): JSX.Element => (
  <>
    <CreatePlanTitleArea
      isDraft={false}
      name={plan?.name}
      permissions={plan?.id ? plan?.permissions : undefined}
    />
    {(!showForm) && (
      <MultipleSkeletonLoaders
        numberOfSkeletons={1}
        renderSkeletonItem={() => (
          <CardSkeleton css={styles.largeSkeleton} />
        )}
      />
    )}
    {showForm && (
      <CreatePlanSetupForm
        plan={plan}
        mentorId={mentorId}
        loggedInUserOrgId={loggedInUserOrgId}
        pdpId={pdpId}
      />
    )}
  </>
);

interface CreatePlanSetupProps {
  pdpId: string,
}

const CreatePlanSetup = ({
  pdpId,
}: CreatePlanSetupProps): JSX.Element => {
  const { data: plan, isLoading: planLoading, isError } = useGetPlanById({ id: pdpId });
  const history = useHistory();

  const { permissions } = plan ?? {};
  useEffect(() => {
    const canEdit = permissions?.includes(PDPPermissions.CanEdit);
    if ((plan && !canEdit) || isError) {
      history.push(DevelopmentPlanRoutes?.PermissionsDenied);
    }
  }, [history, isError, permissions, plan]);

  const {
    allParticipants,
    isLoading: participantsLoading,
  } = useSelectParticipants({
    useOrgIds: true,
    allowSelf: false,
    selectedFilters: [],
    filterIds: [],
  }) as { allParticipants: string[], isLoading: boolean};

  const peopleInfo = useGetPeopleByList({
    selectedIds: allParticipants,
  }) as BaseballCardPerson[];

  const loggedInUserOrgId = getOrganizationUserId() ?? '';
  const loggedInUser = useMemo(() => peopleInfo.filter((person) => person.orgUserId === loggedInUserOrgId), [peopleInfo, loggedInUserOrgId]);
  const showForm = !participantsLoading && !planLoading && loggedInUser.length > 0;
  const { managerId } = loggedInUser[0] ?? {};

  const mentorId = plan?.mentor?.orgUserId ?? managerId;

  const hookProps = {
    plan: plan ?? DEFAULT_PDP,
    showForm,
    mentorId,
    pdpId,
    loggedInUserOrgId,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, CreatePlanSetup };
export default CreatePlanSetup;
