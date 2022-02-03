import { MethodLogDecoratorStrategy } from "../method-decorator.interface";

export interface LogStrategyFacade {
  getLogStrategy(): MethodLogDecoratorStrategy;
}
