import { CardSuit } from '../enums/card-suit';
import { CardValue } from '../enums/card-value';

/**
 * Gets the value of a card.
 * @param card - A string representing a card, e.g., '2H' for 2 of Hearts.
 * @returns The value of the card.
 * @example
 * const value = getValue('2H'); // returns '2'
 */
export function getValue(card: string) {
  return card[0] as CardValue;
}

/**
 * Gets the suit of a card.
 * @param card - A string representing a card, e.g., '2H' for 2 of Hearts.
 * @returns The suit of the card.
 * @example
 * const suit = getSuit('2H'); // returns 'H'
 */
export function getSuit(card: string) {
  return card[1] as CardSuit;
}

/**
 * Creates a function that checks if a card has a different value than the specified one.
 * @param value - The value to compare against.
 * @returns A function that takes a card and returns `true` if the card has a different value, `false` otherwise.
 * @example
 * const hasDifferentValue = cardByOtherValue('3');
 * const result = hasDifferentValue('2H'); // returns true
 */
export function cardByOtherValue(value: string) {
  return (card: string) => getValue(card) !== value;
}

/**
 * Creates a function that checks if a card has a specific suit.
 * @param suit - The suit to compare against.
 * @returns A function that takes a card and returns `true` if the card has the specified suit, `false` otherwise.
 * @example
 * const hasHeartsSuit = cardBySuit('H');
 * const result = hasHeartsSuit('2H'); // returns true
 */
export function cardBySuit(suit: string) {
  return (card: string) => getSuit(card) === suit;
}

/**
 * Collects features from a set of cards based on a specified feature extractor function.
 * @param cards - An array of cards.
 * @param featureExtractor - A function that extracts a feature from a card.
 * @returns A Map where keys are the extracted features and values are the counts of each feature.
 * @example
 * const cards = ['2H', '3C', '2D'];
 * const featureCounts = collect(cards, getValue); // returns Map { '2': 2, '3': 1 }
 */
export function collect(
  cards: string[],
  featureExtractor: (card: string) => string,
) {
  const features = new Map<string, number>();
  for (const card of cards) {
    const feature = featureExtractor(card);
    features.set(feature, (features.get(feature) ?? 0) + 1);
  }
  return features;
}
