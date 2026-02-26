import { Goals } from '@josh-hr/types';
import { CurrencyUnit } from './types';

export const MAX_CASCADING_GOALS_TABLE_DEPTH = 4;

export const MAX_EXTERNAL_LINK_LENGTH = 1000;

// Allows for 15 numbers, 4 commas
export const MAX_GOAL_VALUE_LENGTH = 10;

export const CLONE_PREFIX = '(Clone) ';
export const CLONE_PREFIX_LENGTH = CLONE_PREFIX.length;

export const MAX_CUSTOM_UNIT_TYPE_LENGTH = 20;

// Landing page search
export const MAX_SEARCH_TERMS = 15;
export const MAX_SEARCH_TERM_LENGTH = 70;
export const MAX_SEARCH_TERM_LABEL_LENGTH = 20;

// Goals table
export const PAGINATION_PAGE_SIZES = [10, 25, 50, 75, 100];
export const PAGINATION_DEFAULT_PAGE_SIZE = 25;
export const PAGINATION_DEFAULT_PAGE_NUMBER = 0;

// Currency units
export const CURRENCY_UNITS: CurrencyUnit[] = [
  {
    name: '',
    displayLabel: '$',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: '€',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: '¥',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: '£',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: 'CN¥',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: 'CHF',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: 'CAD',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: 'A$',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: '₹',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
  {
    name: '',
    displayLabel: '₩',
    labelPositionId: Goals.LabelPositionId.Prefix,
  },
];
