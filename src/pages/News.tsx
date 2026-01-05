import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const allNews = [
  {
    id: 1,
    title: "Annual Science Fair Winners Announced",
    excerpt: "Congratulations to our students who excelled in the regional science fair competition. Our team brought home first place with their innovative solar energy project.",
    date: "December 28, 2025",
    category: "Achievement",
  },
  {
    id: 2,
    title: "New Library Wing Opening Ceremony",
    excerpt: "We are excited to announce the opening of our new state-of-the-art library facility featuring digital resources and collaborative learning spaces.",
    date: "December 20, 2025",
    category: "Campus",
  },
  {
    id: 3,
    title: "Winter Break Schedule",
    excerpt: "Important information about the upcoming winter break. Classes will resume on January 6th, 2026. Wishing all families a restful holiday season.",
    date: "December 15, 2025",
    category: "Announcement",
  },
  {
    id: 4,
    title: "Sports Day 2025 Highlights",
    excerpt: "Relive the excitement of our annual sports day! Students showcased their athletic abilities in various track and field events.",
    date: "December 10, 2025",
    category: "Events",
  },
  {
    id: 5,
    title: "Parent-Teacher Meeting Schedule",
    excerpt: "The next parent-teacher meeting is scheduled for January 15th. Please mark your calendars and confirm your attendance.",
    date: "December 5, 2025",
    category: "Announcement",
  },
  {
    id: 6,
    title: "Mathematics Olympiad Success",
    excerpt: "Our students secured top positions in the national mathematics olympiad. Three students qualified for the international round.",
    date: "November 28, 2025",
    category: "Achievement",
  },
];

const News = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl animate-fade-in">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              News & Events
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mt-2 mb-4">
              Latest Updates
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Stay informed about school events, achievements, and announcements.
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="container">
          {/* Search */}
          <div className="max-w-md mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNews.map((item, index) => (
              <Card
                key={item.id}
                className="group overflow-hidden border-border/50 hover:border-gold/50 transition-all duration-300 hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-accent-foreground">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                    </div>
                    <Button variant="ghost" size="sm" className="group/btn">
                      Read More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
