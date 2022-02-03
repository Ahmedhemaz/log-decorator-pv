import { MethodLogDecoratorStrategy } from "../methods-decorators-strategies/method-decorator.interface";

export abstract class ClassLogDecorator {
  protected decoratedClass: any;
  protected methodLogDecoratorStrategy: MethodLogDecoratorStrategy;
  protected loggingConfigurations: any;
  private className: string;

  public abstract getDecorator(): Function;

  public setLoggingConfigurations(loggingConfigurations: any): void {
    this.loggingConfigurations = loggingConfigurations;
  }

  private setDecoratedClass(aClass: any): void {
    this.decoratedClass = aClass;
    this.className = this.decoratedClass.prototype.constructor.name;
  }

  private getDecoratedClassName(): string {
    return this.decoratedClass.name;
  }

  private decorateClassMethods() {
    for (const name of Object.getOwnPropertyNames(this.decoratedClass.prototype)) {
      this.decorateClassMethod(name);
    }
  }

  private decorateClassMethod(methodName: string) {
    const oldDescriptor = this.getClassMethodDescriptor(methodName);
    if (oldDescriptor) {
      this.setClassNameOfLoggingConfigurationsWith(this.getDecoratedClassName());
      this.passLoggingConfigurationsToMethodLogStrategy();
      const decoratedDescriptor = this.getClassMethodDescriptorDecoratedWith(
        oldDescriptor,
        this.methodLogDecoratorStrategy.decorate.bind(this.methodLogDecoratorStrategy)
      );
      this.reDefineMethodClassWithNewDescriptor(decoratedDescriptor, methodName);
    }
  }

  private passLoggingConfigurationsToMethodLogStrategy(): void {
    this.methodLogDecoratorStrategy.setLoggingConfigurations(this.loggingConfigurations);
  }

  private setClassNameOfLoggingConfigurationsWith(className: string): void {
    this.loggingConfigurations.className = className;
  }

  private getClassMethodDescriptor(methodName: string): PropertyDescriptor {
    return Object.getOwnPropertyDescriptor(this.decoratedClass.prototype, methodName);
  }

  private getClassMethodDescriptorDecoratedWith(
    descriptor: PropertyDescriptor,
    decorator: Function
  ): PropertyDescriptor {
    return decorator()(descriptor);
  }

  private reDefineMethodClassWithNewDescriptor(descriptor: PropertyDescriptor, methodName: string): void {
    Object.defineProperty(this.decoratedClass.prototype, methodName, descriptor);
  }
}
