import Dropdown, { DropdownItem, DropdownProps } from '~Common/V3/components/Dropdown';
import CustomCheckbox from '~Common/V3/components/Form/CustomCheckbox';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { SelectChangeEvent } from '@mui/material';
import { PDPRoleType } from '~DevelopmentPlan/const/types';
import { PERSONAL_DEVELOPMENT_FILTER_STYLES } from '~DevelopmentPlan/const/pageStyles';

const styles = {
  ...PERSONAL_DEVELOPMENT_FILTER_STYLES,
};

const renderValue = (value: PDPRoleType[]): string => {
  if (value?.length) {
    return value.join(', ');
  }

  return 'All Roles';
};

interface ViewProps extends DropdownProps<PDPRoleType[]> {
  isMobileView: boolean;
}

const View = ({
  items,
  onChange,
  value,
  isMobileView,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.filterWrapper(isMobileView)}
  >
    <p css={styles.filterLabel(!!value?.length, isMobileView)}>Role</p>
    <Dropdown
      multiple
      displayEmpty
      css={styles.dropdown(!!value?.length, isMobileView)}
      value={value}
      renderItem={(item: DropdownItem<PDPRoleType[]>) => (
        <div css={styles.dropdownItemBoy}>
          <CustomCheckbox checked={value?.includes(item.value)} />
          {item.value}
        </div>
      )}
      onChange={onChange}
      items={items}
      renderValue={renderValue}
      {...props}
    />
  </div>
);

interface RoleFilterProps {
  isMobileView: boolean;
}

const RoleFilter = ({
  isMobileView,
}: RoleFilterProps): JSX.Element => {
  const [value, setRoleValue] = useQueryParamState<PDPRoleType[]>('personalDevelopment', 'role', [], true);

  const items = [
    {
      value: PDPRoleType.Mentor,
      text: '',
      'data-test-id': 'personalDevelopmentFilterMentor',
      disabled: value?.length === 1 && value[0] === PDPRoleType.Viewer,
    },
    {
      value: PDPRoleType.Viewer,
      text: '',
      'data-test-id': 'personalDevelopmentFilterViewer',
      disabled: value?.length === 1 && value[0] === PDPRoleType.Mentor,
    },
  ];

  const onChange = (event: SelectChangeEvent<PDPRoleType[]>): void => {
    setRoleValue(event.target.value as PDPRoleType[]);
  };

  const hookProps = {
    items,
    onChange,
    value,
    isMobileView,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default RoleFilter;
