import rtracer from "cls-rtracer";
import express from "express";
import { HttpStatusCodes } from "../../../..";
import { BaseError } from "../../../../Exceptions/base.error";
import { ModesoRequestLog, ModesoResponseLog } from "../../../log.model";
import { COMPANY_NAME } from "../constants";
import { ApplicationLayerLogDataMapper } from "../data-mappers/application-layer-log-data-mapper.interface";
import { LogMessageBuilder } from "../log-message-builder/log-message-builder";
import { Logger } from "../logger/logger.interface";
import { LoggingOptions } from "../types/class-type";
import { ApplicationLayerLogStrategyLoggingFunctions } from "./interfaces/application-layer-class-strategy-logging-functions.interface";
import { MethodLogDecoratorStrategy } from "./method-decorator.interface";
export class ApplicationLayerLogStrategyImp implements MethodLogDecoratorStrategy {
  private readonly messageBuilder: LogMessageBuilder;
  private readonly loggerAdapter: Logger;
  private readonly dataMapper: ApplicationLayerLogDataMapper;
  private loggingConfigurations: LoggingOptions;

  constructor(messageBuilder: LogMessageBuilder, loggerAdapter: Logger, dataMapper: ApplicationLayerLogDataMapper) {
    this.messageBuilder = messageBuilder;
    this.loggerAdapter = loggerAdapter;
    this.dataMapper = dataMapper;
  }

  public setLoggingConfigurations(loggingConfigurations: any): void {
    this.loggingConfigurations = loggingConfigurations;
  }

  public decorate(): (descriptor: PropertyDescriptor) => PropertyDescriptor {
    return (descriptor: PropertyDescriptor): PropertyDescriptor => {
      const method = descriptor.value;
      const methodName = method.name;
      const closuredLoggingFunctions: ApplicationLayerLogStrategyLoggingFunctions = this.getLoggingFunctions();
      let returnValues: any;
      descriptor.value = async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
          const traceId: string = rtracer.id() as string;
          returnValues = await method.apply(this, [req, res, next]);
          closuredLoggingFunctions.logRequest(req, methodName, traceId);
          closuredLoggingFunctions.logResponse(res, returnValues, methodName, traceId);
        } catch (error) {
          closuredLoggingFunctions.returnHttpResponseAndLogError(error, res, methodName);
        }
        return returnValues;
      };
      return descriptor;
    };
  }

  private logRequest(req: express.Request, methodName: string, traceId: string): void {
    if (!this.isRequestLoggable()) {
      return;
    }
    const mappedRequest = this.mapRequestToLoggingFormat(req);
    mappedRequest.body = this.maskRequestBody(mappedRequest.body);
    const requestLog = this.buildRequestLog(mappedRequest, methodName, traceId);
    this.logRequestLog(requestLog);
  }

  private isRequestLoggable(): boolean {
    return this.loggingConfigurations.requestOptions.isLoggable;
  }

  private mapRequestToLoggingFormat(req: express.Request): any {
    return this.dataMapper.mapRequestToLoggedFormat(req);
  }

  private maskRequestBody(mappedRequestBody: any): any {
    const reqKeysToBeMapped = this.loggingConfigurations.requestOptions.reqBodyKeysToMask;
    return this.dataMapper.maskRequestBodyOf(mappedRequestBody, reqKeysToBeMapped);
  }

  private buildRequestLog(req: any, methodName: string, traceId: string): ModesoRequestLog {
    return this.messageBuilder
      .addCompanyName(COMPANY_NAME)
      .addLibName(this.loggingConfigurations.libName)
      .addClassName(this.loggingConfigurations.className)
      .addMethodName(methodName)
      .addTraceId(traceId)
      .addLogData(req)
      .buildAsRequestLog();
  }

  private logRequestLog(requestLog: ModesoRequestLog): void {
    this.loggerAdapter.logInfo(requestLog);
  }

  private logResponse(res: express.Response, returnValues: any, methodName: string, traceId: string): void {
    const mappedResponse = this.mapResponseToLoggingFormat(res, returnValues);
    const responseLog = this.buildResponseLog(mappedResponse, methodName, traceId);
    this.logResponseLog(responseLog);
  }

  private mapResponseToLoggingFormat(res: express.Response, returnValues: any): any {
    return this.dataMapper.mapResDataToLoggedFormat(res, returnValues);
  }

  private buildResponseLog(response: any, methodName: string, traceId: string) {
    return this.messageBuilder
      .addCompanyName(COMPANY_NAME)
      .addLibName(this.loggingConfigurations.libName)
      .addClassName(this.loggingConfigurations.className)
      .addMethodName(methodName)
      .addTraceId(traceId)
      .addLogData(response)
      .buildAsResponseLog();
  }

  private logResponseLog(responseLog: ModesoResponseLog): void {
    this.loggerAdapter.logInfo(responseLog);
  }

  private returnHttpResponseAndLogError(error: BaseError & Error, res: express.Response, methodName: string): void {
    if (!this.isInstanceOfBaseError(error)) {
      error = this.convertToBaseError(error);
    }
    const errorLog = this.buildErrorLogFrom(error, methodName);
    res.status(error.httpStatusCode).send({ message: error.description });
    this.logError(errorLog);
  }

  private isInstanceOfBaseError(error: Error) {
    return error instanceof BaseError;
  }

  private convertToBaseError(error: Error) {
    return new BaseError(error.name, error.message, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  private buildErrorLogFrom(error: BaseError, methodName: string): ModesoResponseLog {
    return this.messageBuilder
      .addCompanyName(COMPANY_NAME)
      .addLibName(this.loggingConfigurations.libName)
      .addClassName(this.loggingConfigurations.className)
      .addMethodName(methodName)
      .addLogData(error)
      .addTraceId(rtracer.id() as string)
      .buildAsResponseLog();
  }

  private logError(errorLog: ModesoResponseLog): void {
    this.loggerAdapter.logError(errorLog);
  }

  private getLoggingFunctions(): ApplicationLayerLogStrategyLoggingFunctions {
    return {
      returnHttpResponseAndLogError: this.returnHttpResponseAndLogError.bind(this),
      logRequest: this.logRequest.bind(this),
      logResponse: this.logResponse.bind(this),
    };
  }
}
