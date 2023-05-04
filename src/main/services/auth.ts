
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { BasicStrategy } from 'passport-http';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { v4 } from "uuid";
var KeyCloakStrategy = require('passport-keycloak-oauth2-oidc').Strategy;
import userService from './oauthUsers';
import clientService from './oauthClients';
import accessTokenService from './oauthAccessTokens';
import { User } from '../types';


enum PROVIDERS {
    KEYCLOAK = "keycloak"
}

passport.use(new LocalStrategy(
    (username, password, done) => {
        userService.findByUsername(username).then((user: any) => {
            if (!user) return done(null, false);
            if (user.password !== password) return done(null, false);
            return done(null, user);
        }).catch((error: any) => {
            return done(error);
        })
    }
));

passport.serializeUser((user: any, done) => done(null, user.id));

passport.deserializeUser((id: any, done) => {
    userService.findById(id).then((user: any) => {
        done(null, user)
    }).catch((error: any) => {
        done(error)
    })
});

const verifyClient = (clientId: string, clientSecret: string, done: (error: any, user?: any) => void) => {
    clientService.findByClientId(clientId).then((client: any) => {
        if (!client) return done(null, false);
        if (client.client_secret !== clientSecret) return done(null, false);
        return done(null, client);
    }).catch((error: any) => {
        return done(error);
    });
}

passport.use(new BasicStrategy(verifyClient));

passport.use(new ClientPasswordStrategy(verifyClient));

passport.use(new BearerStrategy(
    async (accessToken, done) => {
        try {
            const token = await accessTokenService.find(accessToken);
            if (!token) return done(null, false);
            if (token.user_id) {
                const user = await userService.findById(token.user_id)
                if (!user) return done(null, false);
                    //TODO: To keep this simple, restricted scopes are not implemented,
                    done(null, user, { scope: '*' });
            } else {
                const client = clientService.findByClientId(token.client_id)
                if (!client) return done(null, false);
                //TODO: To keep this simple, restricted scopes are not implemented,
                done(null, client, { scope: '*' });
            }
        } catch (error) {
            return done(error)
        }
    }
));

passport.use(new KeyCloakStrategy({
    clientID: 'myOauthClient',
    realm: 'MyKeyCloakRealm',
    publicClient: 'false',
    clientSecret: 'SCWHeF9HgtJ5BjmJFruk2IW15a5auueq',
    sslRequired: 'external',
    authServerURL: 'http://localhost:8080/auth',
    callbackURL: 'http://localhost:4000/api/auth/keycloak/callback'
  },
  (accessToken: string, refreshToken: string, profile: any, done: any) => {
    if(!profile.email) {
        return done(new Error("email is required field"))
    }
    // check if user exists then return user , otherwise create user and return the user
    userService.find({email_address: profile.email}).then((user: any) => {
        return done(null, user)
    }).catch((error:any) => {
        if(error === "user_not_found") {
            const userInfo: User = {
                id: v4(),
                user_name: profile.email,
                created_on: new Date().toISOString(),
                provider: PROVIDERS.KEYCLOAK,
                email_address: profile.email

            }
            userService.create(userInfo).then((user: User) => {
                return done(null, user)
            }).catch((error: any) => {
                return done(error)
            });
        } else {
            return done(error)
        }
    })
  }
));