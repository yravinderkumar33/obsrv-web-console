import { db } from "./auth_db";
import { Client, User, Token, AuthorizationCode } from "oauth2-server";

const model = {
  getClient: async (clientId: string, clientSecret: string) => {
    const client = db.clients.find(
      (c) => c.clientId === clientId
    );
    if (!client) return null;
    return { ...client, grants: client.grants ?? [] };
  },

  getUserById: async (id: string) => {
    const user = db.users.find((u) => u.id === id);
    if (!user) return null;
    return user;
  },

  getUser: async (username: string, password: string) => {
    const user = db.users.find((u) => u.username === username && u.password === password);
    if (!user) return null;
    return { id: user.id };
  },

  saveToken: async (token: Token, client: Client, user: User) => {
    db.accessTokens.push({ ...token, user, client });
    return { ...token, user, client };
  },

  saveAuthorizationCode: async (code: AuthorizationCode, client: Client, user: User) => {
    db.authorizationCodes.push({ ...code, user, client });
    return { ...code, user, client };
  },

  getAuthorizationCode: async (authorizationCode: string) => {
    const authCode = db.authorizationCodes.find((c) => c.authorizationCode === authorizationCode);
    if (!authCode) return Promise.resolve(null);
    const response: AuthorizationCode = {
      authorizationCode: authCode.authorizationCode,
      expiresAt: authCode.expiresAt,
      redirectUri: authCode.redirectUri,
      client: { id: authCode.client.id, grants: ["authorization_code", "refresh_token", "client_credentials"] },
      user: { id: authCode.user.user }
    }
    return response;
  },

  revokeAuthorizationCode: async (code: AuthorizationCode) => {
    db.authorizationCodes = db.authorizationCodes.filter((c) => c.authorizationCode !== code.authorizationCode);
    return true;
  },

  getAccessToken: async (accessToken: string) => {
    const token = db.accessTokens.find((t) => t.accessToken === accessToken);
    if (!token) return null;
    const response: Token = {
      ...token,
      user: { id: token.user.id },
      client: { id: token.client.id, grants: ["authorization_code", "refresh_token", "client_credentials"] },
    };
    return response;
  },

  revokeToken: async (token: Token) => {
    db.accessTokens = db.accessTokens.filter((t) => t.accessToken !== token.accessToken);
    return true;
  },

  validateScope: async (user: User, client: Client, scope: string | string[]) => {
    // For the purpose of this example, we'll allow any scope.
    return 'read';
  },

  verifyScope: async (token: Token, scope: string | string[]) => {
    // For the purpose of this example, we'll allow any scope.
    return true;
  }
};

export default model;
