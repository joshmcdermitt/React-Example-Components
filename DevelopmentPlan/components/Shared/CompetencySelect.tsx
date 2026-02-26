import { SerializedStyles, css } from '@emotion/react';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { GenerateCompetencyFilterData } from '~DevelopmentPlan/const/functions';
import { PersonalDevelopmentTypeOption } from '~DevelopmentPlan/const/types';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { useGetCompetencyList } from '~DevelopmentPlan/hooks/useGetCompetencyList';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import InputLabel from '@mui/material/InputLabel';
import RequiredIcon from '~Common/V3/components/RequiredIcon';
import { inputStyles } from '~Common/V3/components/uncontrolled/styles';
import { palette } from '~Common/styles/colors';

const styles = {
  competency: css({
    ...inputStyles,
  }),
  fullWidth: css({
    width: '100%',
  }),
  skeleton: css({
    width: '100%',
    maxWidth: '100%',
    height: '3.375rem',
    transform: 'initial',
  }),
  requiredIcon: css({
    position: 'absolute',
    top: '0.75rem !important',
    right: '1rem',
    zIndex: 1,
  }),
  selectWrapper: css({
    position: 'relative',
  }),
  selectLabel: css({
    color: palette.neutrals.gray500,
    fontWeight: 400,
    left: '1rem',
    letterSpacing: '0.5px',
    position: 'absolute',
    top: '.75rem',
    zIndex: 1,
    fontSize: '.75rem',
  }),
};

interface ViewProps {
  showSkeleton: boolean,
  competencyOptionTypes: PersonalDevelopmentTypeOption[],
  onSelectOption: (event: SelectChangeEvent) => void,
  competencyId: string | number | undefined,
  selectStyles?: SerializedStyles,
}

const View = ({
  showSkeleton,
  competencyOptionTypes,
  onSelectOption,
  competencyId,
  selectStyles,
}: ViewProps): JSX.Element => (
  <>
    <div
      css={selectStyles}
    >
      {showSkeleton && (
      <SkeletonLoader
        css={styles.skeleton}
        renderComponent={() => (<></>)}
      />
      )}
      {!showSkeleton && (
      <>
        <div
          css={styles.selectWrapper}
        >
          <InputLabel
            css={styles.selectLabel}
            id="type_label"
          >
            Competency
          </InputLabel>
          <RequiredIcon css={styles.requiredIcon} />
          <Select
            id="type"
            name="competencyId"
            defaultValue={competencyId as unknown as string ?? competencyOptionTypes[0].value}
            required
            css={[styles.competency, styles.fullWidth]}
            onChange={onSelectOption}
          >
            {competencyOptionTypes.map((competencyOptionType) => (
              <MenuItem key={competencyOptionType.value} value={competencyOptionType.value}>
                {competencyOptionType.text}
              </MenuItem>
            ))}
          </Select>
        </div>
      </>
      )}
    </div>
  </>
);

interface CompetencySelectProps {
  pdpId: string,
  selectStyles?: SerializedStyles,
}

export const CompetencySelect = ({
  pdpId,
  selectStyles,
}: CompetencySelectProps): JSX.Element => {
  const { data, isLoading } = useGetCompetencyList({ id: pdpId });
  const competencies = data?.response ?? [];
  const uniqueCompetencyNames = Array.from(new Set(competencies.map((item) => ({ id: item.id, name: item.name }))));
  const [showSkeleton] = useSkeletonLoaders(isLoading);
  const {
    transformedArray: competencyOptionTypes,
  } = GenerateCompetencyFilterData(uniqueCompetencyNames);
  const {
    competencyId,
    setCompetencyId,
  } = useAddResourceModalStore((state) => ({
    competencyId: state.competencyId,
    setCompetencyId: state.setCompetencyId,
  }));

  const onSelectOption = (event: SelectChangeEvent): void => {
    setCompetencyId(parseInt(event.target.value, 10));
  };

  const hookProps = {
    showSkeleton,
    competencyOptionTypes,
    onSelectOption,
    competencyId,
    selectStyles,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
