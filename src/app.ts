import express from 'express';
import cookieParser from 'cookie-parser';
import proxies from './main/proxies';
import mountProxies from './main/utils/proxy';

const app = express();

mountProxies(app, proxies);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

export default app;
