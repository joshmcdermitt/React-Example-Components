import { css } from '@emotion/react';
import { Competency, PDP } from '~DevelopmentPlan/const/types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/pro-light-svg-icons';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { SyntheticEvent, useState } from 'react';
import { ACCORDION_STYLES } from '~DevelopmentPlan/const/pageStyles';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { CardSkeleton } from '~Common/V3/components/Card';
import ClampLines from '~Common/components/ClampLines';
import { palette } from '~Common/styles/colors';
import { useParams } from 'react-router-dom';
import { useGetCompetencyList } from '~DevelopmentPlan/hooks/useGetCompetencyList';
import { CompetencyFocusArea } from './CompetencyFocus';
import { PersonalDevelopmentPlanDetailsParams } from './PersonalDevelopmentPlanDetails';

const styles = {
  ...ACCORDION_STYLES,
  cardSkeleton: css({
    height: '3.3125rem',
    maxWidth: '100%',
    marginBottom: '.75rem',
  }),
  summaryClamp: css({
    margin: '.5rem 0 0 0',
    fontSize: '1rem',

    '& button': {
      border: 'none',
      background: 'none',
      color: palette.brand.indigo,
      padding: '0',
      float: 'right',
      fontSize: '.875rem',
    },
    '& .readonlyInputStyles': {
      background: 'none !important',
    },
  }),
};

interface ViewProps {
  plan: PDP | undefined,
  handleChange: (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => void,
  expanded: string | false,
  showSkeleton: boolean,
  competencies: Competency[] | undefined,
  competenciesAreLoading: boolean,
}

const View = ({
  plan,
  handleChange,
  expanded,
  showSkeleton,
  competencies,
  competenciesAreLoading,
}: ViewProps): JSX.Element => (
  <>
    <Accordion
      css={styles.accordion}
      expanded={expanded === 'summary'}
      onChange={handleChange('summary')}
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
            icon={faAddressCard}
            css={styles.titleIcon}
          />
          Summary
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {showSkeleton && (
        <MultipleSkeletonLoaders
          numberOfSkeletons={2}
          renderSkeletonItem={() => (
            <CardSkeleton css={styles.cardSkeleton} />
          )}
        />
        )}
        {!showSkeleton && (
          <>
            <ClampLines
              text={plan?.summary ?? ''}
              lines={10}
              ellipsis="..."
              moreText="Show More"
              lessText="Show Less"
              innerElement="div"
              emotionStyle={styles.summaryClamp}
            />
            {!competenciesAreLoading && competencies && competencies.length > 0 && (
            <CompetencyFocusArea
              competencies={competencies}
            />
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  </>
);

interface PersonalDevelopmentSummaryProps {
  plan: PDP | undefined,
  showSkeleton: boolean,
}

export const PersonalDevelopmentSummary = ({
  plan,
  showSkeleton,
}: PersonalDevelopmentSummaryProps): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const [expanded, setExpanded] = useState<string | false>('summary');
  const { data: competenciesReturn, isLoading: competenciesAreLoading } = useGetCompetencyList({ id: pdpId });
  const competencies = competenciesReturn?.response ?? [];
  const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };
  const hookProps = {
    plan,
    handleChange,
    expanded,
    showSkeleton,
    competencies,
    competenciesAreLoading,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
