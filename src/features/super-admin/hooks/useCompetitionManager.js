import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_ORGANIZATIONS, DEFAULT_TEMPLATE } from '../constants/competitionConfig';

// Mock initial templates
const INITIAL_TEMPLATES = [
  {
    id: '1',
    name: 'Most Eligible New York',
    city: 'New York',
    season: 2026,
    status: 'active',
    maxContestants: 30,
    category: 'dating',
    contestantType: 'nominations',
    hasHost: true,
    hasEvents: true,
    numberOfWinners: 5,
    selectionCriteria: 'hybrid',
    voteWeight: 60,
    judgeWeight: 40,
    votePrice: 1.00,
    hostPayoutPercentage: 20,
    organization: DEFAULT_ORGANIZATIONS[0],
    assignedHost: { id: 'h1', name: 'Sarah Mitchell', email: 'sarah@eliterank.com' },
  },
  {
    id: '2',
    name: 'Most Eligible Chicago',
    city: 'Chicago',
    season: 2026,
    status: 'assigned',
    maxContestants: 25,
    category: 'dating',
    contestantType: 'nominations',
    hasHost: true,
    hasEvents: true,
    numberOfWinners: 3,
    selectionCriteria: 'votes',
    voteWeight: 100,
    judgeWeight: 0,
    votePrice: 1.00,
    hostPayoutPercentage: 20,
    organization: DEFAULT_ORGANIZATIONS[0],
    assignedHost: { id: 'h2', name: 'Michael Chen', email: 'michael@eliterank.com' },
  },
  {
    id: '3',
    name: 'Most Eligible Miami',
    city: 'Miami',
    season: 2026,
    status: 'draft',
    maxContestants: 30,
    category: 'dating',
    contestantType: 'nominations',
    hasHost: true,
    hasEvents: true,
    numberOfWinners: 5,
    selectionCriteria: 'hybrid',
    voteWeight: 50,
    judgeWeight: 50,
    votePrice: 1.00,
    hostPayoutPercentage: 20,
    organization: DEFAULT_ORGANIZATIONS[0],
    assignedHost: null,
  },
];

export function useCompetitionManager() {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [organizations, setOrganizations] = useState(DEFAULT_ORGANIZATIONS);

  // Create a new competition
  const createCompetition = useCallback((templateData) => {
    const newTemplate = {
      id: `t${Date.now()}`,
      name: `${templateData.organization?.name} ${templateData.city}`,
      status: 'draft',
      assignedHost: null,
      ...templateData,
    };
    setTemplates((prev) => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  // Update an existing competition
  const updateCompetition = useCallback((templateId, updates) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === templateId) {
          const updated = { ...t, ...updates };
          // Update name if organization or city changed
          if (updates.organization || updates.city) {
            updated.name = `${updated.organization?.name} ${updated.city}`;
          }
          return updated;
        }
        return t;
      })
    );
  }, []);

  // Delete a competition
  const deleteCompetition = useCallback((templateId) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
  }, []);

  // Assign a host to a competition
  const assignHost = useCallback((templateId, host) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId ? { ...t, assignedHost: host, status: 'assigned' } : t
      )
    );
  }, []);

  // Activate a competition
  const activateCompetition = useCallback((templateId) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, status: 'active' } : t))
    );
  }, []);

  // Create a new organization
  const createOrganization = useCallback((orgData) => {
    const newOrg = {
      id: `org${Date.now()}`,
      ...orgData,
    };
    setOrganizations((prev) => [...prev, newOrg]);
    return newOrg;
  }, []);

  // Get competitions by status
  const competitionsByStatus = useMemo(() => {
    return {
      draft: templates.filter((t) => t.status === 'draft'),
      assigned: templates.filter((t) => t.status === 'assigned'),
      active: templates.filter((t) => t.status === 'active'),
      completed: templates.filter((t) => t.status === 'completed'),
    };
  }, [templates]);

  // Get competition counts
  const competitionCounts = useMemo(() => {
    return {
      total: templates.length,
      draft: competitionsByStatus.draft.length,
      assigned: competitionsByStatus.assigned.length,
      active: competitionsByStatus.active.length,
      completed: competitionsByStatus.completed.length,
    };
  }, [templates, competitionsByStatus]);

  return {
    // State
    templates,
    organizations,
    competitionsByStatus,
    competitionCounts,

    // Competition actions
    createCompetition,
    updateCompetition,
    deleteCompetition,
    assignHost,
    activateCompetition,

    // Organization actions
    createOrganization,

    // Direct setters for advanced use cases
    setTemplates,
    setOrganizations,
  };
}

export default useCompetitionManager;
