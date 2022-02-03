import { BaseError } from "../../../../Exceptions/base.error";
import { HttpStatusCodes } from "../../../../Exceptions/httpstatuscodes";
export class InvalidClassTypeException extends BaseError {
  constructor(
    name: string = "InvalidClassTypeException",
    description: string = `Class Type must ["APPLICATION_LAYER_CLASS"] or ["DEFAULT"] `,
    httpStatusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(name, description, httpStatusCode);
  }
}
