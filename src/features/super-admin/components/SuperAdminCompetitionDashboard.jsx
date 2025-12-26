import React, { useState } from 'react';
import {
  Crown, ArrowLeft, Shield, Star, LogOut, BarChart3, UserPlus, FileText, Settings as SettingsIcon,
  User, TrendingUp, Calendar, Eye, Edit2
} from 'lucide-react';
import { Button, Badge, Avatar, StatCard } from '../../../components/ui';
import { colors, gradients, spacing, borderRadius, typography, transitions } from '../../../styles/theme';

// Import host dashboard components for reuse
import RevenueCard from '../../overview/components/RevenueCard';
import HostPayoutCard from '../../overview/components/HostPayoutCard';
import CurrentPhaseCard from '../../overview/components/CurrentPhaseCard';
import TrafficCard from '../../overview/components/TrafficCard';
import UpcomingCard from '../../overview/components/UpcomingCard';
import Leaderboard from '../../overview/components/Leaderboard';

// Mock data for the competition
const getMockData = () => {
  return {
    contestants: [
      { id: 'c1', name: 'Marcus Thompson', age: 28, occupation: 'Investment Banker', votes: 847, status: 'approved', interests: ['Travel', 'Fine Dining'] },
      { id: 'c2', name: 'James Wilson', age: 31, occupation: 'Tech Entrepreneur', votes: 623, status: 'approved', interests: ['Startups', 'Golf'] },
      { id: 'c3', name: 'Michael Chen', age: 27, occupation: 'Architect', votes: 512, status: 'approved', interests: ['Design', 'Photography'] },
      { id: 'c4', name: 'David Rodriguez', age: 29, occupation: 'Doctor', votes: 445, status: 'pending', interests: ['Medicine', 'Running'] },
    ],
    nominees: [
      { id: 'n1', name: 'Chris Taylor', nominatedBy: 'Anonymous', status: 'new', nominations: 5 },
      { id: 'n2', name: 'Kevin Park', nominatedBy: 'Sarah M.', status: 'pending', nominations: 3 },
    ],
    events: [
      { id: 'e1', name: 'Opening Gala', date: '2026-02-14', time: '7:00 PM', venue: 'The Plaza', status: 'scheduled' },
      { id: 'e2', name: 'Talent Showcase', date: '2026-02-28', time: '6:00 PM', venue: 'Lincoln Center', status: 'scheduled' },
      { id: 'e3', name: 'Final Event', date: '2026-03-15', time: '8:00 PM', venue: 'The Met', status: 'draft' },
    ],
    judges: [
      { id: 'j1', name: 'Sarah Mitchell', role: 'Head Judge', bio: 'Fashion industry veteran' },
      { id: 'j2', name: 'Robert Chen', role: 'Judge', bio: 'Celebrity matchmaker' },
    ],
    sponsors: [
      { id: 's1', name: 'Luxury Motors', tier: 'platinum', amount: 50000 },
      { id: 's2', name: 'Elite Fashion', tier: 'gold', amount: 25000 },
    ],
    announcements: [
      { id: 'a1', title: 'Voting is now open!', content: 'Cast your votes for your favorite contestants.', pinned: true, date: '2024-02-01' },
      { id: 'a2', title: 'Event reminder', content: 'Opening Gala is next week!', pinned: false, date: '2024-02-05' },
    ],
    revenue: { total: 125500, paidVotes: 42500, sponsorships: 63000, eventTickets: 20000 },
  };
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'nominations', label: 'Nominations', icon: UserPlus },
  { id: 'community', label: 'Community', icon: FileText },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'profile', label: 'Host Profile', icon: User },
];

export default function SuperAdminCompetitionDashboard({ competition, onBack, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [data] = useState(getMockData());
  const [isEditing, setIsEditing] = useState(false);

  // Header component matching host dashboard style but with purple admin theme
  const renderHeader = () => (
    <header style={{
      background: 'rgba(20,20,30,0.95)',
      borderBottom: '1px solid rgba(139,92,246,0.15)',
      padding: `${spacing.md} ${spacing.xxl}`,
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: borderRadius.md,
              color: '#a78bfa',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
          </button>

          {/* Logo */}
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(139,92,246,0.3)',
          }}>
            <Crown size={22} />
          </div>

          {/* Title */}
          <span style={{
            fontSize: typography.fontSize.xxl,
            fontWeight: typography.fontWeight.semibold,
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {competition.name}
          </span>

          {/* Admin badge */}
          <span style={{
            padding: `${spacing.xs} ${spacing.md}`,
            background: 'rgba(139,92,246,0.15)',
            color: '#a78bfa',
            borderRadius: borderRadius.sm,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
          }}>
            <Shield size={12} /> SUPER ADMIN
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          {/* Edit mode toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.sm} ${spacing.md}`,
              background: isEditing ? 'rgba(139,92,246,0.2)' : 'transparent',
              border: `1px solid ${isEditing ? '#8b5cf6' : colors.border.light}`,
              borderRadius: borderRadius.md,
              color: isEditing ? '#a78bfa' : colors.text.secondary,
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
            }}
          >
            <Edit2 size={14} />
            {isEditing ? 'Editing' : 'Edit Mode'}
          </button>

          {/* View public site */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.sm} ${spacing.md}`,
              background: 'transparent',
              border: `1px solid ${colors.border.light}`,
              borderRadius: borderRadius.md,
              color: colors.text.secondary,
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
            }}
          >
            <Eye size={14} />
            View Public Site
          </button>

          {/* Verified badge */}
          <div style={{
            padding: `${spacing.xs} ${spacing.md}`,
            background: 'rgba(139,92,246,0.15)',
            color: '#a78bfa',
            borderRadius: borderRadius.sm,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            border: '1px solid rgba(139,92,246,0.3)',
          }}>
            <Star size={14} /> Admin Access
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.sm} ${spacing.md}`,
              background: 'transparent',
              border: `1px solid ${colors.border.light}`,
              borderRadius: borderRadius.md,
              color: colors.text.secondary,
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );

  // Navigation matching host dashboard style
  const renderNavigation = () => (
    <nav style={{
      background: 'rgba(20,20,30,0.8)',
      borderBottom: `1px solid ${colors.border.lighter}`,
      padding: `0 ${spacing.xxl}`,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '0',
        overflowX: 'auto',
      }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                color: isActive ? '#a78bfa' : colors.text.secondary,
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                borderBottom: `2px solid ${isActive ? '#a78bfa' : 'transparent'}`,
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                transition: `all ${transitions.fast}`,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );

  // Admin alert banner (shown when in edit mode)
  const renderAdminBanner = () => {
    if (!isEditing) return null;
    return (
      <div style={{
        background: 'rgba(139,92,246,0.1)',
        borderBottom: '1px solid rgba(139,92,246,0.2)',
        padding: `${spacing.sm} ${spacing.xxl}`,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          color: '#a78bfa',
          fontSize: typography.fontSize.sm,
        }}>
          <Shield size={14} />
          <span>Admin Edit Mode Active - Changes will override host settings</span>
        </div>
      </div>
    );
  };

  // Overview tab - matching host dashboard exactly
  const renderOverview = () => (
    <div>
      {/* First Row - 3 Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: spacing.xl,
        marginBottom: spacing.xxxl,
      }}>
        <RevenueCard revenueData={data.revenue} sponsors={data.sponsors} />
        <HostPayoutCard totalRevenue={data.revenue.total} />

        {/* Ranking Card */}
        <StatCard
          label="Competition Ranking"
          value="#1"
          icon={TrendingUp}
          iconColor="gold"
          variant="default"
        >
          <div style={{ marginTop: spacing.md }}>
            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
              Top performing city this season
            </p>
          </div>
        </StatCard>
      </div>

      {/* Second Row - 3 Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: spacing.xl,
        marginBottom: spacing.xxxl,
      }}>
        <CurrentPhaseCard events={data.events} />
        <TrafficCard />
        <UpcomingCard events={data.events} />
      </div>

      {/* Competition Overview Card */}
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.xxxl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
            Competition Overview
          </h3>
          {isEditing && (
            <Button variant="secondary" size="sm" icon={Edit2}>
              Edit Details
            </Button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.xl }}>
          <div>
            <p style={{ color: colors.text.muted, fontSize: typography.fontSize.sm, marginBottom: spacing.xs }}>City</p>
            <p style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium }}>{competition.city}</p>
          </div>
          <div>
            <p style={{ color: colors.text.muted, fontSize: typography.fontSize.sm, marginBottom: spacing.xs }}>Season</p>
            <p style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium }}>{competition.season}</p>
          </div>
          <div>
            <p style={{ color: colors.text.muted, fontSize: typography.fontSize.sm, marginBottom: spacing.xs }}>Vote Price</p>
            <p style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium, color: '#22c55e' }}>
              ${competition.votePrice?.toFixed(2)}
            </p>
          </div>
          <div>
            <p style={{ color: colors.text.muted, fontSize: typography.fontSize.sm, marginBottom: spacing.xs }}>Max Contestants</p>
            <p style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium }}>{competition.maxContestants}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <Leaderboard contestants={data.contestants} title={`${competition.city} Top Contestants`} />
    </div>
  );

  // Nominations tab
  const renderNominations = () => (
    <div>
      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: spacing.xl,
        marginBottom: spacing.xxxl,
      }}>
        {[
          { label: 'Total Nominees', value: data.nominees.length + data.contestants.length, color: '#8b5cf6' },
          { label: 'Pending Review', value: data.nominees.filter(n => n.status === 'new').length, color: '#f59e0b' },
          { label: 'Approved', value: data.contestants.length, color: '#22c55e' },
          { label: 'This Week', value: 12, color: '#3b82f6' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: colors.background.card,
            border: `1px solid ${colors.border.light}`,
            borderRadius: borderRadius.xl,
            padding: spacing.xl,
          }}>
            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm, marginBottom: spacing.sm }}>{stat.label}</p>
            <p style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Nominees list */}
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
            Pending Nominations
          </h3>
          {isEditing && (
            <Button size="sm" icon={UserPlus}>Add Nominee</Button>
          )}
        </div>

        {data.nominees.map((nominee) => (
          <div key={nominee.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            padding: spacing.lg,
            background: colors.background.secondary,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.md,
          }}>
            <Avatar name={nominee.name} size={48} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: typography.fontWeight.medium }}>{nominee.name}</p>
              <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                Nominated by {nominee.nominatedBy} • {nominee.nominations} nominations
              </p>
            </div>
            <Badge variant={nominee.status === 'new' ? 'info' : 'warning'} size="sm">
              {nominee.status}
            </Badge>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Button variant="approve" size="sm">Approve</Button>
              <Button variant="reject" size="sm">Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Community tab
  const renderCommunity = () => (
    <div>
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
            Announcements
          </h3>
          {isEditing && (
            <Button size="sm" icon={FileText}>New Announcement</Button>
          )}
        </div>

        {data.announcements.map((announcement) => (
          <div key={announcement.id} style={{
            padding: spacing.lg,
            background: colors.background.secondary,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.md,
            border: announcement.pinned ? '1px solid rgba(212,175,55,0.3)' : 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                  <h4 style={{ fontWeight: typography.fontWeight.semibold }}>{announcement.title}</h4>
                  {announcement.pinned && <Badge variant="gold" size="sm">Pinned</Badge>}
                </div>
                <p style={{ color: colors.text.secondary }}>{announcement.content}</p>
              </div>
              {isEditing && (
                <Button variant="secondary" size="sm" icon={Edit2} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Settings tab
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
          <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
            Judges ({data.judges.length})
          </h3>
          {isEditing && (
            <Button size="sm" icon={UserPlus}>Add Judge</Button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.lg }}>
          {data.judges.map((judge) => (
            <div key={judge.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              padding: spacing.lg,
              background: colors.background.secondary,
              borderRadius: borderRadius.lg,
            }}>
              <Avatar name={judge.name} size={48} variant="gold" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: typography.fontWeight.medium }}>{judge.name}</p>
                <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>{judge.role}</p>
              </div>
              {isEditing && (
                <Button variant="secondary" size="sm" icon={Edit2} />
              )}
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
          <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
            Events ({data.events.length})
          </h3>
          {isEditing && (
            <Button size="sm" icon={Calendar}>Add Event</Button>
          )}
        </div>

        {data.events.map((event) => (
          <div key={event.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            padding: spacing.lg,
            background: colors.background.secondary,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.md,
          }}>
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
              <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {event.venue}
              </p>
            </div>
            <Badge variant={event.status === 'scheduled' ? 'success' : 'secondary'} size="sm">
              {event.status}
            </Badge>
            {isEditing && (
              <Button variant="secondary" size="sm" icon={Edit2} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Host Profile tab
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
              <Avatar name={competition.assignedHost.name} size={80} variant="gold" />
              <div>
                <h2 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold }}>
                  {competition.assignedHost.name}
                </h2>
                <p style={{ color: colors.text.secondary }}>{competition.assignedHost.email}</p>
                <Badge variant="gold" size="sm" style={{ marginTop: spacing.sm }}>Competition Host</Badge>
              </div>
            </div>
            {isEditing && (
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <Button variant="secondary" icon={Edit2}>Edit Host</Button>
                <Button variant="secondary" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.5)' }}>
                  Remove Host
                </Button>
              </div>
            )}
          </div>

          {isEditing && (
            <div style={{
              padding: spacing.lg,
              background: 'rgba(139,92,246,0.1)',
              borderRadius: borderRadius.lg,
              border: '1px solid rgba(139,92,246,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
                <Shield size={16} style={{ color: '#8b5cf6' }} />
                <span style={{ color: '#8b5cf6', fontWeight: typography.fontWeight.medium }}>Admin Actions</span>
              </div>
              <div style={{ display: 'flex', gap: spacing.md }}>
                <Button variant="secondary" size="sm">Reassign Host</Button>
                <Button variant="secondary" size="sm">Message Host</Button>
                <Button variant="secondary" size="sm">View Activity Log</Button>
              </div>
            </div>
          )}
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
          <Button icon={UserPlus}>Assign Host</Button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'nominations': return renderNominations();
      case 'community': return renderCommunity();
      case 'settings': return renderSettings();
      case 'profile': return renderHostProfile();
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: gradients.background }}>
      {renderHeader()}
      {renderNavigation()}
      {renderAdminBanner()}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${spacing.xxxl} ${spacing.xxl}`,
      }}>
        {renderContent()}
      </main>
    </div>
  );
}
