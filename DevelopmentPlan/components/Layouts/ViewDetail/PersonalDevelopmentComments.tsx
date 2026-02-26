import { useParams } from 'react-router';
import { useGetComments } from '~DevelopmentPlan/hooks/useGetComments';
import { Comment } from '~DevelopmentPlan/const/types';
import { ACCORDION_STYLES } from '~DevelopmentPlan/const/pageStyles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/pro-light-svg-icons';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { useHistory } from 'react-router-dom';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { DEFAULT_PDP_PATHNAME } from '~DevelopmentPlan/const/defaults';
import { PersonalDevelopmentPlanDetailsParams } from './PersonalDevelopmentPlanDetails';
import { CommentsArea } from './CommentsArea';

const styles = {
  ...ACCORDION_STYLES,
};
interface ViewProps {
  comments: Comment[] | undefined,
  handleChange: (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => void,
  expanded: string | false,
  showSkeleton: boolean,
}
const View = ({
  comments,
  handleChange,
  expanded,
  showSkeleton,
}: ViewProps): JSX.Element => (
  <>
    <Accordion
      css={styles.accordion}
      expanded={expanded === 'discussion'}
      onChange={handleChange('discussion')}
    >
      <AccordionSummary
        expandIcon={(
          <FontAwesomeIcon
            icon={faCaretDown}
            css={styles.caretDownIcon}
          />
          )}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div css={styles.title}>
          <FontAwesomeIcon
            icon={faComment}
            css={styles.titleIcon}
          />
          Discussion
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <CommentsArea
          comments={comments}
          showSkeleton={showSkeleton}
        />
      </AccordionDetails>
    </Accordion>
  </>
);

export const PersonalDevelopmentComments = (): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const { data: comments, isLoading, isError } = useGetComments({ id: pdpId });

  const history = useHistory();
  useEffect(() => {
    const inPDPs = history.location.pathname.includes(`${DEFAULT_PDP_PATHNAME}`);
    if (isError && inPDPs) {
      history.push(DevelopmentPlanRoutes?.PermissionsDenied);
    }
  }, [history, isError]);
  const [showSkeleton] = useSkeletonLoaders(isLoading);

  const [expanded, setExpanded] = useState<string | false>('discussion');

  const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const hookProps = {
    comments,
    handleChange,
    expanded,
    showSkeleton,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
