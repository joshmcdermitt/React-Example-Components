import { css } from '@emotion/react';
import { Link, useHistory } from 'react-router-dom';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import JoshCard from '~Common/V3/components/JoshCard';
import EmptyStateWithImage from '~Common/components/EmptyStates/EmptyStateWithImage';
import { palette } from '~Common/styles/colors';
import emptyActionsItems from '~ActionItems/assets/images/emptyActionItems.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { forMobileObject } from '~Common/styles/mixins';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '~Goals/hooks/utils/useGetGoalRoutes';
import { InteriorTopBar } from '../GoalsTopBar/InteriorTopBar';

const styles = {
  joshCard: (isDrawer: boolean) => css({
    marginTop: '1.875rem',
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    marginBottom: '2rem',
  }, isDrawer && {
    margin: 0,
    padding: 0,
    boxShadow: 'none',
    overflow: 'unset',
  }, forMobileObject({
    gridTemplateColumns: '1fr',
  })),
  detailsTitle: css({
    gridColumn: '1 / 4',
    fontSize: '1.125rem',
    fontWeight: 600,
    paddingBottom: '1rem',
    borderBottom: `1px solid ${palette.neutrals.gray300}`,
    marginBottom: '1rem',
  }, forMobileObject({
    gridColumn: '1',
  })),
  emptyStateImage: css({
    height: '20rem',
  }),
  container: css({
    width: '100%',
    margin: '1.875rem 1.875rem 0 1.875rem',
  }),
  textBackButton: css({
    fontSize: '1rem',
    fontWeight: 400,
    color: palette.neutrals.gray800,
  }),
  icon: css({
    marginRight: '0.5rem',
  }),
  emptyState: css({
    gridColumn: '1 / 4',
  }),
};

interface ViewProps {
  featureNamesText: FeatureNamesText,
  onClickViewGoals: () => void,
  goalRoutes: GetGoalRoutesReturn['goalRoutes']
  isDrawer?: boolean,
}

const View = ({
  onClickViewGoals,
  featureNamesText,
  isDrawer = false,
  goalRoutes,
}: ViewProps): JSX.Element => (
  <div css={styles.container}>
    <InteriorTopBar
      renderLeftSide={() => (
        <>
          <JoshButton
            component={Link}
            to={goalRoutes?.Dashboard}
            variant="text"
            css={styles.textBackButton}
            textButtonColor={palette.neutrals.gray700}
            data-test-id="goalsBackToGoalsList"
          >
            <FontAwesomeIcon
              css={styles.icon}
              icon={faArrowLeft}
            />
            Back
          </JoshButton>
        </>
      )}
      renderRightSide={() => (<></>)}
    />
    <JoshCard
      css={styles.joshCard(isDrawer)}
    >
      <h1 css={styles.detailsTitle}>
        Permission Denied
      </h1>
      <div
        css={styles.emptyState}
      >
        <EmptyStateWithImage
          renderImage={() => (
            <img
              css={styles.emptyStateImage}
              src={emptyActionsItems}
              alt={`Empty ${featureNamesText.goals.plural}`}
            />
          )}
          renderText={() => (
            <>
              <span>
                {`You do not have permission to view this ${featureNamesText.goals.singular.toLowerCase()}.`}
                <JoshButton
                  variant="text"
                  textButtonColor={palette.brand.blue}
                  onClick={onClickViewGoals}
                  data-test-id="actionItemsEmptyStateCreateActionItem"
                >
                  {`Click here to view your ${featureNamesText.goals.plural.toLowerCase()}`}
                </JoshButton>
              </span>
            </>
          )}
        />
      </div>
    </JoshCard>
  </div>
);

const CanNotViewGoalDetails = ({
  ...props
}): JSX.Element => {
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const history = useHistory();

  const onClickViewGoals = (): void => {
    history.push(goalRoutes?.Dashboard);
  };

  const hookProps = {
    featureNamesText,
    onClickViewGoals,
    goalRoutes,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default CanNotViewGoalDetails;
