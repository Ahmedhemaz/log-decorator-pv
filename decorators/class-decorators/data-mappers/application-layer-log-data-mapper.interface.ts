import express from "express";
import { LoggedRequest, LoggedResponse } from "./types";

export interface ApplicationLayerLogDataMapper {
  mapRequestToLoggedFormat(req: express.Request): LoggedRequest;
  mapResDataToLoggedFormat(data: any, res: express.Response): LoggedResponse;
  maskRequestBodyOf(reqBody: any, keys: string[]): any;
}
