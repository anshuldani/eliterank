import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { INITIAL_ANNOUNCEMENTS } from '../constants/mockData';

const AnnouncementContext = createContext(null);

export function AnnouncementProvider({ children }) {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

  // Add new announcement
  const addAnnouncement = useCallback((announcementData) => {
    const newAnnouncement = {
      id: `a${Date.now()}`,
      date: new Date().toISOString(),
      pinned: false,
      ...announcementData,
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    return newAnnouncement;
  }, []);

  // Update announcement
  const updateAnnouncement = useCallback((announcementId, updates) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === announcementId ? { ...a, ...updates } : a))
    );
  }, []);

  // Delete announcement
  const deleteAnnouncement = useCallback((announcementId) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
  }, []);

  // Toggle pin status
  const togglePin = useCallback((announcementId) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === announcementId ? { ...a, pinned: !a.pinned } : a
      )
    );
  }, []);

  // Get sorted announcements (pinned first, then by date)
  const sortedAnnouncements = useMemo(() => {
    return [...announcements].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [announcements]);

  // Get pinned announcements
  const pinnedAnnouncements = useMemo(() => {
    return announcements.filter((a) => a.pinned);
  }, [announcements]);

  const value = useMemo(
    () => ({
      // State
      announcements,
      sortedAnnouncements,
      pinnedAnnouncements,

      // Actions
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      togglePin,

      // Direct setter
      setAnnouncements,
    }),
    [
      announcements,
      sortedAnnouncements,
      pinnedAnnouncements,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      togglePin,
    ]
  );

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncementContext() {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncementContext must be used within an AnnouncementProvider');
  }
  return context;
}

export default AnnouncementContext;
