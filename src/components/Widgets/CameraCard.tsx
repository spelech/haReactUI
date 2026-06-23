import React, { useState, useEffect } from 'react';
import { Icon } from '@mdi/react';
import { mdiVideo, mdiFullscreen, mdiFullscreenExit, mdiRefresh } from '@mdi/js';
import { getAuthSingleton, getSavedConnectionInfo } from '../../services/haConnection';
import { useEntity } from '../../hooks/useEntity';

interface CameraCardProps {
  entityId: string;
  nameOverride?: string;
  isDemo?: boolean;
}

export const CameraCard: React.FC<CameraCardProps> = ({
  entityId,
  nameOverride,
  isDemo = false,
}) => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const cameraEntity = useEntity(entityId);
  const cameraToken = cameraEntity?.attributes?.access_token;

  const displayName = nameOverride || entityId.split('.')[1].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    // Reset error state on refresh/load so that transient errors don't lock the card
    setError(false);

    if (isDemo) {
      // Demo Mode: Use placeholder image
      setImgUrl(`https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80`);
      return;
    }

    try {
      const connInfo = getSavedConnectionInfo();
      const hassUrl = connInfo.url.endsWith('/') ? connInfo.url.slice(0, -1) : connInfo.url;
      
      if (cameraToken) {
        // Use the modern camera-specific access token
        setImgUrl(`${hassUrl}/api/camera_proxy/${entityId}?token=${cameraToken}&_cb=${refreshKey}`);
      } else {
        // Fallback to connection token
        const auth = getAuthSingleton();
        setImgUrl(`${hassUrl}/api/camera_proxy/${entityId}?token=${auth.accessToken}&_cb=${refreshKey}`);
      }
    } catch (e) {
      console.error('Error generating camera URL:', e);
      setError(true);
    }
  }, [entityId, isDemo, refreshKey, cameraToken]);

  useEffect(() => {
    if (isDemo) return;

    // Auto refresh snapshot every 2.5 seconds to simulate live video
    const interval = setInterval(() => {
      setRefreshKey(Date.now());
    }, 2500);

    return () => clearInterval(interval);
  }, [isDemo]);

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshKey(Date.now());
  };

  return (
    <>
      <div style={styles.card} onClick={toggleFullscreen}>
        <div style={styles.imageContainer}>
          {error ? (
            <div style={styles.errorContainer}>
              <Icon path={mdiVideo} size={2} color="#ef4444" />
              <span style={styles.errorText}>Camera Feed Unavailable</span>
            </div>
          ) : (
            <img
              src={imgUrl}
              alt={displayName}
              style={styles.image}
              onError={() => setError(true)}
            />
          )}
          
          {/* Overlay controls */}
          <div style={styles.overlay}>
            <div style={styles.header}>
              <span style={styles.name}>{displayName}</span>
              {isDemo && <span style={styles.demoBadge}>Demo</span>}
            </div>
            <div style={styles.actions}>
              <button style={styles.actionButton} onClick={handleRefresh} title="Refresh Stream">
                <Icon path={mdiRefresh} size={0.7} color="#ffffff" />
              </button>
              <button style={styles.actionButton} onClick={toggleFullscreen} title="Fullscreen">
                <Icon path={mdiFullscreen} size={0.7} color="#ffffff" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Portal / Overlay */}
      {isFullscreen && (
        <div style={styles.fullscreenOverlay} onClick={toggleFullscreen}>
          <div style={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.fullscreenHeader}>
              <h2 style={styles.fullscreenTitle}>{displayName}</h2>
              <button style={styles.closeButton} onClick={toggleFullscreen}>
                <Icon path={mdiFullscreenExit} size={1} color="#ffffff" />
              </button>
            </div>
            <div style={styles.fullscreenImageContainer}>
              {error ? (
                <div style={styles.errorContainer}>
                  <Icon path={mdiVideo} size={3} color="#ef4444" />
                  <span style={styles.errorText}>Camera Feed Unavailable</span>
                </div>
              ) : (
                <img
                  src={imgUrl}
                  alt={displayName}
                  style={styles.fullscreenImage}
                  onError={() => setError(true)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative' as const,
    cursor: 'pointer',
    background: '#0c0f17',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    height: '100%',
    backgroundColor: '#1f2937',
    color: '#9ca3af',
  },
  errorText: {
    fontSize: '12px',
    fontWeight: 500,
  },
  overlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  name: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
  },
  demoBadge: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    padding: '1px 6px',
    borderRadius: '4px',
    alignSelf: 'flex-start',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.2s',
    outline: 'none',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  fullscreenOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(8px)',
  },
  fullscreenContent: {
    width: '90%',
    maxWidth: '1024px',
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  fullscreenHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #1f2937',
  },
  fullscreenTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#f3f4f6',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  fullscreenImageContainer: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
  },
};
