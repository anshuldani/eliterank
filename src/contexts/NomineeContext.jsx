import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { INITIAL_NOMINEES } from '../constants/mockData';

const NomineeContext = createContext(null);

// Nominee status types for clarity
export const NOMINEE_STATUS = {
  NEW: 'new',
  PENDING: 'pending',
  PROFILE_COMPLETE: 'profile-complete',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export function NomineeProvider({ children }) {
  const [nominees, setNominees] = useState(INITIAL_NOMINEES);

  // Approve a nominee (mark as pending for profile completion)
  const approveNominee = useCallback((nomineeId) => {
    setNominees((prev) =>
      prev.map((n) =>
        n.id === nomineeId ? { ...n, status: NOMINEE_STATUS.PENDING } : n
      )
    );
  }, []);

  // Convert a nominee to a contestant
  const convertNominee = useCallback((nomineeId) => {
    setNominees((prev) =>
      prev.map((n) =>
        n.id === nomineeId ? { ...n, status: NOMINEE_STATUS.APPROVED } : n
      )
    );
  }, []);

  // Reject a nominee
  const rejectNominee = useCallback((nomineeId) => {
    setNominees((prev) => prev.filter((n) => n.id !== nomineeId));
  }, []);

  // Simulate profile completion
  const simulateProfileComplete = useCallback((nomineeId) => {
    setNominees((prev) =>
      prev.map((n) =>
        n.id === nomineeId ? { ...n, status: NOMINEE_STATUS.PROFILE_COMPLETE } : n
      )
    );
  }, []);

  // Resend invite
  const resendInvite = useCallback((nomineeId) => {
    console.log('Resending invite to nominee:', nomineeId);
    // In a real app, this would trigger an email resend
  }, []);

  // Add a new nominee
  const addNominee = useCallback((nomineeData) => {
    const newNominee = {
      id: `n${Date.now()}`,
      status: NOMINEE_STATUS.NEW,
      nominations: 1,
      createdAt: new Date().toISOString(),
      ...nomineeData,
    };
    setNominees((prev) => [...prev, newNominee]);
    return newNominee;
  }, []);

  // Update nominee
  const updateNominee = useCallback((nomineeId, updates) => {
    setNominees((prev) =>
      prev.map((n) => (n.id === nomineeId ? { ...n, ...updates } : n))
    );
  }, []);

  // Get nominees grouped by status
  const nomineesByStatus = useMemo(() => {
    return {
      new: nominees.filter((n) => n.status === NOMINEE_STATUS.NEW),
      pending: nominees.filter((n) => n.status === NOMINEE_STATUS.PENDING),
      profileComplete: nominees.filter((n) => n.status === NOMINEE_STATUS.PROFILE_COMPLETE),
      approved: nominees.filter((n) => n.status === NOMINEE_STATUS.APPROVED),
    };
  }, [nominees]);

  // Get nominee counts
  const nomineeCounts = useMemo(() => {
    return {
      total: nominees.length,
      new: nomineesByStatus.new.length,
      pending: nomineesByStatus.pending.length,
      profileComplete: nomineesByStatus.profileComplete.length,
      approved: nomineesByStatus.approved.length,
    };
  }, [nominees, nomineesByStatus]);

  const value = useMemo(
    () => ({
      // State
      nominees,
      nomineesByStatus,
      nomineeCounts,

      // Actions
      approveNominee,
      convertNominee,
      rejectNominee,
      simulateProfileComplete,
      resendInvite,
      addNominee,
      updateNominee,

      // Direct setter for bulk updates
      setNominees,
    }),
    [
      nominees,
      nomineesByStatus,
      nomineeCounts,
      approveNominee,
      convertNominee,
      rejectNominee,
      simulateProfileComplete,
      resendInvite,
      addNominee,
      updateNominee,
    ]
  );

  return (
    <NomineeContext.Provider value={value}>
      {children}
    </NomineeContext.Provider>
  );
}

export function useNomineeContext() {
  const context = useContext(NomineeContext);
  if (!context) {
    throw new Error('useNomineeContext must be used within a NomineeProvider');
  }
  return context;
}

export default NomineeContext;
