-- Add grade column to profiles
ALTER TABLE public.profiles ADD COLUMN grade integer DEFAULT NULL;

-- Update handle_new_user to store grade from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, grade)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Student'),
    (NEW.raw_user_meta_data->>'grade')::integer
  );
  RETURN NEW;
END;
$$;