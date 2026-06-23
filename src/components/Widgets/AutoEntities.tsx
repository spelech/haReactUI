import React from 'react';
import { useHAStore } from '../../store/haStore';

interface AutoEntitiesProps {
  domain: string;
  integration?: string;
  excludeStates?: string[];
  renderCard: (entityId: string) => React.ReactNode;
}

export const AutoEntities: React.FC<AutoEntitiesProps> = ({
  domain,
  integration,
  excludeStates = [],
  renderCard,
}) => {
  const entities = useHAStore((state) => state.entities);

  const matchedEntities = Object.keys(entities).filter((entityId) => {
    const entity = entities[entityId];
    const entDomain = entityId.split('.')[0];

    if (entDomain !== domain) return false;
    if (excludeStates.includes(entity.state)) return false;
    
    if (integration) {
      // Simple custom attribute checks for integration matching (e.g. check platform)
      const platform = entity.attributes?.platform || '';
      if (!platform.toLowerCase().includes(integration.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  if (matchedEntities.length === 0) {
    return <div style={styles.noResults}>No active {domain} entities found</div>;
  }

  return (
    <div style={styles.list}>
      {matchedEntities.map((entityId) => (
        <div key={entityId} style={styles.item}>
          {renderCard(entityId)}
        </div>
      ))}
    </div>
  );
};

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  item: {
    width: '100%',
  },
  noResults: {
    padding: '16px',
    textAlign: 'center' as const,
    color: '#6b7280',
    fontSize: '13px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
    border: '1px dashed #374151',
  },
};
