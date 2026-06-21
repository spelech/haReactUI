import React from 'react';
import Icon from '@mdi/react';
import {
  mdiPlay,
  mdiPause,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiVolumeHigh,
  mdiTelevision,
} from '@mdi/js';
import type { MediaPlayerProps } from '../../converters/mediaPlayerConverter';

interface MediaPlayerCardProps {
  props: MediaPlayerProps;
  onToggle: () => void;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onChangeVolume?: (volume: number) => void;
  nameOverride?: string;
  iconOverride?: string;
}

export const MediaPlayerCard: React.FC<MediaPlayerCardProps> = ({
  props,
  onToggle,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onChangeVolume,
  nameOverride,
  iconOverride,
}) => {
  const {
    isOn,
    isPlaying,
    volume,
    mediaTitle,
    mediaArtist,
    mediaImage,
    supportsPlay,
    supportsPause,
    supportsVolume,
    supportsNext,
    supportsPrev,
  } = props;

  const displayName = nameOverride || props.name;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeVolume) {
      onChangeVolume(parseInt(e.target.value, 10));
    }
  };

  return (
    <div style={styles.card(mediaImage)}>
      <div style={styles.contentOverlay}>
        <div style={styles.header}>
          <div style={styles.info}>
            <span style={styles.deviceName}>{displayName}</span>
            {isOn && mediaTitle ? (
              <div style={styles.trackDetails}>
                <span style={styles.trackTitle}>{mediaTitle}</span>
                {mediaArtist && <span style={styles.trackArtist}>{mediaArtist}</span>}
              </div>
            ) : (
              <span style={styles.inactiveState}>{isOn ? 'Idle' : 'Off'}</span>
            )}
          </div>
          <button style={styles.powerBtn(isOn)} onClick={onToggle} aria-label="Toggle Power">
            <Icon path={iconOverride || mdiTelevision} size={0.7} />
          </button>
        </div>

        {isOn && (
          <div style={styles.controlsSection}>
            <div style={styles.playbackButtons}>
              {supportsPrev && (
                <button style={styles.controlBtn} onClick={onPrev} aria-label="Previous Track">
                  <Icon path={mdiSkipPrevious} size={1} />
                </button>
              )}
              
              {(supportsPlay || supportsPause) && (
                <button
                  style={styles.playPauseBtn}
                  onClick={isPlaying ? onPause : onPlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <Icon path={isPlaying ? mdiPause : mdiPlay} size={1.2} />
                </button>
              )}

              {supportsNext && (
                <button style={styles.controlBtn} onClick={onNext} aria-label="Next Track">
                  <Icon path={mdiSkipNext} size={1} />
                </button>
              )}
            </div>

            {supportsVolume && onChangeVolume && (
              <div style={styles.volumeRow}>
                <Icon path={mdiVolumeHigh} size={0.7} color="#9ca3af" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={styles.slider}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: (bgImage?: string) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    position: 'relative' as const,
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    background: bgImage
      ? undefined
      : 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(10, 15, 30, 0.8) 100%)',
    boxSizing: 'border-box' as const,
    color: '#ffffff',
  }),
  contentOverlay: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(8px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  info: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    flex: 1,
    marginRight: '8px',
  },
  deviceName: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: '#9ca3af',
  },
  trackDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    marginTop: '6px',
  },
  trackTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#f3f4f6',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  trackArtist: {
    fontSize: '12px',
    color: '#9ca3af',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '2px',
  },
  inactiveState: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '6px',
  },
  powerBtn: (isOn: boolean) => ({
    padding: '6px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isOn ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
    color: isOn ? '#3b82f6' : '#9ca3af',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  controlsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginTop: '8px',
  },
  playbackButtons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  controlBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#f3f4f6',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s, background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  playPauseBtn: {
    backgroundColor: '#ffffff',
    border: 'none',
    color: '#0f172a',
    cursor: 'pointer',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s',
  },
  volumeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#374151',
    outline: 'none',
    WebkitAppearance: 'none' as const,
    cursor: 'pointer',
    accentColor: '#ffffff',
  },
};
