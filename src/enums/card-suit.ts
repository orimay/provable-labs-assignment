/**
 * Enum-like object representing card suits in a standard deck of playing cards.
 * Each property is a string literal representing a specific card suit.
 * @example
 * const suit = CardSuit.Hearts;
 */
export const CardSuit = {
  /**
   * Represents the suit 'Clubs'.
   */
  Clubs: 'C',

  /**
   * Represents the suit 'Diamonds'.
   */
  Diamonds: 'D',

  /**
   * Represents the suit 'Hearts'.
   */
  Hearts: 'H',

  /**
   * Represents the suit 'Spades'.
   */
  Spades: 'S',
} as const;

/**
 * Type representing a card suit, which is a union of all possible card suits.
 * @example
 * const suit: CardSuit = CardSuit.Hearts;
 */
export type CardSuit = (typeof CardSuit)[keyof typeof CardSuit];
