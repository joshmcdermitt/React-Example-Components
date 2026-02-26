import { css } from '@emotion/react';
import { Competency } from '~DevelopmentPlan/const/types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { ACCORDION_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { palette } from '~Common/styles/colors';
import { withLineClamp } from '~Common/styles/mixins';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';

const styles = {
  ...ACCORDION_STYLES,
  accordionFocusWrapper: css({
    display: 'flex',
    width: '100%',
    gap: '.25rem',
    flexWrap: 'wrap',
  }),
  accordionFocus: css({
    backgroundColor: palette.neutrals.gray200,
    padding: '.125rem .75rem',
    boxShadow: 'unset',
    borderRadius: '.25rem',

    ':before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      width: '100%',

      '.MuiAccordionSummary-root': {
        display: 'flex',
      },
    },
    '.MuiAccordionSummary-root': {
      minHeight: 'unset !important',
      display: 'inline-flex',
    },
    '.MuiAccordionSummary-content': {
      margin: '0',
    },
  }),
  focusTitle: css({
    fontSize: '.625rem',
    fontWeight: 600,
    color: palette.neutrals.gray800,
    marginRight: '.5rem',
  }, withLineClamp(1)),
  caretDownIconFocus: css({
    fontSize: '.625rem',
    color: palette.neutrals.gray600,
  }),
  focusMainTitle: css({
    fontSize: '.875rem',
    fontWeight: 600,
    color: palette.neutrals.gray800,
    margin: '.8125rem 0 .25rem 0',
  }),
};

interface ViewProps {
  competencies: Competency[] | undefined,
}

const View = ({
  competencies,
}: ViewProps): JSX.Element => (
  <>
    {competencies && competencies.length > 0 && (
    <>
      <p
        css={styles.focusMainTitle}
      >
        Competency Focus
      </p>
      <div
        css={styles.accordionFocusWrapper}
      >
        {competencies.map((focus) => (
          <Accordion
            css={styles.accordionFocus}
            key={focus.id}
          >
            <AccordionSummary
              expandIcon={(
                <FontAwesomeIcon
                  icon={faCaretDown}
                  css={styles.caretDownIconFocus}
                />
          )}
            >
              <div css={styles.focusTitle}>
                {focus.name}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <HTMLRenderer htmlText={focus.description} />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
    )}
  </>
);

interface CompetencyFocusProps {
  competencies: Competency[] | undefined,
}

export const CompetencyFocusArea = ({
  competencies,
}: CompetencyFocusProps): JSX.Element => {
  const hookProps = {
    competencies,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
