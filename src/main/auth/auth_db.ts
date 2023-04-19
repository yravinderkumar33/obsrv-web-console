import { Client, User, Token, AuthorizationCode } from "oauth2-server";

interface InMemoryDb {
  clients: Client[];
  users: User[];
  accessTokens: Token[];
  authorizationCodes: AuthorizationCode[];
}
const redirectUri: any = [process.env.OAUTH2_WEB_CONSOLE_REDIRECT_URI, process.env.OAUTH2_SUPER_SET_REDIRECT_URI, process.env.OAUTH2_GRAFANA_REDIRECT_URI]
const usersEnv: any = process.env.OAUTH2_USER;
const usersObj = usersEnv && JSON.parse(usersEnv)

export const db: InMemoryDb = {
  clients: [
    {
      id: "1",
      clientId: process.env.OAUTH2_CLIENTID,
      clientSecret: process.env.OAUTH2_CLIENTSECRET,
      grants: ["authorization_code", "refresh_token", "client_credentials"],
      redirectUris: redirectUri,
    },
  ],
  users: [
    usersObj
  ],
  accessTokens: [],
  authorizationCodes: [],
};