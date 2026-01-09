import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Users,
  LogOut,
  Loader2,
  ArrowLeft,
  Pencil,
  Search,
  UserCircle,
  School,
  BookOpen,
  Plus,
  Upload,
  X,
  Copy,
  Check,
  Key,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUsers, useUpdateProfile, useUpdateUserRole, UserWithRole } from "@/hooks/useUsers";
import { useClasses } from "@/hooks/useClasses";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";

type RoleFilter = "all" | "student" | "teacher" | "admin";

const AdminUsers = () => {
  const { user, profile, isLoading: authLoading, isAdmin, signOut } = useAuth();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: classes } = useClasses();
  const updateProfile = useUpdateProfile();
  const updateRole = useUpdateUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
    full_name: string;
    role: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    full_name: "",
    identifier: "",
    role: "student" as "student" | "teacher",
    class_id: "",
    email: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    class_id: "",
    role: "" as "admin" | "student" | "teacher" | "",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (editingUser) {
      setEditForm({
        full_name: editingUser.full_name || "",
        email: editingUser.email || "",
        class_id: editingUser.class_id || "",
        role: editingUser.user_roles?.[0]?.role || "",
      });
    }
  }, [editingUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      full_name: "",
      identifier: "",
      role: "student",
      class_id: "",
      email: "",
    });
    clearAvatar();
  };

  const copyToClipboard = async (text: string, field: "email" | "password") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateUser = async () => {
    if (!createForm.full_name.trim() || !createForm.identifier.trim()) {
      toast.error("Please fill in name and ID");
      return;
    }

    if (createForm.role === "teacher" && !createForm.email.trim()) {
      toast.error("Email is required for teachers");
      return;
    }

    setIsCreating(true);

    try {
      let avatarUrl: string | null = null;

      // Upload avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${createForm.identifier.replace(/\s+/g, "_")}_${Date.now()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload avatar");
        } else {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);
          avatarUrl = urlData.publicUrl;
        }
      }

      // Call edge function to create user
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          full_name: createForm.full_name,
          identifier: createForm.identifier,
          role: createForm.role,
          class_id: createForm.class_id || null,
          avatar_url: avatarUrl,
          email: createForm.role === "teacher" ? createForm.email : null,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Show credentials dialog
      setCreatedCredentials({
        email: data.user.email,
        password: data.password,
        full_name: data.user.full_name,
        role: data.user.role,
      });
      
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateDialogOpen(false);
      resetCreateForm();
      setIsCredentialsDialogOpen(true);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = (userItem: UserWithRole) => {
    setEditingUser(userItem);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      await updateProfile.mutateAsync({
        userId: editingUser.user_id,
        data: {
          full_name: editForm.full_name,
          email: editForm.email,
          class_id: editForm.class_id || null,
        },
      });

      const currentRole = editingUser.user_roles?.[0]?.role;
      if (editForm.role && editForm.role !== currentRole) {
        await updateRole.mutateAsync({
          userId: editingUser.user_id,
          newRole: editForm.role,
        });
      }

      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "teacher":
        return "default";
      case "student":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users?.filter((u) => {
    if (roleFilter !== "all") {
      const hasRole = u.user_roles?.some((r) => r.role === roleFilter);
      if (!hasRole) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = u.full_name?.toLowerCase().includes(query);
      const matchesEmail = u.email?.toLowerCase().includes(query);
      if (!matchesName && !matchesEmail) return false;
    }

    return true;
  });

  const studentCount = users?.filter((u) =>
    u.user_roles?.some((r) => r.role === "student")
  ).length || 0;

  const teacherCount = users?.filter((u) =>
    u.user_roles?.some((r) => r.role === "teacher")
  ).length || 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold">Users Management</span>
              <p className="text-xs text-primary-foreground/70">Students & Teachers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">
              {profile?.full_name || user.email}
            </span>
            <Button variant="hero-outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-heading text-xl font-bold text-foreground">
                    {users?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <UserCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-heading text-xl font-bold text-foreground">
                    {studentCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-heading text-xl font-bold text-foreground">
                    {teacherCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Teachers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <School className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-heading text-xl font-bold text-foreground">
                    {classes?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Classes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as RoleFilter)}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="student">Students</TabsTrigger>
                  <TabsTrigger value="teacher">Teachers</TabsTrigger>
                  <TabsTrigger value="admin">Admins</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="gold" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">
              Users ({filteredUsers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredUsers?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((userItem) => (
                      <TableRow key={userItem.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={userItem.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {getInitials(userItem.full_name || "?")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{userItem.full_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {userItem.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {(userItem as UserWithRole & { identifier?: string }).identifier || "-"}
                        </TableCell>
                        <TableCell>
                          {userItem.user_roles?.map((r) => (
                            <Badge
                              key={r.role}
                              variant={getRoleBadgeVariant(r.role)}
                              className="mr-1"
                            >
                              {r.role}
                            </Badge>
                          ))}
                        </TableCell>
                        <TableCell>{userItem.classes?.name || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(userItem)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback className="text-2xl bg-muted">
                    {createForm.full_name ? getInitials(createForm.full_name) : <UserCircle className="h-12 w-12" />}
                  </AvatarFallback>
                </Avatar>
                {avatarPreview && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={clearAvatar}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create_full_name">Full Name *</Label>
              <Input
                id="create_full_name"
                value={createForm.full_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, full_name: e.target.value })
                }
                placeholder="e.g., Ahmed Mohamed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create_identifier">Student/Teacher ID *</Label>
              <Input
                id="create_identifier"
                value={createForm.identifier}
                onChange={(e) =>
                  setCreateForm({ ...createForm, identifier: e.target.value })
                }
                placeholder="e.g., STU001 or TCH001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create_role">Role *</Label>
              <Select
                value={createForm.role}
                onValueChange={(value) =>
                  setCreateForm({
                    ...createForm,
                    role: value as "student" | "teacher",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {createForm.role === "teacher" && (
              <div className="space-y-2">
                <Label htmlFor="create_email">Email *</Label>
                <Input
                  id="create_email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  placeholder="e.g., teacher@school.com"
                />
              </div>
            )}

            {createForm.role === "student" && (
              <div className="space-y-2">
                <Label htmlFor="create_class">Class</Label>
                <Select
                  value={createForm.class_id || "none"}
                  onValueChange={(value) =>
                    setCreateForm({
                      ...createForm,
                      class_id: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No class</SelectItem>
                    {classes?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetCreateForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={isCreating}>
              {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) =>
                  setEditForm({
                    ...editForm,
                    role: value as "admin" | "student" | "teacher",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class (for students)</Label>
              <Select
                value={editForm.class_id || "none"}
                onValueChange={(value) =>
                  setEditForm({
                    ...editForm,
                    class_id: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No class</SelectItem>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={updateProfile.isPending || updateRole.isPending}
            >
              {(updateProfile.isPending || updateRole.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credentials Dialog - shown after user creation */}
      <Dialog open={isCredentialsDialogOpen} onOpenChange={setIsCredentialsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              User Created Successfully
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Share these login credentials with <strong>{createdCredentials?.full_name}</strong> ({createdCredentials?.role}):
              </p>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Email / Username</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={createdCredentials?.email || ""}
                    readOnly
                    className="font-mono text-sm bg-background"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdCredentials?.email || "", "email")}
                  >
                    {copiedField === "email" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Password</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={createdCredentials?.password || ""}
                    readOnly
                    className="font-mono text-sm bg-background"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdCredentials?.password || "", "password")}
                  >
                    {copiedField === "password" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
              <span className="text-lg leading-none">⚠️</span>
              <span>Make sure to save these credentials! The password cannot be retrieved later.</span>
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsCredentialsDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
