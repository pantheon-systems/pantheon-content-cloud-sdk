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
// export function errorHandler<T = any[]>(f: (...args: T) => Promise<void>) {
//   return async function (args: T) {
//     try {
//       await f(args);
//     } catch (e) {
//       console.log(
//         chalk.red(
//           'Something went wrong. Please contact pantheon support team.',
//         ),
//         chalk.red('Error Details', (e as { message: string }).message),
//       );
//     }
//   };
// }
