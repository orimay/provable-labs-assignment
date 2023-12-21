import { CLI } from './services/cli';
import { getBestHand } from './utils/poker-hand';
import { parseCards } from './utils/validation';

const cli = new CLI();
while (true) {
  const cardsStr = await cli.question('Cards: ');

  try {
    const { hand, deck } = parseCards(cardsStr);

    const bestHand = getBestHand(hand, deck);

    cli.writeLine(
      `Hand: ${hand.join(' ')} Deck: ${deck.join(' ')} Best hand: ${bestHand}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      cli.writeLine(error.message);
    } else {
      cli.writeLine('Unknown error: ' + JSON.stringify(error));
    }
  }

  cli.writeLine();
}
