import { ClassLogDecorator } from "./classes-loggers/abstract-log-decorator";
import { ApplicationLayerLogDecorator } from "./classes-loggers/application-layer-log-decorator";
import { DefaultLogDecorator } from "./classes-loggers/default-class-log-decorator";
import { classesTypes } from "./constants";
import { InvalidClassTypeException } from "./exceptions/invalid-class-type.exception";
import { ApplicationLayerLogStrategyFacadeImp } from "./methods-decorators-strategies/facades/application-layer-log-strategy-facade";
import { DefaultClassLogStrategyFacadeImp } from "./methods-decorators-strategies/facades/default-class-log-strategy-facade";
import { ClassType } from "./types/class-type";

export class LogDecoratorFactoryImp implements LogDecoratorFactory {
  public static instantiate() {
    return new LogDecoratorFactoryImp();
  }
  public getLogDecorator(classType: ClassType): ClassLogDecorator {
    switch (classType) {
      case classesTypes.APPLICATION_LAYER_CLASS:
        return new ApplicationLayerLogDecorator(ApplicationLayerLogStrategyFacadeImp.instantiate().getLogStrategy());
      case classesTypes.DEFAULT:
        return new DefaultLogDecorator(DefaultClassLogStrategyFacadeImp.instantiate().getLogStrategy());
      default:
        throw new InvalidClassTypeException();
    }
  }
}
export interface LogDecoratorFactory {
  getLogDecorator(classType: ClassType): ClassLogDecorator;
}
