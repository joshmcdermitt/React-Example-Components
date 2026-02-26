import { SerializedStyles, css } from '@emotion/react';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { HoverState, useHoverState } from '~Common/hooks/useHoverState';
import { palette } from '~Common/styles/colors';
import { withTruncate } from '~Common/styles/mixins';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

const borderRadius = '.3125rem';

const styles = {
  existingGoalCard: (isSelected: boolean, isHovering: boolean) => css({
    padding: '0.75rem 1rem',
    backgroundColor: palette.neutrals.gray50,
    display: 'flex',
    alignItems: 'center',
    borderRadius,
    border: '1px solid transparent',
  }, isSelected && ({
    border: `1px solid ${palette.brand.blue}`,
  }), isSelected && isHovering && ({
    border: `1px solid ${palette.brand.red}`,
  })),
  details: css({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: '1',
  }),
  title: (isSelected: boolean, isHovering: boolean) => css({
    color: palette.neutrals.gray800,
    fontSize: '1rem',
    fontWeight: 600,
  }, withTruncate(), isSelected && ({
    color: palette.brand.blue,
  }), isSelected && isHovering && ({
    color: palette.brand.red,
  })),
  info: (isSelected: boolean, isHovering: boolean) => css({
    color: palette.neutrals.gray500,
    fontSize: '.8125rem',
    fontWeight: 600,
  }, isSelected && ({
    color: palette.brand.blue,
  }), isSelected && isHovering && ({
    color: palette.brand.red,
  })),
  rightButton: (isVisible: boolean) => css({
    visibility: 'hidden',
  }, isVisible && ({
    visibility: 'visible',
  })),
  skeletonLoader: css({
    borderRadius,
    minWidth: '100%',
    height: '4.25rem',
  }),
};

interface ViewProps extends HoverState {
  title: string,
  ownerFullName: string,
  contextType: string,
  isSelected: boolean,
  featureNamesText: FeatureNamesText,
  renderRightButton?: (styles: SerializedStyles) => JSX.Element,
}

const View = ({
  title,
  ownerFullName,
  contextType,
  isSelected = false,
  renderRightButton,
  isHovering,
  handleMouseEnter,
  handleMouseLeave,
  featureNamesText,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.existingGoalCard(isSelected, isHovering)}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    {...props}
  >
    <div css={styles.details}>
      <div className="title" css={styles.title(isSelected, isHovering)}>{title}</div>
      <div className="info" css={styles.info(isSelected, isHovering)}>
        <span>{`Owned by ${ownerFullName} | `}</span>
        <span>{`${contextType} ${featureNamesText.goals.singular}`}</span>
      </div>
    </div>
    {renderRightButton?.(styles.rightButton(isHovering))}
  </div>
);

type ExistingGoalCardProps = Pick<ViewProps, 'title' | 'ownerFullName' | 'contextType' | 'isSelected' | 'renderRightButton'>;

const ExistingGoalCard = ({
  ...props
}: ExistingGoalCardProps): JSX.Element => {
  const { isHovering, handleMouseEnter, handleMouseLeave } = useHoverState();
  const { featureNamesText } = useGetFeatureNamesText();

  const hookProps = {
    handleMouseEnter,
    handleMouseLeave,
    isHovering,
    featureNamesText,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

const SkeletonView = (): JSX.Element => (
  <SkeletonLoader
    css={styles.skeletonLoader}
    variant="rectangular"
    renderComponent={() => (<></>)}
  />
);

export { View, SkeletonView as ExistingGoalCardSkeleton };
export default ExistingGoalCard;
