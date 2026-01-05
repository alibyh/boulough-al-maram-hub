import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Annual Science Fair Winners Announced",
    excerpt: "Congratulations to our students who excelled in the regional science fair competition...",
    date: "December 28, 2025",
    category: "Achievement",
  },
  {
    id: 2,
    title: "New Library Wing Opening Ceremony",
    excerpt: "We are excited to announce the opening of our new state-of-the-art library facility...",
    date: "December 20, 2025",
    category: "Campus",
  },
  {
    id: 3,
    title: "Winter Break Schedule",
    excerpt: "Important information about the upcoming winter break and return dates for students...",
    date: "December 15, 2025",
    category: "Announcement",
  },
];

const NewsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              Stay Updated
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
              Latest News & Events
            </h2>
          </div>
          <Link to="/news">
            <Button variant="outline" className="group">
              View All News
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-border/50 hover:border-gold/50 transition-all duration-300 hover:shadow-elegant animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
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
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
