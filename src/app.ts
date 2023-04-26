import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import proxies from './main/proxies';
import mountProxies from './main/utils/proxy';
const passport = require('passport');

const app = express();
const sessionSecret: any = process.env.SESSION_SECRET
app.use(
  session({
    secret: sessionSecret ,
    resave: false,
    saveUninitialized: true,
  })
);

mountProxies(app, proxies);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


export default app;
