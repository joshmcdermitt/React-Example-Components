import NiceModal from '@ebay/nice-modal-react';
import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { UserStatus } from '~Admin/const/defaults';
import EditIcon from '~Assets/icons/components/EditIcon';
import { SelectOption, usePeopleTagPicker } from '~Common/components/PeopleTagPicker/usePeopleTagPicker';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { UserGroup } from '~Common/const/userGroups';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import PeoplePickerModal from './Shared/PeoplePickerModal';

interface StyledOwnerSelectorProps {
  isLoading: boolean,
}

const StyledOwnerSelector = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isLoading',
})<StyledOwnerSelectorProps>(({ isLoading }) => ({
  display: 'flex',
  flexWrap: isLoading ? 'nowrap' : 'wrap',
  alignItems: 'center',
  gap: '0.5rem 2rem',
}));

const StyledLabel = styled('label')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: theme.fontSize.small,
  margin: 0,
}));

const StyledDescription = styled('div')(({ theme }) => ({
  color: theme.palette.text.tertiary,
  fontWeight: 400,
  fontSize: theme.fontSize.small,
  margin: 0,
  maxWidth: '12.5rem',
}));

const StyledBaseAvatar = styled(BaseAvatar)(({ theme }) => ({
  border: `1.75px solid ${theme.palette.border.brand}`,
}));

const StyledChangeButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.extraSmall,
  padding: `${theme.spacings.medium} ${theme.spacings.large}`,
  color: theme.palette.text.tertiary,
  background: 'transparent',
  fontWeight: 600,
  border: '2px solid transparent',
  marginLeft: '-1.5rem',

  ':hover': {
    borderColor: theme.palette.border.brand,
    borderRadius: theme.radius.medium,
  },
}));

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  color: theme.palette.text.tertiary,
  fontSize: '1.25rem',
}));

const StyledSkeletonLoader = styled(SkeletonLoader)(({ theme }) => ({
  minWidth: '50%',
  height: '2.25rem',
  borderRadius: theme.radius.medium,
}));

interface ViewProps {
  isLoading: boolean,
  selectedOwner: SelectOption | undefined,
  handleChangeOwnerClick: () => void,
}

const View = ({
  isLoading,
  selectedOwner,
  handleChangeOwnerClick,
  ...props
}: ViewProps): JSX.Element => (
  <StyledOwnerSelector
    isLoading={isLoading}
    {...props}
  >
    <div>
      <StyledLabel data-test-id="goalsOwnerLabel">Owner</StyledLabel>
      <StyledDescription>
        The owner is responsible for goal updates and labels.
      </StyledDescription>
    </div>
    {isLoading && (
      <StyledSkeletonLoader
        variant="rectangular"
        renderComponent={() => (
          <></>
        )}
        {...props}
      />
    )}
    {!isLoading && (
      <>
        <StyledBaseAvatar
          orgUserId={selectedOwner?.value ?? null}
          isDeactivated={!selectedOwner?.value}
          avatarSize={56}
        />

        <StyledChangeButton
          type="button"
          onClick={handleChangeOwnerClick}
          data-test-id="goalsOwnerChangeButton"
        >
          <StyledEditIcon />
          Change
        </StyledChangeButton>
      </>
    )}
  </StyledOwnerSelector>
);

interface OwnerSelectorProps {
  disabledIds?: string[],
  disableLimitedAccessUsers?: boolean,
}

const OwnerSelector = ({
  disabledIds = [],
  disableLimitedAccessUsers = false,
  ...props
}: OwnerSelectorProps): JSX.Element => {
  const { watch, setValue } = useFormContext<CreateEditGoalFormValues>();

  const accountTypesToInclude = disableLimitedAccessUsers
    ? [UserGroup.Admin, UserGroup.Member, UserGroup.Executive]
    : [UserGroup.Admin, UserGroup.Member, UserGroup.LimitedAccess, UserGroup.Executive];

  const {
    peopleList,
    isLoadingPeopleData,
  } = usePeopleTagPicker({
    administrativeStatusesToInclude: [UserStatus.Active, UserStatus.Invited],
    allowSelf: false,
    disabledIds,
    accountTypesToInclude,
  });

  const [isLoading] = useSkeletonLoaders(isLoadingPeopleData);

  const { featureNamesText } = useGetFeatureNamesText();

  const currentParticipants = watch('participants');

  const ownerParticipant = useMemo(() => (
    currentParticipants?.find((participant) => participant.role === Goals.GoalParticipantRole.Owner)
  ), [currentParticipants]);

  const otherParticipants = useMemo(() => (
    currentParticipants?.filter((participant) => participant.role !== Goals.GoalParticipantRole.Owner)
  ) || [], [currentParticipants]);

  const selectedOwner = useMemo(() => peopleList.find((person) => person.value === ownerParticipant?.orgUserId), [ownerParticipant, peopleList]);

  const handleChangeOwnerClick = (): void => {
    const loggedInUserOrgId = getOrganizationUserId() ?? '';
    const ownerToUse = selectedOwner?.value ?? loggedInUserOrgId;

    void NiceModal.show(PeoplePickerModal, {
      selectType: 'single',
      titleText: `Change ${featureNamesText.goals.singular.toLowerCase()} owner`,
      confirmText: 'Change owner',
      initialSelectedIds: [ownerToUse],
      handleConfirm: (selectedIds: string[]): void => {
        const filteredParticipants = otherParticipants.filter((participant) => participant.orgUserId !== selectedIds[0]);
        setValue('participants', [
          ...filteredParticipants,
          {
            orgUserId: selectedIds[0],
            role: Goals.GoalParticipantRole.Owner,
          },
        ]);
      },
    });
  };

  const hookProps = {
    isLoading,
    selectedOwner,
    handleChangeOwnerClick,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default OwnerSelector;
