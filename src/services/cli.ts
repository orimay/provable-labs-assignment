import { Interface, createInterface } from 'readline';

/**
 * CLI (Command Line Interface) service for handling user input and output.
 * This service encapsulates the functionality of creating a readline interface
 * for interacting with the command line, providing a promisified version of `readline.question`.
 */
export class CLI {
  private m_readline: Interface;

  /**
   * Creates an instance of the CLI service.
   * Initializes the readline interface for processing user input and output.
   */
  public constructor() {
    // Create a readline interface using standard input and output
    this.m_readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Add a listener for the 'close' event to gracefully exit the process
    this.m_readline.addListener('close', () => {
      this.m_readline.close();
      process.exit(0);
    });
  }

  /**
   * Writes the specified text followed by a newline character to the output.
   * If no text is provided, only a newline character is written.
   * @param text - The text to be written to the console. Defaults to an empty string.
   * @example
   * cli.writeLine('Hello, world!');
   * // Output: Hello, world!
   *
   * cli.writeLine();
   * // Output: (newline)
   */
  public writeLine(text = '') {
    this.m_readline.write(text + '\n');
  }

  /**
   * Promisified version of `readline.question`.
   * @param text - The text to display when prompting the user.
   * @returns A promise that resolves with the user's input.
   * @example
   * const userInput = await cli.question('Enter something: ');
   */
  public question(text: string) {
    return new Promise<string>(resolve =>
      this.m_readline.question(text, resolve),
    );
  }
}
