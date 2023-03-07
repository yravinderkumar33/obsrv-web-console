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
    setConfig: (options: any, setOptions: any, response: any) => void;
    error: () => Array<any>
}