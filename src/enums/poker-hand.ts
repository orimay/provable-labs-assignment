/**
 * Enum-like object representing various poker hand types.
 * Each property is a string literal representing a specific poker hand.
 * @example
 * const hand: PokerHand = PokerHand.OnePair;
 */
export const PokerHand = {
  /**
   * Represents the highest card poker hand.
   */
  HighestCard: 'highest-card',

  /**
   * Represents the one pair poker hand.
   */
  OnePair: 'one-pair',

  /**
   * Represents the two pairs poker hand.
   */
  TwoPairs: 'two-pairs',

  /**
   * Represents the three of a kind poker hand.
   */
  ThreeOfAKind: 'three-of-a-kind',

  /**
   * Represents the straight poker hand.
   */
  Straight: 'straight',

  /**
   * Represents the flush poker hand.
   */
  Flush: 'flush',

  /**
   * Represents the full house poker hand.
   */
  FullHouse: 'full-house',

  /**
   * Represents the four of a kind poker hand.
   */
  FourOfAKind: 'four-of-a-kind',

  /**
   * Represents the straight flush poker hand.
   */
  StraightFlush: 'straight-flush',
} as const;

/**
 * Type representing a poker hand, which is a union of all possible hand types.
 * @example
 * const hand: PokerHand = 'one-pair';
 */
export type PokerHand = (typeof PokerHand)[keyof typeof PokerHand];
