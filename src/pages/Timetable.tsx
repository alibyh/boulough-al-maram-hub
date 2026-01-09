import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Loader2, BookOpen, MapPin, Timer } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useTimetableByClass, TimetableSlot } from "@/hooks/useTimetable";

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
        <div className="container max-w-3xl">
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

          {/* Today/Tomorrow Tabs */}
          {selectedClass && (
            <div className="mb-6">
              <Tabs
                value={selectedDay}
                onValueChange={(v) => setSelectedDay(v as "today" | "tomorrow")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="today" className="text-base py-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-semibold">Today</span>
                      <span className="text-xs text-muted-foreground">
                        {getDayLabel("today")}
                      </span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="tomorrow" className="text-base py-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-semibold">Tomorrow</span>
                      <span className="text-xs text-muted-foreground">
                        {getDayLabel("tomorrow")}
                      </span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Schedule */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !slotsForDay.length ? (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                No classes scheduled for {selectedDay === "today" ? "today" : "tomorrow"}.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {slotsForDay.map((slot) => {
                const status = getSlotStatus(slot);
                const isOngoing = status?.type === "ongoing";
                const isUpcoming = status?.type === "upcoming";
                const isFinished = status?.type === "finished";

                return (
                  <Card
                    key={slot.id}
                    className={`border-border/50 transition-all ${
                      isOngoing
                        ? "ring-2 ring-primary bg-primary/5"
                        : isFinished
                        ? "opacity-60"
                        : ""
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          {/* Subject Name */}
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <h4 className="font-heading text-lg font-semibold text-foreground">
                              {slot.subjects?.name || "Unknown Subject"}
                            </h4>
                          </div>

                          {/* Time and Classroom */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                              </span>
                            </div>
                            {slot.classroom && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{slot.classroom}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        {status && selectedDay === "today" && (
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                              isOngoing
                                ? "bg-primary text-primary-foreground"
                                : isUpcoming
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Timer className="h-3.5 w-3.5" />
                            {isOngoing && <span>{status.minutes}m left</span>}
                            {isUpcoming && <span>in {status.minutes}m</span>}
                            {isFinished && <span>Done</span>}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Timetable;
