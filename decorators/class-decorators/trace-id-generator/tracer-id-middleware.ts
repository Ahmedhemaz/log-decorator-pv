import rtracer from "cls-rtracer";
import { v4 } from "uuid";
export const rtracerMiddleware = rtracer.expressMiddleware({ requestIdFactory: v4 });
