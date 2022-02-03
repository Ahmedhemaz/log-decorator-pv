import { getLogger } from "../../../../logger";
import { LogMessageBuilder } from "../../log-message-builder/log-message-builder";
import { LoggerAdapterImp } from "../../logger/logger-adapter";
import { DefaultClassLogStrategyImp } from "../default-class-strategy";
import { MethodLogDecoratorStrategy } from "../method-decorator.interface";
import { LogStrategyFacade } from "./log-strategy-facade.interface";

export class DefaultClassLogStrategyFacadeImp implements LogStrategyFacade {
  public static instantiate(): LogStrategyFacade {
    return new DefaultClassLogStrategyFacadeImp();
  }

  private readonly defaultClassLogStrategy: MethodLogDecoratorStrategy;

  constructor(defaultClassLogStrategy: MethodLogDecoratorStrategy = null) {
    this.defaultClassLogStrategy =
      defaultClassLogStrategy ||
      new DefaultClassLogStrategyImp(new LogMessageBuilder(), new LoggerAdapterImp(getLogger()));
  }

  public getLogStrategy(): MethodLogDecoratorStrategy {
    return this.defaultClassLogStrategy;
  }
}
