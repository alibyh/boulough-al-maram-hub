import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  LogOut,
  Loader2,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
} from "@/hooks/useClasses";
import { toast } from "sonner";

const AdminClasses = () => {
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: classes, isLoading: classesLoading } = useClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const [newClassName, setNewClassName] = useState("");
  const [editingClass, setEditingClass] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleCreate = async () => {
    if (!newClassName.trim()) return;
    try {
      await createClass.mutateAsync(newClassName.trim());
      setNewClassName("");
      setDialogOpen(false);
      toast.success("Class created successfully");
    } catch (error) {
      toast.error("Failed to create class");
    }
  };

  const handleUpdate = async () => {
    if (!editingClass || !editingClass.name.trim()) return;
    try {
      await updateClass.mutateAsync({
        id: editingClass.id,
        name: editingClass.name.trim(),
      });
      setEditingClass(null);
      toast.success("Class updated successfully");
    } catch (error) {
      toast.error("Failed to update class");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await deleteClass.mutateAsync(id);
      toast.success("Class deleted successfully");
    } catch (error) {
      toast.error("Failed to delete class");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold">Admin Portal</span>
              <p className="text-xs text-primary-foreground/70">Boulough Al-Maram</p>
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
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Manage Classes
            </h1>
            <p className="text-muted-foreground">
              Add, edit, or delete school classes
            </p>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading">Classes</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Class name (e.g., Grade 9A)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                  <Button
                    onClick={handleCreate}
                    disabled={createClass.isPending}
                    className="w-full"
                  >
                    {createClass.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Create Class
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {classesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : classes?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No classes found. Add your first class!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes?.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>
                        {editingClass?.id === cls.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={editingClass.name}
                              onChange={(e) =>
                                setEditingClass({
                                  ...editingClass,
                                  name: e.target.value,
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleUpdate()
                              }
                            />
                            <Button size="sm" onClick={handleUpdate}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingClass(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          cls.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingClass?.id !== cls.id && (
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                setEditingClass({ id: cls.id, name: cls.name })
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(cls.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminClasses;
