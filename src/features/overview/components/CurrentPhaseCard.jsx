import React from 'react';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { formatDate } from '../../../utils/formatters';

export default function CurrentPhaseCard({ events }) {
  const activeEvent = events.find((e) => e.status === 'active');
  const completedCount = events.filter((e) => e.status === 'completed').length;
  const totalCount = events.length;
  const progress = (completedCount / totalCount) * 100;

  const cardStyle = {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
    border: `1px solid ${colors.border.gold}`,
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.base, marginBottom: spacing.sm }}>
            Current Phase
          </p>
          <p style={{ fontSize: typography.fontSize.xxxl, fontWeight: typography.fontWeight.semibold, color: colors.gold.primary }}>
            {activeEvent?.name || 'No Active Phase'}
          </p>
        </div>
        <div
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            background: 'rgba(34,197,94,0.15)',
            borderRadius: borderRadius.xxl,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: borderRadius.full,
              background: colors.status.success,
              animation: 'pulse 2s infinite',
            }}
          />
          <span style={{ color: colors.status.success, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: spacing.xl }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
            Competition Progress
          </span>
          <span style={{ color: colors.gold.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
            {completedCount}/{totalCount} phases
          </span>
        </div>
        <div
          style={{
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: borderRadius.xs,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #d4af37, #f4d03f)',
              borderRadius: borderRadius.xs,
            }}
          />
        </div>
      </div>

      {/* Phase Details */}
      {activeEvent && (
        <div
          style={{
            marginTop: spacing.lg,
            padding: spacing.md,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: borderRadius.md,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>Started</span>
            <span style={{ color: '#fff', fontSize: typography.fontSize.sm }}>
              {formatDate(activeEvent.date, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>Ends</span>
            <span style={{ color: colors.gold.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
              {activeEvent.endDate
                ? formatDate(activeEvent.endDate, { month: 'short', day: 'numeric' })
                : '-'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
