import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy, Clock } from "lucide-react";
import heroImage from "@/assets/hero-school.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Boulough Al-Maram High School Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">
              Admissions Open for 2025-2026
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            Shaping Minds,{" "}
            <span className="text-gradient">Building Futures</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
            At Boulough Al-Maram High School, we combine academic excellence with
            strong moral values to nurture tomorrow's leaders. Join our community
            of learners and achievers.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/about">
              <Button variant="hero" size="xl">
                Explore Our School
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/student-login">
              <Button variant="hero-outline" size="xl">
                Student Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-in animation-delay-300">
          {[
            { icon: Users, value: "1,200+", label: "Students" },
            { icon: BookOpen, value: "50+", label: "Courses" },
            { icon: Trophy, value: "95%", label: "Success Rate" },
            { icon: Clock, value: "30+", label: "Years of Excellence" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                <stat.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <div className="font-heading text-xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
