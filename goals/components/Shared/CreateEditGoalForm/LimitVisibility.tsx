import { SwitchUnstyled, switchUnstyledClasses } from '@mui/base';
import {
  styled,
} from '@mui/material';
import { memo } from 'react';
import { useFormContext, UseFormRegister } from 'react-hook-form';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { palette } from '~Common/styles/colorsRedesign';
import { palette as oldPalette } from '~Common/styles/colors';

const StyledGoalLimitVisibilityContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const StyledLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: theme.fontSize.small,
  margin: 0,
}));

const StyledDescription = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.tertiary,
  fontWeight: 400,
  fontSize: theme.fontSize.small,
  margin: '0 0 .5rem 0',
  maxWidth: '14.375rem',
}));

const Root = styled('span')(({ theme }) => ({
  fontSize: 0,
  position: 'relative',
  display: 'inline-block',
  width: '2.25rem',
  height: '1.25rem',
  cursor: 'pointer',

  [`& .${switchUnstyledClasses.track}`]: {
    boxSizing: 'border-box',
    background: oldPalette.neutrals.gray400,
    borderRadius: 24,
    display: 'block',
    height: '100%',
    width: '100%',
    position: 'absolute',
    transitionProperty: 'all',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '120ms',
  },

  [`& .${switchUnstyledClasses.thumb}`]: {
    boxSizing: 'border-box',
    display: 'block',
    width: '1rem',
    height: '1rem',
    top: '.125rem',
    left: '.125rem',
    borderRadius: theme.radius.full,
    backgroundColor: theme.palette.foreground.white,
    position: 'relative',
    transitionProperty: 'all',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '120ms',
  },

  [`&.${switchUnstyledClasses.checked}`]: {
    [`& .${switchUnstyledClasses.thumb}`]: {
      left: '1.125rem',
      backgroundColor: theme.palette.foreground.white,
      boxShadow: '0 1px 2px rgb(0 0 0 / 0.3)',
    },
    [`& .${switchUnstyledClasses.track}`]: {
      border: 'none',
      background: palette.foreground.brandSecondary,
    },
  },

  [`& .${switchUnstyledClasses.input}`]: {
    cursor: 'inherit',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0,
    zIndex: 1,
    margin: 0,
  },
}));

interface ViewProps {
  register: UseFormRegister<CreateEditGoalFormValues>,
  isPrivate: boolean,
}

const View = memo(({
  register,
  isPrivate,
  ...props
}: ViewProps): JSX.Element => (
  <StyledGoalLimitVisibilityContainer
    {...props}
  >
    <StyledLabel data-test-id="goalsLimitVisibilityLabel">
      <div>
        Limit visibility
      </div>
    </StyledLabel>
    <StyledDescription>
      Visible only to you, the owner, and assigned collaborators.
    </StyledDescription>
    <SwitchUnstyled
      slots={{
        root: Root,
      }}
      slotProps={{
        input: {
          ...register('isPrivate'),
          // @ts-expect-error data-test-id works here, but throws an error. I am unsure why.
          'data-test-id': 'goalsLimitVisibilitySwitch',
        },
      }}
      checked={isPrivate}
    />
  </StyledGoalLimitVisibilityContainer>
), (prevProps, nextProps) => (
  prevProps.isPrivate === nextProps.isPrivate
));

const LimitVisibility = ({
  ...props
}): JSX.Element => {
  const { register, watch } = useFormContext<CreateEditGoalFormValues>();
  const isPrivate = !!watch('isPrivate');

  const hookProps = {
    register,
    isPrivate,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default LimitVisibility;
