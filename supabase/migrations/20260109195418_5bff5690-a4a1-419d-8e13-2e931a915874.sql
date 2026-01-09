-- Add teacher_id column to timetable_slots
ALTER TABLE public.timetable_slots
ADD COLUMN teacher_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_timetable_slots_teacher_id ON public.timetable_slots(teacher_id);