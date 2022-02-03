import { ClassLogDecorator } from "./classes-loggers/abstract-log-decorator";
import { LogDecoratorFactory, LogDecoratorFactoryImp } from "./log-decorator-method-factory";
import { LoggingOptions } from "./types/class-type";

export function Log(loggingConfiguration: LoggingOptions) {
  const logFactory: LogDecoratorFactory = LogDecoratorFactoryImp.instantiate();
  const decorator: ClassLogDecorator = logFactory.getLogDecorator(loggingConfiguration.classType);
  decorator.setLoggingConfigurations(loggingConfiguration);
  return decorator.getDecorator().bind(decorator);
}
