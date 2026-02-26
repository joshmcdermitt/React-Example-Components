import { useParams } from 'react-router-dom';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { CommentsArea } from '~DevelopmentPlan/components/Layouts/ViewDetail/CommentsArea';
import { PersonalDevelopmentPlanDetailsParams } from '~DevelopmentPlan/components/Layouts/ViewDetail/PersonalDevelopmentPlanDetails';
import { Comment } from '~DevelopmentPlan/const/types';
import { useGetComments } from '~DevelopmentPlan/hooks/useGetComments';

interface ViewProps {
  comments: Comment[] | undefined,
  showSkeleton: boolean,
}

const View = ({
  comments,
  showSkeleton,
}: ViewProps): JSX.Element => (
  <>
    <CommentsArea
      comments={comments}
      showSkeleton={showSkeleton}
    />
  </>
);

interface CommentsMobileProps {
  idToUse?: string,
}

export const CommentsMobile = ({
  idToUse,
}: CommentsMobileProps): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const { data: comments, isLoading } = useGetComments({ id: idToUse ?? pdpId });
  const [showSkeleton] = useSkeletonLoaders(isLoading);

  const hookProps = {
    comments,
    showSkeleton,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
