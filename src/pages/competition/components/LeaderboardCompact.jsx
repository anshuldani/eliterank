import { usePublicCompetition } from '../../../contexts/PublicCompetitionContext';
import { Crown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Image-focused leaderboard - contestants are the STARS
 * Large portrait cards, minimal UI chrome
 */
export function LeaderboardCompact() {
  const {
    topThree,
    contestants,
    dangerZone,
    openContestantProfile,
    openVoteModal,
    orgSlug,
    citySlug,
    year,
  } = usePublicCompetition();

  const navigate = useNavigate();

  const basePath = year
    ? `/c/${orgSlug}/${citySlug}/${year}`
    : `/c/${orgSlug}/${citySlug}`;

  // Show all contestants after top 3 (up to 6 more for compact view)
  const displayContestants = contestants?.slice(3, 9) || [];

  // Format number with commas
  const formatVotes = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  return (
    <div className="leaderboard-prominent">
      <div className="leaderboard-header">
        <h3>
          <Crown size={18} />
          Leaderboard
        </h3>
        <span className="live-indicator">
          <span className="live-dot" />
          Live
        </span>
      </div>

      {/* Top 3 - Hero Portrait Cards */}
      <div className="hero-podium">
        {topThree?.map((contestant, index) => {
          const rank = index + 1;
          const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze';
          const isFirst = rank === 1;

          return (
            <div
              key={contestant.id}
              className={`hero-card hero-card-${rankClass}`}
              onClick={() => openContestantProfile(contestant)}
            >
              {/* Large portrait image */}
              <div className="hero-image-wrap">
                {contestant.avatar_url ? (
                  <img
                    src={contestant.avatar_url}
                    alt={contestant.name}
                    className="hero-image"
                  />
                ) : (
                  <div className="hero-placeholder">
                    {contestant.name?.charAt(0)}
                  </div>
                )}
                {/* Rank badge overlaid on image */}
                <div className={`hero-rank-badge ${rankClass}`}>
                  {isFirst && <Crown size={12} />}
                  {rank}
                </div>
                {/* Vote button appears on hover */}
                <button
                  className="hero-vote-btn"
                  onClick={(e) => { e.stopPropagation(); openVoteModal(contestant); }}
                >
                  Vote
                </button>
              </div>
              {/* Name and minimal info below */}
              <div className="hero-info">
                <span className="hero-name">{contestant.name?.split(' ')[0]}</span>
                <span className="hero-votes">{formatVotes(contestant.votes)} votes</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Remaining Contestants - Portrait Grid */}
      {displayContestants.length > 0 && (
        <div className="portrait-grid">
          {displayContestants.map(contestant => {
            const isDanger = contestant.zone === 'danger';

            return (
              <div
                key={contestant.id}
                className={`portrait-card ${isDanger ? 'at-risk' : ''}`}
                onClick={() => openContestantProfile(contestant)}
              >
                {/* Portrait image */}
                <div className="portrait-image-wrap">
                  {contestant.avatar_url ? (
                    <img
                      src={contestant.avatar_url}
                      alt={contestant.name}
                      className="portrait-image"
                    />
                  ) : (
                    <div className="portrait-placeholder">
                      {contestant.name?.charAt(0)}
                    </div>
                  )}
                  {/* Subtle rank in corner */}
                  <span className="portrait-rank">#{contestant.displayRank}</span>
                  {/* Danger indicator */}
                  {isDanger && (
                    <span className="portrait-danger">
                      <AlertTriangle size={12} />
                      At Risk
                    </span>
                  )}
                  {/* Vote on hover */}
                  <button
                    className="portrait-vote-btn"
                    onClick={(e) => { e.stopPropagation(); openVoteModal(contestant); }}
                  >
                    Vote
                  </button>
                </div>
                {/* Name below image */}
                <div className="portrait-info">
                  <span className="portrait-name">{contestant.name?.split(' ')[0]}</span>
                  <span className="portrait-votes">{formatVotes(contestant.votes)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
