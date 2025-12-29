import React, { useState, useEffect, useRef } from 'react';
import {
  X, Crown, MapPin, Calendar, Trophy, Clock, ChevronRight, ChevronLeft, Sparkles, Users, Star,
  Ticket, Activity, Info, Briefcase, UserPlus, Loader, User, ExternalLink, Megaphone, Award, Building, Heart, Filter, ChevronDown
} from 'lucide-react';
import { Button, Badge, OrganizationLogo } from '../ui';
import { colors, spacing, borderRadius, typography } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import {
  computeCompetitionPhase,
  isCompetitionVisible,
  isCompetitionAccessible,
  getPhaseDisplayConfig,
  COMPETITION_STATUSES,
  shouldAutoTransitionToLive,
  shouldAutoTransitionToCompleted,
} from '../../utils/competitionPhase';
import { getCityImage } from '../../utils/cityImages';

const TABS = [
  { id: 'competitions', label: 'Competitions', icon: Crown },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  { id: 'about', label: 'About', icon: Info },
];

export default function EliteRankCityModal({
  isOpen,
  onClose,
  onOpenCompetition,
  onOpenTeaser, // New prop for opening teaser page
  isFullPage = false,
  onLogin,
  onDashboard,
  onProfile, // New prop for opening profile page
  isAuthenticated = false,
  userRole = 'fan',
  userName,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('competitions');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [cities, setCities] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'upcoming', 'complete'
  const [cityFilter, setCityFilter] = useState('all'); // 'all' or city id
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch competitions, organizations, and cities from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Fetch competitions with settings for timeline dates, plus events and announcements
        const [compsResult, orgsResult, citiesResult, settingsResult, profilesResult, eventsResult, announcementsResult] = await Promise.all([
          supabase.from('competitions').select('*').order('created_at', { ascending: false }),
          supabase.from('organizations').select('*').order('name'),
          supabase.from('cities').select('*').order('name'),
          supabase.from('competition_settings').select('*'),
          supabase.from('profiles').select('id, email, first_name, last_name, avatar_url, bio, instagram'),
          supabase.from('events').select('*').order('date', { ascending: true }),
          supabase.from('announcements').select('*').order('published_at', { ascending: false }),
        ]);

        // Create lookup map for profiles (hosts)
        const profilesMap = (profilesResult.data || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});

        // Store cities for lookup
        const citiesData = citiesResult.data || [];
        setCities(citiesData);

        // Create lookup map for cities
        const citiesMap = citiesData.reduce((acc, city) => {
          acc[city.id] = city;
          return acc;
        }, {});

        // Create lookup map for settings
        const settingsMap = (settingsResult.data || []).reduce((acc, s) => {
          acc[s.competition_id] = s;
          return acc;
        }, {});

        // Check for auto-transitions and update if needed
        const competitionsToTransition = [];
        for (const comp of (compsResult.data || [])) {
          const settings = settingsMap[comp.id];

          // Check if should transition from publish to live
          if (shouldAutoTransitionToLive(comp, settings)) {
            competitionsToTransition.push({ id: comp.id, newStatus: 'live' });
          }
          // Check if should transition from live to completed
          else if (shouldAutoTransitionToCompleted(comp, settings)) {
            competitionsToTransition.push({ id: comp.id, newStatus: 'completed' });
          }
        }

        // Apply auto-transitions if any
        if (competitionsToTransition.length > 0) {
          for (const { id, newStatus } of competitionsToTransition) {
            await supabase
              .from('competitions')
              .update({ status: newStatus })
              .eq('id', id);
          }

          // Re-fetch competitions to get updated data
          const { data: updatedComps } = await supabase
            .from('competitions')
            .select('*')
            .order('created_at', { ascending: false });

          if (updatedComps) {
            compsResult.data = updatedComps;
          }
        }

        if (compsResult.data) {
          setCompetitions(compsResult.data.map(comp => {
            // Compute the phase from status and timeline
            const computedPhase = computeCompetitionPhase(comp);

            // Check visibility based on status
            const visible = isCompetitionVisible(comp.status);
            const accessible = isCompetitionAccessible(comp.status);

            // Get city - either from direct city field or lookup from city_id
            const cityFromLookup = citiesMap[comp.city_id];
            const cityName = comp.city || cityFromLookup?.name || 'Unknown City';
            const cityState = cityFromLookup?.state || '';
            const citySlug = cityFromLookup?.slug || cityName.toLowerCase().replace(/\s+/g, '-');

            // Get host profile if host_id exists
            const hostProfile = comp.host_id ? profilesMap[comp.host_id] : null;
            const host = hostProfile ? {
              id: hostProfile.id,
              name: `${hostProfile.first_name || ''} ${hostProfile.last_name || ''}`.trim() || hostProfile.email,
              title: 'Competition Host',
              bio: hostProfile.bio || '',
              avatar: hostProfile.avatar_url,
              instagram: hostProfile.instagram,
            } : null;

            return {
              id: comp.id,
              // Use custom name if set, otherwise generate
              name: comp.name || `Most Eligible ${cityName}`,
              city: cityName,
              cityState,
              citySlug,
              cityId: comp.city_id,
              season: comp.season || new Date().getFullYear(),
              // Store both status (super admin controlled) and computed phase - normalize to lowercase
              status: (comp.status || COMPETITION_STATUSES.DRAFT).toLowerCase(),
              phase: computedPhase,
              contestants: 0,
              votes: 0,
              visible,
              accessible,
              organizationId: comp.organization_id,
              host,
              // Timeline data for display (now from competition_settings, but keep for backward compat)
              nomination_start: comp.nomination_start,
              nomination_end: comp.nomination_end,
              voting_start: comp.voting_start,
              voting_end: comp.voting_end,
              finals_date: comp.finals_date,
              winner_count: comp.number_of_winners || 3,
            };
          }));
        }

        if (orgsResult.data) {
          setOrganizations(orgsResult.data);
        }

        // Process events with competition info
        if (eventsResult.data) {
          const eventsWithCompInfo = eventsResult.data.map(event => {
            const comp = compsResult.data?.find(c => c.id === event.competition_id);
            const cityInfo = comp?.city_id ? citiesMap[comp.city_id] : null;
            return {
              ...event,
              competitionName: comp?.name || `Most Eligible ${cityInfo?.name || 'Unknown'}`,
              cityName: cityInfo?.name || comp?.city || 'Unknown City',
            };
          });
          setEvents(eventsWithCompInfo);
        }

        // Process announcements with competition info
        if (announcementsResult.data) {
          const announcementsWithCompInfo = announcementsResult.data.map(announcement => {
            const comp = compsResult.data?.find(c => c.id === announcement.competition_id);
            const cityInfo = comp?.city_id ? citiesMap[comp.city_id] : null;
            return {
              ...announcement,
              competitionName: comp?.name || `Most Eligible ${cityInfo?.name || 'Unknown'}`,
              cityName: cityInfo?.name || comp?.city || 'Unknown City',
            };
          });
          setAnnouncements(announcementsWithCompInfo);
        }
      } catch {
        // Silent fail - will show empty state
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get cities that have visible competitions
  const availableCities = cities.filter(city =>
    competitions.some(c => c.visible && c.cityId === city.id)
  );

  // Filter competitions based on visibility, city, and status filter
  const visibleCompetitions = competitions.filter(c => {
    // Must be visible (publish, active, or complete status)
    if (!c.visible) return false;

    // Apply city filter
    if (cityFilter !== 'all' && c.cityId !== cityFilter) {
      return false;
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        // Show live competitions with timeline phases (nomination, voting, judging)
        return c.status === COMPETITION_STATUSES.LIVE && ['nomination', 'voting', 'judging'].includes(c.phase);
      }
      if (statusFilter === 'upcoming') {
        // Show published (coming soon) competitions
        return c.status === COMPETITION_STATUSES.PUBLISH;
      }
      if (statusFilter === 'complete') {
        // Show completed competitions
        return c.status === COMPETITION_STATUSES.COMPLETED || c.phase === 'completed';
      }
    }

    return true;
  });

  const handleCompetitionClick = (competition) => {
    // Get organization data for this competition
    const org = organizations.find(o => o.id === competition.organizationId);
    const competitionWithOrg = {
      ...competition,
      organization: org ? {
        id: org.id,
        name: org.name,
        logo_url: org.logo_url || org.logo,
        slug: org.slug,
      } : null,
    };

    if (competition.accessible && onOpenCompetition) {
      onOpenCompetition(competitionWithOrg);
    } else if (competition.status === COMPETITION_STATUSES.PUBLISH) {
      if (onOpenTeaser) {
        onOpenTeaser(competitionWithOrg);
      } else if (onOpenCompetition) {
        onOpenCompetition({ ...competitionWithOrg, isTeaser: true });
      }
    }
  };

  const getOrganizationName = (orgId) => {
    const org = organizations.find(o => o.id === orgId);
    return org?.name || '';
  };

  const getOrganizationLogo = (orgId) => {
    const org = organizations.find(o => o.id === orgId);
    return org?.logo_url || org?.logo || null;
  };

  const getOrganizationSlug = (orgId) => {
    const org = organizations.find(o => o.id === orgId);
    return org?.slug || null;
  };

  // Handle organization click - navigate to org page
  const handleOrganizationClick = (e, orgId) => {
    e.stopPropagation();
    const slug = getOrganizationSlug(orgId);
    if (slug) {
      window.location.href = `/org/${slug}`;
    }
  };

  // Handle city click - navigate to city page
  const handleCityClick = (e, citySlug) => {
    e.stopPropagation();
    if (citySlug) {
      window.location.href = `/city/${citySlug}`;
    }
  };

  // Competition Card Component - Sweatpals-inspired Design
  const CompetitionCard = ({ competition, cardWidth = '340px' }) => {
    const isHovered = hoveredCard === competition.id;
    const isAccessible = competition.accessible;
    const isPublished = competition.status === COMPETITION_STATUSES.PUBLISH;

    // Get display config based on computed phase
    const displayPhase = isAccessible ? competition.phase : competition.status;
    const config = getPhaseDisplayConfig(displayPhase);
    const isClickable = isAccessible || isPublished;

    // Get city background image
    const cityImage = getCityImage(competition.city);

    // CTA text based on status/phase
    const getCtaText = () => {
      if (isPublished) return 'Learn More';
      if (competition.phase === 'nomination') return 'Nominate Now';
      if (competition.phase === 'voting') return 'Vote Now';
      return 'View';
    };

    return (
      <div style={{
        width: cardWidth,
        minWidth: cardWidth,
        flexShrink: 0,
      }}>
        {/* Main Card with Image */}
        <div
          onClick={() => handleCompetitionClick(competition)}
          onMouseEnter={() => setHoveredCard(competition.id)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            position: 'relative',
            borderRadius: borderRadius.xl,
            overflow: 'hidden',
            cursor: isClickable ? 'pointer' : 'default',
            transform: isHovered && isClickable ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isHovered && isClickable
              ? '0 20px 40px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(0,0,0,0.3)',
            aspectRatio: '16/10',
          }}
        >
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${cityImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isHovered ? 'brightness(0.6)' : 'brightness(0.5)',
            transition: 'filter 0.3s',
          }} />

          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%)',
          }} />

          {/* Content */}
          <div style={{
            position: 'relative',
            padding: spacing.lg,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Top Row: Status Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Badge variant={config.variant} size="sm" pill style={{ backdropFilter: 'blur(8px)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {config.pulse && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      background: '#4ade80',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite',
                    }} />
                  )}
                  {config.label}
                </span>
              </Badge>
            </div>

            {/* Main Content - Bottom Aligned */}
            <div style={{ marginTop: 'auto' }}>
              {/* Competition Name */}
              <h3 style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: '#fff',
                marginBottom: spacing.xs,
                lineHeight: 1.2,
              }}>
                {competition.name}
              </h3>

              {/* Season */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                marginBottom: spacing.sm,
              }}>
                <Calendar size={12} style={{ color: colors.text.secondary }} />
                <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                  Season {competition.season}
                </span>
              </div>

              {/* CTA Button Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {isClickable && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: `${spacing.xs} ${spacing.md}`,
                    background: isHovered ? colors.gold.primary : 'rgba(212,175,55,0.25)',
                    border: `1px solid ${colors.gold.primary}`,
                    borderRadius: borderRadius.md,
                    color: isHovered ? '#000' : colors.gold.primary,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    transition: 'all 0.2s',
                  }}>
                    <Sparkles size={12} />
                    {getCtaText()}
                  </div>
                )}

                {/* Coming Soon Date */}
                {!isClickable && competition.nomination_start && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    color: colors.text.secondary,
                    fontSize: typography.fontSize.xs,
                  }}>
                    <Clock size={12} />
                    Opens {new Date(competition.nomination_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Below Card */}
        <div style={{
          padding: `${spacing.md} ${spacing.xs}`,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.xs,
        }}>
          {/* Location - Clickable */}
          <div
            onClick={(e) => handleCityClick(e, competition.citySlug)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              cursor: competition.citySlug ? 'pointer' : 'default',
            }}
          >
            <MapPin size={14} style={{ color: colors.gold.primary }} />
            <span style={{
              fontSize: typography.fontSize.sm,
              color: colors.gold.primary,
              fontWeight: typography.fontWeight.medium,
            }}>
              {competition.city}{competition.cityState ? `, ${competition.cityState}` : ''}
            </span>
            {competition.citySlug && (
              <ChevronRight size={12} style={{ color: colors.gold.primary, opacity: 0.6 }} />
            )}
          </div>

          {/* Organization - Clickable */}
          {competition.organizationId && (
            <div
              onClick={(e) => handleOrganizationClick(e, competition.organizationId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                cursor: 'pointer',
              }}
            >
              <OrganizationLogo logo={getOrganizationLogo(competition.organizationId)} size={18} />
              <span style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.secondary,
              }}>
                {getOrganizationName(competition.organizationId)}
              </span>
              <ChevronRight size={12} style={{ color: colors.text.muted, opacity: 0.6 }} />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Horizontal Scroll Carousel Component
  const CompetitionCarousel = ({ title, competitions: comps, icon: Icon, iconColor = colors.gold.primary, emptyMessage }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    useEffect(() => {
      updateScrollButtons();
      window.addEventListener('resize', updateScrollButtons);
      return () => window.removeEventListener('resize', updateScrollButtons);
    }, [comps]);

    const scroll = (direction) => {
      if (scrollContainerRef.current) {
        const scrollAmount = 360; // Card width + gap
        scrollContainerRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
        setTimeout(updateScrollButtons, 300);
      }
    };

    if (comps.length === 0) {
      return null;
    }

    return (
      <div style={{ marginBottom: spacing.xxxl }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.lg,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Icon size={22} style={{ color: iconColor }} />
            <h3 style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.semibold,
              color: '#fff',
            }}>
              {title}
            </h3>
            <Badge variant="default" size="sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
              {comps.length}
            </Badge>
          </div>

          {/* Scroll Arrows */}
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: canScrollLeft ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${canScrollLeft ? colors.border.light : 'transparent'}`,
                color: canScrollLeft ? '#fff' : colors.text.muted,
                cursor: canScrollLeft ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: canScrollRight ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${canScrollRight ? colors.border.light : 'transparent'}`,
                color: canScrollRight ? '#fff' : colors.text.muted,
                cursor: canScrollRight ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          style={{
            display: 'flex',
            gap: spacing.lg,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: spacing.md,
            marginLeft: `-${spacing.md}`,
            marginRight: `-${spacing.md}`,
            paddingLeft: spacing.md,
            paddingRight: spacing.md,
          }}
        >
          {comps.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>

        {/* Hide scrollbar */}
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    );
  };

  // Render Tab Content
  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: colors.gold.primary, marginBottom: spacing.md }} />
          <p style={{ color: colors.text.secondary }}>Loading competitions...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    // Group competitions by status for carousel sections
    const liveNowCompetitions = visibleCompetitions.filter(c =>
      c.status === COMPETITION_STATUSES.LIVE && ['nomination', 'voting', 'judging'].includes(c.phase)
    );
    const comingSoonCompetitions = visibleCompetitions.filter(c =>
      c.status === COMPETITION_STATUSES.PUBLISH
    );
    const recentlyCompletedCompetitions = visibleCompetitions.filter(c =>
      c.status === COMPETITION_STATUSES.COMPLETED || c.phase === 'completed'
    );

    // Get selected city name
    const selectedCityName = cityFilter === 'all'
      ? 'All Cities'
      : cities.find(c => c.id === cityFilter)?.name || 'All Cities';

    switch (activeTab) {
      case 'competitions':
        return (
          <>
            {/* Hero Section */}
            <section style={{ padding: `${spacing.xxxl} ${spacing.xxl}`, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: typography.fontWeight.bold, color: '#fff', marginBottom: spacing.lg, lineHeight: 1.2 }}>
                Discover the Most Eligible
                <span style={{ display: 'block', color: colors.gold.primary }}>In Your City</span>
              </h2>
              <p style={{ fontSize: typography.fontSize.lg, color: colors.text.secondary, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                Vote for your favorites, attend exclusive events, and be part of the most exciting social competition in America.
              </p>
            </section>

            <section style={{ padding: `0 ${spacing.xxl} ${spacing.xxxl}`, maxWidth: '1400px', margin: '0 auto' }}>
              {/* Restyled Filters Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.lg,
                marginBottom: spacing.xxl,
                padding: `${spacing.md} ${spacing.lg}`,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: borderRadius.xl,
                border: `1px solid ${colors.border.light}`,
                flexWrap: 'wrap',
              }}>
                {/* Left: Filter Icon & City Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                  <Filter size={18} style={{ color: colors.text.secondary }} />

                  {/* City Dropdown */}
                  <div
                    ref={cityDropdownRef}
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={() => setShowCityDropdown(!showCityDropdown)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                        padding: `${spacing.sm} ${spacing.md}`,
                        background: cityFilter !== 'all' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${cityFilter !== 'all' ? colors.gold.primary : colors.border.light}`,
                        borderRadius: borderRadius.lg,
                        color: cityFilter !== 'all' ? colors.gold.primary : colors.text.primary,
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        minWidth: '140px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <MapPin size={14} />
                        {selectedCityName}
                      </span>
                      <ChevronDown size={14} style={{
                        transform: showCityDropdown ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                      }} />
                    </button>

                    {/* Dropdown Menu */}
                    {showCityDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        minWidth: '180px',
                        background: colors.background.card,
                        border: `1px solid ${colors.border.light}`,
                        borderRadius: borderRadius.lg,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        zIndex: 100,
                        overflow: 'hidden',
                      }}>
                        <button
                          onClick={() => { setCityFilter('all'); setShowCityDropdown(false); }}
                          style={{
                            width: '100%',
                            padding: `${spacing.sm} ${spacing.md}`,
                            background: cityFilter === 'all' ? 'rgba(212,175,55,0.15)' : 'transparent',
                            border: 'none',
                            color: cityFilter === 'all' ? colors.gold.primary : colors.text.primary,
                            fontSize: typography.fontSize.sm,
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = cityFilter === 'all' ? 'rgba(212,175,55,0.15)' : 'transparent'}
                        >
                          All Cities
                        </button>
                        {availableCities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => { setCityFilter(city.id); setShowCityDropdown(false); }}
                            style={{
                              width: '100%',
                              padding: `${spacing.sm} ${spacing.md}`,
                              background: cityFilter === city.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                              border: 'none',
                              color: cityFilter === city.id ? colors.gold.primary : colors.text.primary,
                              fontSize: typography.fontSize.sm,
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = cityFilter === city.id ? 'rgba(212,175,55,0.15)' : 'transparent'}
                          >
                            {city.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Status Filter Pills */}
                <div style={{ display: 'flex', gap: spacing.xs }}>
                  {[
                    { id: 'all', label: 'All', icon: null },
                    { id: 'active', label: 'Live Now', icon: Activity },
                    { id: 'upcoming', label: 'Coming Soon', icon: Clock },
                    { id: 'complete', label: 'Completed', icon: Trophy },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setStatusFilter(filter.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                        padding: `${spacing.xs} ${spacing.md}`,
                        background: statusFilter === filter.id
                          ? 'rgba(212,175,55,0.2)'
                          : 'transparent',
                        border: statusFilter === filter.id
                          ? `1px solid ${colors.gold.primary}`
                          : '1px solid transparent',
                        borderRadius: borderRadius.pill,
                        color: statusFilter === filter.id ? colors.gold.primary : colors.text.secondary,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.medium,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {filter.icon && <filter.icon size={12} />}
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Competition Sections */}
              {statusFilter === 'all' ? (
                <>
                  {/* Live Now Section */}
                  <CompetitionCarousel
                    title="Live Now"
                    competitions={liveNowCompetitions}
                    icon={Activity}
                    iconColor="#4ade80"
                    emptyMessage="No live competitions at the moment"
                  />

                  {/* Coming Soon Section */}
                  <CompetitionCarousel
                    title="Coming Soon"
                    competitions={comingSoonCompetitions}
                    icon={Clock}
                    iconColor="#60a5fa"
                    emptyMessage="No upcoming competitions"
                  />

                  {/* Recently Completed Section */}
                  <CompetitionCarousel
                    title="Recently Completed"
                    competitions={recentlyCompletedCompetitions}
                    icon={Trophy}
                    iconColor={colors.gold.primary}
                    emptyMessage="No completed competitions yet"
                  />

                  {/* Empty State - When no competitions exist at all */}
                  {visibleCompetitions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: spacing.xxxl, background: colors.background.card, borderRadius: borderRadius.xxl, border: `1px solid ${colors.border.light}` }}>
                      <Crown size={48} style={{ color: colors.text.muted, marginBottom: spacing.lg }} />
                      <h3 style={{ fontSize: typography.fontSize.xl, color: '#fff', marginBottom: spacing.sm }}>
                        {cityFilter !== 'all' ? 'No Competitions in This City' : 'No Competitions Yet'}
                      </h3>
                      <p style={{ fontSize: typography.fontSize.md, color: colors.text.secondary }}>
                        {cityFilter !== 'all'
                          ? 'Try selecting a different city.'
                          : 'Check back soon for upcoming competitions in your city!'}
                      </p>
                      {cityFilter !== 'all' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setCityFilter('all')}
                          style={{ marginTop: spacing.lg, width: 'auto' }}
                        >
                          View All Cities
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Filtered View - Show single section with grid layout
                <>
                  {visibleCompetitions.length > 0 ? (
                    <div style={{ marginBottom: spacing.xxxl }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
                        {statusFilter === 'active' && <Activity size={22} style={{ color: '#4ade80' }} />}
                        {statusFilter === 'upcoming' && <Clock size={22} style={{ color: '#60a5fa' }} />}
                        {statusFilter === 'complete' && <Trophy size={22} style={{ color: colors.gold.primary }} />}
                        <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: '#fff' }}>
                          {statusFilter === 'active' && 'Live Now'}
                          {statusFilter === 'upcoming' && 'Coming Soon'}
                          {statusFilter === 'complete' && 'Recently Completed'}
                        </h3>
                        <Badge variant="default" size="sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          {visibleCompetitions.length}
                        </Badge>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: spacing.xl,
                      }}>
                        {visibleCompetitions.map((competition) => (
                          <CompetitionCard key={competition.id} competition={competition} cardWidth="100%" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: spacing.xxxl, background: colors.background.card, borderRadius: borderRadius.xxl, border: `1px solid ${colors.border.light}` }}>
                      <Crown size={48} style={{ color: colors.text.muted, marginBottom: spacing.lg }} />
                      <h3 style={{ fontSize: typography.fontSize.xl, color: '#fff', marginBottom: spacing.sm }}>
                        No Matching Competitions
                      </h3>
                      <p style={{ fontSize: typography.fontSize.md, color: colors.text.secondary }}>
                        Try adjusting your filter criteria.
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { setStatusFilter('all'); setCityFilter('all'); }}
                        style={{ marginTop: spacing.lg, width: 'auto' }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        );

      case 'events':
        // Sort events chronologically with upcoming first
        const now = new Date();
        const upcomingEvents = events.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
        const pastEvents = events.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

        return (
          <section style={{ padding: `${spacing.xxxl} ${spacing.xxl}`, maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', borderRadius: borderRadius.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: spacing.xl }}>
                <Calendar size={40} style={{ color: '#fff' }} />
              </div>
              <h2 style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, color: '#fff', marginBottom: spacing.lg }}>Events</h2>
              <p style={{ fontSize: typography.fontSize.xl, color: colors.text.secondary, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                Attend exclusive events across all Elite Rank competitions
              </p>
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div style={{ marginBottom: spacing.xxxl }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
                  <Sparkles size={24} style={{ color: colors.gold.primary }} />
                  <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: '#fff' }}>Upcoming Events</h3>
                  <Badge variant="success" size="sm">{upcomingEvents.length}</Badge>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: spacing.xl }}>
                  {upcomingEvents.map(event => (
                    <div key={event.id} style={{
                      background: colors.background.card,
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: borderRadius.xl,
                      padding: spacing.xl,
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
                        <Badge variant="info" size="sm">{event.cityName}</Badge>
                        <span style={{ fontSize: typography.fontSize.sm, color: colors.gold.primary, fontWeight: typography.fontWeight.medium }}>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: '#fff', marginBottom: spacing.sm }}>{event.name}</h4>
                      {event.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.sm, marginBottom: spacing.sm }}>
                          <MapPin size={14} />
                          {event.location}
                        </div>
                      )}
                      {event.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                          <Clock size={14} />
                          {event.time}
                        </div>
                      )}
                      <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, marginTop: spacing.md }}>{event.competitionName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
                  <Clock size={24} style={{ color: colors.text.secondary }} />
                  <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary }}>Past Events</h3>
                  <Badge variant="default" size="sm">{pastEvents.length}</Badge>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: spacing.xl }}>
                  {pastEvents.slice(0, 6).map(event => (
                    <div key={event.id} style={{
                      background: colors.background.card,
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: borderRadius.xl,
                      padding: spacing.xl,
                      opacity: 0.7,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
                        <Badge variant="default" size="sm">{event.cityName}</Badge>
                        <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: '#fff', marginBottom: spacing.sm }}>{event.name}</h4>
                      {event.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                          <MapPin size={14} />
                          {event.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {events.length === 0 && (
              <div style={{ textAlign: 'center', padding: spacing.xxxl, background: colors.background.card, borderRadius: borderRadius.xxl, border: `1px solid ${colors.border.light}` }}>
                <Calendar size={48} style={{ color: colors.text.muted, marginBottom: spacing.lg }} />
                <h3 style={{ fontSize: typography.fontSize.xl, color: '#fff', marginBottom: spacing.sm }}>No Events Yet</h3>
                <p style={{ fontSize: typography.fontSize.md, color: colors.text.secondary }}>
                  Check back soon for upcoming events across all competitions!
                </p>
              </div>
            )}
          </section>
        );

      case 'announcements':
        return (
          <section style={{ padding: `${spacing.xxxl} ${spacing.xxl}`, maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', borderRadius: borderRadius.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: spacing.xl }}>
                <Megaphone size={40} style={{ color: '#0a0a0f' }} />
              </div>
              <h2 style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, color: '#fff', marginBottom: spacing.lg }}>Announcements</h2>
              <p style={{ fontSize: typography.fontSize.xl, color: colors.text.secondary, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                Stay updated with the latest news from all Elite Rank competitions
              </p>
            </div>

            {announcements.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                {announcements.map(announcement => (
                  <div key={announcement.id} style={{
                    background: colors.background.card,
                    border: announcement.pinned ? `2px solid ${colors.gold.primary}` : `1px solid ${colors.border.light}`,
                    borderRadius: borderRadius.xl,
                    padding: spacing.xxl,
                    position: 'relative',
                  }}>
                    {announcement.pinned && (
                      <Badge variant="gold" size="sm" style={{ position: 'absolute', top: spacing.lg, right: spacing.lg }}>
                        Pinned
                      </Badge>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                      <Badge variant="info" size="sm">{announcement.cityName}</Badge>
                      <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        {new Date(announcement.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: '#fff', marginBottom: spacing.md }}>
                      {announcement.title}
                    </h3>
                    <p style={{ fontSize: typography.fontSize.md, color: colors.text.light, lineHeight: 1.7, marginBottom: spacing.md }}>
                      {announcement.content}
                    </p>
                    <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted }}>{announcement.competitionName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: spacing.xxxl, background: colors.background.card, borderRadius: borderRadius.xxl, border: `1px solid ${colors.border.light}` }}>
                <Megaphone size={48} style={{ color: colors.text.muted, marginBottom: spacing.lg }} />
                <h3 style={{ fontSize: typography.fontSize.xl, color: '#fff', marginBottom: spacing.sm }}>No Announcements Yet</h3>
                <p style={{ fontSize: typography.fontSize.md, color: colors.text.secondary }}>
                  Check back soon for news and updates!
                </p>
              </div>
            )}
          </section>
        );

      case 'opportunities':
        const opportunityCards = [
          {
            id: 'compete',
            icon: Trophy,
            title: 'Compete',
            subtitle: 'Become a Contestant',
            description: 'Get nominated to compete in your city\'s Most Eligible competition. Build your profile, gain votes, and compete for the title.',
            color: '#d4af37',
            gradient: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
            cta: 'Get Nominated',
            features: ['Build your public profile', 'Compete for votes', 'Attend exclusive events', 'Win prizes and recognition'],
          },
          {
            id: 'judge',
            icon: Award,
            title: 'Judge',
            subtitle: 'Become a Judge',
            description: 'Join our panel of distinguished judges and help select the most eligible contestants in your city.',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))',
            cta: 'Apply to Judge',
            features: ['Evaluate top contestants', 'VIP event access', 'Network with influencers', 'Shape the competition'],
          },
          {
            id: 'host',
            icon: Crown,
            title: 'Host',
            subtitle: 'Host a Competition',
            description: 'Lead your city\'s Most Eligible competition. Organize events, manage contestants, and build your community.',
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))',
            cta: 'Apply to Host',
            features: ['Run your own competition', 'Build a local community', 'Earn revenue share', 'Full platform support'],
          },
          {
            id: 'sponsor',
            icon: Building,
            title: 'Sponsor',
            subtitle: 'Become a Sponsor',
            description: 'Partner with Elite Rank to reach an engaged audience of ambitious professionals in major cities.',
            color: '#22c55e',
            gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
            cta: 'Become a Sponsor',
            features: ['Brand visibility at events', 'Access to contestants', 'Content partnerships', 'Custom activations'],
          },
        ];

        return (
          <section style={{ padding: `${spacing.xxxl} ${spacing.xxl}`, maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #d4af37, #f4d03f)', borderRadius: borderRadius.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: spacing.xl }}>
                <Briefcase size={40} style={{ color: '#0a0a0f' }} />
              </div>
              <h2 style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, color: '#fff', marginBottom: spacing.lg }}>Opportunities</h2>
              <p style={{ fontSize: typography.fontSize.xl, color: colors.text.secondary, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                Join Elite Rank as a contestant, judge, host, or sponsor
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: spacing.xl }}>
              {opportunityCards.map(opp => {
                const IconComponent = opp.icon;
                return (
                  <div key={opp.id} style={{
                    background: opp.gradient,
                    border: `1px solid ${opp.color}40`,
                    borderRadius: borderRadius.xxl,
                    padding: spacing.xxl,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${opp.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: `${opp.color}30`,
                      borderRadius: borderRadius.lg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.lg,
                    }}>
                      <IconComponent size={28} style={{ color: opp.color }} />
                    </div>

                    <p style={{ fontSize: typography.fontSize.xs, color: opp.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: spacing.xs }}>
                      {opp.subtitle}
                    </p>
                    <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: '#fff', marginBottom: spacing.md }}>
                      {opp.title}
                    </h3>
                    <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, lineHeight: 1.6, marginBottom: spacing.lg }}>
                      {opp.description}
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: spacing.xl, flex: 1 }}>
                      {opp.features.map((feature, i) => (
                        <li key={i} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          fontSize: typography.fontSize.sm,
                          color: colors.text.light,
                          marginBottom: spacing.sm,
                        }}>
                          <Heart size={12} style={{ color: opp.color }} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant="secondary"
                      style={{
                        width: '100%',
                        borderColor: opp.color,
                        color: opp.color,
                      }}
                      onClick={() => {
                        if (opp.id === 'compete') {
                          // Navigate to competitions to get nominated
                          setActiveTab('competitions');
                        } else if (onLogin && !isAuthenticated) {
                          onLogin();
                        }
                      }}
                    >
                      {opp.cta}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Contact Section */}
            <div style={{
              marginTop: spacing.xxxl,
              padding: spacing.xxl,
              background: colors.background.card,
              border: `1px solid ${colors.border.gold}`,
              borderRadius: borderRadius.xxl,
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: '#fff', marginBottom: spacing.md }}>
                Have Questions?
              </h3>
              <p style={{ fontSize: typography.fontSize.md, color: colors.text.secondary, marginBottom: spacing.lg }}>
                Reach out to learn more about opportunities with Elite Rank
              </p>
              <Button variant="primary" onClick={() => window.location.href = 'mailto:hello@eliterank.com'}>
                Contact Us
              </Button>
            </div>
          </section>
        );

      case 'about':
        return (
          <section style={{ padding: `${spacing.xxxl} ${spacing.xxl}`, maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #d4af37, #f4d03f)', borderRadius: borderRadius.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: spacing.xl }}>
                <Crown size={40} style={{ color: '#0a0a0f' }} />
              </div>
              <h2 style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, color: '#fff', marginBottom: spacing.lg }}>About Elite Rank</h2>
              <p style={{ fontSize: typography.fontSize.xl, color: colors.text.secondary, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                Elite Rank is America's premier social competition platform, connecting ambitious professionals through city-based competitions, exclusive events, and meaningful networking opportunities.
              </p>
            </div>

            <div style={{ background: colors.background.card, border: `1px solid ${colors.border.gold}`, borderRadius: borderRadius.xxl, padding: spacing.xxxl, marginBottom: spacing.xxxl }}>
              <h3 style={{ fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.semibold, color: colors.gold.primary, marginBottom: spacing.lg, textAlign: 'center' }}>Our Mission</h3>
              <p style={{ fontSize: typography.fontSize.lg, color: colors.text.primary, textAlign: 'center', lineHeight: 1.8 }}>
                To celebrate and elevate exceptional individuals in every major city. We believe that recognition, community, and connection are powerful catalysts for personal and professional growth.
              </p>
            </div>

            <div style={{ marginBottom: spacing.xxxl }}>
              <h3 style={{ fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.semibold, color: '#fff', marginBottom: spacing.xl, textAlign: 'center' }}>How It Works</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.xl }}>
                {[
                  { step: '1', title: 'Compete', desc: 'Contestants are nominated and compete for votes in their city' },
                  { step: '2', title: 'Vote', desc: 'The public votes for their favorites throughout the season' },
                  { step: '3', title: 'Win', desc: 'Winners are crowned at exclusive finale events' },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: spacing.xl }}>
                    <div style={{ width: '48px', height: '48px', background: colors.gold.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: spacing.lg, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: '#0a0a0f' }}>{item.step}</div>
                    <h4 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: '#fff', marginBottom: spacing.sm }}>{item.title}</h4>
                    <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const containerStyle = isFullPage
    ? { minHeight: '100vh', background: colors.background.primary }
    : {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 1000,
        overflow: 'auto',
      };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.border.light}`,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `${spacing.md} ${spacing.xxl}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
              borderRadius: borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Crown size={24} style={{ color: '#0a0a0f' }} />
            </div>
            <span style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: '#fff' }}>
              Elite<span style={{ color: colors.gold.primary }}>Rank</span>
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', gap: spacing.xs }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: activeTab === tab.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: borderRadius.md,
                  color: activeTab === tab.id ? colors.gold.primary : colors.text.secondary,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Auth Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            {isAuthenticated ? (
              <>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Hi, {userName}
                </span>
                {onDashboard && (
                  <Button variant="secondary" size="sm" onClick={onDashboard}>Dashboard</Button>
                )}
                {onProfile && (
                  <Button variant="secondary" size="sm" onClick={onProfile} icon={User}>Profile</Button>
                )}
                <Button variant="secondary" size="sm" onClick={onLogout}>Logout</Button>
              </>
            ) : (
              onLogin && <Button variant="primary" size="sm" onClick={onLogin}>Sign In</Button>
            )}
            {!isFullPage && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.text.secondary,
                  cursor: 'pointer',
                  padding: spacing.sm,
                }}
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        {renderContent()}
      </main>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
