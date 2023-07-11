import chalk from 'chalk';

export class UnhandledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
export class HTTPNotFound extends Error {
  constructor() {
    super('Not Found');
    this.name = this.constructor.name;
  }
}
export function errorHandler<T>(f: (arg: T) => Promise<void>) {
  return async function (arg: T) {
    try {
      await f(arg);
    } catch (e) {
      console.log(
        chalk.red(
          'ERROR: Something went wrong. Please contact Pantheon support team.',
        ),
      );
    }
  };
}
