import { CARD_SUITS } from '../constants/card-suits';
import { CARD_VALUES } from '../constants/card-values';
import { PokerHand } from '../enums/poker-hand';
import { cardBySuit, collect, getSuit, getValue } from './card-feature';

/**
 * A mapping of poker hands to their corresponding values.
 */
const HAND_VALUE = new Map<string, number>(
  Object.values(PokerHand).map((hand, index) => [hand, index]),
);

/**
 * Determines if a current poker hand has reached or surpassed a target poker hand in value.
 * @param handCurrent - The current poker hand.
 * @param handTarget - The target poker hand to compare against.
 * @returns `true` if the current hand has reached or surpassed the target hand, `false` otherwise.
 * @example
 * const result = reachedHand(PokerHand.TwoPairs, PokerHand.FullHouse); // returns false
 */
export function reachedHand(handCurrent: PokerHand, handTarget: PokerHand) {
  const valueCurrent = HAND_VALUE.get(handCurrent) ?? 0;
  const valueTarget = HAND_VALUE.get(handTarget) ?? 0;
  return valueCurrent >= valueTarget;
}

/**
 * Get count groups for card values in the hand and deck.
 * @param hand - Array of cards in the player's hand.
 * @param deck - Array of cards on top of the deck.
 * @returns A map where keys are counts of each card value, and values are the number of occurrences of those counts.
 * @example
 * const hand = ['2H', '3D', '4S', '2C', '3H'];
 * const deck = ['2S', '6D', '7H'];
 * const countGroups = getCountGroups(hand, deck);
 * // Output: Map { 2 => 3, 3 => 2 }
 */
export function getCountGroups(hand: string[], deck: string[]) {
  const valueGroups = new Map<string, number>();
  const handValues = collect(hand, getValue);
  const deckValues = collect(deck, getValue);

  for (const [value, count] of deckValues) {
    valueGroups.set(value, count);
  }

  let handCardsLeft = 5 - deck.length;
  const handEntries = [...handValues.entries()].sort(
    (a, b) =>
      // prioritizing by the count of this value in deck,
      (deckValues.get(b[0]) ?? 0) - (deckValues.get(a[0]) ?? 0) ||
      // then (if the same count in deck) by the count of this value in hand
      b[1] - a[1],
  );

  // We can only use 5 cards, so discard extra hand cards
  for (const [value, count] of handEntries) {
    const deckCount = valueGroups.get(value) ?? 0;
    const handCount = Math.min(handCardsLeft, count);
    valueGroups.set(value, deckCount + handCount);
    handCardsLeft -= handCount;
    if (!handCardsLeft) break;
  }

  const countGroups = new Map<number, number>();
  for (const count of valueGroups.values()) {
    if (count <= 1) continue;
    countGroups.set(count, (countGroups.get(count) ?? 0) + 1);
  }

  return countGroups;
}

/**
 * Gets the cards needed to form a flush from the hand and deck.
 * @param hand - The current hand.
 * @param deck - The deck of cards.
 * @returns An object with 'hand' and 'deck' properties if successful, `null` otherwise.
 * @example
 * const result = getFlushCards(['2H', 'JH', 'KH', 'QH', 'AH'], ['TH']);
 * console.log(result.hand); // ['2H', 'JH', 'KH', 'QH', 'AH']
 * console.log(result.deck); // ['TH']
 */
export function getFlushCards(hand: string[], deck: string[]) {
  const handSuits = collect(hand, getSuit);
  const deckSuits = collect(deck, getSuit);
  for (const suit of CARD_SUITS) {
    const countDeck = deckSuits.get(suit) ?? 0;

    // all cards from deck are mandatory
    if (countDeck < deck.length) continue;

    const countHand = handSuits.get(suit) ?? 0;
    if (countDeck + countHand >= 5) {
      return {
        deck,
        hand: hand.filter(cardBySuit(suit)),
      };
    }
  }
  return null;
}

/**
 * Determines if a hand and deck form a straight.
 * @param hand - The current hand.
 * @param deck - The deck of cards.
 * @returns `true` if the hand and deck form a straight, `false` otherwise.
 * @example
 * const result = isStraight(['QC', 'JH', 'KH', '2D', '3S'], ['TH', 'QH', 'AH']);
 * console.log(result); // true
 */
export function isStraight(hand: string[], deck: string[]) {
  const handValues = collect(hand, getValue);
  const deckValues = collect(deck, getValue);

  // Every deck card must only appear once in straight
  if (deckValues.size !== deck.length) return false;

  let sequence = 0;
  let handCardsLeft = 5 - deckValues.size;
  for (const value of CARD_VALUES) {
    const countInDeck = deckValues.get(value) ?? 0;

    if (countInDeck === 1) {
      ++sequence;
    } else if (handCardsLeft && handValues.has(value)) {
      // the sequence may start with hand cards
      --handCardsLeft;
      ++sequence;
    } else {
      // the sequence is broken, reset
      sequence = 0;
      handCardsLeft = 5 - deckValues.size;
    }

    // the sequence is found
    if (sequence === 5) return true;
  }
  return false;
}

/**
 * Finds the best poker hand from a given hand and deck.
 * @param hand - The current hand.
 * @param deck - The deck of cards.
 * @returns The best poker hand formed from the given hand and deck.
 * @example
 * const result = getBestHand(['TH', 'JH', 'QC', 'QD', 'QS'], ['QH', 'KH', 'AH', '2S', '6S']);
 * console.log(result); // "straight-flush"
 */
export function getBestHand(hand: string[], deck: string[]) {
  let bestHand: PokerHand = PokerHand.HighestCard;

  for (let i = 0; i < 6; ++i) {
    // the easiest cases are when we either discard no cards or discard all cards
    // then when we discard the maximum count of cards
    // so we discard 0, 5, 4, 3, 2, 1 cards until we find the perfect hand
    const cardsToDiscard = (6 - i) % 6;
    const cardsFromDeck = deck.slice(0, cardsToDiscard);

    const flushCards = getFlushCards(hand, cardsFromDeck);
    if (flushCards !== null) {
      if (isStraight(flushCards.hand, flushCards.deck)) {
        // The best possible hand found
        return PokerHand.StraightFlush;
      }
    }

    // no need to count cards if we already found the best card count
    if (reachedHand(bestHand, PokerHand.FourOfAKind)) continue;

    const countGroups = getCountGroups(hand, cardsFromDeck);

    if (countGroups.get(4)) {
      bestHand = PokerHand.FourOfAKind;
      continue;
    }

    if (reachedHand(bestHand, PokerHand.FullHouse)) continue;
    if (countGroups.get(3) && countGroups.get(2)) {
      bestHand = PokerHand.FullHouse;
      continue;
    }

    if (reachedHand(bestHand, PokerHand.Flush)) continue;
    if (flushCards !== null) {
      bestHand = PokerHand.Flush;
      continue;
    }

    if (reachedHand(bestHand, PokerHand.Straight)) continue;
    if (isStraight(hand, cardsFromDeck)) {
      bestHand = PokerHand.Straight;
      continue;
    }

    if (reachedHand(bestHand, PokerHand.ThreeOfAKind)) continue;
    if (countGroups.get(3)) {
      bestHand = PokerHand.ThreeOfAKind;
      continue;
    }

    if (reachedHand(bestHand, PokerHand.TwoPairs)) continue;
    if (countGroups.get(2) === 2) {
      bestHand = PokerHand.TwoPairs;
      continue;
    }

    // The best option available at this point, no need to check for reached hand
    if (countGroups.get(2) === 1) {
      bestHand = PokerHand.OnePair;
    }
  }

  return bestHand;
}
