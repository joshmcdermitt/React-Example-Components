import Dropdown, { DropdownItem, DropdownProps } from '~Common/V3/components/Dropdown';
import CustomCheckbox from '~Common/V3/components/Form/CustomCheckbox';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { SelectChangeEvent } from '@mui/material';
import { ResourceType } from '~DevelopmentPlan/const/types';
import { PERSONAL_DEVELOPMENT_FILTER_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { CompetencySelectObj, GenerateCompetencyFilterData } from '~DevelopmentPlan/const/functions';
import { isArray } from 'lodash';

const styles = {
  ...PERSONAL_DEVELOPMENT_FILTER_STYLES,
};

interface ViewProps extends DropdownProps<ResourceType[]> {
  isMobileView: boolean;
}

const View = ({
  onChange,
  items,
  value,
  renderValue,
  isMobileView,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.filterWrapper(isMobileView)}
  >
    <Dropdown
      multiple
      displayEmpty
      css={styles.dropdown(!!value?.length, isMobileView)}
      value={value}
      renderItem={(item: DropdownItem<ResourceType[]>) => (
        <div css={styles.dropdownItemBoy}>
          <CustomCheckbox checked={value?.includes(item.value)} />
          {item.text}
        </div>
      )}
      onChange={onChange}
      items={items}
      renderValue={renderValue}
      {...props}
    />
  </div>
);

interface CompetencyFilterProps {
  uniqueCompetencyNames: CompetencySelectObj[],
  isMobileView: boolean,
}

const CompetencyFilter = ({
  uniqueCompetencyNames,
  isMobileView,
}: CompetencyFilterProps): JSX.Element => {
  const [value, setStatusValue] = useQueryParamState<ResourceType[]>('personalDevelopment', 'competency', [], true);

  const {
    competencyLabels,
    transformedArray,
  } = GenerateCompetencyFilterData(uniqueCompetencyNames);
  // @ts-expect-error : The interop between queryParamState and internal MUI state change was causing some issues.
  const items: DropdownItem<ResourceType[]>[] = transformedArray.map((competency) => ({
    ...competency,
    value: competency.value.toString(),
  }));

  const onChange = (event: SelectChangeEvent<ResourceType[]>): void => {
    setStatusValue(event.target.value as ResourceType[]);
  };
  const renderValue = (valueToUse: ResourceType[] | string): string => {
    const valueHasLength = valueToUse.length > 0;
    if (valueHasLength && isArray(valueToUse)) {
      const competencyLabel = valueToUse.map((statusValue) => competencyLabels[statusValue]);
      return competencyLabel.join(', ');
    }
    return valueHasLength ? competencyLabels[valueToUse as string] : 'Competency';
  };

  const hookProps = {
    value,
    items,
    onChange,
    renderValue,
    isMobileView,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default CompetencyFilter;
