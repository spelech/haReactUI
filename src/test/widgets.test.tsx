import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LightCard } from '../components/Widgets/LightCard';
import { SwitchCard } from '../components/Widgets/SwitchCard';
import { SensorCard } from '../components/Widgets/SensorCard';
import { MediaPlayerCard } from '../components/Widgets/MediaPlayerCard';

describe('Widget Components (Dumb)', () => {
  describe('LightCard', () => {
    it('should render light details and handle toggle click', () => {
      const onToggle = vi.fn();
      const mockProps = {
        id: 'light.test',
        name: 'Bedroom Light',
        isOn: true,
        brightness: 75,
        supportsBrightness: true,
        supportsColorTemp: false,
        supportsColor: false,
        stateText: '75%',
      };

      render(
        <LightCard
          props={mockProps}
          onToggle={onToggle}
        />
      );

      expect(screen.getByText('Bedroom Light')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();

      const toggleBtn = screen.getByRole('button', { name: 'On' });
      fireEvent.click(toggleBtn);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('SwitchCard', () => {
    it('should render switch details and handle click', () => {
      const onToggle = vi.fn();
      const mockProps = {
        id: 'switch.test',
        name: 'Plug Switch',
        isOn: false,
        stateText: 'Off',
      };

      render(
        <SwitchCard
          props={mockProps}
          onToggle={onToggle}
        />
      );

      expect(screen.getByText('Plug Switch')).toBeInTheDocument();
      expect(screen.getByText('Off')).toBeInTheDocument();

      const card = screen.getByText('Plug Switch').closest('div');
      expect(card).toBeInTheDocument();
      if (card) {
        fireEvent.click(card);
      }
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('SensorCard', () => {
    it('should render sensor state and unit', () => {
      const mockProps = {
        id: 'sensor.temp',
        name: 'Room Temp',
        state: '22.4',
        unit: '°C',
        deviceClass: 'temperature',
        stateText: '22.4 °C',
      };

      render(<SensorCard props={mockProps} />);

      expect(screen.getByText('Room Temp')).toBeInTheDocument();
      expect(screen.getByText('22.4')).toBeInTheDocument();
      expect(screen.getByText('°C')).toBeInTheDocument();
    });
  });

  describe('MediaPlayerCard', () => {
    it('should render media details and handle play/pause controls', () => {
      const onToggle = vi.fn();
      const onPlay = vi.fn();
      const onPause = vi.fn();
      const onNext = vi.fn();
      const onPrev = vi.fn();

      const mockProps = {
        id: 'media_player.tv',
        name: 'Living Room TV',
        isOn: true,
        state: 'playing',
        isPlaying: true,
        volume: 30,
        isMuted: false,
        mediaTitle: 'Song Title',
        mediaArtist: 'Artist Name',
        supportsPlay: true,
        supportsPause: true,
        supportsVolume: true,
        supportsMute: true,
        supportsNext: true,
        supportsPrev: true,
      };

      render(
        <MediaPlayerCard
          props={mockProps}
          onToggle={onToggle}
          onPlay={onPlay}
          onPause={onPause}
          onNext={onNext}
          onPrev={onPrev}
        />
      );

      expect(screen.getByText('Living Room TV')).toBeInTheDocument();
      expect(screen.getByText('Song Title')).toBeInTheDocument();
      expect(screen.getByText('Artist Name')).toBeInTheDocument();

      // The play/pause button when playing shows the Pause icon and has aria-label="Pause"
      const playPauseBtn = screen.getByRole('button', { name: 'Pause' });
      expect(playPauseBtn).toBeInTheDocument();
      fireEvent.click(playPauseBtn);
      expect(onPause).toHaveBeenCalledTimes(1);
    });
  });
});
