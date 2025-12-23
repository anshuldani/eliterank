-- Row Level Security Policies
-- Simple, secure access control

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominees ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Public can view host profiles (for public site)
CREATE POLICY "Public can view host profiles"
  ON profiles FOR SELECT
  USING (role = 'host');

-- ============================================
-- COMPETITIONS POLICIES
-- ============================================
-- Anyone can view competitions
CREATE POLICY "Anyone can view competitions"
  ON competitions FOR SELECT
  USING (true);

-- Hosts can create competitions
CREATE POLICY "Hosts can create competitions"
  ON competitions FOR INSERT
  WITH CHECK (auth.uid() = host_id);

-- Hosts can update their own competitions
CREATE POLICY "Hosts can update own competitions"
  ON competitions FOR UPDATE
  USING (auth.uid() = host_id);

-- Hosts can delete their own competitions
CREATE POLICY "Hosts can delete own competitions"
  ON competitions FOR DELETE
  USING (auth.uid() = host_id);

-- ============================================
-- CONTESTANTS POLICIES
-- ============================================
-- Anyone can view contestants (public voting)
CREATE POLICY "Anyone can view contestants"
  ON contestants FOR SELECT
  USING (true);

-- Hosts can manage contestants in their competitions
CREATE POLICY "Hosts can insert contestants"
  ON contestants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update contestants"
  ON contestants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete contestants"
  ON contestants FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

-- ============================================
-- NOMINEES POLICIES
-- ============================================
-- Anyone can submit nominations (public nomination form)
CREATE POLICY "Anyone can submit nominations"
  ON nominees FOR INSERT
  WITH CHECK (true);

-- Nominees can view their own nomination (via invite token)
CREATE POLICY "Nominees can view own nomination"
  ON nominees FOR SELECT
  USING (true); -- Simplified for now, can add token check

-- Hosts can manage nominees in their competitions
CREATE POLICY "Hosts can update nominees"
  ON nominees FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete nominees"
  ON nominees FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

-- ============================================
-- JUDGES POLICIES
-- ============================================
-- Anyone can view judges
CREATE POLICY "Anyone can view judges"
  ON judges FOR SELECT
  USING (true);

-- Hosts can manage judges in their competitions
CREATE POLICY "Hosts can insert judges"
  ON judges FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update judges"
  ON judges FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete judges"
  ON judges FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

-- ============================================
-- SPONSORS POLICIES
-- ============================================
-- Anyone can view sponsors
CREATE POLICY "Anyone can view sponsors"
  ON sponsors FOR SELECT
  USING (true);

-- Hosts can manage sponsors in their competitions
CREATE POLICY "Hosts can insert sponsors"
  ON sponsors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update sponsors"
  ON sponsors FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete sponsors"
  ON sponsors FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

-- ============================================
-- EVENTS POLICIES
-- ============================================
-- Anyone can view public events
CREATE POLICY "Anyone can view public events"
  ON events FOR SELECT
  USING (public_visible = true);

-- Hosts can view all events in their competitions
CREATE POLICY "Hosts can view all events"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

-- Hosts can manage events in their competitions
CREATE POLICY "Hosts can insert events"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update events"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete events"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

-- ============================================
-- ANNOUNCEMENTS POLICIES
-- ============================================
-- Anyone can view announcements
CREATE POLICY "Anyone can view announcements"
  ON announcements FOR SELECT
  USING (true);

-- Hosts can manage announcements in their competitions
CREATE POLICY "Hosts can insert announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update announcements"
  ON announcements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete announcements"
  ON announcements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

-- ============================================
-- VOTES POLICIES
-- ============================================
-- Anyone can insert votes (public voting)
CREATE POLICY "Anyone can vote"
  ON votes FOR INSERT
  WITH CHECK (true);

-- Hosts can view votes in their competitions
CREATE POLICY "Hosts can view votes"
  ON votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM competitions
      WHERE id = competition_id AND host_id = auth.uid()
    )
  );

-- Votes cannot be updated or deleted (immutable)
-- No UPDATE or DELETE policies
