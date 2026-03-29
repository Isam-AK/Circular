-- ============================================================
-- Circular: Hyper-local P2P Resource Sharing — Database Schema
-- Requires PostGIS extension for geospatial queries
-- ============================================================

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- --------------------------------------------------------
-- Profiles
-- --------------------------------------------------------
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username   TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  trust_score NUMERIC(3, 1) DEFAULT 5.0
    CHECK (trust_score >= 0 AND trust_score <= 10),
  location   GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fast nearest-neighbour lookups on profiles
CREATE INDEX idx_profiles_location ON profiles USING GIST (location);

-- --------------------------------------------------------
-- Items
-- --------------------------------------------------------
CREATE TYPE item_status AS ENUM ('available', 'borrowed');

CREATE TYPE item_category AS ENUM (
  'tools', 'electronics', 'kitchen', 'sports', 'books', 'other'
);

CREATE TABLE items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  category    item_category NOT NULL DEFAULT 'other',
  image_url   TEXT,
  status      item_status NOT NULL DEFAULT 'available',
  lat_lng     GEOGRAPHY(POINT, 4326) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_items_lat_lng ON items USING GIST (lat_lng);
CREATE INDEX idx_items_owner   ON items (owner_id);
CREATE INDEX idx_items_status  ON items (status);

-- --------------------------------------------------------
-- Borrows
-- --------------------------------------------------------
CREATE TYPE borrow_status AS ENUM ('pending', 'active', 'returned', 'overdue');

CREATE TABLE borrows (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id     UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status      borrow_status NOT NULL DEFAULT 'pending',
  due_date    TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_borrows_item     ON borrows (item_id);
CREATE INDEX idx_borrows_borrower ON borrows (borrower_id);

-- --------------------------------------------------------
-- Function: distance_in_meters
-- Returns the distance in meters between two geography points.
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION distance_in_meters(
  point_a GEOGRAPHY,
  point_b GEOGRAPHY
)
RETURNS DOUBLE PRECISION
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT ST_Distance(point_a, point_b);
$$;

-- --------------------------------------------------------
-- Function: nearby_items
-- Returns available items within a given radius (meters)
-- from a reference point, ordered by distance.
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION nearby_items(
  ref_lat   DOUBLE PRECISION,
  ref_lng   DOUBLE PRECISION,
  radius_m  DOUBLE PRECISION DEFAULT 5000
)
RETURNS TABLE (
  id          UUID,
  owner_id    UUID,
  title       TEXT,
  description TEXT,
  category    item_category,
  image_url   TEXT,
  status      item_status,
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  distance_m  DOUBLE PRECISION,
  created_at  TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    i.id,
    i.owner_id,
    i.title,
    i.description,
    i.category,
    i.image_url,
    i.status,
    ST_Y(i.lat_lng::geometry) AS latitude,
    ST_X(i.lat_lng::geometry) AS longitude,
    ST_Distance(
      i.lat_lng,
      ST_SetSRID(ST_MakePoint(ref_lng, ref_lat), 4326)::geography
    ) AS distance_m,
    i.created_at
  FROM items i
  WHERE i.status = 'available'
    AND ST_DWithin(
          i.lat_lng,
          ST_SetSRID(ST_MakePoint(ref_lng, ref_lat), 4326)::geography,
          radius_m
        )
  ORDER BY distance_m;
$$;

-- --------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrows  ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can update
CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Items: anyone can read, only owner can insert/update/delete
CREATE POLICY items_select ON items FOR SELECT USING (true);
CREATE POLICY items_insert ON items FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY items_update ON items FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY items_delete ON items FOR DELETE USING (auth.uid() = owner_id);

-- Borrows: participants can read, borrower can insert, participants can update
CREATE POLICY borrows_select ON borrows FOR SELECT
  USING (
    auth.uid() = borrower_id
    OR auth.uid() IN (SELECT owner_id FROM items WHERE items.id = borrows.item_id)
  );
CREATE POLICY borrows_insert ON borrows FOR INSERT
  WITH CHECK (auth.uid() = borrower_id);
CREATE POLICY borrows_update ON borrows FOR UPDATE
  USING (
    auth.uid() = borrower_id
    OR auth.uid() IN (SELECT owner_id FROM items WHERE items.id = borrows.item_id)
  );
