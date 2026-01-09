import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TimetableSlot {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id?: string;
  day_of_week: number; // 0=Sunday, 6=Saturday
  start_time: string;
  end_time: string;
  classroom?: string;
  created_at: string;
  updated_at: string;
  subjects?: {
    id: string;
    name: string;
  };
  classes?: {
    id: string;
    name: string;
  };
  profiles?: {
    id: string;
    full_name: string;
  };
}

export const useTimetableByClass = (classId?: string) => {
  return useQuery({
    queryKey: ["timetable", classId],
    queryFn: async () => {
      if (!classId) return [];
      const { data, error } = await supabase
        .from("timetable_slots")
        .select("*, subjects(*), classes(*), profiles(*)")
        .eq("class_id", classId)
        .order("day_of_week")
        .order("start_time");
      if (error) throw error;
      return data as TimetableSlot[];
    },
    enabled: !!classId,
  });
};

export const useAllTimetableSlots = () => {
  return useQuery({
    queryKey: ["timetable-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timetable_slots")
        .select("*, subjects(*), classes(*), profiles(*)")
        .order("class_id")
        .order("day_of_week")
        .order("start_time");
      if (error) throw error;
      return data as TimetableSlot[];
    },
  });
};

export const useCreateTimetableSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: {
      class_id: string;
      subject_id: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
      classroom?: string;
      teacher_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("timetable_slots")
        .insert(slot)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      queryClient.invalidateQueries({ queryKey: ["timetable-all"] });
    },
  });
};

export const useUpdateTimetableSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...slot
    }: {
      id: string;
      class_id?: string;
      subject_id?: string;
      day_of_week?: number;
      start_time?: string;
      end_time?: string;
      classroom?: string;
      teacher_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("timetable_slots")
        .update(slot)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      queryClient.invalidateQueries({ queryKey: ["timetable-all"] });
    },
  });
};

export const useDeleteTimetableSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("timetable_slots")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      queryClient.invalidateQueries({ queryKey: ["timetable-all"] });
    },
  });
};

// Helper to format day of week
export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
