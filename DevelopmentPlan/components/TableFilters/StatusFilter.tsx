import Dropdown, { DropdownItem, DropdownProps } from '~Common/V3/components/Dropdown';
import CustomCheckbox from '~Common/V3/components/Form/CustomCheckbox';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { SelectChangeEvent } from '@mui/material';
import { PDPStatusEnum } from '~DevelopmentPlan/const/types';
import { PersonalDevelopmentStatusLabels, PersonalDevelopmentStatuses } from '~DevelopmentPlan/const/defaults';
import { PERSONAL_DEVELOPMENT_FILTER_STYLES } from '~DevelopmentPlan/const/pageStyles';

const renderValue = (value: PDPStatusEnum[]): string => {
  if (value?.length) {
    const priorityLabels = value.map((statusValue) => PersonalDevelopmentStatusLabels[statusValue]);
    return priorityLabels.join(', ');
  }

  return 'All Statuses';
};

const styles = {
  ...PERSONAL_DEVELOPMENT_FILTER_STYLES,
};

interface ViewProps extends DropdownProps<PDPStatusEnum[]> {
  isMobileView: boolean;
}

const View = ({
  onChange,
  items,
  value,
  isMobileView,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.filterWrapper(isMobileView)}
  >
    <p css={styles.filterLabel(!!value?.length, isMobileView)}>Status</p>
    <Dropdown
      multiple
      displayEmpty
      css={styles.dropdown(!!value?.length, isMobileView)}
      value={value}
      renderItem={(item: DropdownItem<PDPStatusEnum[]>) => (
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

interface StatusFilterProps {
  isMobileView: boolean;
}

const StatusFilter = ({
  isMobileView,
}: StatusFilterProps): JSX.Element => {
  const [value, setStatusValue] = useQueryParamState<PDPStatusEnum[]>('personalDevelopment', 'status', [], true);

  // @ts-expect-error : The interop between queryParamState and internal MUI state change was causing some issues.
  const items: DropdownItem<PDPStatusEnum[]>[] = PersonalDevelopmentStatuses.map((priority) => ({
    ...priority,
    value: priority.value.toString(),
  }));

  const onChange = (event: SelectChangeEvent<PDPStatusEnum[]>): void => {
    setStatusValue(event.target.value as PDPStatusEnum[]);
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
export default StatusFilter;
