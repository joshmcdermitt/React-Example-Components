import { styled } from '@mui/material';

const StyledRequiredIcon = styled('span')(({ theme }) => ({
  color: theme.palette.text.errorPrimary,
}));

const RequiredIcon = (): JSX.Element => <StyledRequiredIcon>*</StyledRequiredIcon>;

export default RequiredIcon;
