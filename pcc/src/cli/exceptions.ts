export class UndhandledError extends Error {
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
