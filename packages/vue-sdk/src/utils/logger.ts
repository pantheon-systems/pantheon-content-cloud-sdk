export interface Logger {
  error: LogFunction;
  info: LogFunction;
  warn: LogFunction;
}

type LogFunction = (...args: string[]) => void;

export const DefaultLogger: Logger = console;

export const NoopLogger: Logger = {
  error: () => {
    // noop
  },
  info: () => {
    // noop
  },
  warn: () => {
    // noop
  },
};
