import NiceModal from '@ebay/nice-modal-react';
import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import {
  Avatar,
  AvatarGroup,
  styled,
  SvgIcon,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { UserStatus } from '~Admin/const/defaults';
import PlusIcon from '~Assets/icons/plus.svg';
import { SelectOption, usePeopleTagPicker } from '~Common/components/PeopleTagPicker/usePeopleTagPicker';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { UserGroup } from '~Common/const/userGroups';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { useMemo } from 'react';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import UserIcon from '~Assets/icons/components/UserIcon';
import PeoplePickerModal from './Shared/PeoplePickerModal';

const styles = {
  avatarGroup: (overflow: number) => css({
    flexDirection: 'row-reverse',
    '.MuiAvatar-root:first-of-type': {
      marginLeft: overflow && overflow > 0 ? '0px !important' : 'unset', // separates the # avatar from group
    },
  }),
  avatar: css({
    ':last-child': {
      marginLeft: '-.75rem !important',
    },
    ':nth-of-type': {
      marginLeft: '-.75rem !important',
    },
  }),
};

const StyledCollaboratorsSelector = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem 2rem',
});

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

const StyledAvatarContainer = styled('div')<{ hasCollaborators: boolean }>(({ theme, hasCollaborators }) => ({
  display: 'flex',
  paddingLeft: '0.75rem',
  gap: hasCollaborators ? theme.spacings.medium : 0,
  margin: '0 1px',
}));

const StyledBaseAvatar = styled(BaseAvatar)(({ theme }) => ({
  border: `1.75px solid ${theme.palette.border.brand}`,
}));

const StyledAddButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  background: theme.palette.background.primary,
  borderRadius: theme.radius.full,
  border: '2px solid transparent',
  padding: 0,
  position: 'relative',

  ':before': {
    display: 'block',
    width: '100%',
    height: '100%',
    content: '""',
    border: `1px dashed ${theme.palette.border.primary}`,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: theme.radius.full,
  },
  '&:hover': {
    border: `2px solid ${theme.palette.border.brand}`,
    '&:before': {
      border: 'none',
    },
  },
}));

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
  width: '1.25rem',
  height: '1.25rem',
  fill: 'none',
  '& path': {
    stroke: theme.palette.foreground.quinary,
  },
}));

const NUMBER_OF_COLLABORATORS_TO_SHOW_DESKTOP = 10;
const NUMBER_OF_COLLABORATORS_TO_SHOW_MOBILE = 6;

interface ViewProps {
  isLoading: boolean,
  collaborators: SelectOption[],
  handleChangeCollaboratorsClick: () => void,
  numberOfAvatarsToShow: number,
}

const View = ({
  isLoading,
  collaborators,
  handleChangeCollaboratorsClick,
  numberOfAvatarsToShow,
  ...props
}: ViewProps): JSX.Element => (
  <StyledCollaboratorsSelector
    {...props}
  >
    <div>
      <StyledLabel data-test-id="goalsCollaboratorsLabel">Collaborators</StyledLabel>
      <StyledDescription>
        Collaborators can update the goal. They cannot complete or delete the goal.
      </StyledDescription>
    </div>
    {isLoading && (
      <AvatarGroup
        css={styles.avatarGroup(0)}
        max={numberOfAvatarsToShow}
      >
        {Array.from({ length: numberOfAvatarsToShow }).map((_, index) => (
          <Avatar
            /* eslint-disable-next-line react/no-array-index-key */
            key={`skeleton-${index}`}
            sx={{ width: 40, height: 40 }}
          >
            <UserIcon data-test-id="userIcon" />
          </Avatar>
        ))}
      </AvatarGroup>
    )}
    {!isLoading && (
      <StyledAvatarContainer hasCollaborators={collaborators.length > 0}>
        <AvatarGroup
          css={styles.avatarGroup(collaborators.length - numberOfAvatarsToShow)}
          max={numberOfAvatarsToShow}
          spacing="small"
        >
          {collaborators.map((collaborator) => (
            <StyledBaseAvatar
              css={styles.avatar}
              key={collaborator.value}
              orgUserId={collaborator.value ?? null}
              avatarSize={40}
            />
          ))}
        </AvatarGroup>
        <StyledAddButton
          type="button"
          onClick={handleChangeCollaboratorsClick}
          data-test-id="goalsAddCollaboratorsButton"
        >
          <StyledSvgIcon inheritViewBox>
            <PlusIcon title="Plus" />
          </StyledSvgIcon>
        </StyledAddButton>
      </StyledAvatarContainer>
    )}
  </StyledCollaboratorsSelector>
);

interface CollaboratorsSelectorProps {
  disabledIds?: string[],
  disableLimitedAccessUsers?: boolean,
}

const CollaboratorsSelector = ({
  disabledIds = [],
  disableLimitedAccessUsers = false,
  ...props
}: CollaboratorsSelectorProps): JSX.Element => {
  const { watch, setValue } = useFormContext<CreateEditGoalFormValues>();
  const isMobile = useIsMobileQuery();

  const accountTypesToInclude = disableLimitedAccessUsers
    ? [UserGroup.Admin, UserGroup.Member, UserGroup.Executive]
    : [UserGroup.Admin, UserGroup.Member, UserGroup.LimitedAccess, UserGroup.Executive];
  const currentParticipants = watch('participants');
  const owner = useMemo(() => (
    currentParticipants?.find((participant) => participant.role === Goals.GoalParticipantRole.Owner)
  ), [currentParticipants]);

  const {
    peopleList,
    isLoadingPeopleData,
  } = usePeopleTagPicker({
    administrativeStatusesToInclude: [UserStatus.Active, UserStatus.Invited],
    allowSelf: false,
    disabledIds: [...disabledIds, owner?.orgUserId ?? ''],
    accountTypesToInclude,
  });

  const [isLoading] = useSkeletonLoaders(isLoadingPeopleData);

  const baseCollaborators = useMemo(() => (
    currentParticipants?.filter((participant) => participant.role === Goals.GoalParticipantRole.Collaborator)
  ), [currentParticipants]);

  const collaborators = useMemo(() => {
    if (!baseCollaborators) {
      return [];
    }
    return baseCollaborators.map((participant) => {
      const person = peopleList.find((tempPerson) => tempPerson.value === participant.orgUserId);

      return {
        label: person?.label ?? 'Unknown',
        value: participant.orgUserId,
        profileImageUrl: person?.profileImageUrl,
      };
    });
  }, [baseCollaborators, peopleList]);

  const handleChangeCollaboratorsClick = (): void => {
    const initialSelectedIds = collaborators.map((collaborator) => collaborator.value);
    void NiceModal.show(PeoplePickerModal, {
      selectType: 'multiple',
      titleText: 'Add collaborators',
      confirmText: 'Confirm collaborators',
      disableCloseOnSelect: true,
      initialSelectedIds,
      disabledIds: [owner?.orgUserId ?? ''],
      handleConfirm: (selectedIds: string[]): void => {
        const newCollaborators = selectedIds.map((id) => ({
          orgUserId: id,
          role: Goals.GoalParticipantRole.Collaborator,
        }));

        if (owner) {
          setValue('participants', [...newCollaborators, owner]);
        }
      },
    });
  };

  const numberOfAvatarsToShow = isMobile ? NUMBER_OF_COLLABORATORS_TO_SHOW_MOBILE : NUMBER_OF_COLLABORATORS_TO_SHOW_DESKTOP;

  const hookProps = {
    isLoading,
    collaborators,
    handleChangeCollaboratorsClick,
    numberOfAvatarsToShow,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default CollaboratorsSelector;
