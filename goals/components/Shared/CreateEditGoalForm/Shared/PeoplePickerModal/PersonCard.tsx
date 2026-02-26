import { styled } from '@mui/material';
import { ComponentProps, memo } from 'react';
import { SelectOption } from '~Common/components/PeopleTagPicker/usePeopleTagPicker';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';

const StyledPersonCard = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.large,
  padding: theme.spacings.extraLarge,
  borderRadius: theme.radius.extraLarge,
  background: theme.palette.background.primary,
  cursor: 'pointer',
  border: `2px solid ${theme.palette.border.brand}`,
}));

const StyledNameText = styled('p')(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: theme.lineHeight.small,
  fontWeight: 500,
}));

const StyledJoshCheckbox = styled(JoshCheckbox)({
  marginLeft: 'auto',
});

interface PersonCardProps extends ComponentProps<'li'> {
  person: SelectOption,
}

const PersonCard = ({
  person,
  ...props
}: PersonCardProps): JSX.Element => (
  <StyledPersonCard
    {...props}
  >
    <BaseAvatar
      orgUserId={person.value ?? null}
      avatarSize={30}
    />
    <StyledNameText>
      {person.label}
    </StyledNameText>
    <StyledJoshCheckbox
      data-test-id="goalsPeoplePickerPersonCardCheckbox"
      checked
    />
  </StyledPersonCard>
);

export default memo(PersonCard);
