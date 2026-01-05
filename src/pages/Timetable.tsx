import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";

const scheduleData = {
  "Grade 9": [
    { time: "7:30 - 8:15", monday: "Mathematics", tuesday: "English", wednesday: "Arabic", thursday: "Physics", friday: "History" },
    { time: "8:20 - 9:05", monday: "English", tuesday: "Physics", wednesday: "Mathematics", thursday: "Chemistry", friday: "Geography" },
    { time: "9:10 - 9:55", monday: "Arabic", tuesday: "Chemistry", wednesday: "Biology", thursday: "English", friday: "Mathematics" },
    { time: "10:00 - 10:20", monday: "Break", tuesday: "Break", wednesday: "Break", thursday: "Break", friday: "Break" },
    { time: "10:20 - 11:05", monday: "Physics", tuesday: "Biology", wednesday: "English", thursday: "Arabic", friday: "PE" },
    { time: "11:10 - 11:55", monday: "Biology", tuesday: "Arabic", wednesday: "Physics", thursday: "Mathematics", friday: "Art" },
    { time: "12:00 - 12:45", monday: "History", tuesday: "ICT", wednesday: "Chemistry", thursday: "ICT", friday: "Islamic Studies" },
  ],
  "Grade 10": [
    { time: "7:30 - 8:15", monday: "Physics", tuesday: "Mathematics", wednesday: "English", thursday: "Arabic", friday: "Chemistry" },
    { time: "8:20 - 9:05", monday: "Chemistry", tuesday: "English", wednesday: "Mathematics", thursday: "Physics", friday: "Biology" },
    { time: "9:10 - 9:55", monday: "English", tuesday: "Arabic", wednesday: "Chemistry", thursday: "Biology", friday: "Mathematics" },
    { time: "10:00 - 10:20", monday: "Break", tuesday: "Break", wednesday: "Break", thursday: "Break", friday: "Break" },
    { time: "10:20 - 11:05", monday: "Arabic", tuesday: "Physics", wednesday: "Biology", thursday: "English", friday: "History" },
    { time: "11:10 - 11:55", monday: "Mathematics", tuesday: "Chemistry", wednesday: "Arabic", thursday: "ICT", friday: "Geography" },
    { time: "12:00 - 12:45", monday: "ICT", tuesday: "History", wednesday: "PE", thursday: "Art", friday: "Islamic Studies" },
  ],
  "Grade 11": [
    { time: "7:30 - 8:15", monday: "Advanced Math", tuesday: "Physics", wednesday: "Chemistry", thursday: "English", friday: "Arabic" },
    { time: "8:20 - 9:05", monday: "Physics", tuesday: "Advanced Math", wednesday: "English", thursday: "Chemistry", friday: "Biology" },
    { time: "9:10 - 9:55", monday: "Chemistry", tuesday: "English", wednesday: "Advanced Math", thursday: "Biology", friday: "Physics" },
    { time: "10:00 - 10:20", monday: "Break", tuesday: "Break", wednesday: "Break", thursday: "Break", friday: "Break" },
    { time: "10:20 - 11:05", monday: "English", tuesday: "Biology", wednesday: "Physics", thursday: "Advanced Math", friday: "Chemistry" },
    { time: "11:10 - 11:55", monday: "Arabic", tuesday: "Arabic", wednesday: "Biology", thursday: "Arabic", friday: "ICT" },
    { time: "12:00 - 12:45", monday: "Research", tuesday: "Research", wednesday: "Research", thursday: "Research", friday: "Islamic Studies" },
  ],
};

const Timetable = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl animate-fade-in">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              Schedule
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mt-2 mb-4">
              Class Timetable
            </h1>
            <p className="text-lg text-primary-foreground/80">
              View the weekly schedule for each grade level.
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
                <CardTitle className="font-heading">Weekly Schedule</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="Grade 9" className="w-full">
                <TabsList className="mb-6">
                  {Object.keys(scheduleData).map((grade) => (
                    <TabsTrigger key={grade} value={grade}>
                      {grade}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(scheduleData).map(([grade, schedule]) => (
                  <TabsContent key={grade} value={grade}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Time</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Monday</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Tuesday</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Wednesday</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Thursday</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Friday</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.map((row, i) => (
                            <tr
                              key={i}
                              className={`border-b border-border/50 ${
                                row.monday === "Break" ? "bg-muted/50" : ""
                              }`}
                            >
                              <td className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                                {row.time}
                              </td>
                              <td className="px-4 py-3">{row.monday}</td>
                              <td className="px-4 py-3">{row.tuesday}</td>
                              <td className="px-4 py-3">{row.wednesday}</td>
                              <td className="px-4 py-3">{row.thursday}</td>
                              <td className="px-4 py-3">{row.friday}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Timetable;
