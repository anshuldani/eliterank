import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * Provides a clean API for opening/closing modals with data
 */
export default function useModals() {
  const [judgeModal, setJudgeModal] = useState({ isOpen: false, judge: null });
  const [sponsorModal, setSponsorModal] = useState({ isOpen: false, sponsor: null });
  const [eventModal, setEventModal] = useState({ isOpen: false, event: null });
  const [announcementModal, setAnnouncementModal] = useState({ isOpen: false, announcement: null });
  const [convertModal, setConvertModal] = useState({ isOpen: false, nominee: null });
  const [approveModal, setApproveModal] = useState({ isOpen: false, nominee: null });
  const [eliteRankCityOpen, setEliteRankCityOpen] = useState(false);

  // Judge modal handlers
  const openJudgeModal = useCallback((judge = null) => {
    setJudgeModal({ isOpen: true, judge });
  }, []);

  const closeJudgeModal = useCallback(() => {
    setJudgeModal({ isOpen: false, judge: null });
  }, []);

  // Sponsor modal handlers
  const openSponsorModal = useCallback((sponsor = null) => {
    setSponsorModal({ isOpen: true, sponsor });
  }, []);

  const closeSponsorModal = useCallback(() => {
    setSponsorModal({ isOpen: false, sponsor: null });
  }, []);

  // Event modal handlers
  const openEventModal = useCallback((event) => {
    setEventModal({ isOpen: true, event });
  }, []);

  const closeEventModal = useCallback(() => {
    setEventModal({ isOpen: false, event: null });
  }, []);

  // Announcement modal handlers
  const openAnnouncementModal = useCallback((announcement = null) => {
    setAnnouncementModal({ isOpen: true, announcement });
  }, []);

  const closeAnnouncementModal = useCallback(() => {
    setAnnouncementModal({ isOpen: false, announcement: null });
  }, []);

  // Convert nominee modal handlers
  const openConvertModal = useCallback((nominee) => {
    setConvertModal({ isOpen: true, nominee });
  }, []);

  const closeConvertModal = useCallback(() => {
    setConvertModal({ isOpen: false, nominee: null });
  }, []);

  // Approve nominee modal handlers
  const openApproveModal = useCallback((nominee) => {
    setApproveModal({ isOpen: true, nominee });
  }, []);

  const closeApproveModal = useCallback(() => {
    setApproveModal({ isOpen: false, nominee: null });
  }, []);

  // Elite Rank City modal handlers
  const openEliteRankCity = useCallback(() => {
    setEliteRankCityOpen(true);
  }, []);

  const closeEliteRankCity = useCallback(() => {
    setEliteRankCityOpen(false);
  }, []);

  return {
    // State
    judgeModal,
    sponsorModal,
    eventModal,
    announcementModal,
    convertModal,
    approveModal,
    eliteRankCityOpen,
    // Judge handlers
    openJudgeModal,
    closeJudgeModal,
    // Sponsor handlers
    openSponsorModal,
    closeSponsorModal,
    // Event handlers
    openEventModal,
    closeEventModal,
    // Announcement handlers
    openAnnouncementModal,
    closeAnnouncementModal,
    // Convert modal handlers
    openConvertModal,
    closeConvertModal,
    // Approve modal handlers
    openApproveModal,
    closeApproveModal,
    // Elite Rank City handlers
    openEliteRankCity,
    closeEliteRankCity,
  };
}
