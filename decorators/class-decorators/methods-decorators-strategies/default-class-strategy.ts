import { ModesoRequestLog, ModesoResponseLog } from "../../../log.model";
import { BaseError } from "../../../../Exceptions/base.error";
import rtracer from "cls-rtracer";
import util from "util";
import { COMPANY_NAME } from "../constants";
import { LogMessageBuilder } from "../log-message-builder/log-message-builder";
import { Logger } from "../logger/logger.interface";
import { LoggingOptions } from "../types/class-type";
import { DefaultClassStrategyLoggingFunctions } from "./interfaces/default-class-strategy-logging-functions.interface";
import { MethodLogDecoratorStrategy } from "./method-decorator.interface";
import { HttpStatusCodes } from "../../../../Exceptions/httpstatuscodes";

export class DefaultClassLogStrategyImp implements MethodLogDecoratorStrategy {
  private readonly messageBuilder: LogMessageBuilder;
  private readonly loggerAdapter: Logger;
  private loggingConfigurations: LoggingOptions;

  constructor(messageBuilder: LogMessageBuilder, loggerAdapter: Logger) {
    this.messageBuilder = messageBuilder;
    this.loggerAdapter = loggerAdapter;
  }

  public setLoggingConfigurations(loggingConfigurations: LoggingOptions): void {
    this.loggingConfigurations = loggingConfigurations;
  }

  public decorate(): (descriptor: PropertyDescriptor) => PropertyDescriptor {
    return (descriptor: PropertyDescriptor): PropertyDescriptor => {
      const method: Function = descriptor.value;
      const methodName: string = method.name;
      const closuredLoggingFunctions: DefaultClassStrategyLoggingFunctions = this.getLoggingFunctions();
      let returnValues: any;
      descriptor.value = function (...args: any[]) {
        const traceId: string = rtracer.id() as string;
        try {
          returnValues = method.apply(this, args);
          closuredLoggingFunctions.logRequest(methodName, traceId);
          return closuredLoggingFunctions.logResponseOrPromiseResponse(returnValues, methodName, traceId);
        } catch (error) {
          closuredLoggingFunctions.convertToBaseErrorAndLog(error, methodName, traceId);
          throw error;
        }
      };
      return descriptor;
    };
  }

  private logRequest(methodName: string, traceId: string): void {
    const requestLog: ModesoRequestLog = this.buildRequestLog(methodName, traceId);
    this.logRequestLog(requestLog);
  }

  private buildRequestLog(methodName: string, traceId: string): ModesoRequestLog {
    return this.messageBuilder
      .addCompanyName(COMPANY_NAME)
      .addLibName(this.loggingConfigurations.libName)
      .addClassName(this.loggingConfigurations.className)
      .addMethodName(methodName)
      .addTraceId(traceId)
      .buildAsRequestLog();
  }

  private logRequestLog(requestLog: ModesoRequestLog): void {
    this.loggerAdapter.logInfo(requestLog);
  }

  private logResponseOrPromiseResponse(response: any, methodName: string, traceId: string): any {
    if (this.isPromise(response)) {
      return this.logPromiseResponse(response, methodName, traceId);
    } else {
      this.logResponse(methodName, traceId);
      return response;
    }
  }

  private logPromiseResponse(response: any, methodName: string, traceId: string): any {
    return response
      .then((returnValues: any) => {
        this.logResponse(methodName, traceId);
        return returnValues;
      })
      .catch((error) => {
        this.convertToBaseErrorAndLog(error, methodName, traceId);
        throw error;
      });
  }

  private logResponse(methodName: string, traceId: string): void {
    const responseLog: ModesoResponseLog = this.buildResponseLog(methodName, traceId);
    this.logResponseLog(responseLog);
  }

  private buildResponseLog(methodName: string, traceId: string): ModesoResponseLog {
    return this.messageBuilder
      .addCompanyName(COMPANY_NAME)
      .addLibName(this.loggingConfigurations.libName)
      .addClassName(this.loggingConfigurations.className)
      .addMethodName(methodName)
      .addTraceId(traceId)
      .buildAsResponseLog();
  }

  private logResponseLog(responseLog: ModesoResponseLog): void {
    this.loggerAdapter.logInfo(responseLog);
  }

  private convertToBaseErrorAndLog(error: BaseError & Error, methodName: string, traceId: string): void {
    if (!this.isInstanceOfBaseError(error)) {
      error = this.convertToBaseError(error);
    }
    const errorLog = this.buildErrorLogFrom(error, methodName, traceId);
    this.logError(errorLog);
  }

  private isInstanceOfBaseError(error: Error) {
    return error instanceof BaseError;
  }

  private convertToBaseError(error: Error) {
    return new BaseError(error.name, error.message, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  private buildErrorLogFrom(error: BaseError, methodName: string, traceId: string): ModesoResponseLog {
    return this.messageBuilder
      .addCompanyName(COMPANY_NAME)
      .addLibName(this.loggingConfigurations.libName)
      .addClassName(this.loggingConfigurations.className)
      .addMethodName(methodName)
      .addLogData(error)
      .addTraceId(traceId)
      .buildAsResponseLog();
  }

  private logError(errorLog: ModesoResponseLog): void {
    this.loggerAdapter.logError(errorLog);
  }

  private isPromise(returnValue: any): boolean {
    return util.types.isPromise(returnValue);
  }

  private getLoggingFunctions(): DefaultClassStrategyLoggingFunctions {
    return {
      logRequest: this.logRequest.bind(this),
      logResponseOrPromiseResponse: this.logResponseOrPromiseResponse.bind(this),
      convertToBaseErrorAndLog: this.convertToBaseErrorAndLog.bind(this),
    };
  }
}
