import { HassEntity } from 'home-assistant-js-websocket';

export interface MediaPlayerProps {
  id: string;
  name: string;
  isOn: boolean;
  state: string; // 'playing', 'paused', 'idle', 'off', etc.
  isPlaying: boolean;
  volume: number; // 0-100
  isMuted: boolean;
  mediaTitle?: string;
  mediaArtist?: string;
  mediaAlbum?: string;
  mediaImage?: string;
  supportsPlay: boolean;
  supportsPause: boolean;
  supportsVolume: boolean;
  supportsMute: boolean;
  supportsNext: boolean;
  supportsPrev: boolean;
}

export const convertMediaPlayer = (entity: HassEntity): MediaPlayerProps => {
  const attrs = entity.attributes || {};
  const supportedFeatures = attrs.supported_features || 0;

  // Feature bits
  const SUPPORT_PAUSE = 1;
  const SUPPORT_VOLUME_SET = 4;
  const SUPPORT_VOLUME_MUTE = 8;
  const SUPPORT_PREVIOUS_TRACK = 16;
  const SUPPORT_NEXT_TRACK = 32;
  const SUPPORT_PLAY = 16384;

  const volume = attrs.volume_level !== undefined ? Math.round(attrs.volume_level * 100) : 0;

  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    isOn: entity.state !== 'off' && entity.state !== 'unavailable',
    state: entity.state,
    isPlaying: entity.state === 'playing',
    volume,
    isMuted: attrs.is_volume_muted || false,
    mediaTitle: attrs.media_title,
    mediaArtist: attrs.media_artist,
    mediaAlbum: attrs.media_album_name,
    mediaImage: attrs.entity_picture,
    supportsPlay: (supportedFeatures & SUPPORT_PLAY) !== 0,
    supportsPause: (supportedFeatures & SUPPORT_PAUSE) !== 0,
    supportsVolume: (supportedFeatures & SUPPORT_VOLUME_SET) !== 0,
    supportsMute: (supportedFeatures & SUPPORT_VOLUME_MUTE) !== 0,
    supportsNext: (supportedFeatures & SUPPORT_NEXT_TRACK) !== 0,
    supportsPrev: (supportedFeatures & SUPPORT_PREVIOUS_TRACK) !== 0,
  };
};
