-- Remove conflicting public policies on processed_files table
-- These policies allow anyone to access file metadata, which is a security risk
-- We keep only the user-specific policies to ensure proper access control

DROP POLICY IF EXISTS "Anyone can insert processed_files" ON public.processed_files;
DROP POLICY IF EXISTS "Anyone can select processed_files" ON public.processed_files;
DROP POLICY IF EXISTS "Anyone can update processed_files" ON public.processed_files;

-- The remaining policies ensure users can only access their own processed files:
-- - "Users can insert their own processed files" 
-- - "Users can view their own processed files"
-- - "Users can update their own processed files"
-- - "Users can delete their own processed files"