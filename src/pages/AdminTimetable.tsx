import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  LogOut,
  Loader2,
  Plus,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
import {
  useTimetableByClass,
  useCreateTimetableSlot,
  useDeleteTimetableSlot,
  DAY_NAMES,
} from "@/hooks/useTimetable";
import { toast } from "sonner";

// Predefined time slots
const PREDEFINED_SLOTS = [
  { label: "08:00 - 10:00", start_time: "08:00", end_time: "10:00" },
  { label: "10:00 - 12:00", start_time: "10:00", end_time: "12:00" },
  { label: "12:00 - 14:00", start_time: "12:00", end_time: "14:00" },
];

const AdminTimetable = () => {
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: classes, isLoading: classesLoading } = useClasses();
  const { data: subjects } = useSubjects();

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const { data: timetableSlots, isLoading: timetableLoading } =
    useTimetableByClass(selectedClassId);

  const createSlot = useCreateTimetableSlot();
  const deleteSlot = useDeleteTimetableSlot();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [newSlot, setNewSlot] = useState({
    subject_id: "",
    day_of_week: 0,
    time_slot: "0", // index of predefined slot
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (classes?.length && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  if (isLoading || classesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleCreateSlot = async () => {
    let startTime = newSlot.start_time;
    let endTime = newSlot.end_time;

    if (!useCustomTime) {
      const selectedSlot = PREDEFINED_SLOTS[parseInt(newSlot.time_slot)];
      startTime = selectedSlot.start_time;
      endTime = selectedSlot.end_time;
    }

    if (!selectedClassId || !newSlot.subject_id || !startTime || !endTime) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await createSlot.mutateAsync({
        class_id: selectedClassId,
        subject_id: newSlot.subject_id,
        day_of_week: newSlot.day_of_week,
        start_time: startTime,
        end_time: endTime,
      });
      setNewSlot({ subject_id: "", day_of_week: 0, time_slot: "0", start_time: "", end_time: "" });
      setUseCustomTime(false);
      setDialogOpen(false);
      toast.success("Time slot added successfully");
    } catch (error) {
      toast.error("Failed to add time slot");
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time slot?")) return;
    try {
      await deleteSlot.mutateAsync(id);
      toast.success("Time slot deleted successfully");
    } catch (error) {
      toast.error("Failed to delete time slot");
    }
  };

  // Group slots by day for display
  const slotsByDay = timetableSlots?.reduce(
    (acc, slot) => {
      const day = slot.day_of_week;
      if (!acc[day]) acc[day] = [];
      acc[day].push(slot);
      return acc;
    },
    {} as Record<number, typeof timetableSlots>
  );

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
              Manage Timetable
            </h1>
            <p className="text-muted-foreground">
              Configure class schedules
            </p>
          </div>
        </div>

        <Card className="border-border/50 mb-6">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="font-heading">Timetable</CardTitle>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold" disabled={!selectedClassId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Time Slot</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select
                      value={newSlot.subject_id}
                      onValueChange={(v) =>
                        setNewSlot({ ...newSlot, subject_id: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects?.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select
                      value={newSlot.day_of_week.toString()}
                      onValueChange={(v) =>
                        setNewSlot({ ...newSlot, day_of_week: parseInt(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAY_NAMES.map((day, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Slot</Label>
                    {!useCustomTime ? (
                      <Select
                        value={newSlot.time_slot}
                        onValueChange={(v) =>
                          setNewSlot({ ...newSlot, time_slot: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PREDEFINED_SLOTS.map((slot, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={newSlot.start_time}
                            onChange={(e) =>
                              setNewSlot({ ...newSlot, start_time: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={newSlot.end_time}
                            onChange={(e) =>
                              setNewSlot({ ...newSlot, end_time: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setUseCustomTime(!useCustomTime)}
                    >
                      {useCustomTime ? "Use predefined slots" : "Add custom time"}
                    </Button>
                  </div>
                  <Button
                    onClick={handleCreateSlot}
                    disabled={createSlot.isPending}
                    className="w-full"
                  >
                    {createSlot.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Add Slot
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {!selectedClassId ? (
              <p className="text-center text-muted-foreground py-8">
                Please select a class to view its timetable
              </p>
            ) : timetableLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !timetableSlots?.length ? (
              <p className="text-center text-muted-foreground py-8">
                No time slots found. Add your first slot!
              </p>
            ) : (
              <div className="space-y-6">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const daySlots = slotsByDay?.[day];
                  if (!daySlots?.length) return null;
                  return (
                    <div key={day}>
                      <h3 className="font-semibold mb-2">{DAY_NAMES[day]}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {daySlots
                            .sort((a, b) => a.start_time.localeCompare(b.start_time))
                            .map((slot) => (
                              <TableRow key={slot.id}>
                                <TableCell>
                                  {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                </TableCell>
                                <TableCell>{slot.subjects?.name}</TableCell>
                                <TableCell>
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDeleteSlot(slot.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminTimetable;
