import React from 'react';
import { Sparkles, Check, FileText, MapPin } from 'lucide-react';
import { Badge } from '../../../components/ui';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';
import { formatRelativeTime } from '../../../utils/formatters';

const TYPE_CONFIG = {
  announcement: { icon: Sparkles, color: colors.gold.primary, bgColor: 'rgba(212,175,55,0.2)' },
  update: { icon: Check, color: colors.status.success, bgColor: 'rgba(34,197,94,0.15)' },
  news: { icon: FileText, color: colors.status.info, bgColor: 'rgba(59,130,246,0.15)' },
};

export default function AnnouncementsTab({ announcements }) {
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.announcement;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
        <h1 style={{ fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md }}>
          Announcements
        </h1>
        <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.lg }}>
          Stay updated with the latest news from Most Eligible NYC
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {sortedAnnouncements.map((post, i) => {
          const typeConfig = getTypeConfig(post.type);
          const TypeIcon = typeConfig.icon;
          const postDate = new Date(post.date);
          const now = new Date();
          const diffHours = Math.floor((now - postDate) / (1000 * 60 * 60));
          const isNew = diffHours < 24;

          return (
            <div
              key={post.id}
              style={{
                background: post.pinned || i === 0 ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(30,30,40,0.6))' : colors.background.card,
                border: post.pinned || i === 0 ? `1px solid ${colors.border.gold}` : `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.xxl,
                padding: spacing.xxl,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: typeConfig.bgColor,
                    borderRadius: borderRadius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TypeIcon size={20} style={{ color: typeConfig.color }} />
                </div>
                <div>
                  <p style={{ fontWeight: typography.fontWeight.semibold }}>{post.title}</p>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    {formatRelativeTime(post.date)}
                  </p>
                </div>
                {post.pinned && (
                  <Badge variant="gold" size="md" uppercase icon={MapPin} style={{ marginLeft: 'auto' }}>
                    PINNED
                  </Badge>
                )}
                {isNew && !post.pinned && (
                  <Badge variant="gold" size="md" uppercase style={{ marginLeft: 'auto' }}>
                    NEW
                  </Badge>
                )}
              </div>
              <p style={{ color: colors.text.light, fontSize: typography.fontSize.md, lineHeight: '1.6' }}>
                {post.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
