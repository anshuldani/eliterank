import React, { useState } from 'react';
import {
  Crown, ArrowLeft, Shield, LayoutDashboard, Users, MessageSquare, Settings,
  User, Eye, DollarSign, Vote, Calendar, Trophy, Edit2, Save, X,
  Plus, Trash2, Check, AlertTriangle, ChevronDown, MapPin
} from 'lucide-react';
import { Button, Badge } from '../../../components/ui';
import { colors, spacing, borderRadius, typography, gradients } from '../../../styles/theme';

// Mock data for the competition
const getMockData = (competitionId) => {
  if (competitionId === '1') {
    return {
      contestants: [
        { id: 'c1', name: 'Marcus Thompson', age: 28, occupation: 'Investment Banker', votes: 847, status: 'approved' },
        { id: 'c2', name: 'James Wilson', age: 31, occupation: 'Tech Entrepreneur', votes: 623, status: 'approved' },
        { id: 'c3', name: 'Michael Chen', age: 27, occupation: 'Architect', votes: 512, status: 'approved' },
        { id: 'c4', name: 'David Rodriguez', age: 29, occupation: 'Doctor', votes: 445, status: 'pending' },
      ],
      nominees: [
        { id: 'n1', name: 'Chris Taylor', nominatedBy: 'Anonymous', status: 'new' },
        { id: 'n2', name: 'Kevin Park', nominatedBy: 'Sarah M.', status: 'pending' },
      ],
      events: [
        { id: 'e1', name: 'Opening Gala', date: '2026-02-14', status: 'scheduled' },
        { id: 'e2', name: 'Talent Showcase', date: '2026-02-28', status: 'scheduled' },
        { id: 'e3', name: 'Final Event', date: '2026-03-15', status: 'draft' },
      ],
      judges: [
        { id: 'j1', name: 'Sarah Mitchell', role: 'Head Judge', bio: 'Fashion industry veteran' },
        { id: 'j2', name: 'Robert Chen', role: 'Judge', bio: 'Celebrity matchmaker' },
      ],
      announcements: [
        { id: 'a1', title: 'Voting is now open!', content: 'Cast your votes for your favorite contestants.', pinned: true },
        { id: 'a2', title: 'Event reminder', content: 'Opening Gala is next week!', pinned: false },
      ],
      revenue: { total: 125500, votes: 42500, sponsorships: 63000, tickets: 20000 },
    };
  }
  return {
    contestants: [],
    nominees: [],
    events: [],
    judges: [],
    announcements: [],
    revenue: { total: 0, votes: 0, sponsorships: 0, tickets: 0 },
  };
};

const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'nominations', label: 'Nominations', icon: Users },
  { id: 'community', label: 'Community', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Host Profile', icon: User },
];

export default function SuperAdminCompetitionDashboard({ competition, onBack, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(getMockData(competition.id));
  const [editingSettings, setEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...competition });

  const handleSaveSettings = () => {
    // In a real app, this would update the competition
    setEditingSettings(false);
  };

  const handleOverrideContestant = (contestantId, updates) => {
    setData(prev => ({
      ...prev,
      contestants: prev.contestants.map(c =>
        c.id === contestantId ? { ...c, ...updates } : c
      )
    }));
  };

  const handleDeleteContestant = (contestantId) => {
    setData(prev => ({
      ...prev,
      contestants: prev.contestants.filter(c => c.id !== contestantId)
    }));
  };

  const renderOverview = () => (
    <div>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.xl, marginBottom: spacing.xxxl }}>
        {[
          { label: 'Total Revenue', value: `$${data.revenue.total.toLocaleString()}`, icon: DollarSign, color: '#22c55e' },
          { label: 'Vote Revenue', value: `$${data.revenue.votes.toLocaleString()}`, icon: Vote, color: '#8b5cf6' },
          { label: 'Contestants', value: data.contestants.length, icon: Users, color: '#3b82f6' },
          { label: 'Events', value: data.events.length, icon: Calendar, color: '#f59e0b' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: colors.background.card,
            border: `1px solid ${colors.border.light}`,
            borderRadius: borderRadius.xl,
            padding: spacing.xl,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
              <stat.icon size={20} style={{ color: stat.color }} />
              <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>{stat.label}</span>
            </div>
            <p style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Competition Settings with Edit */}
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.xl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Competition Settings
          </h3>
          {!editingSettings ? (
            <Button variant="secondary" size="sm" icon={Edit2} onClick={() => setEditingSettings(true)}>
              Edit Settings
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Button variant="secondary" size="sm" icon={X} onClick={() => setEditingSettings(false)}>
                Cancel
              </Button>
              <Button size="sm" icon={Save} onClick={handleSaveSettings}>
                Save
              </Button>
            </div>
          )}
        </div>

        {!editingSettings ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.lg }}>
            <div>
              <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, marginBottom: spacing.xs }}>Vote Price</p>
              <p style={{ fontWeight: typography.fontWeight.medium, color: '#22c55e' }}>${competition.votePrice?.toFixed(2)}</p>
            </div>
            <div>
              <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, marginBottom: spacing.xs }}>Max Contestants</p>
              <p style={{ fontWeight: typography.fontWeight.medium }}>{competition.maxContestants}</p>
            </div>
            <div>
              <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, marginBottom: spacing.xs }}>Winners</p>
              <p style={{ fontWeight: typography.fontWeight.medium }}>{competition.numberOfWinners}</p>
            </div>
            <div>
              <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, marginBottom: spacing.xs }}>Selection</p>
              <p style={{ fontWeight: typography.fontWeight.medium }}>{competition.selectionCriteria}</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.lg }}>
            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.xs, color: colors.text.muted, marginBottom: spacing.xs }}>Vote Price ($)</label>
              <input
                type="number"
                step="0.25"
                value={tempSettings.votePrice}
                onChange={(e) => setTempSettings({ ...tempSettings, votePrice: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  background: colors.background.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.md,
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.xs, color: colors.text.muted, marginBottom: spacing.xs }}>Max Contestants</label>
              <input
                type="number"
                value={tempSettings.maxContestants}
                onChange={(e) => setTempSettings({ ...tempSettings, maxContestants: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  background: colors.background.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.md,
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.xs, color: colors.text.muted, marginBottom: spacing.xs }}>Winners</label>
              <input
                type="number"
                value={tempSettings.numberOfWinners}
                onChange={(e) => setTempSettings({ ...tempSettings, numberOfWinners: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  background: colors.background.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.md,
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.xs, color: colors.text.muted, marginBottom: spacing.xs }}>Selection</label>
              <select
                value={tempSettings.selectionCriteria}
                onChange={(e) => setTempSettings({ ...tempSettings, selectionCriteria: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  background: colors.background.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.md,
                  color: '#fff',
                }}
              >
                <option value="votes">Public Votes</option>
                <option value="judges">Judges Only</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Contestant Leaderboard
          </h3>
          <Badge variant="purple" size="sm">
            <Shield size={12} /> Admin Override Available
          </Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {data.contestants.sort((a, b) => b.votes - a.votes).map((contestant, index) => (
            <div
              key={contestant.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.lg,
                padding: spacing.lg,
                background: colors.background.secondary,
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.border.light}`,
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                background: index < 3 ? 'linear-gradient(135deg, #d4af37, #f4d03f)' : colors.background.card,
                borderRadius: borderRadius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: typography.fontWeight.bold,
                color: index < 3 ? '#000' : colors.text.secondary,
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: typography.fontWeight.medium }}>{contestant.name}</p>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{contestant.occupation}</p>
              </div>
              <div style={{ textAlign: 'right', marginRight: spacing.lg }}>
                <p style={{ fontWeight: typography.fontWeight.bold, color: '#22c55e' }}>{contestant.votes} votes</p>
                <Badge variant={contestant.status === 'approved' ? 'success' : 'warning'} size="sm">
                  {contestant.status}
                </Badge>
              </div>
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <select
                  value={contestant.status}
                  onChange={(e) => handleOverrideContestant(contestant.id, { status: e.target.value })}
                  style={{
                    padding: spacing.sm,
                    background: colors.background.card,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: borderRadius.md,
                    color: '#fff',
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => handleDeleteContestant(contestant.id)}
                  style={{
                    padding: spacing.sm,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: borderRadius.md,
                    color: '#ef4444',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNominations = () => (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        background: 'rgba(139,92,246,0.1)',
        borderRadius: borderRadius.lg,
        border: '1px solid rgba(139,92,246,0.3)',
        marginBottom: spacing.xl,
      }}>
        <Shield size={18} style={{ color: '#8b5cf6' }} />
        <span style={{ color: '#8b5cf6', fontSize: typography.fontSize.sm }}>
          Super Admin Mode: You can approve, convert, or reject any nomination
        </span>
      </div>

      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
      }}>
        <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.xl }}>
          Pending Nominations ({data.nominees.length})
        </h3>

        {data.nominees.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {data.nominees.map((nominee) => (
              <div
                key={nominee.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.lg,
                  padding: spacing.lg,
                  background: colors.background.secondary,
                  borderRadius: borderRadius.lg,
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: colors.background.card,
                  borderRadius: borderRadius.full,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={24} style={{ color: colors.text.muted }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: typography.fontWeight.medium }}>{nominee.name}</p>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Nominated by: {nominee.nominatedBy}
                  </p>
                </div>
                <Badge variant={nominee.status === 'new' ? 'info' : 'warning'} size="sm">
                  {nominee.status}
                </Badge>
                <div style={{ display: 'flex', gap: spacing.sm }}>
                  <Button size="sm" variant="secondary">Approve</Button>
                  <Button size="sm">Convert</Button>
                  <button
                    style={{
                      padding: spacing.sm,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: borderRadius.md,
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: colors.text.secondary }}>
            No pending nominations
          </div>
        )}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div>
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.xl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Announcements
          </h3>
          <Button size="sm" icon={Plus}>New Announcement</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {data.announcements.map((announcement) => (
            <div
              key={announcement.id}
              style={{
                padding: spacing.lg,
                background: colors.background.secondary,
                borderRadius: borderRadius.lg,
                border: announcement.pinned ? '1px solid rgba(212,175,55,0.3)' : `1px solid ${colors.border.light}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                    <h4 style={{ fontWeight: typography.fontWeight.semibold }}>{announcement.title}</h4>
                    {announcement.pinned && <Badge variant="gold" size="sm">Pinned</Badge>}
                  </div>
                  <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>{announcement.content}</p>
                </div>
                <div style={{ display: 'flex', gap: spacing.sm }}>
                  <Button variant="secondary" size="sm" icon={Edit2} />
                  <button
                    style={{
                      padding: spacing.sm,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: borderRadius.md,
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      {/* Judges */}
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.xl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Judges ({data.judges.length})
          </h3>
          <Button size="sm" icon={Plus}>Add Judge</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.lg }}>
          {data.judges.map((judge) => (
            <div
              key={judge.id}
              style={{
                padding: spacing.lg,
                background: colors.background.secondary,
                borderRadius: borderRadius.lg,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
                    borderRadius: borderRadius.full,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: typography.fontWeight.bold,
                    color: '#000',
                  }}>
                    {judge.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: typography.fontWeight.medium }}>{judge.name}</p>
                    <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{judge.role}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: spacing.sm }}>
                  <Button variant="secondary" size="sm" icon={Edit2} />
                  <button
                    style={{
                      padding: spacing.sm,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: borderRadius.md,
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Events ({data.events.length})
          </h3>
          <Button size="sm" icon={Plus}>Add Event</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {data.events.map((event) => (
            <div
              key={event.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.lg,
                padding: spacing.lg,
                background: colors.background.secondary,
                borderRadius: borderRadius.lg,
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(59,130,246,0.2)',
                borderRadius: borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Calendar size={24} style={{ color: '#3b82f6' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: typography.fontWeight.medium }}>{event.name}</p>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <Badge variant={event.status === 'scheduled' ? 'success' : 'secondary'} size="sm">
                {event.status}
              </Badge>
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <Button variant="secondary" size="sm" icon={Edit2} />
                <button
                  style={{
                    padding: spacing.sm,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: borderRadius.md,
                    color: '#ef4444',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHostProfile = () => (
    <div>
      {competition.assignedHost ? (
        <div style={{
          background: colors.background.card,
          border: `1px solid ${colors.border.light}`,
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
                borderRadius: borderRadius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.fontSize.hero,
                fontWeight: typography.fontWeight.bold,
                color: '#000',
              }}>
                {competition.assignedHost.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold }}>
                  {competition.assignedHost.name}
                </h2>
                <p style={{ color: colors.text.secondary }}>{competition.assignedHost.email}</p>
                <Badge variant="gold" size="sm" style={{ marginTop: spacing.sm }}>Competition Host</Badge>
              </div>
            </div>
            <Button variant="secondary" icon={Edit2}>Edit Host</Button>
          </div>

          <div style={{
            padding: spacing.lg,
            background: 'rgba(139,92,246,0.1)',
            borderRadius: borderRadius.lg,
            border: '1px solid rgba(139,92,246,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
              <Shield size={16} style={{ color: '#8b5cf6' }} />
              <span style={{ color: '#8b5cf6', fontWeight: typography.fontWeight.medium }}>Admin Actions</span>
            </div>
            <div style={{ display: 'flex', gap: spacing.md }}>
              <Button variant="secondary" size="sm">Reassign Host</Button>
              <Button variant="secondary" size="sm">Message Host</Button>
              <Button variant="secondary" size="sm" style={{ borderColor: 'rgba(239,68,68,0.5)', color: '#ef4444' }}>
                Remove Host
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: colors.background.card,
          border: `1px solid ${colors.border.light}`,
          borderRadius: borderRadius.xl,
          padding: spacing.xxl,
          textAlign: 'center',
        }}>
          <User size={64} style={{ color: colors.text.muted, marginBottom: spacing.lg }} />
          <h3 style={{ fontSize: typography.fontSize.lg, marginBottom: spacing.md }}>No Host Assigned</h3>
          <p style={{ color: colors.text.secondary, marginBottom: spacing.xl }}>
            This competition doesn't have a host assigned yet.
          </p>
          <Button icon={Plus}>Assign Host</Button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'nominations':
        return renderNominations();
      case 'community':
        return renderCommunity();
      case 'settings':
        return renderSettings();
      case 'profile':
        return renderHostProfile();
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: gradients.background }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(212,175,55,0.1))',
        borderBottom: `1px solid ${colors.border.light}`,
        padding: `${spacing.lg} ${spacing.xxl}`,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm} ${spacing.md}`,
                background: 'rgba(255,255,255,0.1)',
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.md,
                color: colors.text.secondary,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                borderRadius: borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                {competition.organization?.logo || '👑'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <h1 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold }}>
                    {competition.name}
                  </h1>
                  <Badge variant="purple" size="sm">
                    <Shield size={10} /> Admin
                  </Badge>
                </div>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Season {competition.season} • Super Admin Dashboard
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Button variant="secondary" icon={Eye} onClick={() => {/* Open public site */}}>
              View Public Site
            </Button>
            <Button variant="secondary" onClick={onLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: colors.background.secondary,
        borderBottom: `1px solid ${colors.border.light}`,
        padding: `0 ${spacing.xxl}`,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {DASHBOARD_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: `${spacing.lg} ${spacing.xl}`,
                  color: isActive ? '#8b5cf6' : colors.text.secondary,
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                  borderBottom: `2px solid ${isActive ? '#8b5cf6' : 'transparent'}`,
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: spacing.xxl }}>
        {renderContent()}
      </main>
    </div>
  );
}
