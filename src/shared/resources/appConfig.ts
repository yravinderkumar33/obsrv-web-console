const env = process.env;

export default {
  APP_NAME: env.APP_NAME || 'obsrv-web-console',
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
  }
};
