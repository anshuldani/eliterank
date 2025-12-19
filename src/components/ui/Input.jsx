import React from 'react';
import { colors, borderRadius, spacing, typography } from '../../styles/theme';

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  style = {},
  ...props
}) {
  const containerStyle = {
    marginBottom: spacing.lg,
  };

  const labelStyle = {
    display: 'block',
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${error ? colors.status.error : colors.border.light}`,
    color: colors.text.primary,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.md,
    outline: 'none',
    boxSizing: 'border-box',
    ...style,
  };

  const errorStyle = {
    color: colors.status.error,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
        {...props}
      />
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  showCount = false,
  error,
  style = {},
  ...props
}) {
  const containerStyle = {
    marginBottom: spacing.lg,
  };

  const labelStyle = {
    display: 'block',
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  };

  const textareaStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${error ? colors.status.error : colors.border.light}`,
    color: colors.text.primary,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.md,
    outline: 'none',
    resize: 'none',
    minHeight: `${rows * 24}px`,
    boxSizing: 'border-box',
    fontFamily: typography.fontFamily,
    ...style,
  };

  const countStyle = {
    textAlign: 'right',
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        style={textareaStyle}
        {...props}
      />
      {showCount && maxLength && (
        <p style={countStyle}>
          {value?.length || 0}/{maxLength}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options = [],
  style = {},
  ...props
}) {
  const containerStyle = {
    marginBottom: spacing.lg,
  };

  const labelStyle = {
    display: 'block',
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  };

  const selectStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.border.light}`,
    color: colors.text.primary,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.md,
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    ...style,
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <select value={value} onChange={onChange} style={selectStyle} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FormSection({ title, icon: Icon, children }) {
  const sectionStyle = {
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
  };

  const titleStyle = {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xl,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  return (
    <div style={sectionStyle}>
      {title && (
        <h3 style={titleStyle}>
          {Icon && <Icon size={20} style={{ color: colors.gold.primary }} />}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function FormGrid({ children, columns = 2 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${columns === 2 ? '200px' : '150px'}, 1fr))`,
        gap: spacing.lg,
      }}
    >
      {children}
    </div>
  );
}
