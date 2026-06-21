import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditToolbar } from '../components/Configuration/EditToolbar';
import { WidgetConfigModal } from '../components/Configuration/WidgetConfigModal';
import { WidgetConfig } from '../hooks/useLayoutManager';

describe('Configuration UI Components', () => {
  describe('EditToolbar', () => {
    it('should render gear button when not editing', () => {
      const onToggleEdit = vi.fn();
      const onAddWidget = vi.fn();

      render(
        <EditToolbar
          isEditing={false}
          onToggleEdit={onToggleEdit}
          onAddWidget={onAddWidget}
        />
      );

      const editBtn = screen.getByTitle('Edit Dashboard');
      expect(editBtn).toBeInTheDocument();
      fireEvent.click(editBtn);
      expect(onToggleEdit).toHaveBeenCalledTimes(1);
    });

    it('should render full controls when editing', () => {
      const onToggleEdit = vi.fn();
      const onAddWidget = vi.fn();

      render(
        <EditToolbar
          isEditing={true}
          onToggleEdit={onToggleEdit}
          onAddWidget={onAddWidget}
        />
      );

      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
      const addBtn = screen.getByRole('button', { name: /Add Widget/i });
      const doneBtn = screen.getByRole('button', { name: /Done/i });

      expect(addBtn).toBeInTheDocument();
      expect(doneBtn).toBeInTheDocument();

      fireEvent.click(addBtn);
      expect(onAddWidget).toHaveBeenCalledTimes(1);

      fireEvent.click(doneBtn);
      expect(onToggleEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe('WidgetConfigModal', () => {
    const mockWidget: WidgetConfig = {
      id: 'widget-123',
      type: 'light',
      entityId: 'light.living_room',
      overrides: {
        name: 'Initial Name',
        icon: 'mdi:initial-icon',
      },
    };

    it('should populate fields and invoke onSave with values on submit', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <WidgetConfigModal
          widget={mockWidget}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const nameInput = screen.getByPlaceholderText('e.g. Living Room Lamp') as HTMLInputElement;
      const iconInput = screen.getByPlaceholderText('e.g. MDI path or custom identifier') as HTMLInputElement;

      expect(nameInput.value).toBe('Initial Name');
      expect(iconInput.value).toBe('mdi:initial-icon');

      fireEvent.change(nameInput, { target: { value: 'New Dynamic Name' } });
      fireEvent.change(iconInput, { target: { value: 'mdi:new-icon' } });

      const saveBtn = screen.getByRole('button', { name: /Save Overrides/i });
      fireEvent.click(saveBtn);

      expect(onSave).toHaveBeenCalledWith('widget-123', {
        name: 'New Dynamic Name',
        icon: 'mdi:new-icon',
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
