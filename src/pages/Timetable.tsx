import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Loader2 } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useTimetableByClass, DAY_NAMES } from "@/hooks/useTimetable";

const Timetable = () => {
  const { t } = useTranslation();
  const { data: classes, isLoading: classesLoading } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Set first class as default when loaded
  useMemo(() => {
    if (classes?.length && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { data: timetableSlots, isLoading: timetableLoading } =
    useTimetableByClass(selectedClassId);

  // Get unique time slots for the grid
  const timeSlots = useMemo(() => {
    if (!timetableSlots?.length) return [];
    const times = new Set<string>();
    timetableSlots.forEach((slot) => {
      times.add(`${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`);
    });
    return Array.from(times).sort();
  }, [timetableSlots]);

  // Create a lookup for slots by day and time
  const slotLookup = useMemo(() => {
    if (!timetableSlots?.length) return {};
    const lookup: Record<string, string> = {};
    timetableSlots.forEach((slot) => {
      const key = `${slot.day_of_week}-${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`;
      lookup[key] = slot.subjects?.name || "";
    });
    return lookup;
  }, [timetableSlots]);

  // Days to show (Sunday to Thursday for schools)
  const daysToShow = [0, 1, 2, 3, 4]; // Sunday to Thursday

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
        <div className="container">
          <Card className="border-border/50 shadow-elegant">
            <CardHeader>
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
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !classes?.length ? (
                <p className="text-center text-muted-foreground py-8">
                  No classes available yet.
                </p>
              ) : (
                <Tabs
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                  className="w-full"
                >
                  <TabsList className="mb-6 flex-wrap h-auto">
                    {classes.map((cls) => (
                      <TabsTrigger key={cls.id} value={cls.id}>
                        {cls.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {classes.map((cls) => (
                    <TabsContent key={cls.id} value={cls.id}>
                      {timetableLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : !timeSlots.length ? (
                        <p className="text-center text-muted-foreground py-8">
                          No timetable configured for this class yet.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="px-4 py-3 text-left font-semibold text-foreground">
                                  {t("timetablePage.time")}
                                </th>
                                {daysToShow.map((day) => (
                                  <th
                                    key={day}
                                    className="px-4 py-3 text-left font-semibold text-foreground"
                                  >
                                    {t(`timetablePage.${DAY_NAMES[day].toLowerCase()}`)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {timeSlots.map((time, i) => (
                                <tr
                                  key={i}
                                  className="border-b border-border/50"
                                >
                                  <td className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                                    {time}
                                  </td>
                                  {daysToShow.map((day) => (
                                    <td key={day} className="px-4 py-3">
                                      {slotLookup[`${day}-${time}`] || "-"}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Timetable;
