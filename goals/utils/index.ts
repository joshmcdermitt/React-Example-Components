import { GetIsCurrencyProps } from '~Goals/const/types';
import { CURRENCY_UNITS } from '~Goals/const';

export const getIsGoalValueCurrency = ({ displayLabel, labelPositionId }: GetIsCurrencyProps): boolean => CURRENCY_UNITS
  .some((currencyUnit) => currencyUnit.displayLabel === displayLabel && currencyUnit.labelPositionId === labelPositionId);
