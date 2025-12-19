import React from 'react';
import { spacing } from '../../styles/theme';
import RevenueCard from './components/RevenueCard';
import HostPayoutCard from './components/HostPayoutCard';
import RankingCard from './components/RankingCard';
import CurrentPhaseCard from './components/CurrentPhaseCard';
import TrafficCard from './components/TrafficCard';
import UpcomingCard from './components/UpcomingCard';
import CompetitionOverview from './components/CompetitionOverview';
import Leaderboard from './components/Leaderboard';

export default function OverviewPage({
  competitions,
  contestants,
  sponsors,
  events,
  competitionRankings,
  onViewPublicSite,
}) {
  // Calculate revenue data
  const sponsorshipTotal = sponsors.reduce((sum, s) => sum + s.amount, 0);
  const revenueData = {
    total: 125500,
    sponsorships: sponsorshipTotal,
    paidVotes: 42500,
    eventTickets: 20000,
  };

  const currentCompetition = competitions[0];

  return (
    <div>
      {/* First Row - 3 Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: spacing.xl,
          marginBottom: spacing.xxxl,
        }}
      >
        <RevenueCard revenueData={revenueData} sponsors={sponsors} />
        <HostPayoutCard totalRevenue={revenueData.total} />
        <RankingCard
          competitionRankings={competitionRankings}
          currentCity="New York"
          currentRevenue={revenueData.total}
        />
      </div>

      {/* Second Row - 3 Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: spacing.xl,
          marginBottom: spacing.xxxl,
        }}
      >
        <CurrentPhaseCard events={events} />
        <TrafficCard />
        <UpcomingCard events={events} />
      </div>

      {/* Competition Overview */}
      <CompetitionOverview
        competition={currentCompetition}
        onViewPublicSite={onViewPublicSite}
      />

      {/* Leaderboard */}
      <Leaderboard contestants={contestants} title="New York Top Contestants" />
    </div>
  );
}
