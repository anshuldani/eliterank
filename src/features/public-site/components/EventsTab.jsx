import React from 'react';
import { MapPin, Users, Calendar, Clock, Sparkles, Edit2, Plus } from 'lucide-react';
import { Button } from '../../../components/ui';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { formatEventDateRange } from '../../../utils/formatters';

export default function EventsTab({
  events = [],
  city = 'New York',
  season = '2026',
  phase = 'voting',
  canEdit = false,
  onEditEvent,
  onAddEvent,
}) {
  // Filter to only show public/visible events
  const visibleEvents = events.filter(e => e.publicVisible !== false);

  // For nomination phase or if no events
  if (visibleEvents.length === 0) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xxxl }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1 style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md }}>
              Events
            </h1>
            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.lg }}>
              Exclusive Most Eligible {city} events
            </p>
          </div>
          {canEdit && onAddEvent && (
            <Button
              onClick={onAddEvent}
              icon={Plus}
              style={{ flexShrink: 0 }}
            >
              Add Event
            </Button>
          )}
        </div>

        <div style={{
          textAlign: 'center',
          padding: spacing.xxxl,
          background: colors.background.card,
          border: `1px solid ${colors.border.light}`,
          borderRadius: borderRadius.xxl,
        }}>
          <Calendar size={64} style={{ color: colors.text.muted, marginBottom: spacing.xl }} />
          <h2 style={{ fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.md }}>
            Events Coming Soon
          </h2>
          <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.lg, maxWidth: '500px', margin: '0 auto', marginBottom: spacing.xl }}>
            {phase === 'nomination'
              ? 'Once nominations close and contestants are announced, we\'ll share exciting events for the season.'
              : 'Stay tuned for upcoming events in your area.'
            }
          </p>
          {phase === 'nomination' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.md} ${spacing.xl}`,
              background: 'rgba(212,175,55,0.1)',
              border: `1px solid ${colors.border.gold}`,
              borderRadius: borderRadius.pill,
            }}>
              <Sparkles size={18} style={{ color: colors.gold.primary }} />
              <span style={{ color: colors.gold.primary, fontWeight: typography.fontWeight.medium }}>
                Nominations are currently open!
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const featuredEvent = visibleEvents.find(e => e.featured);
  const otherEvents = visibleEvents.filter(e => !e.featured);

  // Helper to get event status
  const getEventStatus = (event) => {
    if (event.status === 'completed') return 'completed';
    if (!event.date && !event.startDate) return 'upcoming';
    const eventDate = new Date(event.date || event.startDate);
    const now = new Date();
    if (eventDate < now) return 'completed';
    return 'upcoming';
  };

  // Helper to format date/time display
  const formatEventDateTime = (event) => {
    if (event.startDate || event.endDate) {
      return formatEventDateRange(event);
    }
    if (event.date) {
      try {
        const date = new Date(event.date);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        return event.date;
      }
    }
    return 'TBD';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xxxl }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md }}>
            Events
          </h1>
          <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.lg }}>
            {phase === 'completed'
              ? `Past events from Most Eligible ${city} Season ${season}`
              : `Don't miss our exclusive Most Eligible ${city} events`
            }
          </p>
        </div>
        {canEdit && onAddEvent && (
          <Button
            onClick={onAddEvent}
            icon={Plus}
            style={{ flexShrink: 0 }}
          >
            Add Event
          </Button>
        )}
      </div>

      <div style={{ display: 'grid', gap: spacing.xxl }}>
        {/* Featured Event */}
        {featuredEvent && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(139,92,246,0.1))',
              border: `1px solid ${colors.border.gold}`,
              borderRadius: borderRadius.xxl,
              padding: spacing.xxxl,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  background: colors.gold.primary,
                  color: '#0a0a0f',
                  borderRadius: borderRadius.xxl,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.bold,
                }}
              >
                FEATURED
              </span>
              {canEdit && onEditEvent && (
                <button
                  onClick={() => onEditEvent(featuredEvent)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: `${spacing.sm} ${spacing.md}`,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: borderRadius.md,
                    color: colors.text.secondary,
                    cursor: 'pointer',
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <Edit2 size={14} />
                  Edit
                </button>
              )}
            </div>
            <div style={{ marginTop: spacing.lg }}>
              <p style={{ color: colors.gold.primary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
                {formatEventDateTime(featuredEvent)} {featuredEvent.time && `• ${featuredEvent.time}`}
              </p>
              <h2 style={{ fontSize: typography.fontSize.display, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md }}>
                {featuredEvent.name}
              </h2>
              <p style={{ color: colors.text.light, fontSize: typography.fontSize.lg, marginBottom: spacing.xl, maxWidth: '600px' }}>
                {featuredEvent.description}
              </p>
              <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center', marginBottom: spacing.xxl }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.md }}>
                  <MapPin size={16} /> {featuredEvent.location || featuredEvent.venue || 'TBD'}
                </span>
                {featuredEvent.capacity && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.md }}>
                    <Users size={16} /> {featuredEvent.capacity}
                  </span>
                )}
              </div>
              {getEventStatus(featuredEvent) !== 'completed' && (
                <Button size="lg" style={{ padding: `${spacing.md} ${spacing.xxxl}` }}>
                  {featuredEvent.price === 'Free' || !featuredEvent.price ? 'RSVP Free' : `Get Tickets - ${featuredEvent.price}`}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Other Events */}
        {otherEvents.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
            {otherEvents.map(event => {
              const status = getEventStatus(event);
              return (
                <div
                  key={event.id}
                  style={{
                    background: colors.background.card,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: borderRadius.xxl,
                    padding: spacing.xxl,
                    opacity: status === 'completed' ? 0.8 : 1,
                    position: 'relative',
                  }}
                >
                  {canEdit && onEditEvent && (
                    <button
                      onClick={() => onEditEvent(event)}
                      style={{
                        position: 'absolute',
                        top: spacing.md,
                        right: spacing.md,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                        padding: `${spacing.xs} ${spacing.sm}`,
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: borderRadius.md,
                        color: colors.text.secondary,
                        cursor: 'pointer',
                        fontSize: typography.fontSize.xs,
                      }}
                    >
                      <Edit2 size={12} />
                    </button>
                  )}
                  {status === 'completed' && (
                    <span style={{
                      display: 'inline-block',
                      padding: `${spacing.xs} ${spacing.sm}`,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: borderRadius.sm,
                      fontSize: typography.fontSize.xs,
                      color: colors.text.muted,
                      marginBottom: spacing.sm,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      Past Event
                    </span>
                  )}
                  <p style={{ color: colors.gold.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
                    {formatEventDateTime(event)} {event.time && `• ${event.time}`}
                  </p>
                  <h3 style={{ fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
                    {event.name}
                  </h3>
                  <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.md, marginBottom: spacing.lg }}>
                    {event.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.base, marginBottom: spacing.lg }}>
                    <MapPin size={14} /> {event.location || event.venue || 'TBD'}
                  </div>
                  {status !== 'completed' && (
                    <Button variant="secondary" fullWidth>
                      {event.price === 'Free' || !event.price ? 'RSVP Free' : `Get Tickets - ${event.price}`}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
