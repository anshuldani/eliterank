import React, { useState, useEffect } from 'react';
import {
  X, Save, Loader, DollarSign, Calendar, Vote, Plus, Trash2,
  AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Settings
} from 'lucide-react';
import { Button } from '../../../components/ui';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../contexts/ToastContext';
import {
  COMPETITION_STATUS,
  STATUS_CONFIG,
  PRICE_BUNDLER_TIERS,
  DEFAULT_VOTING_ROUND,
  calculateVotePrice,
} from '../../../types/competition';

export default function AdvancedSettingsPanel({ competition, onClose, onSave }) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPriceBundlerInfo, setShowPriceBundlerInfo] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    price_per_vote: 1.00,
    use_price_bundler: false,
    nomination_start: '',
    nomination_end: '',
    finale_date: '',
    allow_manual_votes: false,
  });

  // Voting rounds state
  const [votingRounds, setVotingRounds] = useState([]);

  // Status state (separate from settings)
  const [status, setStatus] = useState(competition?.status || COMPETITION_STATUS.DRAFT);

  // Validation errors
  const [errors, setErrors] = useState([]);

  // Fetch settings on mount
  useEffect(() => {
    if (competition?.id) {
      fetchSettings();
    }
  }, [competition?.id]);

  const fetchSettings = async () => {
    if (!supabase || !competition?.id) return;

    setLoading(true);
    try {
      // Fetch competition settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('competition_settings')
        .select('*')
        .eq('competition_id', competition.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      // Fetch voting rounds
      const { data: roundsData, error: roundsError } = await supabase
        .from('voting_rounds')
        .select('*')
        .eq('competition_id', competition.id)
        .order('round_order');

      if (roundsError) throw roundsError;

      if (settingsData) {
        setSettings({
          price_per_vote: settingsData.price_per_vote || 1.00,
          use_price_bundler: settingsData.use_price_bundler || false,
          nomination_start: settingsData.nomination_start || '',
          nomination_end: settingsData.nomination_end || '',
          finale_date: settingsData.finale_date || '',
          allow_manual_votes: settingsData.allow_manual_votes || false,
        });
      }

      setVotingRounds(roundsData || []);
      setStatus(competition.status);
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Validate dates
  const validateDates = () => {
    const validationErrors = [];
    const nomStart = settings.nomination_start ? new Date(settings.nomination_start) : null;
    const nomEnd = settings.nomination_end ? new Date(settings.nomination_end) : null;
    const finale = settings.finale_date ? new Date(settings.finale_date) : null;

    // Nomination dates
    if (nomStart && nomEnd && nomEnd <= nomStart) {
      validationErrors.push('Nomination end must be after nomination start');
    }

    // Check voting rounds
    let prevRoundEnd = nomEnd;
    votingRounds.forEach((round, index) => {
      const roundStart = round.start_date ? new Date(round.start_date) : null;
      const roundEnd = round.end_date ? new Date(round.end_date) : null;

      if (roundStart && roundEnd && roundEnd <= roundStart) {
        validationErrors.push(`Round ${index + 1}: End date must be after start date`);
      }

      if (prevRoundEnd && roundStart && roundStart < prevRoundEnd) {
        validationErrors.push(`Round ${index + 1}: Starts before previous round ends`);
      }

      prevRoundEnd = roundEnd;
    });

    // Finale date
    if (finale && prevRoundEnd && finale < prevRoundEnd) {
      validationErrors.push('Finale date must be after the last voting round ends');
    }

    // Status validation
    if (status === COMPETITION_STATUS.LIVE) {
      if (!settings.nomination_start || !settings.nomination_end) {
        validationErrors.push('Nomination dates are required for Live status');
      }
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  // Save settings
  const handleSave = async () => {
    if (!validateDates()) {
      toast.error('Please fix the validation errors before saving');
      return;
    }

    setSaving(true);
    try {
      // Update competition status
      const { error: compError } = await supabase
        .from('competitions')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', competition.id);

      if (compError) throw compError;

      // Update or insert settings
      const { error: settingsError } = await supabase
        .from('competition_settings')
        .upsert({
          competition_id: competition.id,
          price_per_vote: settings.price_per_vote,
          use_price_bundler: settings.use_price_bundler,
          nomination_start: settings.nomination_start || null,
          nomination_end: settings.nomination_end || null,
          finale_date: settings.finale_date || null,
          allow_manual_votes: settings.allow_manual_votes,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'competition_id' });

      if (settingsError) throw settingsError;

      // Delete existing voting rounds and re-insert
      await supabase
        .from('voting_rounds')
        .delete()
        .eq('competition_id', competition.id);

      if (votingRounds.length > 0) {
        const roundsToInsert = votingRounds.map((round, index) => ({
          competition_id: competition.id,
          title: round.title || `Round ${index + 1}`,
          round_order: index + 1,
          start_date: round.start_date || null,
          end_date: round.end_date || null,
          contestants_advance: round.contestants_advance || 10,
        }));

        const { error: roundsError } = await supabase
          .from('voting_rounds')
          .insert(roundsToInsert);

        if (roundsError) throw roundsError;
      }

      toast.success('Settings saved successfully');
      if (onSave) onSave();
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Add voting round
  const addVotingRound = () => {
    setVotingRounds(prev => [
      ...prev,
      {
        ...DEFAULT_VOTING_ROUND,
        title: `Round ${prev.length + 1}`,
        round_order: prev.length + 1,
      }
    ]);
  };

  // Remove voting round
  const removeVotingRound = (index) => {
    setVotingRounds(prev => prev.filter((_, i) => i !== index));
  };

  // Update voting round
  const updateVotingRound = (index, field, value) => {
    setVotingRounds(prev =>
      prev.map((round, i) =>
        i === index ? { ...round, [field]: value } : round
      )
    );
  };

  // Format date for input
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  // Styles
  const sectionStyle = {
    background: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  };

  const labelStyle = {
    display: 'block',
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  };

  const inputStyle = {
    width: '100%',
    padding: spacing.md,
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.md,
    color: '#fff',
    fontSize: typography.fontSize.md,
    outline: 'none',
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
          <p style={{ marginTop: spacing.md, color: colors.text.secondary }}>Loading settings...</p>
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
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          border: `1px solid ${colors.border.light}`,
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
          position: 'sticky',
          top: 0,
          background: colors.background.card,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Settings size={24} style={{ color: colors.gold.primary }} />
            <div>
              <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                Advanced Settings
              </h3>
              <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted }}>
                {competition?.organization?.name} - {competition?.city?.name} {competition?.season}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: colors.text.secondary, cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: spacing.xl }}>
          {/* Validation Errors */}
          {errors.length > 0 && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              marginBottom: spacing.lg,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                <span style={{ color: '#ef4444', fontWeight: typography.fontWeight.medium }}>Validation Errors</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: spacing.lg }}>
                {errors.map((error, i) => (
                  <li key={i} style={{ color: '#ef4444', fontSize: typography.fontSize.sm }}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Status Section */}
          <div style={sectionStyle}>
            <h4 style={{ fontSize: typography.fontSize.md, marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <Vote size={18} />
              Competition Status
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    background: status === key ? config.bg : 'transparent',
                    border: `1px solid ${status === key ? config.color : colors.border.light}`,
                    borderRadius: borderRadius.md,
                    color: status === key ? config.color : colors.text.muted,
                    fontSize: typography.fontSize.sm,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: spacing.xs,
                    minWidth: '100px',
                  }}
                >
                  <span style={{ fontWeight: typography.fontWeight.medium }}>{config.label}</span>
                  <span style={{ fontSize: typography.fontSize.xs, opacity: 0.7 }}>{config.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div style={sectionStyle}>
            <h4 style={{ fontSize: typography.fontSize.md, marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <DollarSign size={18} />
              Vote Pricing
            </h4>

            {/* Price per vote */}
            <div style={{ marginBottom: spacing.lg }}>
              <label style={labelStyle}>Base Price Per Vote</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <span style={{ color: colors.text.muted }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.price_per_vote}
                  onChange={(e) => setSettings(prev => ({ ...prev, price_per_vote: parseFloat(e.target.value) || 0 }))}
                  style={{ ...inputStyle, maxWidth: '120px' }}
                />
              </div>
            </div>

            {/* Price bundler toggle */}
            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: spacing.md, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.use_price_bundler}
                  onChange={(e) => setSettings(prev => ({ ...prev, use_price_bundler: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: colors.gold.primary }}
                />
                <span>Enable Price Bundler (volume discounts)</span>
              </label>
            </div>

            {/* Show bundler tiers */}
            {settings.use_price_bundler && (
              <div>
                <button
                  onClick={() => setShowPriceBundlerInfo(!showPriceBundlerInfo)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.gold.primary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  {showPriceBundlerInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  View pricing tiers
                </button>
                {showPriceBundlerInfo && (
                  <div style={{
                    marginTop: spacing.md,
                    background: colors.background.card,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.fontSize.sm }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${colors.border.light}` }}>
                          <th style={{ padding: spacing.sm, textAlign: 'left', color: colors.text.muted }}>Votes</th>
                          <th style={{ padding: spacing.sm, textAlign: 'center', color: colors.text.muted }}>Discount</th>
                          <th style={{ padding: spacing.sm, textAlign: 'right', color: colors.text.muted }}>Price/Vote</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PRICE_BUNDLER_TIERS.map((tier, i) => (
                          <tr key={i}>
                            <td style={{ padding: spacing.sm }}>
                              {tier.minVotes === tier.maxVotes ? tier.minVotes : `${tier.minVotes}-${tier.maxVotes}`}
                            </td>
                            <td style={{ padding: spacing.sm, textAlign: 'center', color: colors.gold.primary }}>
                              {tier.discount}% off
                            </td>
                            <td style={{ padding: spacing.sm, textAlign: 'right' }}>
                              ${(settings.price_per_vote * tier.pricePerVote).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div style={sectionStyle}>
            <h4 style={{ fontSize: typography.fontSize.md, marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <Calendar size={18} />
              Timeline
            </h4>

            {/* Nomination dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
              <div>
                <label style={labelStyle}>Nomination Start</label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(settings.nomination_start)}
                  onChange={(e) => setSettings(prev => ({ ...prev, nomination_start: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Nomination End</label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(settings.nomination_end)}
                  onChange={(e) => setSettings(prev => ({ ...prev, nomination_end: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Voting Rounds */}
            <div style={{ marginBottom: spacing.lg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Voting Rounds</label>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={addVotingRound}
                >
                  Add Round
                </Button>
              </div>

              {votingRounds.length === 0 ? (
                <p style={{ color: colors.text.muted, fontSize: typography.fontSize.sm }}>
                  No voting rounds configured. Add one to define the voting schedule.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  {votingRounds.map((round, index) => (
                    <div
                      key={index}
                      style={{
                        background: colors.background.card,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        border: `1px solid ${colors.border.light}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                        <input
                          type="text"
                          value={round.title}
                          onChange={(e) => updateVotingRound(index, 'title', e.target.value)}
                          placeholder={`Round ${index + 1}`}
                          style={{
                            ...inputStyle,
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            fontWeight: typography.fontWeight.medium,
                            maxWidth: '200px',
                          }}
                        />
                        <button
                          onClick={() => removeVotingRound(index)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: 'none',
                            borderRadius: borderRadius.sm,
                            padding: spacing.xs,
                            cursor: 'pointer',
                            color: '#ef4444',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: spacing.sm }}>
                        <div>
                          <label style={{ ...labelStyle, fontSize: typography.fontSize.xs }}>Start</label>
                          <input
                            type="datetime-local"
                            value={formatDateForInput(round.start_date)}
                            onChange={(e) => updateVotingRound(index, 'start_date', e.target.value)}
                            style={{ ...inputStyle, fontSize: typography.fontSize.sm, padding: spacing.sm }}
                          />
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: typography.fontSize.xs }}>End</label>
                          <input
                            type="datetime-local"
                            value={formatDateForInput(round.end_date)}
                            onChange={(e) => updateVotingRound(index, 'end_date', e.target.value)}
                            style={{ ...inputStyle, fontSize: typography.fontSize.sm, padding: spacing.sm }}
                          />
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: typography.fontSize.xs }}>Advance</label>
                          <input
                            type="number"
                            min="1"
                            value={round.contestants_advance}
                            onChange={(e) => updateVotingRound(index, 'contestants_advance', parseInt(e.target.value) || 1)}
                            style={{ ...inputStyle, fontSize: typography.fontSize.sm, padding: spacing.sm }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Finale date */}
            <div>
              <label style={labelStyle}>Finale Date</label>
              <input
                type="datetime-local"
                value={formatDateForInput(settings.finale_date)}
                onChange={(e) => setSettings(prev => ({ ...prev, finale_date: e.target.value }))}
                style={{ ...inputStyle, maxWidth: '300px' }}
              />
              <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, marginTop: spacing.xs }}>
                Competition will auto-complete after this date
              </p>
            </div>
          </div>

          {/* Additional Settings */}
          <div style={sectionStyle}>
            <h4 style={{ fontSize: typography.fontSize.md, marginBottom: spacing.md }}>
              Additional Settings
            </h4>

            <label style={{ display: 'flex', alignItems: 'center', gap: spacing.md, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.allow_manual_votes}
                onChange={(e) => setSettings(prev => ({ ...prev, allow_manual_votes: e.target.checked }))}
                style={{ width: 18, height: 18, accentColor: colors.gold.primary }}
              />
              <div>
                <span>Allow Manual Votes</span>
                <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, marginTop: spacing.xs }}>
                  Host can add manual votes (tracked separately from public votes)
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: spacing.xl,
          borderTop: `1px solid ${colors.border.light}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: spacing.md,
          position: 'sticky',
          bottom: 0,
          background: colors.background.card,
        }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            icon={Save}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
