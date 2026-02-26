import { css } from '@emotion/react';

import Dropdown, { DropdownItem } from '~Common/V3/components/Dropdown';
import { palette } from '~Common/styles/colors';
import { BasicPdp } from '~DevelopmentPlan/const/types';
import { SelectChangeEvent } from '@mui/material';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { useEffect } from 'react';
import { withTruncate } from '~Common/styles/mixins';

const styles = {
  dropdown: css({
    border: 0,
    padding: '.3125rem 1rem',
    width: 'min-content',

    '.MuiInput-root': {
      display: 'flex',
      alignItems: 'center',
    },

    '.MuiSelect-select': {
      lineHeight: '1.25rem',
      paddingTop: 0,
      paddingBottom: 0,
      minHeight: 0,
    },
  }),
  label: css({
    fontSize: '1rem !important',
    color: `${palette.neutrals.gray700} !important`,
    fontWeight: '500 !important',
    letterSpacing: '.5008px',
    fontStyle: 'normal',
  }),
  menuItem: css({
    display: 'flex',
    alignItems: 'center',
    maxWidth: '50rem',
  }),
  itemText: css({}, withTruncate()),
};

interface ViewProps {
  items: DropdownItem[],
  value: string,
  handleFilterChange: (event: SelectChangeEvent) => void,
  name: string,
}

const View = ({
  items,
  value,
  handleFilterChange,
  name,
}: ViewProps): JSX.Element => (
  <Dropdown
    name={name}
    css={styles.dropdown}
    label=""
    items={items}
    data-test-id="meetingPdpIdSelect"
    onChange={handleFilterChange}
    value={value}
    renderItem={(item: DropdownItem) => (
      <div css={styles.menuItem}>
        <div css={styles.itemText}>{item.text}</div>
      </div>
    )}
  />
);

export interface PdpDropdownProps {
  pdps: BasicPdp[],
  name: string,
}

const PdpDropdown = ({
  pdps,
  name,
}: PdpDropdownProps): JSX.Element => {
  const items = pdps?.map((obj) => ({
    value: obj.id.toString(),
    text: obj.name,
  }));

  const value = items?.[0]?.value;

  const {
    setMeetingPdpId,
  } = useStoreParams((state) => ({
    setMeetingPdpId: state.setMeetingPdpId,
  }));

  const handleFilterChange = (event: SelectChangeEvent): void => {
    setMeetingPdpId(event.target.value);
  };

  useEffect(() => {
    setMeetingPdpId(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hookProps = {
    value,
    items,
    handleFilterChange,
    name,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default PdpDropdown;
