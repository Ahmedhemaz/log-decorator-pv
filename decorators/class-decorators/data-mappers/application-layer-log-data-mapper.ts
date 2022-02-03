import express from "express";
import { LoggedRequest, LoggedResponse } from "./types";
export class ApplicationLayerLogDataMapperImp {
  public mapRequestToLoggedFormat(req: express.Request): LoggedRequest {
    return {
      method: req.method,
      headers: req.headers,
      url: req.url,
      body: req.body,
    };
  }

  public mapResDataToLoggedFormat(res: express.Response, data: any): LoggedResponse {
    return {
      status: res.statusCode,
      headers: res.getHeaders(),
      body: data,
    };
  }

  public maskRequestBodyOf(reqBody: any, keys: string[]): any {
    const maskedRequestBody = { ...reqBody };
    keys.forEach((key) => {
      if (key in maskedRequestBody) {
        maskedRequestBody[key] = "***************";
      }
    });
    return maskedRequestBody;
  }
}
