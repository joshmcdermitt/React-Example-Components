import Dropdown, { DropdownItem, DropdownProps } from '~Common/V3/components/Dropdown';
import CustomCheckbox from '~Common/V3/components/Form/CustomCheckbox';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { SelectChangeEvent } from '@mui/material';
import { ResourceType } from '~DevelopmentPlan/const/types';
import { PERSONAL_DEVELOPMENT_FILTER_STYLES } from '~DevelopmentPlan/const/pageStyles';
import useGetPersonalDevelopmentResourceTypeLabels, {
  PersonalDevelopmentResourceTypeLabels,
} from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentResourceTypeLabels';
import useGetPersonalDevelopmentResourceTypeOptions from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentResourceTypeOptions';

interface RenderValueParams {
  value: ResourceType[],
  resourceTypeLabels: PersonalDevelopmentResourceTypeLabels,
}

const renderValue = ({ value, resourceTypeLabels }: RenderValueParams): string => {
  if (value?.length) {
    const priorityLabels = value.map((statusValue) => resourceTypeLabels[statusValue]);
    return priorityLabels.join(', ');
  }

  return 'Type';
};

const styles = {
  ...PERSONAL_DEVELOPMENT_FILTER_STYLES,
};

interface ViewProps extends Omit<DropdownProps<ResourceType[]>, 'renderValue'> {
  isMobileView: boolean,
  resourceTypeLabels: PersonalDevelopmentResourceTypeLabels,
}

const View = ({
  onChange,
  items,
  value,
  isMobileView,
  resourceTypeLabels,
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
      renderValue={(valueToRender) => renderValue({ value: valueToRender, resourceTypeLabels })}
      {...props}
    />
  </div>
);

interface TypeFilterProps {
  isAccomplishments?: boolean;
  isMobileView: boolean;
}

const TypeFilter = ({
  isAccomplishments = false,
  isMobileView,
}: TypeFilterProps): JSX.Element => {
  const [value, setStatusValue] = useQueryParamState<ResourceType[]>('personalDevelopment', 'type', [], true);
  const { resourceTypeLabels } = useGetPersonalDevelopmentResourceTypeLabels();
  const { resourceTypeOptions } = useGetPersonalDevelopmentResourceTypeOptions();

  // @ts-expect-error : The interop between queryParamState and internal MUI state change was causing some issues.
  const stepsTableTypeItems: DropdownItem<ResourceType[]>[] = resourceTypeOptions
    .filter((priority) => priority.value !== ResourceType.Recognition && priority.value !== ResourceType.Accomplishment)
    .map((priority) => ({
      ...priority,
      value: priority.value.toString(),
    }));
  // @ts-expect-error : The interop between queryParamState and internal MUI state change was causing some issues.
  const accomplishmentTableTypeItems: DropdownItem<ResourceType[]>[] = resourceTypeOptions
    .filter((priority) => priority.value === ResourceType.Recognition || priority.value === ResourceType.Accomplishment)
    .map((priority) => ({
      ...priority,
      value: priority.value.toString(),
    }));
  const onChange = (event: SelectChangeEvent<ResourceType[]>): void => {
    setStatusValue(event.target.value as ResourceType[]);
  };

  const hookProps = {
    value,
    items: isAccomplishments ? accomplishmentTableTypeItems : stepsTableTypeItems,
    onChange,
    renderValue,
    isMobileView,
    resourceTypeLabels,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default TypeFilter;
