import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  FileText,
  Calendar,
  Bell,
  LogOut,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";

const mockResults = [
  { subject: "Mathematics", grade: "A", score: 92 },
  { subject: "Physics", grade: "A-", score: 88 },
  { subject: "Chemistry", grade: "B+", score: 85 },
  { subject: "English", grade: "A", score: 91 },
  { subject: "Arabic", grade: "A+", score: 96 },
  { subject: "Biology", grade: "B+", score: 84 },
];

const announcements = [
  { title: "Final Exams Schedule Released", date: "Jan 5, 2026" },
  { title: "Winter Break: Dec 20 - Jan 5", date: "Dec 15, 2025" },
  { title: "Science Fair Registration Open", date: "Dec 10, 2025" },
];

const StudentDashboard = () => {
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
              <span className="font-heading text-lg font-bold">Student Portal</span>
              <p className="text-xs text-primary-foreground/70">Boulough Al-Maram</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">Welcome, Ahmed</span>
            <Link to="/">
              <Button variant="hero-outline" size="sm">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Welcome back, Ahmed!
          </h1>
          <p className="text-muted-foreground">
            Grade 11 - Science Stream | Student ID: STU2024001
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: "Overall GPA", value: "3.75" },
            { icon: Award, label: "Class Rank", value: "#5" },
            { icon: Clock, label: "Attendance", value: "96%" },
            { icon: BookOpen, label: "Current Courses", value: "8" },
          ].map((stat, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-heading text-xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Results */}
          <Card className="lg:col-span-2 border-border/50 shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-heading">Current Semester Results</CardTitle>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Subject</th>
                      <th className="px-4 py-3 text-center font-semibold text-foreground">Grade</th>
                      <th className="px-4 py-3 text-center font-semibold text-foreground">Score</th>
                      <th className="px-4 py-3 text-right font-semibold text-foreground">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockResults.map((result, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-4 py-3 font-medium">{result.subject}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 rounded-md bg-accent text-accent-foreground font-semibold">
                            {result.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground">
                          {result.score}%
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full"
                                style={{ width: `${result.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Announcements */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-lg">Announcements</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4">
                  {announcements.map((item, i) => (
                    <li key={i} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Calendar, label: "Timetable" },
                    { icon: FileText, label: "Transcripts" },
                    { icon: BookOpen, label: "Study Materials" },
                    { icon: Bell, label: "Notifications" },
                  ].map((link, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2"
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="text-xs">{link.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
