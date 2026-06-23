import React, { useState, useEffect } from 'react';
import { HAProvider, useHA } from './contexts/HAContext';
import { useLayoutManager } from './hooks/useLayoutManager';
import type { WidgetConfig } from './hooks/useLayoutManager';
import { DashboardGrid } from './components/Grid/DashboardGrid';
import { EditToolbar } from './components/Configuration/EditToolbar';
import { EntitySelectorModal } from './components/Configuration/EntitySelectorModal';
import { WidgetConfigModal } from './components/Configuration/WidgetConfigModal';
import { Icon } from '@mdi/react';
import {
  mdiHome,
  mdiShieldLock,
  mdiThermostat,
  mdiCast,
  mdiVideo,
  mdiCar,
  mdiServer,
  mdiLan,
} from '@mdi/js';
import {
  SmartLightCard,
  SmartSwitchCard,
  SmartSensorCard,
  SmartMediaPlayerCard,
  SmartButtonCard,
  SmartToggleCard,
  SmartSliderCard,
  SmartCoverCard,
  SmartThermostatCard,
  SmartAlarmKeypadCard,
  SmartTvRemoteCard,
  SmartCameraCard,
  SmartWeatherCard,
  SmartHistoryGraphCard,
  SmartAdGuardCard,
  SmartVehicleCard,
  SmartOctoPrinterCard,
  SmartUpsStatusCard,
} from './components/Widgets/SmartWidgets';

// Subview navigation items
const VIEW_ITEMS = [
  { id: 'home', label: 'Home', icon: mdiHome },
  { id: 'security', label: 'Security', icon: mdiShieldLock },
  { id: 'climate', label: 'Climate', icon: mdiThermostat },
  { id: 'media', label: 'Media', icon: mdiCast },
  { id: 'cameras', label: 'Cameras', icon: mdiVideo },
  { id: 'car', label: 'Car Status', icon: mdiCar },
  { id: 'server', label: 'Server Monitor', icon: mdiServer },
  { id: 'network', label: 'Network', icon: mdiLan },
];

const DashboardContent: React.FC = () => {
  const { logout } = useHA();
  const {
    currentView,
    setCurrentView,
    widgets,
    layouts,
    isEditing,
    setIsEditing,
    handleLayoutChange,
    addWidget,
    removeWidget,
    updateWidgetOverrides,
    resetLayout,
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
      case 'button':
        return (
          <SmartButtonCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            iconOverride={overrides?.icon}
          />
        );
      case 'toggle':
        return (
          <SmartToggleCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            iconOverride={overrides?.icon}
          />
        );
      case 'slider':
        return (
          <SmartSliderCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            iconOverride={overrides?.icon}
            orientation={overrides?.orientation || 'horizontal'}
          />
        );
      case 'cover':
        return (
          <SmartCoverCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            iconOverride={overrides?.icon}
          />
        );
      case 'thermostat':
        return (
          <SmartThermostatCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
          />
        );
      case 'alarm':
        return (
          <SmartAlarmKeypadCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
          />
        );
      case 'remote':
        return (
          <SmartTvRemoteCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
          />
        );
      case 'camera':
        return (
          <SmartCameraCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
          />
        );
      case 'weather':
        return (
          <SmartWeatherCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
          />
        );
      case 'graph':
        return (
          <SmartHistoryGraphCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
            color={overrides?.color}
          />
        );
      case 'adguard':
        return (
          <SmartAdGuardCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
          />
        );
      case 'car':
        return (
          <SmartVehicleCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
          />
        );
      case 'printer':
        return (
          <SmartOctoPrinterCard
            entityId={widget.entityId}
            nameOverride={overrides?.name}
          />
        );
      case 'ups':
        return (
          <SmartUpsStatusCard
            prefix={overrides?.prefix || 'office'}
            nameOverride={overrides?.name}
          />
        );
      default:
        return <div style={{ padding: '16px', color: '#9ca3af' }}>Unsupported widget</div>;
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.brandLogo} />
          <span style={styles.brandName}>Wiley Home</span>
        </div>
        <nav style={styles.navigation}>
          {VIEW_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={styles.navItem(isActive)}
              >
                <Icon path={item.icon} size={0.8} color={isActive ? '#3b82f6' : '#9ca3af'} />
                <span style={styles.navLabel(isActive)}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main View Container */}
      <div style={styles.dashboardContainer}>
        <EditToolbar
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onAddWidget={() => setIsSelectorOpen(true)}
          onLogout={logout}
          onResetLayout={resetLayout}
        />

        <main style={styles.mainContent}>
          {/* Welcome & Clock Header */}
          <header style={styles.header}>
            <div style={styles.welcomeSection}>
              <h1 style={styles.welcomeTitle}>
                {VIEW_ITEMS.find((v) => v.id === currentView)?.label || 'Wiley Home'}
              </h1>
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
      </div>

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
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#070a13',
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.4) 0%, rgba(7, 10, 19, 1) 100%)',
    overflowX: 'hidden' as const,
  },
  sidebar: {
    width: '240px',
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '24px 16px',
    boxSizing: 'border-box' as const,
    backdropFilter: 'blur(16px)',
    zIndex: 10,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    paddingLeft: '8px',
  },
  brandLogo: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
  },
  brandName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '-0.3px',
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  navItem: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
    outline: 'none',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
    },
  }),
  navLabel: (isActive: boolean) => ({
    fontSize: '13px',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? '#3b82f6' : '#9ca3af',
  }),
  dashboardContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
    overflowX: 'hidden' as const,
  },
  mainContent: {
    flex: 1,
    padding: '24px',
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    boxSizing: 'border-box' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '0 8px',
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
