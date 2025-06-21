import { Request } from 'express';
import pino from 'pino';

export type LogInfo = {
  appid?: string,
  event?: string,
  description?: string,
  useragent?: string,
  source_ip?: string,
  host_ip?: string,
  hostname?: string,
  protocol?: string,
  port?: number,
  request_uri?: string,
  request_method?: string,
};

export const logger = pino({
  level: process.env.LOG_LEVEL,
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(level) {
      return { level };
    },
  },
  enabled: !process.env.IS_LOGGER_SILENT,
});

const logWithReq = (req: Request, level: string, event: string, description: string): void => {
  const logInfo: LogInfo = {
    appid: process.env.APP_ID,
    event,
    description,
    useragent: req.headers['user-agent'],
    source_ip: req.ip,
    host_ip: req.socket.localAddress,
    hostname: req.hostname,
    protocol: req.protocol,
    port: req.socket.localPort,
    request_uri: req.originalUrl,
    request_method: req.method,
  };

  logger[level](logInfo);
};

export const logValidationFail = (req: Request, message: string): void => {
  logWithReq(req, 'warn', 'input_validation_fail', message);
}

export const logAuthorizationFail = (req: Request, message: string): void => {
  logWithReq(req, 'error', 'authz_fail', message);
}

export const logSysCrash = (req: Request, message: string): void => {
  logWithReq(req, 'warn', 'sys_crash', message);
}

export const logNotFoundResource = (req: Request, message: string): void => {
  logWithReq(req, 'info', 'not_found_resource', message);
}

export const logAuthFail = (req: Request, message: string): void => {
  logWithReq(req, 'warn', 'authn_login_fail', message);
}

export const logAuthTokenInvalid = (req: Request, message: string): void => {
  logWithReq(req, 'warn', 'authn_token_invalid', message);
}
