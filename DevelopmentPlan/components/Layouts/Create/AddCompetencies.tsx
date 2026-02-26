import { useHistory, useParams } from 'react-router-dom';
import { FORM_LAYOUT_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { Competency } from '~DevelopmentPlan/const/types';
import EmptyStateWithImage from '~Common/components/EmptyStates/EmptyStateWithImage';
import EmptyDevelopmentPlanCompetencies from '~DevelopmentPlan/assets/images/emptyDevelopmentPlanCompetencies.svg';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { palette } from '~Common/styles/colors';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { CardSkeleton } from '~Common/V3/components/Card';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import CompetencyList from '~DevelopmentPlan/components/Shared/CompetencyList';
import { useGetCompetencyList } from '~DevelopmentPlan/hooks/useGetCompetencyList';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { useEffect, useState } from 'react';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { DEFAULT_PDP_PATHNAME } from '~DevelopmentPlan/const/defaults';
import { useGetPlanById } from '~DevelopmentPlan/hooks/useGetPlanById';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { PersonalDevelopmentPlanDetailsParams } from '../ViewDetail/PersonalDevelopmentPlanDetails';
import AddCompetency from './AddCompetency';

const styles = {
  ...FORM_LAYOUT_STYLES,
};

interface ViewProps {
  competencies: Competency[] | undefined,
  hasCompetencies: boolean,
  onCreateCompetency: () => void,
  showSkeleton: boolean,
  pdpId: string,
  showAddCompetencyForm: boolean,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  resetForm: () => void,
  isOwner: boolean,
}

const View = ({
  competencies,
  hasCompetencies,
  onCreateCompetency,
  showSkeleton,
  pdpId,
  showAddCompetencyForm,
  isOpen,
  setIsOpen,
  resetForm,
  isOwner,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.competencyWrapper}>
      <div css={styles.competencyTitle}>Competencies</div>
      {showSkeleton && (
        <MultipleSkeletonLoaders
          css={styles.competencyCardSkeletonWrapper}
          numberOfSkeletons={3}
          renderSkeletonItem={() => (
            <CardSkeleton css={styles.competencyCardSkeleton} />
          )}
        />
      )}
      {!hasCompetencies && !showAddCompetencyForm && !showSkeleton && (
        <div css={styles.emptyCompetencies}>
          <EmptyStateWithImage
            renderImage={() => (
              <EmptyDevelopmentPlanCompetencies css={styles.emptyStateImage} title="Empty Competencies" />
            )}
            renderText={() => (
              <p>
                Competencies are focus areas for growth.
                <br />
                <JoshButton
                  variant="text"
                  textButtonColor={palette.brand.indigo}
                  onClick={onCreateCompetency}
                  data-test-id="pdpsCreatePageEmptyStateAddCompetency"
                >
                  Add your first one.
                </JoshButton>
              </p>
            )}
          />
        </div>
      )}
      {competencies && hasCompetencies && !showSkeleton && (
        <CompetencyList
          competencies={competencies}
          pdpId={pdpId}
          isOwner={isOwner}
        />
      )}
      {!showSkeleton && (
      <AddCompetency
        isInitialForm={showAddCompetencyForm}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        resetForm={resetForm}
      />
      )}
    </div>
  </>
);

const AddCompetencies = (): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const { data, isLoading, isError } = useGetCompetencyList({ id: pdpId });
  const { data: plan } = useGetPlanById({ id: pdpId });
  const isOwner = plan?.owner?.orgUserId === getOrganizationUserId();

  const history = useHistory();
  useEffect(() => {
    const inPDPs = history.location.pathname.includes(`${DEFAULT_PDP_PATHNAME}`);
    if (isError && inPDPs) {
      history.push(DevelopmentPlanRoutes?.PermissionsDenied);
    }
  }, [history, isError]);

  const [showSkeleton] = useSkeletonLoaders(isLoading);
  const competencies = data?.response;
  const hasCompetencies = !!competencies && competencies?.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const {
    showAddCompetencyForm,
    setShowAddCompetencyForm,
  } = useAddResourceModalStore((state) => ({
    showAddCompetencyForm: state.showAddCompetencyForm,
    setShowAddCompetencyForm: state.setShowAddCompetencyForm,
  }));
  const onCreateCompetency = (): void => {
    setShowAddCompetencyForm(true);
  };

  const resetForm = (): void => {
    setIsOpen(!isOpen);
    setShowAddCompetencyForm(false);
  };

  const hookProps = {
    competencies,
    hasCompetencies,
    onCreateCompetency,
    showSkeleton,
    pdpId,
    showAddCompetencyForm,
    isOpen,
    setIsOpen,
    resetForm,
    isOwner,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, AddCompetencies };
export default AddCompetencies;
