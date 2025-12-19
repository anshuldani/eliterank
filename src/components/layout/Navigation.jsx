import React from 'react';
import { BarChart3, UserPlus, FileText, Settings, User } from 'lucide-react';
import { colors, spacing, typography, transitions } from '../../styles/theme';

const ICON_MAP = {
  overview: BarChart3,
  nominations: UserPlus,
  community: FileText,
  settings: Settings,
  profile: User,
};

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'nominations', label: 'Nominations' },
  { id: 'community', label: 'Community' },
  { id: 'settings', label: 'Settings' },
  { id: 'profile', label: 'Profile' },
];

export default function Navigation({ activeTab, onTabChange }) {
  const navStyle = {
    background: 'rgba(20,20,30,0.8)',
    borderBottom: `1px solid ${colors.border.lighter}`,
    padding: `0 ${spacing.xxl}`,
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '0',
    overflowX: 'auto',
  };

  const getTabStyle = (isActive) => ({
    padding: `${spacing.md} ${spacing.xl}`,
    color: isActive ? colors.gold.primary : colors.text.secondary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    borderBottom: `2px solid ${isActive ? colors.gold.primary : 'transparent'}`,
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    transition: `all ${transitions.fast}`,
    whiteSpace: 'nowrap',
  });

  return (
    <nav style={navStyle}>
      <div style={contentStyle}>
        {TABS.map((tab) => {
          const Icon = ICON_MAP[tab.id];
          return (
            <button
              key={tab.id}
              style={getTabStyle(activeTab === tab.id)}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
