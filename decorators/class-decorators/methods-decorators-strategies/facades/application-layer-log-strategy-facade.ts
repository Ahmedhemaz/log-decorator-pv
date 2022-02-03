import { getLogger } from "../../../../logger";
import { ApplicationLayerLogDataMapperImp } from "../../data-mappers/application-layer-log-data-mapper";
import { LogMessageBuilder } from "../../log-message-builder/log-message-builder";
import { LoggerAdapterImp } from "../../logger/logger-adapter";
import { ApplicationLayerLogStrategyImp } from "../application-layer-class-strategy";
import { MethodLogDecoratorStrategy } from "../method-decorator.interface";
import { LogStrategyFacade } from "./log-strategy-facade.interface";

export class ApplicationLayerLogStrategyFacadeImp implements LogStrategyFacade {
  public static instantiate(): LogStrategyFacade {
    return new ApplicationLayerLogStrategyFacadeImp();
  }

  private readonly applicationLayerLogStrategy: MethodLogDecoratorStrategy;

  constructor(applicationLayerLogStrategy: MethodLogDecoratorStrategy = null) {
    this.applicationLayerLogStrategy =
      applicationLayerLogStrategy ||
      new ApplicationLayerLogStrategyImp(
        new LogMessageBuilder(),
        new LoggerAdapterImp(getLogger()),
        new ApplicationLayerLogDataMapperImp()
      );
  }

  public getLogStrategy(): MethodLogDecoratorStrategy {
    return this.applicationLayerLogStrategy;
  }
}
