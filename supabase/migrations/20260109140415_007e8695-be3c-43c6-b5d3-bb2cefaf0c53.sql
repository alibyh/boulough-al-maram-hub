-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction table for classes and subjects (many-to-many)
CREATE TABLE public.class_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_id, subject_id)
);

-- Timetable slots - each slot represents a class period
CREATE TABLE public.timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subject materials (lectures, files, photos)
CREATE TABLE public.subject_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'document',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add class_id to profiles for student class assignment
ALTER TABLE public.profiles ADD COLUMN class_id UUID REFERENCES public.classes(id);

-- Enable RLS on all new tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_materials ENABLE ROW LEVEL SECURITY;

-- Classes: publicly readable, admin/teacher can manage
CREATE POLICY "Classes are publicly readable" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can manage classes" ON public.classes FOR ALL USING (has_role(auth.uid(), 'teacher'));

-- Subjects: publicly readable, admin/teacher can manage
CREATE POLICY "Subjects are publicly readable" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can manage subjects" ON public.subjects FOR ALL USING (has_role(auth.uid(), 'teacher'));

-- Class subjects: publicly readable, admin/teacher can manage
CREATE POLICY "Class subjects are publicly readable" ON public.class_subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage class subjects" ON public.class_subjects FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can manage class subjects" ON public.class_subjects FOR ALL USING (has_role(auth.uid(), 'teacher'));

-- Timetable slots: publicly readable, admin/teacher can manage
CREATE POLICY "Timetable slots are publicly readable" ON public.timetable_slots FOR SELECT USING (true);
CREATE POLICY "Admins can manage timetable slots" ON public.timetable_slots FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can manage timetable slots" ON public.timetable_slots FOR ALL USING (has_role(auth.uid(), 'teacher'));

-- Subject materials: authenticated users can read, admin/teacher can manage
CREATE POLICY "Authenticated users can read materials" ON public.subject_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage materials" ON public.subject_materials FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can manage materials" ON public.subject_materials FOR ALL USING (has_role(auth.uid(), 'teacher'));

-- Add triggers for updated_at
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timetable_slots_updated_at BEFORE UPDATE ON public.timetable_slots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subject_materials_updated_at BEFORE UPDATE ON public.subject_materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();