/**
 * Competition validation utilities
 */

export const VALIDATION_RULES = {
  MIN_VOTE_PRICE: 0.25,
  MAX_VOTE_PRICE: 100,
  MIN_CONTESTANTS: 1,
  MAX_CONTESTANTS: 100,
  MIN_WINNERS: 1,
  MAX_WINNERS: 10,
  MIN_YEAR: 2024,
  MAX_YEAR: 2030,
};

/**
 * Validate competition form data for creation/editing
 */
export function validateCompetition(data) {
  const errors = {};

  // Organization validation
  if (!data.organization) {
    errors.organization = 'Organization is required';
  }

  // City validation
  if (!data.city || data.city.trim() === '') {
    errors.city = 'City is required';
  }

  // Season/Year validation
  if (!data.season) {
    errors.season = 'Season year is required';
  } else if (data.season < VALIDATION_RULES.MIN_YEAR || data.season > VALIDATION_RULES.MAX_YEAR) {
    errors.season = `Year must be between ${VALIDATION_RULES.MIN_YEAR} and ${VALIDATION_RULES.MAX_YEAR}`;
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  }

  // Contestant type validation
  if (!data.contestantType) {
    errors.contestantType = 'Contestant entry type is required';
  }

  // Selection criteria validation
  if (!data.selectionCriteria) {
    errors.selectionCriteria = 'Winner selection criteria is required';
  }

  // Vote price validation (only if votes or hybrid)
  if (data.selectionCriteria === 'votes' || data.selectionCriteria === 'hybrid') {
    if (data.votePrice < VALIDATION_RULES.MIN_VOTE_PRICE) {
      errors.votePrice = `Vote price must be at least $${VALIDATION_RULES.MIN_VOTE_PRICE}`;
    } else if (data.votePrice > VALIDATION_RULES.MAX_VOTE_PRICE) {
      errors.votePrice = `Vote price cannot exceed $${VALIDATION_RULES.MAX_VOTE_PRICE}`;
    }
  }

  // Max contestants validation
  if (data.maxContestants < VALIDATION_RULES.MIN_CONTESTANTS) {
    errors.maxContestants = 'Must have at least 1 contestant';
  } else if (data.maxContestants > VALIDATION_RULES.MAX_CONTESTANTS) {
    errors.maxContestants = `Cannot exceed ${VALIDATION_RULES.MAX_CONTESTANTS} contestants`;
  }

  // Number of winners validation
  if (data.numberOfWinners < VALIDATION_RULES.MIN_WINNERS) {
    errors.numberOfWinners = 'Must have at least 1 winner';
  } else if (data.numberOfWinners > VALIDATION_RULES.MAX_WINNERS) {
    errors.numberOfWinners = `Cannot exceed ${VALIDATION_RULES.MAX_WINNERS} winners`;
  }

  // Hybrid weight validation
  if (data.selectionCriteria === 'hybrid') {
    if (data.voteWeight + data.judgeWeight !== 100) {
      errors.weights = 'Vote and judge weights must total 100%';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate organization data
 */
export function validateOrganization(data) {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Organization name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Organization name must be at least 2 characters';
  } else if (data.name.length > 50) {
    errors.name = 'Organization name cannot exceed 50 characters';
  }

  if (!data.logo) {
    errors.logo = 'Logo is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Check if a wizard step can proceed
 */
export function canProceedToStep(currentStep, data) {
  switch (currentStep) {
    case 1:
      return data.organization !== null;
    case 2:
      return data.city !== '';
    case 3:
      return data.category !== '';
    case 4:
      return data.contestantType !== '';
    case 5:
      return true; // Settings step has defaults
    case 6:
      return data.selectionCriteria !== '';
    case 7:
      return true; // Review step
    default:
      return false;
  }
}
