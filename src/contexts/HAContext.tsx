import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Connection, subscribeEntities } from 'home-assistant-js-websocket';
import { useHAStore } from '../store/haStore';
import type { ConnectionState, ConnectionInfo } from '../services/haConnection';
import {
  getSavedConnectionInfo,
  saveConnectionInfo,
  establishConnection,
  clearConnectionInfo,
} from '../services/haConnection';

interface HAContextType {
  connection: Connection | null;
  connectionState: ConnectionState;
  error: string | null;
  reconnect: () => Promise<void>;
  updateConnection: (url: string, token: string) => Promise<void>;
  logout: () => void;
}

const HAContext = createContext<HAContextType | undefined>(undefined);

export const useHA = () => {
  const context = useContext(HAContext);
  if (!context) {
    throw new Error('useHA must be used within a HAProvider');
  }
  return context;
};

interface HAProviderProps {
  children: React.ReactNode;
}

export const HAProvider: React.FC<HAProviderProps> = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<ConnectionInfo>(getSavedConnectionInfo());

  // Input states for the setup form
  const [inputUrl, setInputUrl] = useState(info.url);
  const [inputToken, setInputToken] = useState(info.token || '');

  const connect = useCallback(async (currentInfo: ConnectionInfo) => {
    try {
      setError(null);
      const conn = await establishConnection(currentInfo, (state, err) => {
        setConnectionState(state);
        if (err) setError(err);
      });
      setConnection(conn);
    } catch (err: any) {
      console.error('Failed to establish HA connection:', err);
      // establishConnection already sets the state to 'error' and sets the error message
    }
  }, []);

  useEffect(() => {
    connect(info);
  }, [connect, info]);

  useEffect(() => {
    if (!connection) return;

    const unsub = subscribeEntities(connection, (entities) => {
      useHAStore.getState().setEntities(entities);
    });

    return () => {
      unsub();
    };
  }, [connection]);

  const reconnect = useCallback(async () => {
    await connect(info);
  }, [connect, info]);

  const updateConnection = useCallback(async (url: string, token: string) => {
    const updatedInfo = { url, token, useOAuth: !token };
    saveConnectionInfo(url, token);
    setInfo(updatedInfo);
    setInputUrl(url);
    setInputToken(token);
    await connect(updatedInfo);
  }, [connect]);

  const logout = useCallback(() => {
    clearConnectionInfo();
    const defaultedInfo = getSavedConnectionInfo();
    setInfo(defaultedInfo);
    setInputUrl(defaultedInfo.url);
    setInputToken('');
    setConnection(null);
    setConnectionState('error');
    setError('Disconnected. Please configure connection.');
  }, []);

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConnection(inputUrl, inputToken);
  };

  // Render setup/error UI when there's an error and we have no active connection
  if (connectionState === 'error' && !connection) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Connect to Home Assistant</h2>
          {error && <div style={styles.errorBanner}>{error}</div>}
          <form onSubmit={handleSetupSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Home Assistant URL</label>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://10.0.0.10:8123"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Long-Lived Access Token</label>
              <textarea
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Paste your long-lived access token here"
                style={styles.textarea}
              />
              <span style={styles.helpText}>
                Leave blank if you wish to use the standard OAuth2 flow (uncheck if using local docker setups).
              </span>
            </div>
            <button type="submit" style={styles.button}>
              Connect
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render initial loading screen
  if (connectionState === 'connecting' && !connection) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner} />
          <h2 style={styles.loadingText}>Connecting to Home Assistant</h2>
          <p style={styles.loadingSubtext}>{info.url}</p>
        </div>
      </div>
    );
  }

  return (
    <HAContext.Provider
      value={{
        connection,
        connectionState,
        error,
        reconnect,
        updateConnection,
        logout,
      }}
    >
      {children}
      {/* Global Connection Loss Status Banner */}
      {connectionState !== 'connected' && connection && (
        <div style={styles.floatingStatus}>
          <span style={styles.statusDot(connectionState)} />
          {connectionState === 'connecting'
            ? 'Reconnecting to Home Assistant...'
            : 'Connection lost. Retrying...'}
        </div>
      )}
    </HAContext.Provider>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0a0e17',
    color: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
    boxSizing: 'border-box' as const,
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '24px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f87171',
    fontSize: '14px',
    marginBottom: '24px',
    lineHeight: 1.4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#9ca3af',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    color: '#f3f4f6',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    color: '#f3f4f6',
    fontSize: '14px',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical' as const,
    transition: 'border-color 0.2s',
    fontFamily: 'monospace',
  },
  helpText: {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: 1.4,
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  loadingWrapper: {
    textAlign: 'center' as const,
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(59, 130, 246, 0.1)',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    margin: '0 auto 24px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#e5e7eb',
  },
  loadingSubtext: {
    fontSize: '14px',
    color: '#6b7280',
  },
  floatingStatus: {
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '30px',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#e5e7eb',
    fontSize: '14px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
  },
  statusDot: (state: ConnectionState) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: state === 'connecting' ? '#fbbf24' : '#ef4444',
  }),
};

// Add standard keyframe animation in browser dynamically
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
