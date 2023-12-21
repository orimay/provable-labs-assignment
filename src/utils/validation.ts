import { CARD_SUITS } from '../constants/card-suits';
import { CARD_VALUES } from '../constants/card-values';
import { getSuit, getValue } from './card-feature';

/**
 * Parses a string representing a set of cards, validates the format, and extracts the hand and deck.
 * @param cardStr - The string containing card representations separated by spaces.
 * @returns An object with a validated hand and deck.
 * @throws {Error} Ten cards expected if the input does not contain exactly 10 cards.
 * @throws {Error} Invalid card: {card} if any card in the input has an invalid format.
 * @throws {Error} Unexpected card value: {cardValue} if a card has an unexpected value.
 * @throws {Error} Unexpected card suit: {cardSuit} if a card has an unexpected suit.
 * @example
 * const cards = parseCards('2H 3C 4D 5S 6H 7C 8D 9S TH JH');
 * console.log(cards.hand); // ['2H', '3C', '4D', '5S', '6H']
 * console.log(cards.deck); // ['7C', '8D', '9S', 'TH', 'JH']
 */
export function parseCards(cardStr: string) {
  const cards = cardStr.trim().split(' ');

  if (cards.length !== 10) {
    throw new Error('Ten cards expected');
  }

  for (const card of cards) {
    if (card.length !== 2) {
      throw new Error(`Invalid card: ${card}`);
    }

    const cardValue = getValue(card);
    if (!CARD_VALUES.includes(cardValue)) {
      throw new Error(`Unexpected card value: ${cardValue}`);
    }

    const cardSuit = getSuit(card);
    if (!CARD_SUITS.includes(cardSuit)) {
      throw new Error(`Unexpected card suit: ${cardSuit}`);
    }
  }

  return {
    hand: cards.slice(0, 5),
    deck: cards.slice(5, 10),
  };
}
