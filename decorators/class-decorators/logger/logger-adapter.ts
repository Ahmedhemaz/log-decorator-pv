import { Logger } from "./logger.interface";

export class LoggerAdapterImp implements Logger {
  private readonly logger: any;

  constructor(logger: any) {
    this.logger = logger;
  }

  public logInfo(data: any): void {
    this.logger.info(data);
  }

  public logError(data: any): void {
    this.logger.error(data);
  }
}
