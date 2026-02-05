-- Create memos table
CREATE TABLE IF NOT EXISTS memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_memos_category ON memos(category);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS idx_memos_title ON memos USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_memos_content ON memos USING gin(to_tsvector('english', content));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_memos_updated_at ON memos;
CREATE TRIGGER update_memos_updated_at
  BEFORE UPDATE ON memos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
-- In production, you should create more restrictive policies
DROP POLICY IF EXISTS "Allow all operations on memos" ON memos;
CREATE POLICY "Allow all operations on memos"
  ON memos
  FOR ALL
  USING (true)
  WITH CHECK (true);
