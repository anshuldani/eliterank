/**
 * Data transformation utilities for consistent data handling
 */

/**
 * Transform competition template for display
 */
export function formatCompetitionForDisplay(template) {
  return {
    ...template,
    displayName: template.name || `${template.organization?.name} ${template.city}`,
    votePriceFormatted: template.votePrice ? `$${template.votePrice.toFixed(2)}` : 'N/A',
    seasonYear: template.season || new Date().getFullYear(),
  };
}

/**
 * Transform competition for API submission
 */
export function formatCompetitionForApi(data) {
  return {
    organization_id: data.organization?.id,
    city: data.city,
    season: data.season,
    category: data.category,
    contestant_type: data.contestantType,
    has_host: data.hasHost,
    has_events: data.hasEvents,
    max_contestants: data.maxContestants,
    number_of_winners: data.numberOfWinners,
    selection_criteria: data.selectionCriteria,
    vote_weight: data.voteWeight,
    judge_weight: data.judgeWeight,
    vote_price: data.votePrice,
    host_payout_percentage: data.hostPayoutPercentage,
    status: data.status || 'draft',
  };
}

/**
 * Transform contestant for leaderboard display
 */
export function formatContestantForLeaderboard(contestant, rank) {
  return {
    ...contestant,
    rank,
    isTopThree: rank <= 3,
    voteCount: contestant.votes || 0,
    displayName: contestant.name,
    initials: getInitials(contestant.name),
  };
}

/**
 * Get initials from a name
 */
export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Sort contestants by votes (descending)
 */
export function sortContestantsByVotes(contestants) {
  return [...contestants].sort((a, b) => (b.votes || 0) - (a.votes || 0));
}

/**
 * Group items by a key
 */
export function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key];
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {});
}

/**
 * Filter items by search query
 */
export function filterBySearch(items, query, searchFields = ['name']) {
  if (!query || query.trim() === '') return items;

  const lowerQuery = query.toLowerCase().trim();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(lowerQuery);
    })
  );
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
