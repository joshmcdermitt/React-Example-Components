import { css } from '@emotion/react';
import { Competency } from '~DevelopmentPlan/const/types';
import { useState } from 'react';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { useDeleteCompetency } from '~DevelopmentPlan/hooks/useDeleteCompetency';
import { OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { AddResourceModal } from '../Modals/AddResourceModal';
import CompetencyItem from './CompetencyItem';
import { ConfirmationPlanModal } from '../Modals/ConfirmationPlanModal';

const styles = {
  competencyListWrap: css({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '1.5rem',
  }),
};

interface ViewProps {
  competencies: Competency[],
  pdpId: string,
  editCompetency: (competency: Competency) => () => void,
  competencyIdToEdit: number | undefined,
  setCompetencyIdToEdit: (competencyId: number | undefined) => void,
  isOwner: boolean,
  showDeleteResourceModal: boolean,
  closeDeleteResourceModal: () => void,
  deleteCompetency: () => void,
}

const View = ({
  competencies,
  pdpId,
  editCompetency,
  competencyIdToEdit,
  setCompetencyIdToEdit,
  isOwner,
  showDeleteResourceModal,
  closeDeleteResourceModal,
  deleteCompetency,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.competencyListWrap}>
      {competencies?.map((competency) => (
        <CompetencyItem
          key={competency.id}
          competency={competency}
          isEditing={competency.id === competencyIdToEdit}
          isEditingOtherItem={competencyIdToEdit !== undefined && competencyIdToEdit !== competency.id}
          editCompetency={editCompetency}
          setCompetencyIdToEdit={setCompetencyIdToEdit}
          pdpId={pdpId}
          isOwner={isOwner}
        />
      ))}
    </div>
    <ConfirmationPlanModal
      show={showDeleteResourceModal}
      close={closeDeleteResourceModal}
      handleConfirmation={deleteCompetency}
      title="Are you sure you want to delete this competency?"
      bodyText="Deleting this competency will unlink items from this development plan. You can relink them to another competency."
      buttonText="Delete Competency"
    />
    <AddResourceModal
      pdpId={pdpId}
    />
  </>
);

interface CompetencyListProps {
  competencies: Competency[],
  pdpId: string,
  isOwner: boolean,
}

const CompetencyList = ({
  competencies,
  pdpId,
  isOwner,
}: CompetencyListProps): JSX.Element => {
  const [competencyIdToEdit, setCompetencyIdToEdit] = useState<number>();

  const editCompetency = (competency: Competency) => () => {
    setCompetencyIdToEdit(competency.id);
  };

  const {
    showDeleteResourceModal,
    closeDeleteResourceModal,
    setShowAddCompetencyForm,
    competencyId,
  } = useAddResourceModalStore((state) => ({
    showDeleteResourceModal: state.showDeleteResourceModal,
    closeDeleteResourceModal: state.closeDeleteResourceModal,
    setShowAddCompetencyForm: state.setShowAddCompetencyForm,
    competencyId: state.competencyId,
  }));

  const resetForm = (): void => {
    setCompetencyIdToEdit(undefined);
    setShowAddCompetencyForm(false);
  };
  const { mutate: deleteCompetencyMutation } = useDeleteCompetency();

  const deleteCompetency = (): void => {
    resetForm();
    const competencyIdToUse = competencyId?.toString() ?? OPTIMISTIC_ID?.toString();
    deleteCompetencyMutation({ id: pdpId, competencyId: competencyIdToUse }, { onSuccess: onDeleteSuccess });
  };

  const onDeleteSuccess = (): void => {
    setCompetencyIdToEdit(undefined);
    closeDeleteResourceModal();
  };

  const hookProps = {
    competencies,
    pdpId,
    editCompetency,
    competencyIdToEdit,
    setCompetencyIdToEdit,
    isOwner,
    showDeleteResourceModal,
    closeDeleteResourceModal,
    deleteCompetency,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, CompetencyList };
export default CompetencyList;
