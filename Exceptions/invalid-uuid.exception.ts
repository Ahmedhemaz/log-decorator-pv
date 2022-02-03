import { BaseError } from "./base.error";
import { HttpStatusCodes } from "./httpstatuscodes";

export class InvalidUUIDV4Exception extends BaseError {
  constructor(
    name: string = "InvalidUUIDV4Exception",
    description: string = "Invalid UUID V4",
    httpStatusCode: number = HttpStatusCodes.BAD_REQUEST
  ) {
    super(name, description, httpStatusCode);
  }
}
