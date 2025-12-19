import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { daysUntil, formatDate } from '../../../utils/formatters';

export default function UpcomingCard({ events }) {
  const nextEvent = events.find((e) => e.status === 'upcoming');
  const daysAway = nextEvent ? daysUntil(nextEvent.date) : 0;

  const cardStyle = {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
  };

  const iconBoxStyle = {
    width: '52px',
    height: '52px',
    borderRadius: borderRadius.lg,
    background: 'rgba(139,92,246,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.status.purple,
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.base, marginBottom: spacing.sm }}>
            Coming Up Next
          </p>
          <p style={{ fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.semibold }}>
            {nextEvent?.name || 'No Upcoming Events'}
          </p>
        </div>
        <div style={iconBoxStyle}>
          <Calendar size={26} />
        </div>
      </div>

      {nextEvent && (
        <div style={{ marginTop: spacing.lg }}>
          <div
            style={{
              padding: spacing.lg,
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
              borderRadius: borderRadius.lg,
              border: '1px solid rgba(139,92,246,0.2)',
              textAlign: 'center',
            }}
          >
            <p style={{ color: colors.status.purple, fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold }}>
              {daysAway > 0 ? daysAway : 0}
            </p>
            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {daysAway === 1 ? 'Day Away' : 'Days Away'}
            </p>
          </div>

          <div
            style={{
              marginTop: spacing.md,
              padding: `${spacing.md} ${spacing.md}`,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: borderRadius.sm,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <Calendar size={14} style={{ color: colors.text.secondary }} />
              <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                {formatDate(nextEvent.date, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            {nextEvent.time && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs }}>
                <Clock size={14} style={{ color: colors.text.secondary }} />
                <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                  {nextEvent.time}
                </span>
              </div>
            )}
            {nextEvent.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs }}>
                <MapPin size={14} style={{ color: colors.text.secondary }} />
                <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                  {nextEvent.location}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
