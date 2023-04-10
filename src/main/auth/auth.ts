import OAuthServer from 'express-oauth-server';
import {oauthModel} from './model'

const config: any = {
    model: oauthModel,
    accessTokenLifetime: 60 * 60, // 1 hour access token lifetime
    allowBearerTokensInQueryString: true,
    refreshTokenLifetime: 60 * 60 * 24 * 30, // 30 day refresh token lifetime
    requireClientAuthentication: { password: false },
    authorizationCodeLifetime: 300, // 5 minute authorization code lifetime
    allowEmptyState: true,
    debug: true,
  }
  
export const oauthServer =  new OAuthServer(config);