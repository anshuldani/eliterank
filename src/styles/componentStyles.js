// Shared component styles
// These are style objects that can be used across components

import { colors, gradients, shadows, borderRadius, spacing, typography, transitions } from './theme';

const styles = {
  // Layout
  container: {
    minHeight: '100vh',
    background: gradients.background,
    fontFamily: typography.fontFamily,
    color: colors.text.primary,
  },

  // Header
  header: {
    background: 'rgba(20,20,30,0.95)',
    borderBottom: `1px solid ${colors.border.gold}`,
    padding: `${spacing.md} ${spacing.xxl}`,
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backdropFilter: 'blur(20px)',
  },

  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Logo
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },

  logoIcon: {
    width: '40px',
    height: '40px',
    background: gradients.gold,
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0a0a0f',
    boxShadow: shadows.gold,
  },

  logoText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.semibold,
    background: gradients.gold,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  // Navigation
  nav: {
    background: 'rgba(20,20,30,0.8)',
    borderBottom: `1px solid ${colors.border.lighter}`,
    padding: `0 ${spacing.xxl}`,
  },

  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '0',
    overflowX: 'auto',
  },

  navItem: (active) => ({
    padding: `${spacing.md} ${spacing.xl}`,
    color: active ? colors.gold.primary : colors.text.secondary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    borderBottom: `2px solid ${active ? colors.gold.primary : 'transparent'}`,
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    transition: `all ${transitions.fast}`,
  }),

  // Main content
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing.xxxl} ${spacing.xxl}`,
  },

  // Page title
  pageTitle: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xxxl,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },

  // Gold accent
  gold: {
    color: colors.gold.primary,
  },

  // Panels
  panel: {
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
  },

  panelHeader: {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border.lighter}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  },

  // Cards
  statCard: (gradient = false) => ({
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    border: '1px solid',
    borderColor: gradient ? colors.border.gold : colors.border.light,
    background: gradient
      ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(30,30,40,0.6))'
      : colors.background.card,
    transition: `all ${transitions.normal}`,
  }),

  statLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.sm,
  },

  statValue: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.semibold,
    color: '#fff',
  },

  statIcon: (color = 'gold') => {
    const colorMap = {
      gold: { bg: 'rgba(212,175,55,0.15)', color: colors.gold.primary },
      blue: { bg: 'rgba(59,130,246,0.15)', color: colors.status.info },
      purple: { bg: 'rgba(139,92,246,0.15)', color: colors.status.purple },
      green: { bg: 'rgba(34,197,94,0.15)', color: colors.status.success },
    };
    const c = colorMap[color] || colorMap.gold;
    return {
      width: '52px',
      height: '52px',
      borderRadius: borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: c.bg,
      color: c.color,
    };
  },

  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.status.success,
  },

  // Badges
  badge: {
    padding: `${spacing.xs} ${spacing.md}`,
    background: 'rgba(212,175,55,0.15)',
    color: colors.gold.primary,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },

  statusBadge: (status) => {
    const statusMap = {
      active: { bg: 'rgba(34,197,94,0.15)', color: colors.status.success },
      approved: { bg: 'rgba(34,197,94,0.15)', color: colors.status.success },
      nomination: { bg: 'rgba(59,130,246,0.15)', color: colors.status.info },
      'profile-complete': { bg: 'rgba(59,130,246,0.15)', color: colors.status.info },
      pending: { bg: 'rgba(251,191,36,0.15)', color: colors.status.warning },
      'pending-approval': { bg: 'rgba(251,191,36,0.15)', color: colors.status.warning },
      'awaiting-profile': { bg: 'rgba(139,92,246,0.15)', color: colors.status.purple },
      upcoming: { bg: 'rgba(139,92,246,0.15)', color: colors.status.purple },
    };
    const s = statusMap[status] || statusMap.upcoming;
    return {
      padding: `5px ${spacing.md}`,
      borderRadius: borderRadius.xxl,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      textTransform: 'uppercase',
      background: s.bg,
      color: s.color,
    };
  },

  // Avatar
  avatar: (size = '44px') => ({
    width: size,
    height: size,
    borderRadius: borderRadius.full,
    background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.semibold,
    color: colors.gold.primary,
    fontSize: size === '80px' ? '24px' : '14px',
  }),

  // Buttons
  btnPrimary: {
    background: gradients.gold,
    color: '#0a0a0f',
    border: 'none',
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.md,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    boxShadow: shadows.gold,
  },

  btnSecondary: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.border.light}`,
    color: colors.text.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  btnApprove: {
    background: 'rgba(34,197,94,0.15)',
    color: colors.status.success,
    border: `1px solid rgba(34,197,94,0.3)`,
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },

  btnReject: {
    background: 'rgba(239,68,68,0.15)',
    color: colors.status.error,
    border: `1px solid rgba(239,68,68,0.3)`,
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: colors.background.overlay,
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: spacing.xl,
  },

  modal: {
    background: '#1a1a24',
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xxl,
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'hidden',
  },

  modalHeader: {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border.lighter}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.semibold,
  },

  modalClose: {
    background: 'none',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    padding: spacing.sm,
  },

  modalBody: {
    padding: spacing.xl,
    maxHeight: '60vh',
    overflowY: 'auto',
  },

  modalFooter: {
    padding: spacing.xl,
    borderTop: `1px solid ${colors.border.lighter}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },

  // Forms
  formSection: {
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
  },

  formTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xl,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.lg,
  },

  formGroup: {
    marginBottom: spacing.lg,
  },

  formLabel: {
    display: 'block',
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },

  formInput: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.border.light}`,
    color: colors.text.primary,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.md,
    outline: 'none',
    boxSizing: 'border-box',
  },

  formTextarea: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.border.light}`,
    color: colors.text.primary,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.md,
    outline: 'none',
    resize: 'none',
    minHeight: '100px',
    boxSizing: 'border-box',
  },

  // Hobby/Interest tags
  hobbyGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  hobbyTag: (selected) => ({
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: borderRadius.xxl,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    border: 'none',
    transition: `all ${transitions.fast}`,
    background: selected ? colors.gold.primary : 'rgba(255,255,255,0.05)',
    color: selected ? '#0a0a0f' : colors.text.secondary,
  }),

  interestTag: {
    padding: `5px ${spacing.md}`,
    background: 'rgba(212,175,55,0.1)',
    color: colors.gold.primary,
    borderRadius: borderRadius.xxl,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  // Trend indicator
  trendIndicator: (trend) => ({
    width: '28px',
    height: '28px',
    borderRadius: borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
    background: trend === 'up'
      ? 'rgba(34,197,94,0.15)'
      : trend === 'down'
        ? 'rgba(239,68,68,0.15)'
        : 'rgba(255,255,255,0.05)',
    color: trend === 'up'
      ? colors.status.success
      : trend === 'down'
        ? colors.status.error
        : colors.text.secondary,
  }),

  // Save button
  saveBtn: {
    width: '100%',
    padding: spacing.lg,
    background: gradients.gold,
    color: '#0a0a0f',
    border: 'none',
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    boxShadow: shadows.gold,
  },

  // Competition card styles
  compCard: {
    background: colors.background.cardHover,
    border: `1px solid ${colors.border.lighter}`,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },

  compHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  compCity: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  compStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },

  compStatValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.semibold,
    color: '#fff',
  },

  compStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },

  // Leaderboard
  leaderboard: {
    padding: `${spacing.sm} ${spacing.xl} ${spacing.xl}`,
  },

  leaderItem: (top = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    background: top ? 'rgba(212,175,55,0.05)' : 'transparent',
    marginBottom: spacing.xs,
  }),

  rank: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },

  contestantInfo: {
    flex: 1,
  },

  contestantName: {
    fontWeight: typography.fontWeight.medium,
    color: '#fff',
    display: 'block',
  },

  contestantVotes: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },

  // Profile styles
  profileCover: {
    height: '180px',
    background: gradients.cover,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  coverBtn: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.lg}`,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.base,
    color: '#fff',
    cursor: 'pointer',
  },

  profileAvatar: {
    width: '120px',
    height: '120px',
    borderRadius: borderRadius.xxl,
    background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))',
    border: '4px solid #1a1a24',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: typography.fontWeight.semibold,
    color: colors.gold.primary,
    position: 'relative',
  },

  // Nominee card
  nomineeCard: {
    background: colors.background.cardHover,
    border: `1px solid ${colors.border.lighter}`,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },

  nomineeName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  },

  nomineeMeta: {
    display: 'flex',
    gap: spacing.lg,
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },

  nomineeBio: {
    color: colors.text.light,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.md,
  },

  nomineeActions: {
    display: 'flex',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTop: `1px solid ${colors.border.lighter}`,
    flexWrap: 'wrap',
  },

  sourceBadge: (isSelf) => ({
    padding: `5px ${spacing.md}`,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    background: isSelf ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.15)',
    color: isSelf ? colors.status.purple : colors.status.info,
  }),
};

export default styles;
