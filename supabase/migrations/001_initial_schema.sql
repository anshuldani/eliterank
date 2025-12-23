-- EliteRank Database Schema
-- Simple, scalable, cost-effective design for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  city TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'host' CHECK (role IN ('host', 'admin', 'contestant')),
  -- Social links
  instagram TEXT,
  twitter TEXT,
  linkedin TEXT,
  tiktok TEXT,
  -- Host-specific
  hobbies TEXT[], -- Array of hobbies
  payout_percentage DECIMAL(5,2) DEFAULT 20.00,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMPETITIONS
-- ============================================
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  city TEXT NOT NULL,
  season INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'nomination', 'voting', 'finals', 'completed')),
  phase TEXT DEFAULT 'setup' CHECK (phase IN ('setup', 'nomination', 'voting', 'finals', 'ended')),
  -- Stats (denormalized for performance)
  total_contestants INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  -- Settings
  vote_price DECIMAL(6,2) DEFAULT 1.00,
  nomination_start TIMESTAMPTZ,
  nomination_end TIMESTAMPTZ,
  voting_start TIMESTAMPTZ,
  voting_end TIMESTAMPTZ,
  finals_date TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTESTANTS
-- ============================================
CREATE TABLE contestants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- Profile info (can be independent of user account)
  name TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  occupation TEXT,
  bio TEXT,
  avatar_url TEXT,
  instagram TEXT,
  interests TEXT[],
  -- Competition data
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'winner', 'finalist')),
  votes INTEGER DEFAULT 0,
  rank INTEGER,
  trend TEXT DEFAULT 'same' CHECK (trend IN ('up', 'down', 'same')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOMINEES (before becoming contestants)
-- ============================================
CREATE TABLE nominees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  -- Nominee info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  occupation TEXT,
  bio TEXT,
  city TEXT,
  instagram TEXT,
  interests TEXT[],
  -- Nomination source
  nominated_by TEXT DEFAULT 'self' CHECK (nominated_by IN ('self', 'third_party')),
  nominator_name TEXT,
  nominator_email TEXT,
  -- Status flow: pending-approval -> awaiting-profile -> profile-complete -> approved -> (becomes contestant)
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'pending-approval', 'awaiting-profile', 'profile-complete', 'approved', 'rejected')),
  profile_complete BOOLEAN DEFAULT FALSE,
  -- Invite tracking
  invite_token UUID DEFAULT uuid_generate_v4(),
  invite_sent_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JUDGES
-- ============================================
CREATE TABLE judges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SPONSORS
-- ============================================
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT DEFAULT 'Gold' CHECK (tier IN ('Platinum', 'Gold', 'Silver')),
  amount DECIMAL(10,2) DEFAULT 0,
  logo_url TEXT,
  website_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENTS (competition timeline)
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  time TIME,
  location TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  public_visible BOOLEAN DEFAULT TRUE,
  is_double_vote_day BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANNOUNCEMENTS
-- ============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'announcement' CHECK (type IN ('announcement', 'update', 'news')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOTES (transaction log)
-- ============================================
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES contestants(id) ON DELETE CASCADE,
  voter_email TEXT,
  vote_count INTEGER DEFAULT 1,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_intent_id TEXT, -- Stripe payment intent
  is_double_vote BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_competitions_host ON competitions(host_id);
CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_city_season ON competitions(city, season);

CREATE INDEX idx_contestants_competition ON contestants(competition_id);
CREATE INDEX idx_contestants_votes ON contestants(competition_id, votes DESC);
CREATE INDEX idx_contestants_status ON contestants(status);

CREATE INDEX idx_nominees_competition ON nominees(competition_id);
CREATE INDEX idx_nominees_status ON nominees(status);
CREATE INDEX idx_nominees_email ON nominees(email);

CREATE INDEX idx_judges_competition ON judges(competition_id);
CREATE INDEX idx_sponsors_competition ON sponsors(competition_id);
CREATE INDEX idx_events_competition ON events(competition_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_announcements_competition ON announcements(competition_id);
CREATE INDEX idx_announcements_pinned ON announcements(pinned, published_at DESC);

CREATE INDEX idx_votes_competition ON votes(competition_id);
CREATE INDEX idx_votes_contestant ON votes(contestant_id);
CREATE INDEX idx_votes_created ON votes(created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON competitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contestants_updated_at
  BEFORE UPDATE ON contestants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_nominees_updated_at
  BEFORE UPDATE ON nominees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to increment vote count and update stats
CREATE OR REPLACE FUNCTION process_vote()
RETURNS TRIGGER AS $$
BEGIN
  -- Update contestant vote count
  UPDATE contestants
  SET votes = votes + NEW.vote_count
  WHERE id = NEW.contestant_id;

  -- Update competition stats
  UPDATE competitions
  SET
    total_votes = total_votes + NEW.vote_count,
    total_revenue = total_revenue + NEW.amount_paid
  WHERE id = NEW.competition_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_insert
  AFTER INSERT ON votes
  FOR EACH ROW EXECUTE FUNCTION process_vote();

-- Function to update contestant rankings
CREATE OR REPLACE FUNCTION update_contestant_rankings(comp_id UUID)
RETURNS VOID AS $$
BEGIN
  WITH ranked AS (
    SELECT
      id,
      votes,
      ROW_NUMBER() OVER (ORDER BY votes DESC) as new_rank,
      rank as old_rank
    FROM contestants
    WHERE competition_id = comp_id AND status = 'active'
  )
  UPDATE contestants c
  SET
    rank = r.new_rank,
    trend = CASE
      WHEN r.old_rank IS NULL THEN 'same'
      WHEN r.new_rank < r.old_rank THEN 'up'
      WHEN r.new_rank > r.old_rank THEN 'down'
      ELSE 'same'
    END
  FROM ranked r
  WHERE c.id = r.id;
END;
$$ LANGUAGE plpgsql;
