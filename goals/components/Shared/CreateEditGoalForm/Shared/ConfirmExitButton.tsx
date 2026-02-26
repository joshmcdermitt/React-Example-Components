import { LocationDescriptorObject } from 'history';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ShouldConfirmButton, { ShouldConfirmButtonProps } from '../../ShouldConfirmButton';

type ViewProps = ShouldConfirmButtonProps;

const View = ({
  shouldConfirmClose,
  onConfirm,
  ...props
}: ViewProps): JSX.Element => (
  <ShouldConfirmButton
    shouldConfirmClose={shouldConfirmClose}
    onConfirm={onConfirm}
    {...props}
  />
);

interface ConfirmExitButtonProps extends Omit<ViewProps, 'onConfirm'> {
  toLocation: LocationDescriptorObject,
}

const ConfirmExitButton = ({
  toLocation,
  ...props
}: ConfirmExitButtonProps): JSX.Element => {
  const history = useHistory();

  const onConfirm = useCallback(() => {
    if (toLocation.pathname) {
      history.push(toLocation.pathname, toLocation.state);
    }
  }, [history, toLocation]);

  const hookProps = {
    onConfirm,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default ConfirmExitButton;
