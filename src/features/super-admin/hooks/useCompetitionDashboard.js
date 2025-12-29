import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

/**
 * Hook to fetch all dashboard data for a specific competition
 * Fetches contestants, nominees, judges, sponsors, events, announcements, and revenue data
 */
export function useCompetitionDashboard(competitionId) {
  const [data, setData] = useState({
    contestants: [],
    nominees: [],
    judges: [],
    sponsors: [],
    events: [],
    announcements: [],
    revenue: { total: 0, paidVotes: 0, sponsorships: 0, eventTickets: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!competitionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel for better performance
      const [
        contestantsResult,
        nomineesResult,
        judgesResult,
        sponsorsResult,
        eventsResult,
        announcementsResult,
        votesResult,
        competitionResult,
        profilesResult,
      ] = await Promise.all([
        // Contestants ordered by votes (for leaderboard)
        supabase
          .from('contestants')
          .select('*')
          .eq('competition_id', competitionId)
          .order('votes', { ascending: false }),

        // Nominees ordered by creation date
        supabase
          .from('nominees')
          .select('*')
          .eq('competition_id', competitionId)
          .order('created_at', { ascending: false }),

        // Judges ordered by sort_order
        supabase
          .from('judges')
          .select('*')
          .eq('competition_id', competitionId)
          .order('sort_order'),

        // Sponsors ordered by tier and sort_order
        supabase
          .from('sponsors')
          .select('*')
          .eq('competition_id', competitionId)
          .order('sort_order'),

        // Events ordered by date
        supabase
          .from('events')
          .select('*')
          .eq('competition_id', competitionId)
          .order('date'),

        // Announcements ordered by pinned and date
        supabase
          .from('announcements')
          .select('*')
          .eq('competition_id', competitionId)
          .order('pinned', { ascending: false })
          .order('published_at', { ascending: false }),

        // Get vote totals for revenue
        supabase
          .from('votes')
          .select('amount_paid')
          .eq('competition_id', competitionId),

        // Get competition info (if needed later)
        null,

        // Fetch all profiles to match by email for third-party nominations
        supabase
          .from('profiles')
          .select('id, email'),
      ]);

      // Check for errors
      const errors = [
        contestantsResult.error,
        nomineesResult.error,
        judgesResult.error,
        sponsorsResult.error,
        eventsResult.error,
        announcementsResult.error,
        votesResult.error,
        profilesResult?.error,
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error('Errors fetching dashboard data:', errors);
        setError(errors[0]?.message || 'Error fetching data');
      }

      // Create a map of emails to profile IDs for quick lookup
      const emailToProfileMap = new Map();
      (profilesResult?.data || []).forEach((profile) => {
        if (profile.email) {
          emailToProfileMap.set(profile.email.toLowerCase(), profile.id);
        }
      });

      // Transform contestants for leaderboard
      const contestants = (contestantsResult.data || []).map((c, index) => ({
        id: c.id,
        name: c.name,
        age: c.age,
        occupation: c.occupation,
        votes: c.votes || 0,
        status: c.status,
        interests: c.interests || [],
        trend: c.trend || 'same',
        rank: index + 1,
        avatarUrl: c.avatar_url,
        bio: c.bio,
        instagram: c.instagram,
      }));

      // Transform nominees - include all fields for categorization
      const nominees = (nomineesResult.data || []).map((n) => {
        // Determine if nominee has a profile:
        // 1. If they have a user_id, they definitely have a profile
        // 2. If self-nominated, they were logged in so they have a profile
        // 3. If third-party nominated, check if their email matches a profile in the database
        let hasProfile = !!n.user_id;
        let matchedProfileId = n.user_id;

        if (!hasProfile && n.email) {
          // Check if email matches an existing profile
          const emailLower = n.email.toLowerCase();
          if (emailToProfileMap.has(emailLower)) {
            hasProfile = true;
            matchedProfileId = emailToProfileMap.get(emailLower);
          }
        }

        // Self-nominations always indicate they have a profile (they were logged in)
        if (n.nominated_by === 'self' && !hasProfile) {
          // This shouldn't happen in normal flow, but mark it anyway
          hasProfile = true;
        }

        return {
          id: n.id,
          name: n.name,
          email: n.email,
          phone: n.phone,
          instagram: n.instagram,
          occupation: n.occupation,
          bio: n.bio,
          interests: n.interests || [],
          // Nomination source info
          nominatedBy: n.nominated_by, // 'self' or 'third_party'
          nominatorId: n.nominator_id,
          nominatorName: n.nominator_name,
          nominatorEmail: n.nominator_email,
          // Profile link info - use matched profile ID if found
          userId: matchedProfileId,
          hasProfile,
          // Status and completion
          status: n.status,
          age: n.age,
          city: n.city,
          livesNearCity: n.lives_near_city,
          isSingle: n.is_single,
          profileComplete: n.profile_complete,
          // Tracking
          inviteToken: n.invite_token,
          inviteSentAt: n.invite_sent_at,
          convertedToContestantId: n.converted_to_contestant_id,
          createdAt: n.created_at,
          updatedAt: n.updated_at,
        };
      });

      // Transform judges
      const judges = (judgesResult.data || []).map((j) => ({
        id: j.id,
        name: j.name,
        role: j.title || 'Judge',
        bio: j.bio,
        avatarUrl: j.avatar_url,
      }));

      // Transform sponsors and calculate sponsorship revenue
      const sponsors = (sponsorsResult.data || []).map((s) => ({
        id: s.id,
        name: s.name,
        tier: s.tier?.toLowerCase() || 'gold',
        amount: parseFloat(s.amount) || 0,
        logoUrl: s.logo_url,
        websiteUrl: s.website_url,
      }));

      const sponsorshipTotal = sponsors.reduce((sum, s) => sum + s.amount, 0);

      // Transform events
      const events = (eventsResult.data || []).map((e) => ({
        id: e.id,
        name: e.name,
        date: e.date,
        endDate: e.end_date,
        time: e.time,
        venue: e.location,
        location: e.location,
        status: e.status,
        isDoubleVoteDay: e.is_double_vote_day,
        publicVisible: e.public_visible,
      }));

      // Transform announcements
      const announcements = (announcementsResult.data || []).map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        pinned: a.pinned,
        type: a.type,
        date: a.published_at,
        createdAt: a.created_at,
      }));

      // Calculate revenue
      const paidVotes = (votesResult.data || []).reduce(
        (sum, v) => sum + (parseFloat(v.amount_paid) || 0),
        0
      );
      const totalRevenue = paidVotes + sponsorshipTotal;

      const revenue = {
        total: totalRevenue,
        paidVotes: paidVotes,
        sponsorships: sponsorshipTotal,
        eventTickets: 0, // Would need separate tracking for ticket sales
      };

      setData({
        contestants,
        nominees,
        judges,
        sponsors,
        events,
        announcements,
        revenue,
      });
    } catch (err) {
      console.error('Error in useCompetitionDashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refresh function for manual refetch
  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Approve a nominee - updates status and creates a contestant record
  const approveNominee = useCallback(async (nominee) => {
    if (!supabase || !competitionId) return { success: false, error: 'Missing configuration' };

    try {
      // First, update the nominee status to 'approved'
      const { error: updateError } = await supabase
        .from('nominees')
        .update({ status: 'approved' })
        .eq('id', nominee.id);

      if (updateError) throw updateError;

      // Then, create a contestant record from the nominee data
      const contestantData = {
        competition_id: competitionId,
        name: nominee.name,
        email: nominee.email,
        phone: nominee.phone,
        instagram: nominee.instagram,
        age: nominee.age,
        city: nominee.city,
        status: 'active',
        votes: 0,
      };

      const { error: insertError } = await supabase
        .from('contestants')
        .insert(contestantData);

      if (insertError) throw insertError;

      // Refresh data to show updated lists
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      console.error('Error approving nominee:', err);
      return { success: false, error: err.message };
    }
  }, [competitionId, fetchDashboardData]);

  // Reject a nominee - updates status to 'rejected'
  const rejectNominee = useCallback(async (nomineeId) => {
    if (!supabase || !competitionId) return { success: false, error: 'Missing configuration' };

    try {
      const { error: updateError } = await supabase
        .from('nominees')
        .update({ status: 'rejected' })
        .eq('id', nomineeId);

      if (updateError) throw updateError;

      // Refresh data to show updated list
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      console.error('Error rejecting nominee:', err);
      return { success: false, error: err.message };
    }
  }, [competitionId, fetchDashboardData]);

  // Archive a nominee - updates status to 'archived'
  const archiveNominee = useCallback(async (nomineeId) => {
    if (!supabase || !competitionId) return { success: false, error: 'Missing configuration' };

    try {
      const { error: updateError } = await supabase
        .from('nominees')
        .update({ status: 'archived' })
        .eq('id', nomineeId);

      if (updateError) throw updateError;

      // Refresh data to show updated list
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      console.error('Error archiving nominee:', err);
      return { success: false, error: err.message };
    }
  }, [competitionId, fetchDashboardData]);

  // Restore an archived nominee to pending
  const restoreNominee = useCallback(async (nomineeId) => {
    if (!supabase || !competitionId) return { success: false, error: 'Missing configuration' };

    try {
      const { error: updateError } = await supabase
        .from('nominees')
        .update({ status: 'pending' })
        .eq('id', nomineeId);

      if (updateError) throw updateError;

      // Refresh data to show updated list
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      console.error('Error restoring nominee:', err);
      return { success: false, error: err.message };
    }
  }, [competitionId, fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refresh,
    approveNominee,
    rejectNominee,
    archiveNominee,
    restoreNominee,
  };
}

export default useCompetitionDashboard;
