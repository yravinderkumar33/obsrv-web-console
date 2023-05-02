export interface ITelemetry {
  id: string;
  ver: string;
  pid: string;
  did?: string;
  batchsize: number;
}

export interface ILogData {
  type: string;
  level: string;
  message: string;
  params?: Array<Object>;
}

export interface IInteractData {
  id: string | undefined;
  type: string;
  ver: string;
}

export interface IImpressionData {
  id: string;
  type: string;
  pageId: string;
  uri: string;
}
