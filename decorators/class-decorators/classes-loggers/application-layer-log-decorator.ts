import { MethodLogDecoratorStrategy } from "../methods-decorators-strategies/method-decorator.interface";
import { ClassLogDecorator } from "./abstract-log-decorator";

export class ApplicationLayerLogDecorator extends ClassLogDecorator {
  constructor(methodLogDecoratorStrategy: MethodLogDecoratorStrategy) {
    super();
    this.methodLogDecoratorStrategy = methodLogDecoratorStrategy;
  }
  public getDecorator(): Function {
    return function (target: new (...params: any[]) => any) {
      this.setDecoratedClass(target);
      this.decorateClassMethods();
    };
  }
}
