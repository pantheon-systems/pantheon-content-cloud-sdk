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
