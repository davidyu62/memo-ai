-- Fix existing table: Drop and recreate trigger and policy if they exist

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_memos_updated_at ON memos;

-- Recreate trigger
CREATE TRIGGER update_memos_updated_at
  BEFORE UPDATE ON memos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop policy if exists
DROP POLICY IF EXISTS "Allow all operations on memos" ON memos;

-- Recreate policy
CREATE POLICY "Allow all operations on memos"
  ON memos
  FOR ALL
  USING (true)
  WITH CHECK (true);
