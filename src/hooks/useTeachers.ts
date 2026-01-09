import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
}

export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      // First get all user_ids with teacher role
      const { data: teacherRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "teacher");

      if (rolesError) throw rolesError;
      if (!teacherRoles?.length) return [];

      const teacherUserIds = teacherRoles.map((r) => r.user_id);

      // Then get profiles for those users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email")
        .in("user_id", teacherUserIds);

      if (profilesError) throw profilesError;
      return profiles as Teacher[];
    },
  });
};
