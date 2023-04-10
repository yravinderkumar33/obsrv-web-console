import * as oauthServer from 'oauth2-server';

interface AccessToken {
  accessToken: string;
  clientId: string;
  expires: Date;
  userId: string;
  scope: string;
}

interface RefreshToken {
  refreshToken: string;
  clientId: string;
  expires: Date;
  userId: string;
  scope: string;
}

interface AuthorizationCode {
  code: string;
  clientId: string;
  expires: Date;
  redirectUri: string;
  userId: string;
  scope: string;
}

interface User {
  id: string;
  username: string;
  password: string;
}

interface Client {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  grants: string[];
  redirectUris: string[];
}

const authorizedClientIds = ['abc123', 'xyz789'];

const users: User[] = [
  {
    id: '123',
    username: 'john',
    password: 'password',
  },
  {
    id: '456',
    username: 'jane',
    password: 'password',
  },
];

const clients: Client[] = [
  {
    id: '1',
    name: 'Sample Client',
    clientId: 'abc123',
    clientSecret: 'ssh-secret',
    grants: ['password', 'refresh_token'],
    redirectUris: [],
  },
  {
    id: '2',
    name: 'Sample Client 2',
    clientId: 'xyz789',
    clientSecret: 'ssh-password',
    grants: ['authorization_code'],
    redirectUris: ['http://localhost:3000/callback'],
  },
];

const tokens: AccessToken[] = [];
const refreshTokens: RefreshToken[] = [];
const authorizationCodes: AuthorizationCode[] = [];

export const model: any = {
  getClient: async (clientId: string, clientSecret: string) => {
    const client = clients.find(
      (c) => c.clientId === clientId && c.clientSecret === clientSecret
    );

    if (!client) {
      return null;
    }

    return {
      id: client.clientId,
      redirectUris: client.redirectUris,
      grants: client.grants,
    };
  },

  getUser: async (username: string, password: string) => {
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
    };
  },

  saveToken: async (
    token: oauthServer.Token,
    client: oauthServer.Client,
    user: oauthServer.User
  ) => {
    const tokenConf: any = {
      accessToken: token.accessToken,
      expires: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken, // NOTE this is only needed if you need refresh tokens down the line
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: client,
      user: user,
    }
    tokens.push(tokenConf);

    return tokenConf;
  }
  
}