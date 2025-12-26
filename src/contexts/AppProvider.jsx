import React from 'react';
import { AuthProvider } from './AuthContext';
import { CompetitionProvider } from './CompetitionContext';
import { NomineeProvider } from './NomineeContext';
import { AnnouncementProvider } from './AnnouncementContext';

/**
 * AppProvider combines all context providers in the correct order.
 * Auth should be outermost as other contexts may depend on auth state.
 */
export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <CompetitionProvider>
        <NomineeProvider>
          <AnnouncementProvider>
            {children}
          </AnnouncementProvider>
        </NomineeProvider>
      </CompetitionProvider>
    </AuthProvider>
  );
}

export default AppProvider;
