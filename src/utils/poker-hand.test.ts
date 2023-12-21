import { describe, expect, it } from 'vitest';
import { PokerHand } from '../enums/poker-hand';

import { getBestHand, getFlushCards, isStraight } from './poker-hand';
import { parseCards } from './validation';

describe('poker-hand', () => {
  it.each([
    [['QC', 'JH', 'KH', 'QH', 'AH'], ['TH'], true],
    [['QC', 'JH', 'KH', '2D', '3S'], ['TH', 'QH', 'AH'], true],
    [['2C', '3H', '4H', '5D', '7S'], ['JH', 'TH', 'QH', 'AH', 'KH'], true],
    [['QH', 'KH', 'AH', '2S', '6S'], ['TH', 'JH'], true],
    [['2H', '2S', '4H', '3S', '3C'], ['2D', '3D', '5C'], false],
  ])('isStraight(%j, %j) -> %j', async (hand, deck, expected) => {
    expect(isStraight(hand, deck)).toEqual(expected);
  });

  it.each([
    [
      ['2H', 'JH', 'KH', 'QH', 'AH'],
      ['TH'],
      { deck: ['TH'], hand: ['2H', 'JH', 'KH', 'QH', 'AH'] },
    ],
    [
      [],
      ['TC', 'QC', 'AC', '2C', '3C'],
      {
        deck: ['TC', 'QC', 'AC', '2C', '3C'],
        hand: [],
      },
    ],
    [
      ['TC', 'QC', 'AC', '2C', '3C'],
      [],
      {
        deck: [],
        hand: ['TC', 'QC', 'AC', '2C', '3C'],
      },
    ],
    [[], ['TH', 'QC', 'AC', '2C', '3C'], null],
  ])('getFlushCards(%j, %j) -> %j', async (hand, deck, expected) => {
    expect(getFlushCards(hand, deck)).toEqual(expected);
  });

  it.each([
    ['TH JH QC QD QS QH KH AH 2S 6S', PokerHand.StraightFlush],
    ['2H 2S 3H 3S 3C 2D 3D 6C 9C TH', PokerHand.FourOfAKind],
    ['2H 2S 3H 3S 3C 2D 9C 3D 6C TH', PokerHand.FullHouse],
    ['2H AD 5H AC 7H AH 6H 9H 4H 3C', PokerHand.Flush],
    ['AC 2D 6C 3S KD 5S 4D KS AS 4C', PokerHand.Straight],
    ['KS AH 2H 3C 4H KC 2C TC 2D AS', PokerHand.ThreeOfAKind],
    ['AH 2C 9S AD 3C QH KS JS JD KD', PokerHand.TwoPairs],
    ['6C 9C 8C 2D 7C 2H TC 4C 9S AH', PokerHand.OnePair],
    ['3D 5S 2H QD TD 6S KH 9H AD QH', PokerHand.HighestCard],
  ])('getBestHand(%j) -> %j', async (cardsStr, expected) => {
    const { hand, deck } = parseCards(cardsStr);
    expect(getBestHand(hand, deck)).toEqual(expected);
  });
});
