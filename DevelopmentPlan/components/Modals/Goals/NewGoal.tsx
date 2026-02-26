import { CreateGoalForm as OldCreateGoalForm } from '~Goals/components/DeleteAfterUOM/Create';
import { SerializedStyles, css } from '@emotion/react';
import {
  UseFormReturn,
} from 'react-hook-form';
import { Form } from '~Common/V3/components/uncontrolled';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';

const styles = {
  goalOverride: css({
    maxWidth: '100%',
    margin: 0,
    padding: 0,
  }),
};

interface ViewProps {
  formContext: UseFormReturn<CreateEditGoalFormValues>,
  runGoalValidations: () => void,
  actionTextToUse: string,
  onCancel: () => void,
  featureNamesText: FeatureNamesText,
  overrideStyles?: SerializedStyles,
}

const View = ({
  formContext,
  runGoalValidations,
  actionTextToUse,
  onCancel,
  featureNamesText,
  overrideStyles,
}: ViewProps): JSX.Element => (
  <>
    <ContextButtons
      portalIds={['modalButtons']}
      renderContents={() => (
        <>
          <JoshButton
            data-test-id="addResourceModalSaveChanges"
            size="small"
            type="submit"
            onClick={runGoalValidations}
          >
            {`${actionTextToUse} ${featureNamesText.goals.singular}`}
          </JoshButton>
          <JoshButton
            data-test-id="addResourceModalCancelChanges"
            onClick={onCancel}
            size="small"
            variant="ghost"
          >
            Cancel
          </JoshButton>
        </>
      )}
    />
    <Form
      formContext={formContext}
      onSubmit={() => null}
    >
      <OldCreateGoalForm
        css={[styles.goalOverride, ...overrideStyles ? [overrideStyles] : []]}
        formContext={formContext}
        hideHeader
      />
    </Form>
  </>
);

type NewGoalProps = Pick<ViewProps, 'actionTextToUse' | 'onCancel' | 'formContext' | 'runGoalValidations' | 'overrideStyles'>;

export const NewGoal = ({
  ...props
}: NewGoalProps): JSX.Element => {
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
