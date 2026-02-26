import { css } from '@emotion/react';
import { useMemo, useState } from 'react';
import TabNavItem from '~Common/V3/components/Drawers/TabNavItem';
import JoshModal from '~Common/V3/components/JoshModal';
import { palette } from '~Common/styles/colors';
import { useShowLinkGoalModal } from '~Goals/hooks/utils/useShowLinkGoalModal';
import { LinkedGoalType } from '~Goals/const/types';
import { useGetLinkedGoalIds } from '~Goals/hooks/utils/useGetLinkedGoalIds';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import useUserLinkedGoalIds, { UseUserLinkedGoalIdsReturn } from '~Goals/stores/useUserLinkedGoalIds';
import { UseLinkGoalWithExistingGoalLinksReturn } from '~Goals/hooks/utils/useLinkGoalWithExistingGoalLinks';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import useGetLinkGoalModalTabText, { LinkGoalModalTab, LinkGoalModalTabText } from '~Goals/hooks/utils/useGetLinkGoalModalTabText';
import { forMobileObject } from '~Common/styles/mixins';
import { ReferenceLinks } from '~Common/const/referenceLinks';
import LinkNewGoal from './LinkNewGoal';
import LinkExistingGoal from './LinkExistingGoal';

const styles = {
  modalBody: css({
    overflowX: 'hidden',
  }),
  tabWrapper: css({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: palette.neutrals.gray100,
    // We want the tabs to expand past the padding of the modal body and take up full with of the modal
    margin: '0 -1.5rem 1rem -1.5rem',
    padding: '0.5rem 1.5rem 0 1.5rem',
  }),
  footer: css({
    justifyContent: 'space-between',
  }, forMobileObject({
    paddingBottom: '3.125rem',
  })),
  modalButtons: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }),
};

interface ViewProps extends Omit<UseUserLinkedGoalIdsReturn, 'hasUnsavedLinkedGoals'>,
Pick<UseLinkGoalWithExistingGoalLinksReturn, 'linkParentGoal' | 'linkSupportingGoals'> {
  showModal: boolean,
  activeTab: LinkGoalModalTab,
  linkedGoalType: LinkedGoalType,
  setActiveTab: (tab: LinkGoalModalTab) => void,
  linkedGoalIds: string[],
  goalId: string,
  requireCloseConfirmation: boolean,
  handleClose: (_?: object, reason?: string) => void,
  featureNamesText: FeatureNamesText,
  tabText: LinkGoalModalTabText['tabText'],
}

const View = ({
  showModal,
  handleClose,
  activeTab,
  linkedGoalType,
  setActiveTab,
  goalId,
  requireCloseConfirmation,
  userLinkedGoalIds,
  addLinkedGoalIds,
  removeLinkedGoalIds,
  replaceLinkedGoalIds,
  linkParentGoal,
  linkSupportingGoals,
  featureNamesText,
  tabText,
  ...props
}: ViewProps): JSX.Element => (
  <JoshModal
    open={showModal}
    onClose={handleClose}
    {...props}
  >
    <JoshModal.Header
      shouldConfirmClose={requireCloseConfirmation}
      confirmationQuestionText="Leave without saving?"
      confirmationConfirmText="Yes"
      confirmationCancelText="No"
    >
      <JoshModal.Title>
        {linkedGoalType === LinkedGoalType.Parent
          ? `Connect Parent ${featureNamesText.goals.singular}`
          : `Connect Supporting ${featureNamesText.goals.singular}`}
      </JoshModal.Title>
    </JoshModal.Header>
    <JoshModal.Body css={styles.modalBody}>
      <div css={styles.tabWrapper}>
        {Object.values(LinkGoalModalTab).map((tab) => (
          <TabNavItem
            key={tab}
            isActive={activeTab === tab}
            onClick={() => setActiveTab(tab as LinkGoalModalTab)}
            renderNavItem={() => (
              <div>{tabText[tab]}</div>
            )}
          />
        ))}
      </div>
      {activeTab === LinkGoalModalTab.Existing && (
        <LinkExistingGoal
          linkedGoalType={linkedGoalType}
          requireCloseConfirmation={requireCloseConfirmation}
          userLinkedGoalIds={userLinkedGoalIds}
          addLinkedGoalIds={addLinkedGoalIds}
          removeLinkedGoalIds={removeLinkedGoalIds}
          replaceLinkedGoalIds={replaceLinkedGoalIds}
          linkParentGoal={linkParentGoal}
          linkSupportingGoals={linkSupportingGoals}
          goalId={goalId}
        />
      )}
      {activeTab === LinkGoalModalTab.New && (
        <LinkNewGoal
          goalId={goalId}
          linkedGoalType={linkedGoalType}
          linkParentGoal={linkParentGoal}
          linkSupportingGoals={linkSupportingGoals}
        />
      )}
    </JoshModal.Body>
    <JoshModal.Footer css={styles.footer}>
      <div>
        <span>{`Linking this ${featureNamesText.goals.singular.toLowerCase()} may make it visible to other users. `}</span>
        <JoshButton
          variant="text"
          component="a"
          href={`${ReferenceLinks.CreateManageObjectives}`}
          target="_blank"
          data-test-id="goalsLinkNewGoalLearnMore"
        >
          Learn More.
        </JoshButton>
      </div>
      <div css={styles.modalButtons} id="modalButtons" />
    </JoshModal.Footer>
  </JoshModal>
);

export interface LinkedGoalModalProps extends Pick<ViewProps, 'showModal' | 'linkParentGoal' | 'linkSupportingGoals'> {
  linkedGoalType?: LinkedGoalType,
  goalId: string,
}

const LinkedGoalModal = ({
  linkedGoalType = LinkedGoalType.Parent,
  goalId,
  ...props
}: LinkedGoalModalProps): JSX.Element => {
  const { closeModal } = useShowLinkGoalModal();
  const [activeTab, setActiveTab] = useState(LinkGoalModalTab.Existing);
  const { linkedGoalIds } = useGetLinkedGoalIds({ goalId, linkedGoalType });
  const { featureNamesText } = useGetFeatureNamesText();
  const { tabText } = useGetLinkGoalModalTabText();

  const {
    userLinkedGoalIds,
    addLinkedGoalIds,
    removeLinkedGoalIds,
    replaceLinkedGoalIds,
    hasUnsavedLinkedGoals,
  } = useUserLinkedGoalIds(linkedGoalIds);

  const requireCloseConfirmation = useMemo(() => {
    if (activeTab === LinkGoalModalTab.Existing) {
      return hasUnsavedLinkedGoals;
    }

    return false;
  }, [activeTab, hasUnsavedLinkedGoals]);

  const handleClose = (_?: object, reason?: string): void => {
    if (reason !== 'escapeKeyDown' && reason !== 'backdropClick') {
      closeModal();
    }
  };

  const hookProps = {
    closeModal,
    activeTab,
    linkedGoalType,
    setActiveTab,
    linkedGoalIds,
    goalId,
    userLinkedGoalIds,
    addLinkedGoalIds,
    removeLinkedGoalIds,
    replaceLinkedGoalIds,
    requireCloseConfirmation,
    handleClose,
    featureNamesText,
    tabText,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default LinkedGoalModal;
