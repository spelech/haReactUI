import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { WidgetConfig } from '../../hooks/useLayoutManager';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  widgets: WidgetConfig[];
  layouts: any;
  isEditing: boolean;
  onLayoutChange: (currentLayout: any, allLayouts: any) => void;
  onRemoveWidget: (id: string) => void;
  onConfigureWidget?: (widget: WidgetConfig) => void;
  children: (widget: WidgetConfig) => React.ReactNode;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  layouts,
  isEditing,
  onLayoutChange,
  onRemoveWidget,
  onConfigureWidget,
  children,
}) => {
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 };

  return (
    <div style={styles.gridContainer}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={80}
        margin={[16, 16]}
        isDraggable={isEditing}
        isResizable={isEditing}
        draggableHandle=".drag-handle"
        onLayoutChange={onLayoutChange}
      >
        {widgets.map((widget) => (
          <div key={widget.id} style={styles.gridItem(isEditing)}>
            {/* Widget Header in Edit Mode */}
            {isEditing && (
              <div style={styles.editBar}>
                <div className="drag-handle" style={styles.dragHandle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 3H11V5H9V3M13 3H15V5H13V3M9 7H11V9H9V7M13 7H15V9H13V7M9 11H11V13H9V11M13 11H15V13H13V11M9 15H11V17H9V15M13 15H15V17H13V15M9 19H11V21H9V19M13 19H15V21H13V19Z" />
                  </svg>
                  <span>Drag</span>
                </div>
                <div style={styles.actionButtons}>
                  {onConfigureWidget && (
                    <button
                      onClick={() => onConfigureWidget(widget)}
                      style={styles.actionButton('#3b82f6')}
                      title="Configure overrides"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveWidget(widget.id)}
                    style={styles.actionButton('#ef4444')}
                    title="Remove Widget"
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}

            {/* Widget Wrapper */}
            <div style={styles.widgetContent(isEditing)}>
              {children(widget)}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

const styles = {
  gridContainer: {
    width: '100%',
    minHeight: 'calc(100vh - 120px)',
  },
  gridItem: (isEditing: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#111827',
    border: isEditing ? '1px dashed #3b82f6' : '1px solid #1f2937',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
  }),
  editBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 8px',
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
    userSelect: 'none' as const,
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#9ca3af',
    cursor: 'move',
    fontSize: '11px',
    fontWeight: 600,
  },
  actionButtons: {
    display: 'flex',
    gap: '4px',
  },
  actionButton: (bgColor: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    backgroundColor: bgColor,
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '11px',
    lineHeight: 1,
    padding: 0,
  }),
  widgetContent: (isEditing: boolean) => ({
    flex: 1,
    position: 'relative' as const,
    height: isEditing ? 'calc(100% - 27px)' : '100%',
    width: '100%',
    pointerEvents: isEditing ? ('none' as const) : ('auto' as const),
  }),
};
