import React, { memo, useMemo } from 'react';
import { colors, borderRadius, typography } from '../../styles/theme';

function Avatar({
  name,
  size = 44,
  src,
  style = {},
}) {
  const initials = useMemo(() => {
    return name
      ? name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
      : '?';
  }, [name]);

  const avatarStyle = useMemo(() => ({
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: borderRadius.full,
    background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.semibold,
    color: colors.gold.primary,
    fontSize: size >= 80 ? '24px' : size >= 60 ? '18px' : '14px',
    overflow: 'hidden',
    flexShrink: 0,
    ...style,
  }), [size, style]);

  if (src) {
    return (
      <div style={avatarStyle}>
        <img
          src={src}
          alt={name || 'Avatar'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return <div style={avatarStyle}>{initials}</div>;
}

export default memo(Avatar);
