import React, { useState, useEffect } from 'react';
import { Crown, Check, X, AlertCircle, User, MapPin, Calendar, Loader } from 'lucide-react';
import { Button } from '../../../components/ui';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../contexts/ToastContext';

/**
 * ClaimCompletionPage
 *
 * Shown after user clicks magic link from email.
 * Allows them to Accept or Reject the nomination.
 *
 * Flow:
 * - Accept → Mark as claimed, check profile completeness, redirect accordingly
 * - Reject → Mark nomination as rejected, redirect to explore page
 */
export default function ClaimCompletionPage({
  token,
  onAccept,
  onReject,
  onClose,
  user,
  profile
}) {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [nominee, setNominee] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Fetch nominee and competition data
  useEffect(() => {
    const fetchNomination = async () => {
      if (!token) {
        setError('Invalid nomination link');
        setLoading(false);
        return;
      }

      // Wait for user to be authenticated (from magic link)
      if (!user) {
        // Give auth a moment to process the magic link
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check session again
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Please sign in to claim your nomination. Check your email for the magic link.');
          setLoading(false);
          return;
        }
      }

      try {
        // Fetch nominee by invite token
        const { data: nomineeData, error: nomineeError } = await supabase
          .from('nominees')
          .select(`
            *,
            competition:competitions(
              id,
              city,
              season,
              status,
              nomination_start,
              nomination_end,
              organization:organizations(name, logo_url, slug)
            )
          `)
          .eq('invite_token', token)
          .single();

        if (nomineeError || !nomineeData) {
          setError('Nomination not found. This link may be invalid or expired.');
          setLoading(false);
          return;
        }

        // Check if already claimed and converted
        if (nomineeData.converted_to_contestant) {
          setError('This nomination has already been claimed and converted to a contestant entry.');
          setLoading(false);
          return;
        }

        // Check if already rejected
        if (nomineeData.status === 'rejected') {
          setError('This nomination was previously declined.');
          setLoading(false);
          return;
        }

        // Check if nomination period ended
        const comp = nomineeData.competition;
        if (comp?.nomination_end) {
          const endDate = new Date(comp.nomination_end);
          if (new Date() > endDate) {
            setError('Sorry, the nomination period for this competition has ended.');
            setLoading(false);
            return;
          }
        }

        setNominee(nomineeData);
        setCompetition(comp);
      } catch (err) {
        console.error('Error fetching nomination:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNomination();
  }, [token, user]);

  // Handle Accept nomination
  const handleAccept = async () => {
    setProcessing(true);

    try {
      // Update nominee record - mark as claimed
      const { error: updateError } = await supabase
        .from('nominees')
        .update({
          claimed_at: new Date().toISOString(),
          user_id: user?.id,
        })
        .eq('invite_token', token);

      if (updateError) throw updateError;

      // Check if profile is complete
      const isProfileComplete = checkProfileComplete(profile);

      toast.success('Nomination accepted!');

      // Call onAccept with profile completion status and nominee data
      onAccept?.({
        nominee,
        competition,
        needsProfileCompletion: !isProfileComplete,
      });
    } catch (err) {
      console.error('Error accepting nomination:', err);
      toast.error('Failed to accept nomination. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Reject nomination
  const handleReject = async () => {
    setProcessing(true);

    try {
      // Update nominee status to rejected
      const { error: updateError } = await supabase
        .from('nominees')
        .update({
          status: 'rejected',
          user_id: user?.id,
        })
        .eq('invite_token', token);

      if (updateError) throw updateError;

      toast.success('Nomination declined');
      onReject?.();
    } catch (err) {
      console.error('Error rejecting nomination:', err);
      toast.error('Failed to decline nomination. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Check if user profile has required fields
  const checkProfileComplete = (profile) => {
    if (!profile) return false;

    const hasName = profile.first_name && profile.last_name;
    const hasImage = profile.avatar_url;
    const hasBio = profile.bio && profile.bio.trim().length > 0;
    const hasCity = profile.city && profile.city.trim().length > 0;

    return hasName && hasImage && hasBio && hasCity;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(212, 175, 55, 0.2)',
            borderTopColor: colors.gold.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: colors.text.secondary }}>Loading your nomination...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        padding: spacing.xl,
      }}>
        <div style={{
          maxWidth: '400px',
          textAlign: 'center',
          background: colors.background.card,
          border: `1px solid ${colors.border.light}`,
          borderRadius: borderRadius.xl,
          padding: spacing.xxxl,
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <AlertCircle size={32} style={{ color: colors.status.error }} />
          </div>
          <h2 style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: '#fff',
            marginBottom: spacing.md,
          }}>
            {error.includes('sign in') ? 'Authentication Required' : 'Oops!'}
          </h2>
          <p style={{
            fontSize: typography.fontSize.md,
            color: colors.text.secondary,
            marginBottom: spacing.xl,
            lineHeight: 1.6,
          }}>
            {error}
          </p>
          <Button variant="secondary" onClick={onClose}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // Nominator display
  const nominatorDisplay = nominee.nominator_anonymous
    ? 'Someone special'
    : (nominee.nominator_name || 'Someone');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      padding: spacing.xl,
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
          padding: spacing.xl,
          textAlign: 'center',
          borderBottom: `1px solid ${colors.border.light}`,
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Crown size={36} style={{ color: colors.gold.primary }} />
          </div>
          <h1 style={{
            fontSize: typography.fontSize.xxl,
            fontWeight: typography.fontWeight.bold,
            color: '#fff',
            marginBottom: spacing.sm,
          }}>
            Confirm Your Nomination
          </h1>
          <p style={{
            fontSize: typography.fontSize.lg,
            color: colors.gold.primary,
          }}>
            Most Eligible {competition?.city} {competition?.season}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: spacing.xl }}>
          {/* Nomination details */}
          <div style={{
            background: colors.background.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              marginBottom: spacing.md,
            }}>
              <User size={16} style={{ color: colors.gold.primary }} />
              <span style={{ fontSize: typography.fontSize.sm, color: colors.text.muted }}>
                Nominated by
              </span>
            </div>
            <p style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
              {nominatorDisplay}
            </p>

            {nominee.nomination_reason && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  marginBottom: spacing.sm,
                  marginTop: spacing.lg,
                }}>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.text.muted }}>
                    Why they nominated you:
                  </span>
                </div>
                <p style={{
                  fontSize: typography.fontSize.md,
                  color: colors.text.primary,
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  padding: spacing.md,
                  background: 'rgba(212, 175, 55, 0.05)',
                  borderRadius: borderRadius.md,
                  borderLeft: `3px solid ${colors.gold.primary}`,
                }}>
                  "{nominee.nomination_reason}"
                </p>
              </>
            )}
          </div>

          {/* Competition info */}
          <div style={{
            display: 'flex',
            gap: spacing.lg,
            marginBottom: spacing.xl,
            padding: spacing.md,
            background: 'rgba(255,255,255,0.02)',
            borderRadius: borderRadius.md,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <MapPin size={14} style={{ color: colors.text.muted }} />
              <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                {competition?.city}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <Calendar size={14} style={{ color: colors.text.muted }} />
              <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                {competition?.season}
              </span>
            </div>
          </div>

          {/* Info text */}
          <p style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginBottom: spacing.xl,
            lineHeight: 1.6,
            textAlign: 'center',
          }}>
            By accepting, you'll be entered into the competition pending admin approval.
            {!checkProfileComplete(profile) && (
              <span style={{ display: 'block', marginTop: spacing.sm, color: colors.gold.primary }}>
                You'll need to complete your profile to finalize your entry.
              </span>
            )}
          </p>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: spacing.md,
          }}>
            <Button
              variant="secondary"
              onClick={handleReject}
              disabled={processing}
              style={{ flex: 1 }}
            >
              {processing ? (
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <X size={18} style={{ marginRight: spacing.xs }} />
                  Decline
                </>
              )}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={processing}
              style={{ flex: 1 }}
            >
              {processing ? (
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <Check size={18} style={{ marginRight: spacing.xs }} />
                  Accept
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
