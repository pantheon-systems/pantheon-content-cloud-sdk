import ora, { Ora } from 'ora';
export class SpinnerLogger {
  logger: Ora | null;
  constructor(message: string, disabled: boolean = false) {
    if (!disabled) this.logger = ora(message);
    else this.logger = null;
  }

  start() {
    if (this.logger) this.logger.start();
  }
  stop() {
    if (this.logger) this.logger.stop();
  }

  succeed(message: string) {
    if (this.logger) this.logger.succeed(message);
  }
}

export class Logger {
  logger: Console;
  disabled: boolean;
  constructor(disabled: boolean = false) {
    this.logger = console;
    this.disabled = disabled;
  }

  log(...args: any[]) {
    if (!this.disabled) this.logger.log(...args);
  }
  error(...args: any[]) {
    this.logger.error(...args);
  }
}
