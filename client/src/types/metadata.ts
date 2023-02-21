export interface IChartFetchRequest {
    type: string;
    retryIntervalInMs: number;
    timeout: number;
    url: string;
    method: string;
    headers: object;
    body: object;
    params: object;
    parse: (response: object) => Array<object>
    error: () => Array<any>
}