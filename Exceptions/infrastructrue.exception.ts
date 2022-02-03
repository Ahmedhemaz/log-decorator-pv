import { BaseError } from "./base.error";
import { HttpStatusCodes } from "./httpstatuscodes";

export class InfraStructureException extends BaseError {
  constructor(
    name: string = "InfraStructureException",
    description: string,
    httpStatusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(name, description, httpStatusCode);
  }
}
