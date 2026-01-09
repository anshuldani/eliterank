import { usePublicCompetition } from '../../../contexts/PublicCompetitionContext';
import { Crown, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Compact leaderboard for sidebar/main view
 * Shows top 3 podium + next few contestants
 */
export function LeaderboardCompact() {
  const {
    topThree,
    contestants,
    dangerZone,
    openContestantProfile,
    orgSlug,
    citySlug,
    year,
  } = usePublicCompetition();

  const navigate = useNavigate();

  const basePath = year
    ? `/c/${orgSlug}/${citySlug}/${year}`
    : `/c/${orgSlug}/${citySlug}`;

  // Show ranks 4-8
  const displayContestants = contestants?.slice(3, 8) || [];

  // Format number with commas
  const formatVotes = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  // Get rank change indicator
  const getRankChange = (contestant) => {
    const trend = contestant.trend || 0;
    if (trend > 0) return { direction: 'up', value: trend };
    if (trend < 0) return { direction: 'down', value: Math.abs(trend) };
    return null;
  };

  // Render avatar with proper fallback
  const renderAvatar = (contestant, size = 'md') => {
    const initial = contestant.name?.charAt(0)?.toUpperCase() || '?';

    if (contestant.avatar_url) {
      return (
        <img
          src={contestant.avatar_url}
          alt={contestant.name}
          className="avatar-img"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }

    return <span className="avatar-initial">{initial}</span>;
  };

  return (
    <div className="leaderboard-compact">
      <div className="leaderboard-header">
        <h3>
          <Crown size={16} />
          Leaderboard
        </h3>
        <span className="live-indicator">
          <span className="live-dot" />
          Live
        </span>
      </div>

      {/* Top 3 Podium - Order: 2nd, 1st, 3rd */}
      <div className="leaderboard-podium-compact">
        {[1, 0, 2].map(index => {
          const contestant = topThree?.[index];
          if (!contestant) return null;

          const isFirst = index === 0;
          const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze';
          const rankChange = getRankChange(contestant);

          return (
            <div
              key={contestant.id}
              className={`podium-item podium-${rankClass} ${isFirst ? 'podium-first' : ''}`}
              onClick={() => openContestantProfile(contestant)}
            >
              <div className={`podium-avatar podium-avatar-${rankClass}`}>
                {contestant.avatar_url ? (
                  <img src={contestant.avatar_url} alt={contestant.name} />
                ) : (
                  <span className="avatar-initial">{contestant.name?.charAt(0)}</span>
                )}
                {isFirst && (
                  <span className="podium-crown">
                    <Crown size={14} />
                  </span>
                )}
                <span className={`podium-rank podium-rank-${rankClass}`}>
                  {index === 0 ? 1 : index === 1 ? 2 : 3}
                </span>
              </div>
              <span className="podium-name">{contestant.name?.split(' ')[0]}</span>
              <span className="podium-votes">{formatVotes(contestant.votes)}</span>
              {rankChange && (
                <span className={`rank-change rank-change-${rankChange.direction}`}>
                  {rankChange.direction === 'up' ? (
                    <><TrendingUp size={10} /> +{rankChange.value}</>
                  ) : (
                    <><TrendingDown size={10} /> -{rankChange.value}</>
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Remaining contestants */}
      <div className="leaderboard-list-compact">
        {displayContestants.map(contestant => {
          const isDanger = contestant.zone === 'danger';
          const rankChange = getRankChange(contestant);

          return (
            <div
              key={contestant.id}
              className={`leaderboard-row ${isDanger ? 'danger-zone' : ''}`}
              onClick={() => openContestantProfile(contestant)}
            >
              <span className="row-rank">#{contestant.displayRank}</span>
              <div className="row-avatar">
                {contestant.avatar_url ? (
                  <img src={contestant.avatar_url} alt={contestant.name} />
                ) : (
                  <span className="avatar-initial">{contestant.name?.charAt(0)}</span>
                )}
              </div>
              <div className="row-info">
                <span className="row-name">
                  {contestant.name}
                  {isDanger && (
                    <span className="danger-badge">
                      <AlertTriangle size={10} />
                      At Risk
                    </span>
                  )}
                </span>
                {rankChange && (
                  <span className={`rank-change rank-change-${rankChange.direction}`}>
                    {rankChange.direction === 'up' ? (
                      <><TrendingUp size={10} /> +{rankChange.value}</>
                    ) : (
                      <><TrendingDown size={10} /> -{rankChange.value}</>
                    )}
                  </span>
                )}
              </div>
              <span className="row-votes">{formatVotes(contestant.votes)}</span>
            </div>
          );
        })}
      </div>

      {/* Danger Zone Summary */}
      {dangerZone?.length > 0 && (
        <div className="danger-zone-summary">
          <AlertTriangle size={12} />
          <span>{dangerZone.length} contestants at risk of elimination</span>
        </div>
      )}

      {/* View All Link */}
      <button
        className="leaderboard-view-all"
        onClick={() => navigate(`${basePath}/leaderboard`)}
      >
        View All {contestants?.length || 0} Contestants
      </button>
    </div>
  );
}

export default LeaderboardCompact;
