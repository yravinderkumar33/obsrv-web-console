
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { BasicStrategy } from 'passport-http';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import userService from './oauthUsers';
import clientService from './oauthClients';
import accessTokenService from './oauthAccessTokens';

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
        if (client.clientSecret !== clientSecret) return done(null, false);
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
            if (token.userId) {
                const user = await userService.findById(token.userId)
                if (!user) return done(null, false);
                    //TODO: To keep this simple, restricted scopes are not implemented,
                    done(null, user, { scope: '*' });
            } else {
                const client = clientService.findByClientId(token.clientId)
                if (!client) return done(null, false);
                //TODO: To keep this simple, restricted scopes are not implemented,
                done(null, client, { scope: '*' });
            }
        } catch (error) {
            return done(error)
        }
    }
));
