import React from 'react';
import { Crown, Trophy, Medal, Star, Instagram, Award, Sparkles } from 'lucide-react';
import { colors, spacing, borderRadius, typography } from '../../../styles/theme';

// Medal colors for top 5
const MEDAL_STYLES = {
  1: { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', label: '1st Place', icon: Crown },
  2: { bg: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)', color: '#000', label: '2nd Place', icon: Medal },
  3: { bg: 'linear-gradient(135deg, #CD7F32, #B8860B)', color: '#000', label: '3rd Place', icon: Medal },
  4: { bg: 'linear-gradient(135deg, #4a5568, #2d3748)', color: '#fff', label: '4th Place', icon: Award },
  5: { bg: 'linear-gradient(135deg, #4a5568, #2d3748)', color: '#fff', label: '5th Place', icon: Award },
};

export default function WinnersTab({ city, season, winners = [] }) {
  // If no winners provided, use placeholder data
  const displayWinners = winners.length > 0 ? winners : [
    { rank: 1, name: 'Sarah Mitchell', votes: 28450, occupation: 'Marketing Executive', instagram: '@sarahmitchell' },
    { rank: 2, name: 'James Rodriguez', votes: 24320, occupation: 'Tech Entrepreneur', instagram: '@jamesrodriguez' },
    { rank: 3, name: 'Emily Chen', votes: 21890, occupation: 'Fashion Designer', instagram: '@emilychen' },
    { rank: 4, name: 'Michael Thompson', votes: 19750, occupation: 'Investment Banker', instagram: '@michaelthompson' },
    { rank: 5, name: 'Olivia Williams', votes: 18420, occupation: 'Attorney', instagram: '@oliviawilliams' },
  ];

  const grandWinner = displayWinners[0];
  const runnerUps = displayWinners.slice(1, 5);

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: `${spacing.xxxl} ${spacing.xl}`,
        background: 'linear-gradient(180deg, rgba(212,175,55,0.15) 0%, transparent 100%)',
        borderRadius: borderRadius.xxl,
        marginBottom: spacing.xxxl,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing.sm,
          padding: `${spacing.sm} ${spacing.lg}`,
          background: 'rgba(212,175,55,0.2)',
          border: `1px solid ${colors.gold.primary}`,
          borderRadius: borderRadius.pill,
          marginBottom: spacing.xl,
        }}>
          <Trophy size={16} style={{ color: colors.gold.primary }} />
          <span style={{ fontSize: typography.fontSize.sm, color: colors.gold.primary, fontWeight: typography.fontWeight.semibold }}>
            SEASON {season} COMPLETE
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: typography.fontWeight.bold,
          color: '#fff',
          marginBottom: spacing.lg,
          lineHeight: 1.1,
        }}>
          Congratulations to
          <span style={{ display: 'block', color: colors.gold.primary }}>{city}'s Most Eligible!</span>
        </h1>

        <p style={{
          fontSize: typography.fontSize.lg,
          color: colors.text.secondary,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Thank you to everyone who participated, voted, and made this season unforgettable.
        </p>
      </div>

      {/* Grand Winner Card */}
      {grandWinner && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
          border: `2px solid ${colors.gold.primary}`,
          borderRadius: borderRadius.xxl,
          padding: spacing.xxxl,
          marginBottom: spacing.xxxl,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Crown decoration */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(212,175,55,0.5)',
          }}>
            <Crown size={40} style={{ color: '#000' }} />
          </div>

          <div style={{ marginTop: spacing.xxxl }}>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.gold.primary,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: spacing.md,
              fontWeight: typography.fontWeight.semibold,
            }}>
              Season {season} Winner
            </p>

            <h2 style={{
              fontSize: typography.fontSize.hero,
              fontWeight: typography.fontWeight.bold,
              color: '#fff',
              marginBottom: spacing.sm,
            }}>
              {grandWinner.name}
            </h2>

            <p style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
              marginBottom: spacing.lg,
            }}>
              {grandWinner.occupation}
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xl,
              padding: `${spacing.md} ${spacing.xl}`,
              background: 'rgba(0,0,0,0.3)',
              borderRadius: borderRadius.xl,
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: colors.gold.primary }}>
                  {grandWinner.votes.toLocaleString()}
                </p>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Total Votes</p>
              </div>
              {grandWinner.instagram && (
                <a
                  href={`https://instagram.com/${grandWinner.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.text.light,
                    textDecoration: 'none',
                  }}
                >
                  <Instagram size={20} />
                  <span>{grandWinner.instagram}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Runner Ups */}
      <div style={{ marginBottom: spacing.xxxl }}>
        <h3 style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          color: '#fff',
          marginBottom: spacing.xl,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
        }}>
          <Sparkles size={24} style={{ color: colors.gold.primary }} />
          Top 5 Finalists
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.lg,
        }}>
          {runnerUps.map((winner) => {
            const medalStyle = MEDAL_STYLES[winner.rank];
            const Icon = medalStyle?.icon || Award;

            return (
              <div
                key={winner.rank}
                style={{
                  background: colors.background.card,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.xl,
                  padding: spacing.xl,
                  position: 'relative',
                }}
              >
                {/* Rank Badge */}
                <div style={{
                  position: 'absolute',
                  top: spacing.md,
                  right: spacing.md,
                  width: '36px',
                  height: '36px',
                  background: medalStyle?.bg || colors.background.secondary,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={18} style={{ color: medalStyle?.color || '#fff' }} />
                </div>

                <div style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: spacing.sm,
                }}>
                  {medalStyle?.label || `${winner.rank}th Place`}
                </div>

                <h4 style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: '#fff',
                  marginBottom: spacing.xs,
                }}>
                  {winner.name}
                </h4>

                <p style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  marginBottom: spacing.md,
                }}>
                  {winner.occupation}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    color: colors.gold.primary,
                  }}>
                    <Star size={14} />
                    <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
                      {winner.votes.toLocaleString()} votes
                    </span>
                  </div>

                  {winner.instagram && (
                    <a
                      href={`https://instagram.com/${winner.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: colors.text.muted }}
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Season Stats */}
      <div style={{
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.xxl,
        padding: spacing.xxl,
        marginBottom: spacing.xxxl,
      }}>
        <h3 style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          color: '#fff',
          marginBottom: spacing.xl,
          textAlign: 'center',
        }}>
          Season {season} by the Numbers
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: spacing.lg,
        }}>
          {[
            { value: '18', label: 'Contestants' },
            { value: '89K+', label: 'Total Votes' },
            { value: '12', label: 'Events Hosted' },
            { value: '5', label: 'Winners' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: typography.fontSize.hero,
                fontWeight: typography.fontWeight.bold,
                color: colors.gold.primary,
                marginBottom: spacing.xs,
              }}>
                {stat.value}
              </p>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Thank You Message */}
      <div style={{
        textAlign: 'center',
        padding: spacing.xxl,
        background: 'rgba(212,175,55,0.05)',
        borderRadius: borderRadius.xl,
        border: `1px solid ${colors.border.gold}`,
      }}>
        <Trophy size={48} style={{ color: colors.gold.primary, marginBottom: spacing.lg }} />
        <h3 style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          color: '#fff',
          marginBottom: spacing.md,
        }}>
          Thank You, {city}!
        </h3>
        <p style={{
          fontSize: typography.fontSize.md,
          color: colors.text.secondary,
          maxWidth: '500px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Season {season} was incredible thanks to our amazing contestants, dedicated voters, and supportive sponsors.
          See you next season!
        </p>
      </div>
    </div>
  );
}
