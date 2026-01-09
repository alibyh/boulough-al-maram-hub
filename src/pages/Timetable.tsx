import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Loader2, BookOpen, MapPin, Timer, Calendar } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useTimetableByClass, TimetableSlot, DAY_NAMES } from "@/hooks/useTimetable";

const Timetable = () => {
  const { t } = useTranslation();
  const { data: classes, isLoading: classesLoading } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today");
  const [now, setNow] = useState(new Date());

  // Update time every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Set first class as default when loaded
  useEffect(() => {
    if (classes?.length && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { data: timetableSlots, isLoading: timetableLoading } =
    useTimetableByClass(selectedClassId);

  // Get today and tomorrow's day of week (0=Sunday, 6=Saturday)
  const todayDayOfWeek = now.getDay();
  const tomorrowDayOfWeek = (todayDayOfWeek + 1) % 7;

  // Get slots for selected day
  const displayDayOfWeek = selectedDay === "today" ? todayDayOfWeek : tomorrowDayOfWeek;
  
  const slotsForDay = useMemo(() => {
    if (!timetableSlots?.length) return [];
    return timetableSlots
      .filter((slot) => slot.day_of_week === displayDayOfWeek)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [timetableSlots, displayDayOfWeek]);

  // Get unique time slots and organize data for full table
  const weeklySchedule = useMemo(() => {
    if (!timetableSlots?.length) return { timeSlots: [], grid: {} };
    
    // Get unique time slots sorted
    const timeSlots = [...new Set(timetableSlots.map(s => `${s.start_time}-${s.end_time}`))]
      .sort()
      .map(ts => {
        const [start, end] = ts.split("-");
        return { start, end, key: ts };
      });

    // Create grid: { "08:00-10:00": { 0: slot, 1: slot, ... } }
    const grid: Record<string, Record<number, TimetableSlot>> = {};
    timeSlots.forEach(ts => {
      grid[ts.key] = {};
    });
    
    timetableSlots.forEach(slot => {
      const key = `${slot.start_time}-${slot.end_time}`;
      if (grid[key]) {
        grid[key][slot.day_of_week] = slot;
      }
    });

    return { timeSlots, grid };
  }, [timetableSlots]);

  // Get days that have at least one class
  const activeDays = useMemo(() => {
    if (!timetableSlots?.length) return [];
    const days = [...new Set(timetableSlots.map(s => s.day_of_week))].sort();
    return days;
  }, [timetableSlots]);

  // Calculate time status for a slot
  const getSlotStatus = (slot: TimetableSlot) => {
    if (selectedDay !== "today") return null;
    
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    
    const [startH, startM] = slot.start_time.split(":").map(Number);
    const [endH, endM] = slot.end_time.split(":").map(Number);
    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    if (currentTotalMinutes < startTotalMinutes) {
      const minsUntilStart = startTotalMinutes - currentTotalMinutes;
      return { type: "upcoming", minutes: minsUntilStart };
    } else if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes) {
      const minsUntilEnd = endTotalMinutes - currentTotalMinutes;
      return { type: "ongoing", minutes: minsUntilEnd };
    } else {
      return { type: "finished", minutes: 0 };
    }
  };

  const formatTime = (time: string) => time.slice(0, 5);

  const getDayLabel = (day: "today" | "tomorrow") => {
    const date = new Date();
    if (day === "tomorrow") date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const selectedClass = classes?.find((c) => c.id === selectedClassId);
  const isLoading = classesLoading || timetableLoading;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl animate-fade-in">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              {t("common.timetable")}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mt-2 mb-4">
              {t("timetablePage.title")}
            </h1>
            <p className="text-lg text-primary-foreground/80">
              {t("timetablePage.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Timetable */}
      <section className="py-16">
        <div className="container max-w-5xl">
          {/* Class Selector */}
          <Card className="border-border/50 shadow-elegant mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="font-heading">
                  {t("timetablePage.selectGrade")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {classesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !classes?.length ? (
                <p className="text-center text-muted-foreground py-4">
                  No classes available yet.
                </p>
              ) : (
                <Tabs
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                  className="w-full"
                >
                  <TabsList className="flex-wrap h-auto w-full justify-start">
                    {classes.map((cls) => (
                      <TabsTrigger key={cls.id} value={cls.id}>
                        {cls.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Today/Tomorrow Section */}
          {selectedClass && (
            <Card className="border-border/50 shadow-elegant mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-heading">Quick View</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* Today/Tomorrow Tabs */}
                <div className="mb-6">
                  <Tabs
                    value={selectedDay}
                    onValueChange={(v) => setSelectedDay(v as "today" | "tomorrow")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-14">
                      <TabsTrigger value="today" className="text-base py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-semibold">Today</span>
                          <span className="text-xs opacity-80">
                            {getDayLabel("today")}
                          </span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="tomorrow" className="text-base py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-semibold">Tomorrow</span>
                          <span className="text-xs opacity-80">
                            {getDayLabel("tomorrow")}
                          </span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Schedule for selected day */}
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !slotsForDay.length ? (
                  <div className="py-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
                    No classes scheduled for {selectedDay === "today" ? "today" : "tomorrow"}.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {slotsForDay.map((slot) => {
                      const status = getSlotStatus(slot);
                      const isOngoing = status?.type === "ongoing";
                      const isUpcoming = status?.type === "upcoming";
                      const isFinished = status?.type === "finished";

                      return (
                        <div
                          key={slot.id}
                          className={`flex items-center justify-between gap-4 p-4 rounded-lg border transition-all ${
                            isOngoing
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : isFinished
                              ? "border-border/50 bg-muted/30 opacity-60"
                              : "border-border/50 bg-background hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Time */}
                            <div className="flex flex-col items-center text-center min-w-[60px]">
                              <span className="text-sm font-semibold text-foreground">
                                {formatTime(slot.start_time)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(slot.end_time)}
                              </span>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-10 bg-border" />

                            {/* Subject & Classroom */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                                <span className="font-medium text-foreground truncate">
                                  {slot.subjects?.name || "Unknown Subject"}
                                </span>
                              </div>
                              {slot.classroom && (
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                  <span className="text-sm text-muted-foreground truncate">
                                    {slot.classroom}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          {status && selectedDay === "today" && (
                            <div
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                isOngoing
                                  ? "bg-primary text-primary-foreground"
                                  : isUpcoming
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <Timer className="h-3 w-3" />
                              {isOngoing && <span>{status.minutes}m left</span>}
                              {isUpcoming && <span>in {status.minutes}m</span>}
                              {isFinished && <span>Done</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Full Weekly Timetable */}
          {selectedClass && !isLoading && timetableSlots?.length > 0 && (
            <Card className="border-border/50 shadow-elegant">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-heading">Full Week Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-6 px-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[100px] font-semibold">Time</TableHead>
                        {activeDays.map(day => (
                          <TableHead 
                            key={day} 
                            className={`text-center font-semibold min-w-[120px] ${
                              day === todayDayOfWeek ? "text-primary" : ""
                            }`}
                          >
                            {DAY_NAMES[day]}
                            {day === todayDayOfWeek && (
                              <span className="block text-xs font-normal text-primary">Today</span>
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeklySchedule.timeSlots.map(({ start, end, key }) => (
                        <TableRow key={key} className="hover:bg-muted/30">
                          <TableCell className="font-medium text-sm whitespace-nowrap">
                            {formatTime(start)}
                            <span className="text-muted-foreground"> - </span>
                            {formatTime(end)}
                          </TableCell>
                          {activeDays.map(day => {
                            const slot = weeklySchedule.grid[key]?.[day];
                            return (
                              <TableCell 
                                key={day} 
                                className={`text-center p-2 ${
                                  day === todayDayOfWeek ? "bg-primary/5" : ""
                                }`}
                              >
                                {slot ? (
                                  <div className="p-2 rounded-md bg-accent/50 border border-border/30">
                                    <div className="font-medium text-sm text-foreground">
                                      {slot.subjects?.name}
                                    </div>
                                    {slot.classroom && (
                                      <div className="text-xs text-muted-foreground mt-0.5">
                                        {slot.classroom}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/40">—</span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Timetable;
