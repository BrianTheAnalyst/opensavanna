
-- Create a stored procedure to safely fetch datasets by verification status
CREATE OR REPLACE FUNCTION get_datasets_by_status(status_param TEXT)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
    SELECT 
      json_build_object(
        'id', d.id,
        'title', d.title,
        'description', d.description,
        'category', d.category,
        'format', d.format,
        'country', d.country,
        'date', d.date,
        'downloads', d.downloads,
        'featured', d.featured,
        'file', d.file,
        'verificationStatus', d.verificationStatus,
        'verifiedAt', d.verifiedAt,
        'created_at', d.created_at,
        'updated_at', d.updated_at,
        'user_id', d.user_id,
        'users', json_build_object(
          'email', u.email
        )
      )::jsonb
    FROM datasets d
    LEFT JOIN auth.users u ON d.user_id = u.id
    WHERE d.verificationStatus = status_param;
END;
$$;
