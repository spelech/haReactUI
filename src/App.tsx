import React, { useState, useEffect } from 'react';
import { HAProvider, useHA } from './contexts/HAContext';
import { useLayoutManager } from './hooks/useLayoutManager';
import type { WidgetConfig } from './hooks/useLayoutManager';
import { DashboardGrid } from './components/Grid/DashboardGrid';
import { EditToolbar } from './components/Configuration/EditToolbar';
import { EntitySelectorModal } from './components/Configuration/EntitySelectorModal';
import { WidgetConfigModal } from './components/Configuration/WidgetConfigModal';
import {
  SmartLightCard,
  SmartSwitchCard,
  SmartSensorCard,
  SmartMediaPlayerCard,
} from './components/Widgets/SmartWidgets';

const DashboardContent: React.FC = () => {
  const { logout } = useHA();
  const {
    widgets,
    layouts,
    isEditing,
    setIsEditing,
    handleLayoutChange,
    addWidget,
    removeWidget,
    updateWidgetOverrides,
  } = useLayoutManager();

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [configWidget, setConfigWidget] = useState<WidgetConfig | null>(null);

  // Digital Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateString = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  const renderWidgetContent = (widget: WidgetConfig) => {
    const { overrides } = widget;
    switch (widget.type) {
      case 'light':
        return (
          <SmartLightCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            iconOverride={overrides?.icon}
          />
        );
      case 'switch':
        return (
          <SmartSwitchCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            iconOverride={overrides?.icon}
          />
        );
      case 'sensor':
        return (
          <SmartSensorCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            iconOverride={overrides?.icon}
          />
        );
      case 'media':
        return (
          <SmartMediaPlayerCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            iconOverride={overrides?.icon}
          />
        );
      default:
        return <div style={{ padding: '16px', color: '#9ca3af' }}>Unsupported widget</div>;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <EditToolbar
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onAddWidget={() => setIsSelectorOpen(true)}
        onLogout={logout}
      />

      <main style={styles.mainContent}>
        {/* Welcome & Clock Header */}
        <header style={styles.header}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Wiley Home</h1>
            <p style={styles.welcomeSubtitle}>Smart Dashboard</p>
          </div>
          <div style={styles.clockSection}>
            <div style={styles.timeText}>{timeString}</div>
            <div style={styles.dateText}>{dateString}</div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <DashboardGrid
          widgets={widgets}
          layouts={layouts}
          isEditing={isEditing}
          onLayoutChange={handleLayoutChange}
          onRemoveWidget={removeWidget}
          onConfigureWidget={(w) => setConfigWidget(w)}
        >
          {renderWidgetContent}
        </DashboardGrid>
      </main>

      {/* Add Widget Selector Modal */}
      <EntitySelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectEntity={(entityId, type) => {
          addWidget({ type, entityId });
        }}
      />

      {/* Configure Widget Overrides Modal */}
      <WidgetConfigModal
        widget={configWidget}
        isOpen={configWidget !== null}
        onClose={() => setConfigWidget(null)}
        onSave={(id, overrides) => {
          updateWidgetOverrides(id, overrides);
        }}
      />
    </div>
  );
};

function App() {
  return (
    <HAProvider>
      <DashboardContent />
    </HAProvider>
  );
}

const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#070a13',
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.5) 0%, rgba(7, 10, 19, 1) 100%)',
    color: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
    overflowX: 'hidden' as const,
  },
  mainContent: {
    flex: 1,
    padding: '24px',
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '0 16px',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  welcomeTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  welcomeSubtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: 500,
  },
  clockSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#f3f4f6',
    fontVariantNumeric: 'tabular-nums',
  },
  dateText: {
    fontSize: '13px',
    color: '#9ca3af',
    fontWeight: 500,
    marginTop: '2px',
  },
};

export default App;
