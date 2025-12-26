import React from 'react';
import { MapPin, Calendar, Users, Edit2, Trash2, UserPlus, Check, Eye } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { STATUS_STYLES, CATEGORY_TYPES } from '../constants/competitionConfig';

export default function CompetitionCard({
  template,
  onAssignHost,
  onActivate,
  onViewDashboard,
  onEdit,
  onDelete,
}) {
  const status = STATUS_STYLES[template.status];
  const category = CATEGORY_TYPES.find((c) => c.id === template.category);

  return (
    <div
      style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: colors.background.secondary,
              borderRadius: borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            {template.organization?.logo || '👑'}
          </div>
          <div>
            <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              {template.name}
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
              {template.organization?.name}
            </p>
          </div>
        </div>
        <div
          style={{
            padding: `${spacing.xs} ${spacing.md}`,
            background: status.bg,
            borderRadius: borderRadius.pill,
          }}
        >
          <span style={{ color: status.color, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', gap: spacing.lg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary }}>
          <MapPin size={14} />
          <span style={{ fontSize: typography.fontSize.sm }}>{template.city}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary }}>
          <Calendar size={14} />
          <span style={{ fontSize: typography.fontSize.sm }}>Season {template.season}</span>
        </div>
        {category && (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: category.color }}>
            <category.icon size={14} />
            <span style={{ fontSize: typography.fontSize.sm }}>{category.name}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary }}>
          <Users size={14} />
          <span style={{ fontSize: typography.fontSize.sm }}>Max {template.maxContestants}</span>
        </div>
      </div>

      {/* Assigned Host */}
      {template.assignedHost && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.md,
            background: 'rgba(212,175,55,0.1)',
            borderRadius: borderRadius.md,
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
              borderRadius: borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: typography.fontWeight.bold,
              color: '#000',
              fontSize: typography.fontSize.sm,
            }}
          >
            {template.assignedHost.name.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
              {template.assignedHost.name}
            </p>
            <p style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
              {template.assignedHost.email}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: spacing.sm, marginTop: 'auto' }}>
        {template.status === 'draft' && (
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => onAssignHost(template)}
            style={{ flex: 1 }}
          >
            Assign Host
          </Button>
        )}
        {template.status === 'assigned' && (
          <Button
            variant="approve"
            size="sm"
            icon={Check}
            onClick={() => onActivate(template.id)}
            style={{ flex: 1 }}
          >
            Activate
          </Button>
        )}
        {template.status === 'active' && onViewDashboard && (
          <Button
            variant="secondary"
            size="sm"
            icon={Eye}
            onClick={() => onViewDashboard(template)}
            style={{ flex: 1 }}
          >
            View Dashboard
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          icon={Edit2}
          onClick={() => onEdit(template)}
          style={{ width: '40px', padding: spacing.sm }}
        />
        <Button
          variant="secondary"
          size="sm"
          icon={Trash2}
          onClick={() => onDelete(template.id)}
          style={{ width: '40px', padding: spacing.sm }}
        />
      </div>
    </div>
  );
}
