const env = process.env;

export default {
  APP_NAME: env.APP_NAME || 'obsrv-web-console',
  APP_BASE_URL: env.OAUTH_WEB_CONSOLE_URL || "http://localhost:4000",
  PORT: env.PORT || 3000,
  ENV: env.ENV || 'development',
  PROMETHEUS: {
    URL: env.PROMETHEUS_URL || "http://localhost:9090"
  },
  OBS_API: {
    URL: env.OBS_API_URL || "http://localhost:4000"
  },
  CONFIG_API: {
    URL: env.CONFIG_API_URL || "http://localhost:4001"
  },
  SYSTEM_API: {
    URL: env.SYSTEM_API_URL || "http://localhost:4002"
  },
  ALERT_MANAGER: {
    URL: env.ALERT_MANAGER_URL || "http://localhost:9093"
  },
  GRAFANA: {
    URL: env.GRAFANA_URL || "http://localhost:8000"
  },
  SUPERSET: {
    URL: env.SUPERSET_URL || "http://localhost:8088"
  },
  AUTH: {
    KEYCLOAK: {
      URL: env.AUTH_KEYCLOAK_SERVER_URL || "http://localhost:8080/auth",
      REALM: env.AUTH_KEYCLOAK_REALM || "MyKeyCloakRealm",
      CLIENT_ID: env.AUTH_KEYCLOAK_CLIENT_ID || "myOauthClient",
      CLIENT_SECRET: env.AUTH_KEYCLOAK_CLIENT_SECRET || "SCWHeF9HgtJ5BjmJFruk2IW15a5auueq",
      PUBLIC_CLIENT: env.AUTH_KEYCLOAK_PUBLIC_CLIENT || "false",
      SSL_REQUIRED: env.AUTH_KEYCLOAK_SSL_REQUIRED || "external"
    }
  }
};
