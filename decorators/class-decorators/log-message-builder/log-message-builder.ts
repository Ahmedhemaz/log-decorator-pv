import { ModesoRequestLog, ModesoResponseLog } from "../../../log.model";

export class LogMessageBuilder {
  private message: string;
  private traceId: string;
  private data: any;
  constructor() {
    this.message = ``;
  }

  public addCompanyName(name: string) {
    this.message = this.message.concat(`${name}:`);
    return this;
  }

  public addLibName(name: string) {
    this.message = this.message.concat(`${name}:`);
    return this;
  }

  public addClassName(name: string) {
    this.message = this.message.concat(`${name}:`);
    return this;
  }

  public addMethodName(name: string) {
    this.message = this.message.concat(`${name}`);
    return this;
  }

  public addTraceId(id: string) {
    this.traceId = id;
    return this;
  }

  public addLogData(data: any) {
    this.data = data;
    return this;
  }

  public buildAsRequestLog(): ModesoRequestLog {
    const requestLog: ModesoRequestLog = new ModesoRequestLog(this.message, this.traceId, this.data);
    this.clearLoggingInfo();
    return requestLog;
  }

  public buildAsResponseLog(): ModesoResponseLog {
    const responseLog: ModesoResponseLog = new ModesoResponseLog(this.message, this.traceId, this.data);
    this.clearLoggingInfo();
    return responseLog;
  }

  private clearLoggingInfo() {
    this.clearLogMessage();
    this.clearTraceId();
    this.clearLogData();
  }

  private clearLogMessage() {
    this.message = ``;
  }

  private clearTraceId() {
    this.traceId = ``;
  }

  private clearLogData() {
    this.data = {};
  }
  // add return value (masked/unmasked)
}
