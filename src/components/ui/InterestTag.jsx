import React from 'react';
import { colors, borderRadius, spacing, typography, transitions } from '../../styles/theme';

export default function InterestTag({ children, selected = false, onClick, size = 'md' }) {
  const sizeStyles = {
    sm: {
      padding: `3px ${spacing.sm}`,
      fontSize: typography.fontSize.xs,
    },
    md: {
      padding: `5px ${spacing.md}`,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.base,
    },
  };

  const tagStyle = {
    ...sizeStyles[size],
    background: selected ? colors.gold.primary : 'rgba(212,175,55,0.1)',
    color: selected ? '#0a0a0f' : colors.gold.primary,
    borderRadius: borderRadius.xxl,
    fontWeight: typography.fontWeight.medium,
    cursor: onClick ? 'pointer' : 'default',
    border: 'none',
    transition: `all ${transitions.fast}`,
    display: 'inline-block',
  };

  if (onClick) {
    return (
      <button style={tagStyle} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <span style={tagStyle}>{children}</span>;
}

// Hobby selector for forms
export function HobbySelector({ hobbies = [], selected = [], onChange, max = 8 }) {
  const toggleHobby = (hobby) => {
    if (selected.includes(hobby)) {
      onChange(selected.filter((h) => h !== hobby));
    } else if (selected.length < max) {
      onChange([...selected, hobby]);
    }
  };

  return (
    <div>
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          marginBottom: spacing.lg,
        }}
      >
        Select up to {max} hobbies ({selected.length}/{max})
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
        {hobbies.map((hobby) => (
          <InterestTag
            key={hobby}
            selected={selected.includes(hobby)}
            onClick={() => toggleHobby(hobby)}
            size="lg"
          >
            {hobby}
          </InterestTag>
        ))}
      </div>
    </div>
  );
}
