
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { BasicStrategy } from 'passport-http';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { v4 } from "uuid";
const KeyCloakStrategy = require('passport-keycloak-oauth2-oidc').Strategy;
import ActiveDirectoryStrategy  from 'passport-activedirectory';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userService from './oauthUsers';
import clientService from './oauthClients';
import accessTokenService from './oauthAccessTokens';
import { User } from '../types';
import appConfig from '../../shared/resources/appConfig';


enum PROVIDERS {
    KEYCLOAK = "keycloak",
    GOOGLE = "google",
    AD = "ad"
}

const emailAddressErrorMessage = "email address is required field for authentication";

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
    clientID: appConfig.AUTH.KEYCLOAK.CLIENT_ID,
    realm: appConfig.AUTH.KEYCLOAK.REALM,
    publicClient: appConfig.AUTH.KEYCLOAK.PUBLIC_CLIENT,
    clientSecret: appConfig.AUTH.KEYCLOAK.CLIENT_SECRET,
    sslRequired: appConfig.AUTH.KEYCLOAK.SSL_REQUIRED,
    authServerURL: appConfig.AUTH.KEYCLOAK.URL,
    callbackURL: `${appConfig.APP_BASE_URL}/api/auth/keycloak/callback`
},
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
        if (!profile.email) {
            return done(new Error(emailAddressErrorMessage))
        }
        // check if user exists then return user , otherwise create user and return the user
        userService.find({ email_address: profile.email }).then((user: any) => {
            return done(null, user)
        }).catch((error: any) => {
            if (error === "user_not_found") {
                return createUser(profile.email, PROVIDERS.KEYCLOAK, done)
            } else {
                return done(error)
            }
        })
    }
));


passport.use(new GoogleStrategy({
    clientID: appConfig.AUTH.GOOGLE.CLIENT_ID,
    clientSecret: appConfig.AUTH.GOOGLE.CLIENT_SECRET,
    callbackURL: `${appConfig.APP_BASE_URL}/api/auth/google/callback`
},
    (accessToken, refreshToken, profile, done) => {
        if (profile.emails && profile.emails?.length <= 0) {
            return done(new Error(emailAddressErrorMessage))
        }

        const emailAddress = profile?.emails && profile?.emails[0]['value']
        if (!emailAddress) {
            return done(new Error(emailAddressErrorMessage))
        }

        userService.find({ email_address: emailAddress }).then((user: any) => {
            return done(null, user)
        }).catch((error: any) => {
            if (error === "user_not_found") {
                return createUser(emailAddress, PROVIDERS.GOOGLE, done)
            } else {
                return done(error)
            }
        })
    }
))


passport.use(new ActiveDirectoryStrategy(
    {
    integrated: false,
    ldap: {
        url: appConfig.AUTH.AD.URL,
        baseDN: appConfig.AUTH.AD.BASE_DN,
        username: appConfig.AUTH.AD.USER_NAME,
        passport: appConfig.AUTH.AD.PASSWORD
    }
}, (profile: any, ad: any, done: any) => {
    ad.isUserMemberOf(profile._json.dn, 'AccessGroup',  (err:any , isMember: any) => {
        
        if (err) {
            console.log(err)
            return done(err)
        }

        if (profile.emails && profile.emails?.length <= 0) {
            return done(new Error(emailAddressErrorMessage))
        }

        const emailAddress = profile?.emails && profile?.emails[0]['value']
        if (!emailAddress) {
            return done(new Error(emailAddressErrorMessage))
        }
        userService.find({ email_address: emailAddress }).then((user: any) => {
            return done(null, user)
        }).catch((error: any) => {
        console.log(error)
            if (error === "user_not_found") {
                return createUser(emailAddress, PROVIDERS.AD, done)
            } else {
                return done(error)
            }
        })
    })
}))

const createUser = (emailAddress: string, provider: string, done: any) => {
    const userInfo: User = {
        id: v4(),
        user_name: emailAddress,
        created_on: new Date().toISOString(),
        provider: provider,
        email_address: emailAddress

    }
    userService.create(userInfo).then((user: User) => {
        return done(null, user)
    }).catch((error: any) => {
        return done(error)
    });
}