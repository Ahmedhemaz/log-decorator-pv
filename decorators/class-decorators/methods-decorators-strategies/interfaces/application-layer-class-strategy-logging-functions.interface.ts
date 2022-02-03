import { BaseError } from "../../../../../Exceptions/base.error";
import express from "express";

export interface ApplicationLayerLogStrategyLoggingFunctions {
  returnHttpResponseAndLogError: (error: BaseError & Error, res: express.Response, methodName: string) => void;
  logRequest: (req: express.Request, methodName: string, traceId: string) => void;
  logResponse: (res: express.Response, returnValues: any, methodName: string, traceId: string) => void;
}
