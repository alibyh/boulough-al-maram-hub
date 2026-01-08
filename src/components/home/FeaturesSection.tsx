import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Globe, Microscope, Palette } from "lucide-react";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpen,
      title: t("features.academicExcellence.title"),
      description: t("features.academicExcellence.description"),
    },
    {
      icon: Users,
      title: t("features.experiencedFaculty.title"),
      description: t("features.experiencedFaculty.description"),
    },
    {
      icon: Award,
      title: t("features.characterBuilding.title"),
      description: t("features.characterBuilding.description"),
    },
    {
      icon: Globe,
      title: t("features.modernFacilities.title"),
      description: t("features.modernFacilities.description"),
    },
    {
      icon: Microscope,
      title: t("features.scienceResearch.title"),
      description: t("features.scienceResearch.description"),
    },
    {
      icon: Palette,
      title: t("features.artsCulture.title"),
      description: t("features.artsCulture.description"),
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-gold uppercase tracking-wider">
            {t("features.subtitle")}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {t("features.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("features.description")}
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
              {t("features.learnMoreButton")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
