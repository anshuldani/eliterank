import React from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { StatCard } from '../../../components/ui';
import { colors, spacing, typography } from '../../../styles/theme';
import { formatNumber } from '../../../utils/formatters';

export default function TrafficCard() {
  // In production, this would come from analytics API
  const trafficData = {
    pageViews: 48392,
    uniqueVisitors: 32150,
    totalPageViews: 156420,
    avgTimeOnSite: '4m 32s',
  };

  const metrics = [
    { label: 'Unique Visitors', value: formatNumber(trafficData.uniqueVisitors) },
    { label: 'Page Views', value: formatNumber(trafficData.totalPageViews) },
    { label: 'Avg. Time on Site', value: trafficData.avgTimeOnSite },
  ];

  return (
    <StatCard
      label="Public Site Traffic"
      value={formatNumber(trafficData.pageViews)}
      icon={Eye}
      iconColor="blue"
      trend={<TrendingUp size={14} />}
      trendValue="+12% this week"
    >
      {/* Traffic Breakdown */}
      <div style={{ marginTop: spacing.lg }}>
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: `${spacing.sm} 0`,
              borderBottom: index < metrics.length - 1 ? `1px solid ${colors.border.lighter}` : 'none',
            }}
          >
            <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.base }}>
              {metric.label}
            </span>
            <span style={{ color: '#fff', fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium }}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      <p style={{ color: colors.text.muted, fontSize: typography.fontSize.xs, marginTop: spacing.md }}>
        Since nominations opened (Jan 15)
      </p>
    </StatCard>
  );
}
