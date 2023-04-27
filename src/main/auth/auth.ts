import ExpressoAuthServer from 'express-oauth-server';
import model from './model'

export const oauthServer =  new ExpressoAuthServer({
  model: model,
  accessTokenLifetime: 60 * 60, // 1 hour access token lifetime
  allowBearerTokensInQueryString: true,
  refreshTokenLifetime: 60 * 60 * 24 * 30, // 30 day refresh token lifetime
  requireClientAuthentication: { password: false },
  authorizationCodeLifetime: 300, // 5 minute authorization code lifetime
  allowEmptyState: true
});