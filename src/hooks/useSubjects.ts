import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Subject {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ClassSubject {
  id: string;
  class_id: string;
  subject_id: string;
  created_at: string;
}

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Subject[];
    },
  });
};

export const useClassSubjects = (classId?: string) => {
  return useQuery({
    queryKey: ["class-subjects", classId],
    queryFn: async () => {
      let query = supabase.from("class_subjects").select("*, subjects(*)");
      if (classId) {
        query = query.eq("class_id", classId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!classId || classId === undefined,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("subjects")
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from("subjects")
        .update({ name })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useAssignSubjectToClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classId,
      subjectId,
    }: {
      classId: string;
      subjectId: string;
    }) => {
      const { data, error } = await supabase
        .from("class_subjects")
        .insert({ class_id: classId, subject_id: subjectId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-subjects"] });
    },
  });
};

export const useRemoveSubjectFromClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("class_subjects")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-subjects"] });
    },
  });
};
