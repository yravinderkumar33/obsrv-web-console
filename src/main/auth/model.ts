import { Client, User, Token, AuthorizationCode } from "oauth2-server";

interface InMemoryDb {
  clients: Client[];
  users: User[];
  accessTokens: Token[];
  authorizationCodes: AuthorizationCode[];
}

const db: InMemoryDb = {
  clients: [
    {
      id: "1",
      clientId: "123",
      clientSecret: "secret",
      grants: ["authorization_code", "refresh_token", "client_credentials"],
      redirectUris: ["http://localhost:3001/", "http://localhost:8088/oauth-authorized/Obsrv"],
    },
  ],
  users: [
    { id: "1", username: "user", password: "password", email: "user@123.com" },
    { id: "2", username: "admin", password: "password", email: "admin@123.com" },
  ],
  accessTokens: [],
  authorizationCodes: [],
};

const model = {
  getClient: async (clientId: string, clientSecret: string) => {
    const client = db.clients.find(
      (c) => c.clientId === clientId
    );
    if (!client) return null;
    return { ...client, grants: client.grants ?? [] };
  },

  getUser: async (username: string, password: string) => {
    const user = db.users.find((u) => u.username === username && u.password === password);
    if (!user) return null;
    return { id: user.id };
  },

  saveToken: async (token: Token, client: Client, user: User) => {
    console.log(`save Token`, user, token, client)
    db.accessTokens.push({ ...token, user, client });
    return { ...token, user, client };
  },

  saveAuthorizationCode: async (code: AuthorizationCode, client: Client, user: User) => {
    db.authorizationCodes.push({ ...code, user, client });
    return { ...code, user, client };
  },

  getAuthorizationCode: async (authorizationCode: string) => {
    const authCode = db.authorizationCodes.find((c) => c.code === authorizationCode);
    if (!authCode) return Promise.resolve(null);
    const response: AuthorizationCode = {
      authorizationCode: authCode.authorizationCode,
      expiresAt: authCode.expiresAt,
      redirectUri: authCode.redirectUri,
      client: { id: authCode.client.id, grants: ["authorization_code", "refresh_token", "client_credentials"] },
      user: { id: authCode.user.id }
    }
    return Promise.resolve(response);
  },

  revokeAuthorizationCode: async (code: AuthorizationCode) => {
    db.authorizationCodes = db.authorizationCodes.filter((c) => c.code !== code.code);
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
  },
  getUserFromClient: async (client: Client) => {
    const storedClient = db.clients.find(
      (c) => c.clientId === client.id
    );
    if (!client) return null;
    return {
      id: storedClient?.id,
      name: storedClient?.name,
      clientId: storedClient?.id,
      grants: storedClient?.grants,
      redirectUris: storedClient?.redirectUris,
    };
  }
};

export default model;
