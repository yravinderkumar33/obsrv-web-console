import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import proxies from './main/proxies';
import mountProxies from './main/utils/proxy';

const app = express();
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

mountProxies(app, proxies);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


export default app;
