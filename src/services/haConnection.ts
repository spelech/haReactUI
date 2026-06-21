import {
  createConnection,
  createLongLivedTokenAuth,
  getAuth,
  Auth,
  Connection,
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
} from 'home-assistant-js-websocket';

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ConnectionInfo {
  url: string;
  token?: string;
  useOAuth?: boolean;
}

let connectionSingleton: Connection | null = null;
let authSingleton: Auth | null = null;

// Key names for localStorage
const STORAGE_KEYS = {
  URL: 'ha-url',
  TOKEN: 'ha-token',
  OAUTH_TOKENS: 'ha-oauth-tokens',
};

export const getSavedConnectionInfo = (): ConnectionInfo => {
  const envUrl = import.meta.env.VITE_HA_URL;
  const envToken = import.meta.env.VITE_HA_TOKEN;

  const url = localStorage.getItem(STORAGE_KEYS.URL) || envUrl || 'http://10.0.0.10:8123';
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || envToken || '';
  const useOAuth = localStorage.getItem(STORAGE_KEYS.TOKEN) ? false : !envToken;

  return { url, token, useOAuth };
};

export const saveConnectionInfo = (url: string, token?: string) => {
  localStorage.setItem(STORAGE_KEYS.URL, url);
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

export const clearConnectionInfo = () => {
  localStorage.removeItem(STORAGE_KEYS.URL);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.OAUTH_TOKENS);
  connectionSingleton = null;
  authSingleton = null;
};

export const establishConnection = async (
  info: ConnectionInfo,
  onStateChange: (state: ConnectionState, error?: string) => void
): Promise<Connection> => {
  onStateChange('connecting');
  const { url, token, useOAuth } = info;

  try {
    if (!url) {
      throw new Error('Home Assistant URL is required.');
    }

    let auth: Auth;

    if (token) {
      // Long-Lived Access Token authentication
      auth = createLongLivedTokenAuth(url, token);
    } else if (useOAuth) {
      // OAuth2 authentication
      const authOptions = {
        hassUrl: url,
        saveTokens: (tokens: any) => {
          localStorage.setItem(STORAGE_KEYS.OAUTH_TOKENS, JSON.stringify(tokens));
        },
        loadTokens: () => {
          try {
            const val = localStorage.getItem(STORAGE_KEYS.OAUTH_TOKENS);
            return Promise.resolve(val ? JSON.parse(val) : null);
          } catch {
            return Promise.resolve(null);
          }
        },
      };
      auth = await getAuth(authOptions);
    } else {
      throw new Error('No authentication method provided.');
    }

    authSingleton = auth;
    const connection = await createConnection({ auth });
    connectionSingleton = connection;

    onStateChange('connected');

    // Attach listeners for connection lifecycle
    connection.addEventListener('ready', () => {
      onStateChange('connected');
    });

    connection.addEventListener('disconnected', () => {
      onStateChange('disconnected');
    });

    connection.addEventListener('reconnect-error', () => {
      onStateChange('error', 'Reconnection failed');
    });

    return connection;
  } catch (err: any) {
    let errorMsg = 'Failed to connect';
    if (err === ERR_CANNOT_CONNECT) {
      errorMsg = 'Cannot connect to Home Assistant';
    } else if (err === ERR_INVALID_AUTH) {
      errorMsg = 'Invalid authentication credentials';
    } else if (err instanceof Error) {
      errorMsg = err.message;
    }
    onStateChange('error', errorMsg);
    throw err;
  }
};

export const getConnection = (): Connection => {
  if (!connectionSingleton) {
    throw new Error('Connection has not been initialized. Call establishConnection first.');
  }
  return connectionSingleton;
};

export const getAuthSingleton = (): Auth => {
  if (!authSingleton) {
    throw new Error('Auth has not been initialized.');
  }
  return authSingleton;
};

export const callService = async (
  domain: string,
  service: string,
  serviceData?: Record<string, any>,
  target?: { entity_id?: string | string[]; device_id?: string | string[]; area_id?: string | string[] }
) => {
  const conn = getConnection();
  return conn.sendMessagePromise({
    type: 'call_service',
    domain,
    service,
    service_data: serviceData,
    target,
  });
};
