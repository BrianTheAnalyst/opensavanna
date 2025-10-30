-- Make storage buckets private
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('dataset_files', 'data_files');

-- Add RLS policies for dataset_files bucket
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own dataset files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dataset_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own dataset files
CREATE POLICY "Users can read their own dataset files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'dataset_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to approved dataset files
CREATE POLICY "Public can read approved dataset files"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'dataset_files' AND
  EXISTS (
    SELECT 1 FROM public.datasets
    WHERE datasets.file LIKE '%' || name || '%'
    AND datasets.verification_status = 'approved'
  )
);

-- Add RLS policies for data_files bucket
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own data files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'data_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own data files
CREATE POLICY "Users can read their own data files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'data_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to read all files
CREATE POLICY "Admins can read all dataset files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'dataset_files' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can read all data files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'data_files' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);