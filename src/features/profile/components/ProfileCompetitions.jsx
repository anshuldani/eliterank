import React, { useState, useEffect } from 'react';
import { Trophy, Crown, MapPin, Star, ExternalLink } from 'lucide-react';
import { Panel, Badge } from '../../../components/ui';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { getHostedCompetitions, getContestantCompetitions } from '../../../lib/competition-history';
import { useResponsive } from '../../../hooks/useResponsive';

const STATUS_LABELS = {
  upcoming: 'Upcoming',
  nomination: 'Nominations',
  voting: 'Voting',
  completed: 'Completed',
  live: 'Live',
  publish: 'Coming Soon',
};

function CompetitionCard({ competition, role, contestantData }) {
  const { isMobile } = useResponsive();
  const isHost = role === 'host';
  const city = competition?.city || 'Competition';
  const season = competition?.season || '';
  const status = competition?.status || 'upcoming';
  const isActive = ['voting', 'nomination', 'live'].includes(status);
  const isWinner = contestantData?.status === 'winner';

  const url = `/most-eligible/${city.toLowerCase().replace(/\s+/g, '-')}-${season}`;

  return (
    <a
      href={url}
      style={{
        display: 'block',
        background: isWinner
          ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))'
          : isActive
          ? 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))'
          : 'rgba(255,255,255,0.03)',
        border: isWinner
          ? '1px solid rgba(212,175,55,0.3)'
          : isActive
          ? '1px solid rgba(34,197,94,0.2)'
          : '1px solid rgba(255,255,255,0.05)',
        borderRadius: borderRadius.lg,
        padding: isMobile ? spacing.md : spacing.lg,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
            <MapPin size={14} style={{ color: isHost ? colors.accent.purple : colors.gold.primary }} />
            <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.text.primary, fontSize: typography.fontSize.sm }}>
              {city} {season}
            </span>
          </div>
          {contestantData && (
            <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
              {contestantData.votes?.toLocaleString() || 0} votes
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          {isWinner ? (
            <Badge variant="gold" size="sm"><Trophy size={12} /> Winner</Badge>
          ) : (
            <Badge variant={isActive ? 'success' : 'default'} size="sm" pill>
              {isActive && '● '}{STATUS_LABELS[status] || status}
            </Badge>
          )}
          <ExternalLink size={14} style={{ color: colors.text.tertiary }} />
        </div>
      </div>
    </a>
  );
}

export default function ProfileCompetitions({ userId }) {
  const { isMobile } = useResponsive();
  const [hostedCompetitions, setHostedCompetitions] = useState([]);
  const [contestantEntries, setContestantEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    Promise.all([
      getHostedCompetitions(userId),
      getContestantCompetitions(userId),
    ]).then(([hosted, contestant]) => {
      setHostedCompetitions(hosted);
      setContestantEntries(contestant);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [userId]);

  const hasHosted = hostedCompetitions.length > 0;
  const hasContestant = contestantEntries.length > 0;

  if (loading) {
    return (
      <Panel style={{ marginBottom: spacing.xl }}>
        <div style={{ padding: spacing.xl, textAlign: 'center', color: colors.text.muted }}>
          Loading competitions...
        </div>
      </Panel>
    );
  }

  if (!hasHosted && !hasContestant) {
    return (
      <Panel style={{ marginBottom: spacing.xl }}>
        <div style={{ padding: spacing.xl, textAlign: 'center', color: colors.text.muted }}>
          <Trophy size={32} style={{ marginBottom: spacing.md, opacity: 0.3 }} />
          <p style={{ fontSize: typography.fontSize.sm }}>No competitions yet</p>
        </div>
      </Panel>
    );
  }

  return (
    <>
      {/* Hosting Section */}
      {hasHosted && (
        <Panel style={{ marginBottom: spacing.xl }}>
          <div style={{ padding: isMobile ? spacing.lg : spacing.xl }}>
            <h3 style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing.lg,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}>
              <Crown size={18} style={{ color: colors.accent.purple }} /> Hosting
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {hostedCompetitions.map(comp => (
                <CompetitionCard key={comp.id} competition={comp} role="host" />
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* Contestant Section */}
      {hasContestant && (
        <Panel style={{ marginBottom: spacing.xl }}>
          <div style={{ padding: isMobile ? spacing.lg : spacing.xl }}>
            <h3 style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing.lg,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}>
              <Star size={18} style={{ color: colors.gold.primary }} /> Competed
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {contestantEntries.map(entry => (
                <CompetitionCard
                  key={entry.id}
                  competition={entry.competition}
                  role="contestant"
                  contestantData={entry}
                />
              ))}
            </div>
          </div>
        </Panel>
      )}
    </>
  );
}
