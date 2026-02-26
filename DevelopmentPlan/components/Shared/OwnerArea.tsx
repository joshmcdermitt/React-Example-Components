import { css } from '@emotion/react';
import CareCardAvatar from '~Common/V3/components/CareCardAvatar';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';

const styles = {
  avatar: css({
    width: '2rem',
    height: '2rem',
  }),
};

interface ViewProps {
  id: string | undefined,
}

const View = ({
  id,
}: ViewProps): JSX.Element => (
  <>
    {!id && (
      <>
        <SkeletonLoader
          width={35}
          height={35}
          variant="rectangular"
          renderComponent={() => <div />}
        />
        <SkeletonLoader
          width={250}
          height={25}
          variant="rectangular"
          renderComponent={() => <div />}
        />
      </>
    )}
    {id && (
    <CareCardAvatar
      id={id}
      noBackdrop
      containerStyle={styles.avatar}
      renderAvatar={(imageUrl, fullName, isDeactivated, email, orgUserId) => (
        <BaseAvatar
          orgUserId={orgUserId ?? null}
          avatarSize={35}
        />
      )}
      renderSkeletonLoader={() => (
        <SkeletonLoader
          width={35}
          height={35}
          variant="rectangular"
          renderComponent={() => <div />}
        />
      )}
    />
    )}
  </>
);

interface OwnerAreaProps {
  id: string | undefined,
}

export const OwnerArea = ({
  id,
}: OwnerAreaProps): JSX.Element => {
  const hookProps = {
    id,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
