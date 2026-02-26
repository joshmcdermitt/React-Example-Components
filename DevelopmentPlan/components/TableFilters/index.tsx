import { css } from '@emotion/react';
import {
  useCallback,
  useMemo,
} from 'react';
import { useGetPeopleByList } from '~Deprecated/hooks/peoplePicker/useNewPeople';
import { PersonDisplayInformation } from '~Common/const/interfaces';
import { SelectOption } from '~Goals/const/types';
import { useSelectParticipants } from '~Common/hooks/useSelectParticipants';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import ClearFiltersButton from '~Common/components/Cards/FilterBarCard/ClearFiltersButton';
import { useIsDesktopQuery, useIsMobileQuery } from '~Common/hooks/useMediaListener';
import OwnerFilter from './OwnerFilter';
import StatusFilter from './StatusFilter';
import RoleFilter from './RoleFilter';

const styles = {
  filtersContainer: (isMobileView: boolean) => css({
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    gap: '.5rem',
    paddingBottom: '.625rem',
    flexWrap: 'wrap',
  }, isMobileView && {
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: '1rem',
    width: '100%',
  }),
};

interface ViewProps {
  areFiltersActive: boolean,
  clearAllFilters: () => void,
  onOwnerChange: (newOwnerValue: string[]) => void,
  ownerList?: string[],
  recipientList: SelectOption[],
  isDesktop: boolean,
  isMobile: boolean,
}

const View = ({
  areFiltersActive,
  clearAllFilters,
  onOwnerChange,
  ownerList,
  recipientList,
  isDesktop,
  isMobile,
}: ViewProps): JSX.Element => (
  <>
    <div
      css={styles.filtersContainer(!isDesktop)}
    >
      <OwnerFilter
        onOwnerChange={onOwnerChange}
        ownerList={ownerList}
        recipientList={recipientList}
        isMobileView={!isDesktop}
      />
      <StatusFilter
        data-test-id="personalDevelopmentTableStatusFilter"
        isMobileView={!isDesktop}
      />
      <RoleFilter
        data-test-id="personalDevelopmentTableRoleFilter"
        isMobileView={!isDesktop}
      />
      <ClearFiltersButton
        hasFilters={areFiltersActive}
        onClick={clearAllFilters}
        isMobile={isMobile}
      />
    </div>
  </>
);

interface TableFiltersProps {
  areFiltersActive: boolean,
  clearAllFilters: () => void,
}

export const TableFilters = ({
  areFiltersActive,
  clearAllFilters,
}: TableFiltersProps): JSX.Element => {
  const [ownerList, setOwnerList] = useQueryParamState<string[]>('personalDevelopment', 'owner', [], true);
  const isMobile = useIsMobileQuery();
  const isDesktop = useIsDesktopQuery();

  const onOwnerChange = useCallback((newOwnerValue: string[]) => {
    setOwnerList(newOwnerValue);
  }, [setOwnerList]);

  const {
    allParticipants,
  } = useSelectParticipants({
    useOrgIds: true,
    allowSelf: false,
    selectedFilters: [],
    filterIds: [],
  }) as { allParticipants: string[], isLoading: boolean};

  const peopleInfo = useGetPeopleByList({
    selectedIds: allParticipants,
  }) as PersonDisplayInformation[];

  const recipientList = useMemo(() => peopleInfo.map((person) => ({
    label: `${person?.firstName} ${person?.lastName}`,
    value: person?.orgUserId,
    profileImage: person?.profileImageUrl,
    jobTitle: person?.jobTitle,
  })), [peopleInfo]) as SelectOption[];

  const hookProps = {
    areFiltersActive,
    clearAllFilters,
    onOwnerChange,
    ownerList,
    recipientList,
    isDesktop,
    isMobile,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
