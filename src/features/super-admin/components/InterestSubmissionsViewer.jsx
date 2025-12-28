import React, { useState, useEffect } from 'react';
import {
  X, Loader, Mail, Phone, User, Calendar, Filter, Download,
  Building2, DollarSign, Trophy, Award, CheckCircle, XCircle,
  MessageSquare, ExternalLink, ChevronDown
} from 'lucide-react';
import { Button } from '../../../components/ui';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../contexts/ToastContext';
import { INTEREST_TYPE, INTEREST_TYPE_CONFIG } from '../../../types/competition';

const INTEREST_ICONS = {
  [INTEREST_TYPE.HOSTING]: Building2,
  [INTEREST_TYPE.SPONSORING]: DollarSign,
  [INTEREST_TYPE.COMPETING]: Trophy,
  [INTEREST_TYPE.JUDGING]: Award,
};

const INTEREST_COLORS = {
  [INTEREST_TYPE.HOSTING]: '#8b5cf6',
  [INTEREST_TYPE.SPONSORING]: '#22c55e',
  [INTEREST_TYPE.COMPETING]: '#f59e0b',
  [INTEREST_TYPE.JUDGING]: '#3b82f6',
};

export default function InterestSubmissionsViewer({ competition, onClose }) {
  const toast = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch submissions on mount
  useEffect(() => {
    if (competition?.id) {
      fetchSubmissions();
    }
  }, [competition?.id]);

  const fetchSubmissions = async () => {
    if (!supabase || !competition?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interest_submissions')
        .select('*')
        .eq('competition_id', competition.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  // Update submission status
  const updateSubmissionStatus = async (submissionId, status) => {
    try {
      const { error } = await supabase
        .from('interest_submissions')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`Submission marked as ${status}`);
      fetchSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error updating submission:', err);
      toast.error('Failed to update submission');
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !sub.status || sub.status === 'pending';
    if (filter === 'approved') return sub.status === 'approved';
    if (filter === 'rejected') return sub.status === 'rejected';
    return sub.interest_type === filter;
  });

  // Count by type
  const counts = {
    all: submissions.length,
    [INTEREST_TYPE.HOSTING]: submissions.filter(s => s.interest_type === INTEREST_TYPE.HOSTING).length,
    [INTEREST_TYPE.SPONSORING]: submissions.filter(s => s.interest_type === INTEREST_TYPE.SPONSORING).length,
    [INTEREST_TYPE.COMPETING]: submissions.filter(s => s.interest_type === INTEREST_TYPE.COMPETING).length,
    [INTEREST_TYPE.JUDGING]: submissions.filter(s => s.interest_type === INTEREST_TYPE.JUDGING).length,
    pending: submissions.filter(s => !s.status || s.status === 'pending').length,
  };

  // Export to CSV
  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Phone', 'Interest Type', 'Message', 'Status', 'Submitted At'];
    const rows = filteredSubmissions.map(sub => [
      sub.name,
      sub.email,
      sub.phone || '',
      INTEREST_TYPE_CONFIG[sub.interest_type]?.label || sub.interest_type,
      sub.message || '',
      sub.status || 'pending',
      new Date(sub.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interest-submissions-${competition.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Submissions exported successfully');
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Styles
  const cardStyle = {
    background: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    cursor: 'pointer',
    border: `1px solid transparent`,
    transition: 'border-color 0.2s',
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          background: colors.background.card,
          borderRadius: borderRadius.xxl,
          padding: spacing.xxxl,
          textAlign: 'center',
        }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: colors.gold.primary }} />
          <p style={{ marginTop: spacing.md, color: colors.text.secondary }}>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: spacing.xl,
    }} onClick={onClose}>
      <div
        style={{
          background: colors.background.card,
          borderRadius: borderRadius.xxl,
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
          border: `1px solid ${colors.border.light}`,
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: spacing.xl,
          borderBottom: `1px solid ${colors.border.light}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              Interest Submissions
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.text.muted }}>
              {competition?.organization?.name} - {competition?.city?.name} {competition?.season}
            </p>
          </div>
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={exportToCsv}
              disabled={filteredSubmissions.length === 0}
            >
              Export CSV
            </Button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: colors.text.secondary, cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          padding: `${spacing.md} ${spacing.xl}`,
          borderBottom: `1px solid ${colors.border.light}`,
          display: 'flex',
          gap: spacing.sm,
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              background: filter === 'all' ? 'rgba(212,175,55,0.2)' : 'transparent',
              border: `1px solid ${filter === 'all' ? colors.gold.primary : colors.border.light}`,
              borderRadius: borderRadius.md,
              color: filter === 'all' ? colors.gold.primary : colors.text.muted,
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              whiteSpace: 'nowrap',
            }}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              background: filter === 'pending' ? 'rgba(212,175,55,0.2)' : 'transparent',
              border: `1px solid ${filter === 'pending' ? colors.gold.primary : colors.border.light}`,
              borderRadius: borderRadius.md,
              color: filter === 'pending' ? colors.gold.primary : colors.text.muted,
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              whiteSpace: 'nowrap',
            }}
          >
            Pending ({counts.pending})
          </button>
          {Object.entries(INTEREST_TYPE).map(([key, value]) => {
            const Icon = INTEREST_ICONS[value];
            const color = INTEREST_COLORS[value];
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  background: filter === value ? `${color}20` : 'transparent',
                  border: `1px solid ${filter === value ? color : colors.border.light}`,
                  borderRadius: borderRadius.md,
                  color: filter === value ? color : colors.text.muted,
                  cursor: 'pointer',
                  fontSize: typography.fontSize.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                {INTEREST_TYPE_CONFIG[value]?.label} ({counts[value]})
              </button>
            );
          })}
        </div>

        {/* Submissions List */}
        <div style={{ flex: 1, overflow: 'auto', padding: spacing.xl }}>
          {filteredSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: spacing.xxxl }}>
              <Mail size={48} style={{ color: colors.text.muted, marginBottom: spacing.md }} />
              <h4 style={{ fontSize: typography.fontSize.lg, marginBottom: spacing.sm }}>No Submissions</h4>
              <p style={{ color: colors.text.secondary }}>
                {filter === 'all'
                  ? 'No one has submitted an interest form yet.'
                  : 'No submissions match the selected filter.'}
              </p>
            </div>
          ) : (
            filteredSubmissions.map(sub => {
              const Icon = INTEREST_ICONS[sub.interest_type] || User;
              const color = INTEREST_COLORS[sub.interest_type] || colors.text.muted;

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  style={{
                    ...cardStyle,
                    borderColor: selectedSubmission?.id === sub.id ? colors.gold.primary : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md }}>
                    {/* Icon */}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.md,
                      background: `${color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} style={{ color }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                        <span style={{ fontWeight: typography.fontWeight.medium }}>{sub.name}</span>
                        <span style={{
                          fontSize: typography.fontSize.xs,
                          padding: `2px ${spacing.xs}`,
                          background: `${color}20`,
                          color,
                          borderRadius: borderRadius.sm,
                        }}>
                          {INTEREST_TYPE_CONFIG[sub.interest_type]?.label}
                        </span>
                        {sub.status === 'approved' && (
                          <CheckCircle size={14} style={{ color: '#22c55e' }} />
                        )}
                        {sub.status === 'rejected' && (
                          <XCircle size={14} style={{ color: '#ef4444' }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, fontSize: typography.fontSize.sm, color: colors.text.muted }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                          <Mail size={12} />
                          {sub.email}
                        </span>
                        {sub.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                            <Phone size={12} />
                            {sub.phone}
                          </span>
                        )}
                      </div>
                      {sub.message && (
                        <p style={{
                          marginTop: spacing.sm,
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {sub.message}
                        </p>
                      )}
                    </div>

                    {/* Date & Actions */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: typography.fontSize.xs, color: colors.text.muted }}>
                        {formatDate(sub.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        {selectedSubmission && (
          <div style={{
            borderTop: `1px solid ${colors.border.light}`,
            padding: spacing.xl,
            background: colors.background.secondary,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
              <div>
                <h4 style={{ fontSize: typography.fontSize.md, marginBottom: spacing.xs }}>
                  {selectedSubmission.name}
                </h4>
                <div style={{ display: 'flex', gap: spacing.lg, fontSize: typography.fontSize.sm }}>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    style={{ color: colors.gold.primary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: spacing.xs }}
                  >
                    <Mail size={14} />
                    {selectedSubmission.email}
                  </a>
                  {selectedSubmission.phone && (
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      style={{ color: colors.gold.primary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: spacing.xs }}
                    >
                      <Phone size={14} />
                      {selectedSubmission.phone}
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{ background: 'none', border: 'none', color: colors.text.muted, cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {selectedSubmission.message && (
              <div style={{
                background: colors.background.card,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                  <MessageSquare size={14} style={{ color: colors.text.muted }} />
                  <span style={{ fontSize: typography.fontSize.xs, color: colors.text.muted }}>Message</span>
                </div>
                <p style={{ fontSize: typography.fontSize.sm, whiteSpace: 'pre-wrap' }}>
                  {selectedSubmission.message}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: spacing.md }}>
              <Button
                variant="secondary"
                icon={XCircle}
                onClick={() => updateSubmissionStatus(selectedSubmission.id, 'rejected')}
                style={{ flex: 1 }}
              >
                Reject
              </Button>
              <Button
                icon={CheckCircle}
                onClick={() => updateSubmissionStatus(selectedSubmission.id, 'approved')}
                style={{ flex: 1 }}
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
