import NiceModal, { muiDialogV5, NiceModalHandler, useModal } from '@ebay/nice-modal-react';
import {
  Autocomplete,
  Popper,
  styled,
  Theme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { UserStatus } from '~Admin/const/defaults';
import { SelectOption, usePeopleTagPicker } from '~Common/components/PeopleTagPicker/usePeopleTagPicker';
import { UserGroup } from '~Common/const/userGroups';
import { CloseModalResponse } from '~Common/const/constants';
import JoshModal from '~Common/V3/components/JoshModal';
import { InputUnstyled } from '@mui/base';
import SearchIcon from '~Assets/icons/components/SearchIcon';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import PersonCard from './PersonCard';

const StyledInputRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  background: theme.palette.background.primary,
  border: `1px solid ${theme.palette.border.primary}`,
  borderRadius: theme.radius.medium,
  padding: '.625rem .875rem !important',
  color: theme.palette.text.primary,
  gap: theme.spacings.medium,
}));

const StyledInput = styled('input')({
  flex: 1,
  border: 0,
});

const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  color: theme.palette.foreground.quaternary,
}));

const StyledJoshModalBody = styled(JoshModal.Body)({
  display: 'flex',
  flexDirection: 'column',
  gap: '.625rem',
  minHeight: '18.75rem',
});

const StyledPeopleList = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacings.medium,
  margin: 0,
  padding: 0,
}));

const StyledConfirmButton = styled('button')(({ theme }) => ({
  padding: '.625rem .875rem',
  border: 0,
  borderRadius: theme.radius.medium,
  background: theme.palette.background.brand,
  color: theme.palette.text.white,
  fontWeight: 600,
}));

const StyledJoshModalFooter = styled(JoshModal.Footer)({
  justifyContent: 'flex-end',
});

const StyledOption = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.medium,
}));

const StyledPopper = styled(Popper)({
  width: '60% !important',
  marginLeft: 'auto !important',
});

interface ViewProps {
  modal: NiceModalHandler<Record<string, unknown>>,
  titleText: string,
  confirmText: string,
  handleClose: (_?: object, reason?: string) => void,
  selectedIds: string[],
  handleConfirmClick: () => void,
  peopleListIds: string[],
  peopleListObject: Record<string, SelectOption>,
  selectType: 'single' | 'multiple',
  handleChange: (_: unknown, newValue: string | string[]) => void,
  searchText: string,
  setSearchText: (searchText: string) => void,
  handlePersonClick: (orgUserId: string) => void,
  disableCloseOnSelect?: boolean,
}

const View = ({
  modal,
  titleText,
  confirmText,
  handleClose,
  selectedIds,
  handleConfirmClick,
  handleChange,
  peopleListIds,
  peopleListObject,
  selectType,
  searchText,
  setSearchText,
  handlePersonClick,
  disableCloseOnSelect,
  ...props
}: ViewProps): JSX.Element => (
  <JoshModal
    {...muiDialogV5(modal)}
    onClose={handleClose}
    {...props}
  >
    <JoshModal.Header
      shouldConfirmClose
      confirmationQuestionText={CloseModalResponse.ConfirmUnsavedChanges}
      confirmationConfirmText={CloseModalResponse.Yes}
      confirmationCancelText={CloseModalResponse.No}
    >
      <JoshModal.Title>
        {titleText}
      </JoshModal.Title>
    </JoshModal.Header>
    <StyledJoshModalBody>
      <Autocomplete
        disablePortal
        disableClearable
        disableCloseOnSelect={disableCloseOnSelect}
        multiple={selectType === 'multiple'}
        renderTags={() => null}
        value={selectedIds}
        options={peopleListIds}
        PopperComponent={StyledPopper}
        ListboxProps={{
          // @ts-expect-error More MUI lies, this works
          sx: {
            maxHeight: '15.625rem',
            '& .MuiAutocomplete-option': {
              margin: (theme: Theme) => `${theme.spacings.small}`,
              border: '1px solid transparent',
            },
            '& .MuiAutocomplete-option[aria-selected="true"]': {
              border: (theme: Theme) => `1px solid ${theme.palette.border.primary}`,
              borderRadius: (theme: Theme) => theme.radius.medium,
            },
          },
        }}
        renderOption={(optionProps, option) => (
          <StyledOption {...optionProps}>
            <BaseAvatar
              orgUserId={peopleListObject[option].value ?? null}
              avatarSize={24}
            />
            {peopleListObject[option].label}
          </StyledOption>
        )}
        inputValue={searchText}
        onInputChange={(event, newValue, reason) => {
          if (reason === 'input') {
            setSearchText(newValue);
          }
        }}
        filterOptions={(options, { inputValue }) => (
          options.filter((option) => peopleListObject[option]?.label.toLowerCase().includes(inputValue.toLowerCase())))}
        onChange={handleChange}
        renderInput={(params) => (
          <InputUnstyled
            slots={{
              root: StyledInputRoot,
              input: StyledInput,
            }}
            slotProps={{
              root: { ref: params.InputProps.ref },
              input: {
                ...params.inputProps,
                // @ts-expect-error data-test-id works here, not sure why it's throwing a TS error.
                'data-test-id': 'goalsUserSelectorSearch',
              },
            }}
            startAdornment={(
              <StyledSearchIcon />
            )}
            placeholder="Search people to add"
            type="text"
            {...params.inputProps}
          />
        )}
      />
      <StyledPeopleList>
        {selectedIds.map((orgUserId) => (
          <PersonCard
            key={orgUserId}
            onClick={() => handlePersonClick(orgUserId)}
            person={peopleListObject[orgUserId]}
          />
        ))}
      </StyledPeopleList>
    </StyledJoshModalBody>
    <StyledJoshModalFooter>
      <StyledConfirmButton data-test-id="goalsUserSelectorConfirmButton" onClick={handleConfirmClick}>
        {confirmText}
      </StyledConfirmButton>
    </StyledJoshModalFooter>
  </JoshModal>
);

interface PeoplePickerModalProps extends Pick<ViewProps, 'titleText' | 'confirmText'> {
  handleConfirm: (selectedIds: string[]) => void,
  selectType: 'single' | 'multiple',
  disabledIds?: string[],
  disableLimitedAccessUsers?: boolean,
  initialSelectedIds?: string[],
  disableCloseOnSelect?: boolean,
}

const PeoplePickerModal = ({
  handleConfirm,
  selectType,
  disabledIds = [],
  disableLimitedAccessUsers = false,
  disableCloseOnSelect = false,
  initialSelectedIds = [],
  ...props
}: PeoplePickerModalProps): JSX.Element => {
  const accountTypesToInclude = disableLimitedAccessUsers
    ? [UserGroup.Admin, UserGroup.Member, UserGroup.Executive]
    : [UserGroup.Admin, UserGroup.Member, UserGroup.LimitedAccess, UserGroup.Executive];

  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
  const [searchText, setSearchText] = useState('');

  const {
    peopleList,
  } = usePeopleTagPicker({
    administrativeStatusesToInclude: [UserStatus.Active, UserStatus.Invited],
    allowSelf: false,
    disabledIds,
    accountTypesToInclude,
  });

  const peopleListIds = useMemo(
    () => peopleList
      .map((person) => person.value)
      .filter((id) => !disabledIds.includes(id)),
    [peopleList, disabledIds],
  );

  const peopleListObject: Record<string, SelectOption> = useMemo(() => (
    peopleList.reduce((acc, person) => ({ ...acc, [person.value]: person }), {})
  ), [peopleList]);

  const modal = useModal();

  const handleClose = (_?: object, reason?: string): void => {
    if (reason !== 'escapeKeyDown' && reason !== 'backdropClick') {
      void modal.hide();
    }
  };

  const handlePersonClick = (orgUserId: string): void => {
    if (selectType === 'multiple') {
      setSelectedIds((currentSelectedIds) => currentSelectedIds.filter((selectedId) => selectedId !== orgUserId));
    } else if (selectType === 'single') {
      /*
        Leaving this for now since this UX isn't fully fleshed out yet
        No behavior needed for this since you can't remove a single person from here
      */
    }
  };

  const handleChange = (_: unknown, newValue: string | string[]): void => {
    // I don't think we will ever hit the single string newValue case, but MUI seems to think it's possible
    if (typeof newValue === 'string') {
      setSelectedIds([newValue]);
    } else {
      setSelectedIds(newValue);
    }
  };

  const handleConfirmClick = (): void => {
    handleConfirm(selectedIds);
    void modal.hide();
  };

  const hookProps = {
    modal,
    handleClose,
    selectedIds,
    handleConfirmClick,
    handleChange,
    peopleListIds,
    peopleListObject,
    selectType,
    searchText,
    setSearchText,
    handlePersonClick,
    disableCloseOnSelect,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default NiceModal.create(PeoplePickerModal);
