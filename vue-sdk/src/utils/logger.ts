export interface Logger {
  error: LogFunction;
  info: LogFunction;
  warn: LogFunction;
}

type LogFunction = (...args: any[]) => void;

export const DefaultLogger: Logger = console;

export const NoopLogger: Logger = {
  error: () => {},
  info: () => {},
  warn: () => {},
};
