import { FORM_LAYOUT_STYLES } from '~DevelopmentPlan/const/pageStyles';
import Chip from '@mui/material/Chip';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { PDPPermissions, ViewPersonalDevelopmentPlanPerspective } from '~DevelopmentPlan/const/types';
import PersonalDevelopmentActionMenu from '~DevelopmentPlan/components/Shared/PersonalDevelopmentActionMenu';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import Tooltip from '~Common/components/Tooltip';
import { openInNewTab } from '~DevelopmentPlan/const/functions';
import { css } from '@emotion/react';

const styles = {
  ...FORM_LAYOUT_STYLES,
  inspirationWrap: (isMobile: boolean) => css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: isMobile ? '.625rem' : '2.5rem',
  }),
  inspirationButton: css({
    fontSize: '12px',
    fontWeight: 400,
  }),
};

interface CreatePlanTitleAreaProps {
  isDraft: boolean,
  name: string | undefined,
  permissions?: PDPPermissions[],
}

const CreatePlanTitleArea = ({
  isDraft,
  name,
  permissions,
}: CreatePlanTitleAreaProps): JSX.Element => {
  const {
    viewPerspective,
  } = useStoreParams((state) => ({
    viewPerspective: state.viewPerspective,
  }));

  const inspirationURL = 'https://josh.helpscoutdocs.com/article/80-creating-and-managing-development-plans';
  const showActionMenu = Boolean(isDraft || (name && name?.length > 0));
  const isMobile = useIsMobileQuery();
  return (
    <>
      <div css={styles.titleWrapper}>
        <div css={styles.titleContainer}>
          <span css={styles.title}>
            {name && name?.length > 0 ? name : 'Create a Personal Development Plan'}
          </span>
          {permissions && (
          <PersonalDevelopmentActionMenu
            permissions={permissions}
            isDraft={showActionMenu}
          />
          )}
          {isDraft && (
            <>
              <Chip
                css={styles.chip}
                label="Draft"
              />
            </>
          )}
        </div>
        {viewPerspective === ViewPersonalDevelopmentPlanPerspective.Create_Plan && !isMobile && (
          <p css={styles.note}>Timeline below will automatically populate with your tasks.</p>
        )}
      </div>
      {viewPerspective === ViewPersonalDevelopmentPlanPerspective.Setup && (
      <>
        <div css={styles.inspirationWrap(isMobile)}>
          <h2 data-test-id="pdpSetupPageSubheading" css={styles.description}>What do you want to accomplish?</h2>
          <Tooltip
            content="View our guide on how to create a development plan including examples and best practices."
          >
            <JoshButton
              css={styles.inspirationButton}
              variant="text"
              color="primary"
              data-test-id="inspiration"
              onClick={() => openInNewTab(inspirationURL)}
            >
              Need Inspiration?
            </JoshButton>
          </Tooltip>
        </div>
      </>
      )}
    </>
  );
};

export default CreatePlanTitleArea;
