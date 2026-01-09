-- Add identifier column to profiles for student/teacher ID
ALTER TABLE public.profiles 
ADD COLUMN identifier TEXT UNIQUE;

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Admins can upload avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update avatars" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete avatars" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));