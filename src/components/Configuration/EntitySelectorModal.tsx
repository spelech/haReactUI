import React, { useState } from 'react';
import { useHAStore } from '../../store/haStore';

interface EntitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (entityId: string, type: 'light' | 'switch' | 'sensor' | 'media') => void;
}

export const EntitySelectorModal: React.FC<EntitySelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectEntity,
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<'all' | 'light' | 'switch' | 'sensor' | 'media_player'>('all');
  const entities = useHAStore((state) => state.entities);

  if (!isOpen) return null;

  // Filter entities based on search query and domain
  const filteredEntities = Object.keys(entities).filter((entityId) => {
    const entity = entities[entityId];
    const friendlyName = entity.attributes?.friendly_name || '';
    const matchesSearch =
      entityId.toLowerCase().includes(search.toLowerCase()) ||
      friendlyName.toLowerCase().includes(search.toLowerCase());

    const domain = entityId.split('.')[0];
    const isSupportedDomain = ['light', 'switch', 'sensor', 'media_player'].includes(domain);

    if (!isSupportedDomain) return false;

    if (domainFilter === 'all') {
      return matchesSearch;
    }
    return domain === domainFilter && matchesSearch;
  });

  const getWidgetType = (entityId: string): 'light' | 'switch' | 'sensor' | 'media' => {
    const domain = entityId.split('.')[0];
    if (domain === 'light') return 'light';
    if (domain === 'switch') return 'switch';
    if (domain === 'media_player') return 'media';
    return 'sensor';
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add Widget</h2>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div style={styles.searchBarContainer}>
          <input
            type="text"
            placeholder="Search entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tabsContainer}>
          {(['all', 'light', 'switch', 'sensor', 'media_player'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setDomainFilter(tab)}
              style={styles.tab(domainFilter === tab)}
            >
              {tab === 'media_player' ? 'Media' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.listContainer}>
          {filteredEntities.length === 0 ? (
            <div style={styles.noResults}>No entities found</div>
          ) : (
            filteredEntities.map((entityId) => {
              const entity = entities[entityId];
              const name = entity.attributes?.friendly_name || entityId;
              const type = getWidgetType(entityId);
              return (
                <div
                  key={entityId}
                  style={styles.item}
                  onClick={() => {
                    onSelectEntity(entityId, type);
                    onClose();
                  }}
                >
                  <div style={styles.itemInfo}>
                    <span style={styles.itemName}>{name}</span>
                    <span style={styles.itemSub}>{entityId}</span>
                  </div>
                  <span style={styles.badge(type)}>{type}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  modal: {
    width: '90%',
    maxWidth: '540px',
    height: '80vh',
    maxHeight: '600px',
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #1f2937',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#f3f4f6',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: '24px',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },
  searchBarContainer: {
    padding: '16px 24px 8px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    color: '#f3f4f6',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    padding: '8px 24px 16px',
    borderBottom: '1px solid #1f2937',
    overflowX: 'auto' as const,
  },
  tab: (isActive: boolean) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: isActive ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
    color: isActive ? '#ffffff' : '#9ca3af',
    transition: 'all 0.2s',
  }),
  listContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '12px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  noResults: {
    textAlign: 'center' as const,
    color: '#6b7280',
    marginTop: '40px',
    fontSize: '14px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderColor: '#4b5563',
    },
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    overflow: 'hidden',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f3f4f6',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemSub: {
    fontSize: '11px',
    color: '#9ca3af',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  badge: (type: string) => {
    let color = '#fbbf24'; // light
    if (type === 'switch') color = '#3b82f6';
    if (type === 'sensor') color = '#10b981';
    if (type === 'media') color = '#ec4899';
    return {
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      color,
      backgroundColor: `${color}1A`,
      padding: '2px 6px',
      borderRadius: '4px',
      border: `1px solid ${color}33`,
    };
  },
};
