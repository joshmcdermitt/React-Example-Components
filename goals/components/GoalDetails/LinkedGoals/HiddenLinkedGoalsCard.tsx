import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import PrivateIcon from './LinkedGoalCard/PrivateIcon';

const styles = {
  hiddenLinkedGoalsCard: css({
    cursor: 'not-allowed',
    gridColumn: '1/5',
    display: 'grid',
    gridTemplateColumns: 'subgrid',
  }),
  title: css({
    color: palette.neutrals.gray800,
    fontWeight: 600,
    gridColumn: '1',
  }),
  privateIcon: css({
    gridColumn: '3',
  }),
};

interface ViewProps {
  hiddenGoalsCount: number,
  featureNamesText: FeatureNamesText,
}

const View = ({
  hiddenGoalsCount,
  featureNamesText,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.hiddenLinkedGoalsCard}
    {...props}
  >
    <div css={styles.title}>{`${hiddenGoalsCount} Private ${hiddenGoalsCount > 1 ? featureNamesText.goals.plural : featureNamesText.goals.singular}`}</div>
    <PrivateIcon css={styles.privateIcon} />
  </div>
);

type HiddenLinkedGoalsCardProps = Pick<ViewProps, 'hiddenGoalsCount'>

const HiddenLinkedGoalsCard = ({
  ...props
}: HiddenLinkedGoalsCardProps): JSX.Element => {
  const { featureNamesText } = useGetFeatureNamesText();

  const hookProps = {
    featureNamesText,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default HiddenLinkedGoalsCard;
