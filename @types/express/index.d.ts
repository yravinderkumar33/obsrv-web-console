declare namespace Express {
  export interface Request {
    responsePayload: Record<string, any>;
    session: any;
  }
}
