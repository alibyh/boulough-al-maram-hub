-- Add classroom/place column to timetable_slots
ALTER TABLE public.timetable_slots 
ADD COLUMN classroom text;