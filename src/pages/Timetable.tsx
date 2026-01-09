import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Loader2, MapPin } from "lucide-react";
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
      <section className="bg-hero-gradient py-12 md:py-16">
        <div className="container">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              {t("timetablePage.title")}
            </h1>
            <p className="text-primary-foreground/80">
              {t("timetablePage.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-2xl">
          
          {/* Class Selector Pills */}
          {classesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !classes?.length ? (
            <div className="text-center text-muted-foreground py-12 bg-background rounded-xl">
              No classes available yet.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedClassId === cls.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-background text-foreground hover:bg-muted border border-border"
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>

              {/* Today/Tomorrow Toggle */}
              {selectedClass && (
                <div className="bg-background rounded-xl border border-border overflow-hidden mb-6">
                  <div className="grid grid-cols-2">
                    <button
                      onClick={() => setSelectedDay("today")}
                      className={`py-4 text-center font-medium transition-all relative ${
                        selectedDay === "today"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-sm">Today</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {getDayLabel("today")}
                      </span>
                      {selectedDay === "today" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedDay("tomorrow")}
                      className={`py-4 text-center font-medium transition-all relative border-l border-border ${
                        selectedDay === "tomorrow"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-sm">Tomorrow</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {getDayLabel("tomorrow")}
                      </span>
                      {selectedDay === "tomorrow" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  </div>

                  {/* Quick View Slots */}
                  <div className="border-t border-border">
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : !slotsForDay.length ? (
                      <div className="py-12 text-center text-muted-foreground">
                        No classes scheduled
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {slotsForDay.map((slot) => {
                          const status = getSlotStatus(slot);
                          const isOngoing = status?.type === "ongoing";
                          const isFinished = status?.type === "finished";

                          return (
                            <div
                              key={slot.id}
                              className={`p-4 ${isFinished ? "opacity-50" : ""} ${
                                isOngoing ? "bg-primary/5" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-foreground">
                                    {slot.subjects?.name || "Unknown Subject"}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <span>
                                      {formatTime(slot.start_time)}– {formatTime(slot.end_time)}
                                    </span>
                                    {slot.classroom && (
                                      <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {slot.classroom}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {status && selectedDay === "today" && (
                                  <span
                                    className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                                      isOngoing
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : isFinished
                                        ? "bg-muted text-muted-foreground"
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    }`}
                                  >
                                    {isOngoing && `${status.minutes}m left`}
                                    {status.type === "upcoming" && `in ${status.minutes}m`}
                                    {isFinished && "Done"}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full Week Schedule */}
              {selectedClass && !isLoading && timetableSlots && timetableSlots.length > 0 && (
                <div className="bg-background rounded-xl border border-border overflow-hidden">
                  {activeDays.map((dayOfWeek, idx) => {
                    const daySlots = timetableSlots
                      .filter(s => s.day_of_week === dayOfWeek)
                      .sort((a, b) => a.start_time.localeCompare(b.start_time));
                    
                    const isToday = dayOfWeek === todayDayOfWeek;
                    
                    // Calculate the actual date for this day of week
                    const dayDate = new Date();
                    const diff = dayOfWeek - todayDayOfWeek;
                    dayDate.setDate(dayDate.getDate() + (diff < 0 ? diff + 7 : diff));

                    return (
                      <div key={dayOfWeek} className={idx > 0 ? "border-t border-border" : ""}>
                        {/* Day Header */}
                        <div className={`px-4 py-3 ${isToday ? "bg-primary/5" : "bg-muted/50"}`}>
                          <span className={`font-semibold ${isToday ? "text-primary" : "text-foreground"}`}>
                            {DAY_NAMES[dayOfWeek]}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            {dayDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                          </span>
                        </div>

                        {/* Day Slots */}
                        <div className="divide-y divide-border/50">
                          {daySlots.map(slot => (
                            <div key={slot.id} className="px-4 py-3">
                              <h4 className="font-medium text-foreground">
                                {slot.subjects?.name || "Unknown Subject"}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span>
                                  {formatTime(slot.start_time)}– {formatTime(slot.end_time)}
                                </span>
                                {slot.classroom && (
                                  <>
                                    <span>•</span>
                                    <span>{slot.classroom}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Timetable;
