import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Loader2, BookOpen } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useTimetableByClass, DAY_NAMES, TimetableSlot } from "@/hooks/useTimetable";

const Timetable = () => {
  const { t } = useTranslation();
  const { data: classes, isLoading: classesLoading } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Set first class as default when loaded
  useEffect(() => {
    if (classes?.length && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { data: timetableSlots, isLoading: timetableLoading } =
    useTimetableByClass(selectedClassId);

  // Group slots by day, only include days that have classes
  const slotsByDay = useMemo(() => {
    if (!timetableSlots?.length) return {};
    
    const grouped: Record<number, TimetableSlot[]> = {};
    
    timetableSlots.forEach((slot) => {
      if (!grouped[slot.day_of_week]) {
        grouped[slot.day_of_week] = [];
      }
      grouped[slot.day_of_week].push(slot);
    });

    // Sort slots within each day by start_time
    Object.keys(grouped).forEach((day) => {
      grouped[Number(day)].sort((a, b) => 
        a.start_time.localeCompare(b.start_time)
      );
    });

    return grouped;
  }, [timetableSlots]);

  // Get days that have classes, sorted
  const daysWithClasses = useMemo(() => {
    return Object.keys(slotsByDay)
      .map(Number)
      .sort((a, b) => a - b);
  }, [slotsByDay]);

  const selectedClass = classes?.find((c) => c.id === selectedClassId);
  const isLoading = classesLoading || timetableLoading;

  const formatTime = (time: string) => time.slice(0, 5);

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

          {/* Selected Class Info */}
          {selectedClass && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {selectedClass.name}
              </h2>
            </div>
          )}

          {/* Schedule by Day */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !daysWithClasses.length ? (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                No timetable configured for this class yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {daysWithClasses.map((day) => (
                <div key={day} className="space-y-3">
                  {/* Day Header */}
                  <h3 className="font-heading text-lg font-bold text-foreground border-b border-border pb-2">
                    {t(`timetablePage.${DAY_NAMES[day].toLowerCase()}`)}
                  </h3>

                  {/* Slots for this day */}
                  <div className="space-y-3">
                    {slotsByDay[day].map((slot) => (
                      <Card 
                        key={slot.id} 
                        className="border-border/50 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Time Badge */}
                            <div className="flex-shrink-0 min-w-[100px]">
                              <div className="text-sm font-medium text-muted-foreground">
                                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                              </div>
                            </div>

                            {/* Subject Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-foreground">
                                  {slot.subjects?.name || "Unknown Subject"}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Timetable;
