import { BaseError } from "../../../../../Exceptions/base.error";

export interface DefaultClassStrategyLoggingFunctions {
  logRequest: (methodName: string, traceId: string) => void;
  logResponseOrPromiseResponse: (response: any, methodName: string, traceId: string) => any;
  convertToBaseErrorAndLog: (error: BaseError & Error, methodName: string, traceId: string) => void;
}
