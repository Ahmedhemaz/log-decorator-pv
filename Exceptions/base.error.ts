export class BaseError extends Error {
  public readonly name: string;
  public readonly description: string;
  public readonly httpStatusCode: number;

  constructor(name: string, description: string, httpStatusCode: number) {
    super(description);
    this.name = name;
    this.description = description;
    this.httpStatusCode = httpStatusCode;
    Error.captureStackTrace(this);
  }
}
