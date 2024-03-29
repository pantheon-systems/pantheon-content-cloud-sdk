export interface Logger {
  error: LogFunction;
  info: LogFunction;
  warn: LogFunction;
}

type LogFunction = (...args: unknown[]) => void;

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
