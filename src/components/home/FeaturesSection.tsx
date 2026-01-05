import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Globe, Microscope, Palette } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Comprehensive curriculum aligned with international standards for holistic education.",
  },
  {
    icon: Users,
    title: "Experienced Faculty",
    description: "Dedicated teachers with years of experience in nurturing young minds.",
  },
  {
    icon: Award,
    title: "Character Building",
    description: "Strong emphasis on moral values, ethics, and personal development.",
  },
  {
    icon: Globe,
    title: "Modern Facilities",
    description: "State-of-the-art classrooms, labs, and recreational spaces for students.",
  },
  {
    icon: Microscope,
    title: "Science & Research",
    description: "Well-equipped laboratories for hands-on learning in sciences.",
  },
  {
    icon: Palette,
    title: "Arts & Culture",
    description: "Rich programs in arts, music, and cultural activities.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-gold uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Excellence in Every Aspect
          </h2>
          <p className="text-muted-foreground">
            We provide a nurturing environment where students thrive academically,
            socially, and personally.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-gold/50 transition-all duration-300 hover:shadow-elegant animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent mb-5 group-hover:bg-gold/20 transition-colors">
                <feature.icon className="h-7 w-7 text-primary group-hover:text-gold transition-colors" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/about">
            <Button variant="default" size="lg">
              Learn More About Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
