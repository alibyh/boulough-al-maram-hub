import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type UserWithRole = Tables<"profiles"> & {
  user_roles: { role: "admin" | "student" | "teacher" }[];
  classes?: { name: string } | null;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Fetch profiles with classes
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`*, classes (name)`)
        .order("full_name");

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const usersWithRoles: UserWithRole[] = profiles.map((profile) => ({
        ...profile,
        user_roles: roles
          .filter((r) => r.user_id === profile.user_id)
          .map((r) => ({ role: r.role as "admin" | "student" | "teacher" })),
      }));

      return usersWithRoles;
    },
  });
};

export const useUsersByRole = (role: "student" | "teacher" | "admin") => {
  return useQuery({
    queryKey: ["users", role],
    queryFn: async () => {
      // First get user_ids with the specified role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", role);

      if (roleError) throw roleError;

      const userIds = roleData.map((r) => r.user_id);

      if (userIds.length === 0) return [];

      // Then get profiles for those users
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`*, classes (name)`)
        .in("user_id", userIds)
        .order("full_name");

      if (error) throw error;

      // Fetch roles for these users
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      if (rolesError) throw rolesError;

      // Merge
      const usersWithRoles: UserWithRole[] = profiles.map((profile) => ({
        ...profile,
        user_roles: roles
          .filter((r) => r.user_id === profile.user_id)
          .map((r) => ({ role: r.role as "admin" | "student" | "teacher" })),
      }));

      return usersWithRoles;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: TablesUpdate<"profiles">;
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: "admin" | "student" | "teacher";
    }) => {
      // Delete existing roles for this user
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Insert new role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Delete from profiles (user_roles will cascade if set up properly)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};
