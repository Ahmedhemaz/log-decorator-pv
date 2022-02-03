export type ClassType = "APPLICATION_LAYER_CLASS" | "DEFAULT";

export interface RequestLoggingOptions {
  isLoggable: boolean;
  reqBodyKeysToMask: string[];
}

export interface LoggingOptions {
  classType: ClassType;
  libName: string;
  className?: string;
  requestOptions?: RequestLoggingOptions;
}
