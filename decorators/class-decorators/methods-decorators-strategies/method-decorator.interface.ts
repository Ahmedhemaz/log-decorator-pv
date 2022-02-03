export interface MethodLogDecoratorStrategy {
  decorate(): (descriptor: PropertyDescriptor) => PropertyDescriptor;
  setLoggingConfigurations(loggingConfigurations: any): void;
}
