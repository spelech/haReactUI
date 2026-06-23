import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LightCard } from '../components/Widgets/LightCard';
import { SwitchCard } from '../components/Widgets/SwitchCard';
import { SensorCard } from '../components/Widgets/SensorCard';
import { MediaPlayerCard } from '../components/Widgets/MediaPlayerCard';
import { ButtonCard } from '../components/Widgets/ButtonCard';
import { ToggleCard } from '../components/Widgets/ToggleCard';
import { SliderCard } from '../components/Widgets/SliderCard';
import { CoverCard } from '../components/Widgets/CoverCard';
import { ThermostatCard } from '../components/Widgets/ThermostatCard';
import { AlarmKeypadCard } from '../components/Widgets/AlarmKeypadCard';
import { TvRemoteCard } from '../components/Widgets/TvRemoteCard';
import { SecureButton } from '../components/Widgets/SecureButton';

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

  describe('ButtonCard', () => {
    it('should render and handle press', () => {
      const onPress = vi.fn();
      const mockProps = {
        id: 'button.test',
        name: 'Trigger Script',
        state: 'unknown',
        stateText: 'unknown',
      };

      render(
        <ButtonCard
          props={mockProps}
          onPress={onPress}
        />
      );

      expect(screen.getByText('Trigger Script')).toBeInTheDocument();
      const card = screen.getByRole('button', { name: 'Press Trigger Script' });
      fireEvent.click(card);
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('ToggleCard', () => {
    it('should render state and trigger toggle', () => {
      const onToggle = vi.fn();
      const mockProps = {
        id: 'input_boolean.test',
        name: 'Guest Mode',
        isOn: true,
        stateText: 'On',
      };

      render(
        <ToggleCard
          props={mockProps}
          onToggle={onToggle}
        />
      );

      expect(screen.getByText('Guest Mode')).toBeInTheDocument();
      expect(screen.getByText('On')).toBeInTheDocument();
      const card = screen.getByRole('button', { name: 'Toggle Guest Mode' });
      fireEvent.click(card);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('SliderCard', () => {
    it('should render and decrease values', () => {
      const onChange = vi.fn();
      const mockProps = {
        id: 'input_number.test',
        name: 'Volume',
        value: 50,
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
        stateText: '50 %',
      };

      render(
        <SliderCard
          props={mockProps}
          onChange={onChange}
        />
      );

      expect(screen.getByText('Volume')).toBeInTheDocument();
      expect(screen.getByText('50 %')).toBeInTheDocument();

      const decBtn = screen.getByRole('button', { name: 'Decrease value' });
      fireEvent.click(decBtn);
      expect(onChange).toHaveBeenCalledWith(45);
    });

    it('should render and increase values', () => {
      const onChange = vi.fn();
      const mockProps = {
        id: 'input_number.test',
        name: 'Volume',
        value: 50,
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
        stateText: '50 %',
      };

      render(
        <SliderCard
          props={mockProps}
          onChange={onChange}
        />
      );

      const incBtn = screen.getByRole('button', { name: 'Increase value' });
      fireEvent.click(incBtn);
      expect(onChange).toHaveBeenCalledWith(55);
    });
  });

  describe('CoverCard', () => {
    it('should render states and trigger direction buttons', () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const onStop = vi.fn();
      const onSetPosition = vi.fn();

      const mockProps = {
        id: 'cover.test',
        name: 'Blinds',
        state: 'open',
        position: 80,
        stateText: '80% Open',
        supportsPosition: true,
        supportsOpen: true,
        supportsClose: true,
        supportsStop: true,
      };

      render(
        <CoverCard
          props={mockProps}
          onOpen={onOpen}
          onClose={onClose}
          onStop={onStop}
          onSetPosition={onSetPosition}
        />
      );

      expect(screen.getByText('Blinds')).toBeInTheDocument();
      expect(screen.getByText('80% Open')).toBeInTheDocument();

      const openBtn = screen.getByRole('button', { name: 'Open cover' });
      fireEvent.click(openBtn);
      expect(onOpen).toHaveBeenCalledTimes(1);

      const stopBtn = screen.getByRole('button', { name: 'Stop cover movement' });
      fireEvent.click(stopBtn);
      expect(onStop).toHaveBeenCalledTimes(1);

      const closeBtn = screen.getByRole('button', { name: 'Close cover' });
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('ThermostatCard', () => {
    it('should render and handle adjustments', () => {
      const onChangeTargetTemp = vi.fn();
      const onChangeMode = vi.fn();
      const mockProps = {
        id: 'climate.test',
        name: 'Ecobee',
        state: 'heat',
        currentTemperature: 20,
        targetTemperature: 21,
        minTemp: 15,
        maxTemp: 30,
        hvacModes: ['off', 'heat', 'cool'],
        stateText: 'HEAT (Target: 21°C)',
      };

      render(
        <ThermostatCard
          props={mockProps}
          onChangeTargetTemp={onChangeTargetTemp}
          onChangeMode={onChangeMode}
        />
      );

      expect(screen.getByText('Ecobee')).toBeInTheDocument();
      expect(screen.getByText('Current: 20°C')).toBeInTheDocument();

      const incBtn = screen.getByRole('button', { name: 'Increase temperature' });
      fireEvent.click(incBtn);
      expect(onChangeTargetTemp).toHaveBeenCalledWith(21.5);
    });
  });

  describe('AlarmKeypadCard', () => {
    it('should render digits and keypad actions', () => {
      const onArmHome = vi.fn();
      const onArmAway = vi.fn();
      const onDisarm = vi.fn();
      const mockProps = {
        id: 'alarm_control_panel.test',
        name: 'Ring Alarm',
        state: 'disarmed',
        codeRequired: true,
        stateText: 'Disarmed',
      };

      render(
        <AlarmKeypadCard
          props={mockProps}
          onArmHome={onArmHome}
          onArmAway={onArmAway}
          onDisarm={onDisarm}
        />
      );

      expect(screen.getByText('Ring Alarm')).toBeInTheDocument();

      const key1 = screen.getByRole('button', { name: '1' });
      fireEvent.click(key1);

      const armHomeBtn = screen.getByRole('button', { name: 'Arm Home' });
      fireEvent.click(armHomeBtn);
      expect(onArmHome).toHaveBeenCalledWith('1');
    });
  });

  describe('TvRemoteCard', () => {
    it('should emit commands when keys are pressed', () => {
      const onSendCommand = vi.fn();
      const onVolumeUp = vi.fn();
      const onVolumeDown = vi.fn();
      const onMute = vi.fn();
      const onPowerToggle = vi.fn();

      render(
        <TvRemoteCard
          name="Living Room TV"
          onSendCommand={onSendCommand}
          onVolumeUp={onVolumeUp}
          onVolumeDown={onVolumeDown}
          onMute={onMute}
          onPowerToggle={onPowerToggle}
        />
      );

      expect(screen.getByText('Living Room TV')).toBeInTheDocument();

      const upBtn = screen.getByRole('button', { name: 'Up' });
      fireEvent.click(upBtn);
      expect(onSendCommand).toHaveBeenCalledWith('up');

      const volUpBtn = screen.getByRole('button', { name: 'Volume Up' });
      fireEvent.click(volUpBtn);
      expect(onVolumeUp).toHaveBeenCalledTimes(1);
    });
  });

  describe('SecureButton', () => {
    it('should require double click confirmation', () => {
      const onConfirm = vi.fn();

      render(
        <SecureButton
          onConfirm={onConfirm}
          label="Sirens"
          confirmLabel="Fire Siren"
        />
      );

      const btn = screen.getByRole('button', { name: 'Sirens' });
      fireEvent.click(btn);
      expect(onConfirm).not.toHaveBeenCalled();

      fireEvent.click(btn);
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
