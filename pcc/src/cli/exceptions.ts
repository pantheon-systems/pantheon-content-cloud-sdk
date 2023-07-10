class UndhandledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
