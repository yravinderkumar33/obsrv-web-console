import { Client, User, Token, AuthorizationCode } from "oauth2-server";

interface InMemoryDb {
    clients: Client[];
    users: User[];
    accessTokens: Token[];
    authorizationCodes: AuthorizationCode[];
  }

export const db: InMemoryDb = {
    clients: [
      {
        id: "1",
        clientId: "123",
        clientSecret: "secret",
        grants: ["authorization_code", "refresh_token", "client_credentials"],
        redirectUris: ["http://localhost:3001/", "http://localhost:8088/oauth-authorized/obsrv", "http://192.168.1.10:3000/login", "http://localhost:3000/login/generic_oauth"],
      },
    ],
    users: [
      { id: "1", username: "user", password: "password", email: "user@123.com", clientId: "123" },
      { id: "2", username: "admin", password: "password", email: "admin@123.com", clientId: "123" },
    ],
    accessTokens: [],
    authorizationCodes: [],
  };