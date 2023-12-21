/**
 * Enum-like object representing card values in a standard deck of playing cards.
 * Each property is a string literal representing a specific card value.
 * Numeric values represent the corresponding numbers, and face cards are represented by their initials.
 * @example
 * const card = CardValue.Ace;
 */
export const CardValue = {
  /**
   * Represents the card value '2'.
   */
  '2': '2',

  /**
   * Represents the card value '3'.
   */
  '3': '3',

  /**
   * Represents the card value '4'.
   */
  '4': '4',

  /**
   * Represents the card value '5'.
   */
  '5': '5',

  /**
   * Represents the card value '6'.
   */
  '6': '6',

  /**
   * Represents the card value '7'.
   */
  '7': '7',

  /**
   * Represents the card value '8'.
   */
  '8': '8',

  /**
   * Represents the card value '9'.
   */
  '9': '9',

  /**
   * Represents the card value '10'.
   */
  '10': 'T',

  /**
   * Represents the card value 'Jack'.
   */
  Jack: 'J',

  /**
   * Represents the card value 'Queen'.
   */
  Queen: 'Q',

  /**
   * Represents the card value 'King'.
   */
  King: 'K',

  /**
   * Represents the card value 'Ace'.
   */
  Ace: 'A',
} as const;

/**
 * Type representing a card value, which is a union of all possible card values.
 * @example
 * const suit: CardValue = CardValue.Ace;
 */
export type CardValue = (typeof CardValue)[keyof typeof CardValue];
