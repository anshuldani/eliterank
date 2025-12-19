import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Button } from '../../../components/ui';
import { colors, spacing, borderRadius, typography, gradients } from '../../../styles/theme';

export default function EventsTab({ events }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
        <h1 style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md }}>
          Events
        </h1>
        <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.lg }}>
          Don't miss our exclusive Most Eligible events
        </p>
      </div>

      <div style={{ display: 'grid', gap: spacing.xxl }}>
        {/* Featured Event - Finals Gala */}
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
          <span
            style={{
              position: 'absolute',
              top: spacing.xl,
              right: spacing.xl,
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
          <p style={{ color: colors.gold.primary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
            FEB 20, 2025 • 7:00 PM
          </p>
          <h2 style={{ fontSize: typography.fontSize.display, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md }}>
            New York Most Eligible Finals Gala
          </h2>
          <p style={{ color: colors.text.light, fontSize: typography.fontSize.lg, marginBottom: spacing.xl, maxWidth: '600px' }}>
            Join us for an unforgettable evening as we crown New York's Most Eligible. Red carpet, live entertainment, and the final reveal.
          </p>
          <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center', marginBottom: spacing.xxl }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.md }}>
              <MapPin size={16} /> The Plaza Hotel, NYC
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.md }}>
              <Users size={16} /> 500 Guests
            </span>
          </div>
          <Button size="lg" style={{ padding: `${spacing.md} ${spacing.xxxl}` }}>
            Get Tickets - $150
          </Button>
        </div>

        {/* Other Events */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.xl }}>
          <div style={{ background: colors.background.card, border: `1px solid ${colors.border.light}`, borderRadius: borderRadius.xxl, padding: spacing.xxl }}>
            <p style={{ color: colors.gold.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
              FEB 10, 2025 • 6:00 PM
            </p>
            <h3 style={{ fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
              Double Vote Day Mixer
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.md, marginBottom: spacing.lg }}>
              Meet the contestants in person during our special double vote day event.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.base, marginBottom: spacing.lg }}>
              <MapPin size={14} /> Soho House NYC
            </div>
            <Button variant="secondary" fullWidth>
              RSVP Free
            </Button>
          </div>

          <div style={{ background: colors.background.card, border: `1px solid ${colors.border.light}`, borderRadius: borderRadius.xxl, padding: spacing.xxl }}>
            <p style={{ color: colors.gold.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
              FEB 15, 2025 • 8:00 PM
            </p>
            <h3 style={{ fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
              Semi-Finals Watch Party
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.md, marginBottom: spacing.lg }}>
              Watch the semi-finals announcement live with fellow fans and supporters.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.base, marginBottom: spacing.lg }}>
              <MapPin size={14} /> 1 Oak NYC
            </div>
            <Button variant="secondary" fullWidth>
              RSVP Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
