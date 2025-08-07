-- Fix function search path security issue by updating the existing function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, role, must_change_password, temp_password)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'role', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'must_change_password')::boolean, false),
    NEW.raw_user_meta_data->>'temp_password'
  );
  RETURN NEW;
END;
$function$;