import { CARD_SUITS } from '../constants/card-suits';
import { CARD_VALUES } from '../constants/card-values';
import { PokerHand } from '../enums/poker-hand';
import {
  cardByOtherValue,
  cardBySuit,
  collect,
  getSuit,
  getValue,
} from './card-feature';

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
 * Gets the cards needed to form a specified number of a kind from the hand and deck.
 * @param n - The number of cards needed to form the specified kind.
 * @param hand - The current hand.
 * @param deck - The deck of cards.
 * @param cardsTaken - The number of cards already taken from the hand.
 * @returns An object with 'handRest', 'deckRest', and 'cardsTaken' properties if successful, `null` otherwise.
 * @example
 * const result = getNOfAKind(3, ['2H', '2C', '2D', '4S', '5H'], ['6C', '7D', '8S', '9H', '10C']);
 * console.log(result.handRest); // ['4S', '5H']
 * console.log(result.deckRest); // ['6C', '7D', '8S', '9H', '10C']
 * console.log(result.cardsTaken); // 3
 */
export function getNOfAKind(
  n: number,
  hand: string[],
  deck: string[],
  cardsTaken = 0,
) {
  const handValues = collect(hand, getValue);
  const deckValues = collect(deck, getValue);
  for (const value of CARD_VALUES) {
    const countInDeck = deckValues.get(value) ?? 0;
    const handCards = 5 - deckValues.size - cardsTaken;
    const countInHand = Math.min(handCards, handValues.get(value) ?? 0);
    if (countInDeck + countInHand === n) {
      const handRest = hand.filter(cardByOtherValue(value));
      const deckRest = deck.filter(cardByOtherValue(value));
      return {
        handRest,
        deckRest,
        cardsTaken: n,
      };
    }
  }
  return null;
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

  let sequence = 0;
  let handCardsLeft = 5 - deckValues.size;
  for (const value of CARD_VALUES) {
    const countInDeck = deckValues.get(value) ?? 0;

    // Every deck card must only appear once in straight
    if (countInDeck > 1) return false;

    if (countInDeck === 1) {
      ++sequence;
    } else if (handCardsLeft && handValues.has(value)) {
      --handCardsLeft;
      ++sequence;
    } else {
      sequence = 0;
      handCardsLeft = 5 - deckValues.size;
    }

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
        bestHand = PokerHand.StraightFlush;
        break; // The best possible hand found
      }
    }

    if (reachedHand(bestHand, PokerHand.FourOfAKind)) continue;
    const nOfAKindResult = getNOfAKind(4, hand, cardsFromDeck);
    if (nOfAKindResult !== null) {
      bestHand = PokerHand.FourOfAKind;
      continue;
    }

    if (reachedHand(bestHand, PokerHand.FullHouse)) continue;
    const threeOfAKindResult = getNOfAKind(3, hand, cardsFromDeck);
    if (threeOfAKindResult !== null) {
      const twoOfAKindResult = getNOfAKind(
        2,
        threeOfAKindResult.handRest,
        threeOfAKindResult.deckRest,
        threeOfAKindResult.cardsTaken,
      );
      if (twoOfAKindResult !== null) {
        bestHand = PokerHand.FullHouse;
        continue;
      }
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
    if (threeOfAKindResult !== null) {
      bestHand = PokerHand.ThreeOfAKind;
      continue;
    }

    if (reachedHand(bestHand, PokerHand.TwoPairs)) continue;
    const twoOfAKindResult = getNOfAKind(2, hand, cardsFromDeck);
    if (twoOfAKindResult !== null) {
      const secondTwoOfAKindResult = getNOfAKind(
        2,
        twoOfAKindResult.handRest,
        twoOfAKindResult.deckRest,
        twoOfAKindResult.cardsTaken,
      );
      if (secondTwoOfAKindResult !== null) {
        bestHand = PokerHand.TwoPairs;
        continue;
      }

      bestHand = PokerHand.OnePair;
      continue;
    }
  }

  return bestHand;
}
