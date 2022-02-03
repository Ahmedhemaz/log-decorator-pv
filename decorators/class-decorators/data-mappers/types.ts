export interface LoggedRequest {
  method: string;
  headers: any;
  url: string;
  body: any;
}

export interface LoggedResponse {
  status: number;
  headers: any;
  body: any;
}
