import oauth2orize from "oauth2orize";
import passport from "passport";
import login from 'connect-ensure-login';
import clientService from './../../services/oauthClients'
import userService from './../../services/oauthUsers'
import accessTokenService from './../../services/oauthAccessTokens'
import refreshTokenService from './../../services/oauthRefreshTokens'
import authorizationService from './../../services/oauthAutorizationCodes'
import { getUid } from './../../utils/randomString'
import { NextFunction, Request, Response } from "express";

// Create OAuth 2.0 server
const server = oauth2orize.createServer();

server.serializeClient((client, done) => {
  console.log("serializeClient: ", client)
  return done(null, client.id)
});

server.deserializeClient((id, done) => {
  console.log(`deserializeClient: `, id)
  clientService.findById(id).then((client: any) => {
    done(null, client)
  }).catch((error: any) => {
    done(error)
  })
});

const issueTokens = async (userId: string, clientId: string) => {

  const user = await userService.findById(userId)
  const accessToken = getUid(250);
  const refreshToken = getUid(250);
  await accessTokenService.save(accessToken, userId, clientId)
  await refreshTokenService.save(refreshToken, userId, clientId)
  const params = { username: user.user_name };
  return Promise.resolve({ accessToken, refreshToken, params });

}

server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
  const code = getUid(16);
  authorizationService.save(code, client.id, redirectUri, user.id, user.username).then((data) => {
    return done(null, code);
  }).catch((error: any) => {
    return done(error)
  })
}));



server.grant(oauth2orize.grant.token((client, user, ares, done) => {
  console.log('grant issue token', client, user)
  issueTokens(user.id, client.client_id).then((data) => {
    return done(null, data.accessToken, data.params)
  }).catch((error: any) => {
    return done(error)
  })
}));


server.exchange(oauth2orize.exchange.code((client, code, redirectUri, done) => {
  console.log(`exchange code:`, client, code, redirectUri)
  authorizationService.find(code).then((authCode: any) => {
    if (client.id !== authCode.client_id) return done(null, false);
    if (redirectUri !== authCode.redirect_uri) return done(null, false);
    console.log("will issue token")
    issueTokens(authCode.user_id, client.client_id).then((data) => {
      console.log('Token issued.')
      return done(null, data.accessToken, data.refreshToken, data.params)
    }).catch((error: any) => {
      console.log(`Issue token error`, error)
      return done(error)
    });
  }).catch((error: any) => {
    return done(error);
  })
}));

server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {

  clientService.findByClientId(client.clientId).then((localClient: any) => {
    if (!localClient) return done(null, false);
    if (localClient.clientSecret !== client.clientSecret) return done(null, false);

    userService.findByUsername(username).then((user: any) => {
      if (!user) return done(null, false);
      if (password !== user.password) return done(null, false);

      issueTokens(user.id, client.clientId).then((data) => {
        return done(null, data.accessToken, data.refreshToken, data.params)
      }).catch((error: any) => {
        return done(error)
      });
    }).catch((error: any) => {
      return done(error);
    })
  }).catch((error: any) => {
    return done(error);
  })
}));


//TODO: Client credentials based oauth need to be implementated

// server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
//   // Validate the client
//   clientService.findByClientId(client.clientId).then((localClient: any) => {
//     if (!localClient) return done(null, false);
//     if (localClient.clientSecret !== client.clientSecret) return done(null, false);
//     issueTokens(null, client.clientId).then((data) => {
//       return done(null, data.accessToken, data.refreshToken, data.params)
//     }).catch((error: any) => {
//       return done(error)
//     });
//   }).catch((error: any) => {
//     return done(error);
//   })
// }));


// issue new tokens and remove the old ones
server.exchange(oauth2orize.exchange.refreshToken(async (client, oldRefreshToken, scope, done) => {
  try {
    const token = await refreshTokenService.find(oldRefreshToken)
    await accessTokenService.removeByUserIdAndClientId(token.userId, token.clientId);
    await refreshTokenService.removeByUserIdAndClientId(token.userId, token.clientId);
    const { accessToken, refreshToken, params } = await issueTokens(token.user_id, client.id);
    done(null, accessToken, refreshToken);
  } catch (error: any) {
    done(error)
  }
}));


export const authorization = [
  login.ensureLoggedIn("/login"),
  server.authorization((clientId, redirectUri, done) => {
    clientService.findByClientId(clientId).then((client: any) => {
      if (client.redirect_uri != redirectUri) {
        return done(new Error("client redirect uri not matching"))
      }

      return done(null, client, redirectUri);
    }).catch((error: any) => {
      return done(error);
    })
  }, (client, user, scope, type, areq, done) => {
    //TODO: Need to implement apporval workflow
    if (client.is_trusted) {
      return done(null, true, null, null)
    }
  })
];

export const decision = [
  login.ensureLoggedIn("/login"),
  server.decision(),
];

export const token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler(),
];

export const ensureLoggedInMiddleware = (request: Request, response: Response, next: NextFunction) => {
  if (!request?.session?.passport?.user) {
    const errorObj = {
      status: 401,
      message: "You don't have access to view this resource",
      responseCode: 'UNAUTHORIZED',
      errorCode: 'UNAUTHORIZED',
    };
    return next(errorObj)
  }
  return next();
}
