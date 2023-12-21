import { CardValue } from '../enums/card-value';

/**
 * Array of strings representing the possible card values in a standard deck of playing cards.
 * The order is from highest to lowest, considering Ace as the highest.
 */
export const CARD_VALUES: CardValue[] = [
  CardValue.Ace,
  CardValue.King,
  CardValue.Queen,
  CardValue.Jack,
  CardValue['10'],
  CardValue['9'],
  CardValue['8'],
  CardValue['7'],
  CardValue['6'],
  CardValue['5'],
  CardValue['4'],
  CardValue['3'],
  CardValue['2'],
];
