import { styled } from '@mui/material';
import { LocationDescriptor, LocationDescriptorObject } from 'history';
import { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { palette } from '~Common/styles/colorsRedesign';
import ConfirmExitButton from './Shared/ConfirmExitButton';

const StyledFooter = styled('div')<{ $isMobile: boolean }>(({ theme, $isMobile }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacings.extraLarge,
  marginBottom: $isMobile ? theme.spacings.threeExtraLarge : 0,
}));

const StyledCancelButton = styled('button')(({ theme }) => ({
  background: theme.palette.background.primary,
  color: theme.palette.text.secondary,
  padding: `.625rem ${theme.spacings.extraLarge}`,
  borderRadius: theme.radius.medium,
  border: `1px solid ${theme.palette.border.primary}`,
  fontWeight: 600,
}));

const StyledSaveButton = styled('button')(({ theme }) => ({
  background: palette.foreground.brandSecondary,
  color: theme.palette.text.white,
  padding: `.625rem ${theme.spacings.extraLarge}`,
  borderRadius: theme.radius.medium,
  border: 0,
  fontWeight: 600,
}));

interface ViewProps extends ComponentProps<'div'> {
  featureNamesText: FeatureNamesText;
  shouldConfirmClose: boolean;
  returnRoute?: LocationDescriptor<unknown>;
  isMobile: boolean;
}

const View = ({
  featureNamesText,
  shouldConfirmClose,
  returnRoute,
  isMobile,
  ...props
}: ViewProps): JSX.Element => {
  const locationObject = typeof returnRoute === 'string'
    ? { pathname: returnRoute }
    : returnRoute;

  return (
    <StyledFooter
      $isMobile={isMobile}
      {...props}
    >
      {returnRoute && (
        <ConfirmExitButton
          toLocation={locationObject as LocationDescriptorObject}
          shouldConfirmClose={shouldConfirmClose}
          renderButton={({ onClick }) => (
            <StyledCancelButton
              data-test-id="goalsCancelButton"
              onClick={onClick}
              type="button"
            >
              Cancel
            </StyledCancelButton>
          )}
        />
      )}
      <StyledSaveButton data-test-id="goalsSaveButton" type="submit">
        {`Save ${featureNamesText.goals.singular.toLowerCase()}`}
      </StyledSaveButton>
    </StyledFooter>
  );
};

type FooterProps = Omit<ViewProps, 'featureNamesText' | 'goalRoutes' | 'shouldConfirmClose' | 'isMobile'>;

const Footer = ({ ...props }: FooterProps): JSX.Element => {
  const { featureNamesText } = useGetFeatureNamesText();
  const { formState } = useFormContext();
  const shouldConfirmClose = formState.isDirty;
  const isMobile = useIsMobileQuery();

  const hookProps = {
    featureNamesText,
    shouldConfirmClose,
    isMobile,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default Footer;
