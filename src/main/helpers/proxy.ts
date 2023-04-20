import { Request, Response } from "express";
import { incrementApiCalls, incrementFailedApiCalls, setQueryResponseTime } from "./prometheus";

type EnhancedRequest = Request & {
    startTime: number
}

export const onError = ({ entity }: any) => (err: any, req: Request, res: Response) => {
    incrementFailedApiCalls({ entity });
    res.status(500).send('Something went wrong. Please try again later.');
}

export const onProxyRes = ({ entity }: any) => (proxyReq: any, req: any, res: Response) => {
    const startTime = req?.startTime;
    const duration = startTime && (Date.now() - startTime);
    duration && setQueryResponseTime(duration, { entity });
    if (proxyReq?.statusCode >= 400) {
        incrementFailedApiCalls({ entity });
    }
}

export const onProxyReq = ({ entity }: any) => (proxyReq: any, req: any, res: Response) => {
    const startTime = Date.now();
    req.startTime = startTime;
    incrementApiCalls({ entity });
}