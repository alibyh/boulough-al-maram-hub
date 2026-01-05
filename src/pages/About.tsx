import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, BookOpen } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl animate-fade-in">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mt-2 mb-4">
              Our Story
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Discover the journey, mission, and values that make Boulough Al-Maram
              a leading institution in education.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="text-sm font-semibold text-gold uppercase tracking-wider">
                Our Heritage
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                30+ Years of Educational Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 1995, Boulough Al-Maram High School has been a beacon
                  of academic excellence and moral education. Our school was
                  established with a vision to provide quality education that
                  combines modern learning with traditional values.
                </p>
                <p>
                  Over the years, we have grown from a small institution with just
                  a few classrooms to a comprehensive educational facility serving
                  over 1,200 students. Our alumni have gone on to excel in various
                  fields, from medicine and engineering to arts and business.
                </p>
                <p>
                  Today, we continue to evolve and adapt to the changing
                  educational landscape while staying true to our core mission of
                  developing well-rounded individuals who contribute positively to
                  society.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-fade-in animation-delay-200">
              {[
                { value: "1995", label: "Year Founded" },
                { value: "1,200+", label: "Students" },
                { value: "80+", label: "Faculty Members" },
                { value: "95%", label: "University Placement" },
              ].map((stat, i) => (
                <Card key={i} className="border-border/50 hover:border-gold/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="font-heading text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                content:
                  "To provide a comprehensive education that nurtures intellectual growth, moral character, and social responsibility, preparing students to become leaders and positive contributors to society.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                content:
                  "To be a leading educational institution recognized for academic excellence, innovative teaching methods, and the development of well-rounded individuals who embody knowledge, ethics, and leadership.",
              },
              {
                icon: Heart,
                title: "Our Values",
                content:
                  "Excellence in education, respect for all individuals, integrity in actions, commitment to community service, and continuous pursuit of knowledge and self-improvement.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-border/50 hover:border-gold/50 transition-all hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent mb-6">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
              Programs & Facilities
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Academic Programs",
                items: [
                  "Sciences (Physics, Chemistry, Biology)",
                  "Mathematics & Statistics",
                  "Languages (Arabic, English, French)",
                  "Social Sciences & Humanities",
                ],
              },
              {
                icon: Award,
                title: "Extracurricular",
                items: [
                  "Sports teams & competitions",
                  "Art & music programs",
                  "Debate & public speaking",
                  "Community service clubs",
                ],
              },
              {
                icon: Users,
                title: "Support Services",
                items: [
                  "Academic counseling",
                  "Career guidance",
                  "Learning support center",
                  "Parent engagement programs",
                ],
              },
            ].map((section, i) => (
              <Card
                key={i}
                className="border-border/50 hover:border-gold/50 transition-all hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
