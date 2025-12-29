import React from 'react';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { computeCompetitionPhase, COMPETITION_STATUSES, TIMELINE_PHASES } from '../../../utils/competitionPhase';

// Timeline phases in order (for progress calculation when status is 'active')
const TIMELINE_PHASE_ORDER = ['nomination', 'voting', 'judging', 'completed'];

// Human-readable phase/status labels
const PHASE_LABELS = {
  // Super admin statuses
  draft: 'Draft',
  publish: 'Coming Soon',
  active: 'Active',
  complete: 'Complete',
  archive: 'Archived',
  // Timeline phases (when status is active)
  nomination: 'Nomination Phase',
  voting: 'Voting Phase',
  judging: 'Judging Phase',
  completed: 'Completed',
};

export default function CurrentPhaseCard({ competition }) {
  // Get the computed phase (considers timeline dates when status is 'active')
  const computedPhase = computeCompetitionPhase(competition);
  const status = competition?.status || 'draft';

  // Determine if we're in an active timeline phase
  const isActiveStatus = status === COMPETITION_STATUSES.ACTIVE;
  const isTimelinePhase = TIMELINE_PHASE_ORDER.includes(computedPhase);
  const isLive = isActiveStatus && ['nomination', 'voting', 'judging'].includes(computedPhase);
  const isCompleted = computedPhase === 'completed' || computedPhase === 'complete';

  // Calculate progress for active competitions
  let progress = 0;
  let completedCount = 0;
  const totalPhases = TIMELINE_PHASE_ORDER.length;

  if (isActiveStatus && isTimelinePhase) {
    const phaseIndex = TIMELINE_PHASE_ORDER.indexOf(computedPhase);
    completedCount = phaseIndex >= 0 ? phaseIndex : 0;
    progress = totalPhases > 1 ? (completedCount / (totalPhases - 1)) * 100 : 0;
  } else if (isCompleted) {
    completedCount = totalPhases - 1;
    progress = 100;
  }

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
            {PHASE_LABELS[computedPhase] || 'No Active Phase'}
          </p>
        </div>
        {isLive && (
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
        )}
        {isCompleted && (
          <div
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              background: 'rgba(139,92,246,0.15)',
              borderRadius: borderRadius.xxl,
            }}
          >
            <span style={{ color: '#a78bfa', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
              ENDED
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar - only show for active competitions */}
      {isActiveStatus && (
        <div style={{ marginTop: spacing.xl }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
              Competition Progress
            </span>
            <span style={{ color: colors.gold.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
              {completedCount}/{totalPhases - 1} phases
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
      )}
    </div>
  );
}
