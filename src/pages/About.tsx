import Layout from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, BookOpen } from "lucide-react";

const About = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Header */}
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl animate-fade-in">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              {t("aboutPage.title")}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mt-2 mb-4">
              {t("aboutPage.subtitle")}
            </h1>
            <p className="text-lg text-primary-foreground/80">
              {t("aboutPage.headerDescription")}
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
                {t("aboutPage.heritage")}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                {t("aboutPage.heritageTitle")}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t("aboutPage.historyPara1")}</p>
                <p>{t("aboutPage.historyPara2")}</p>
                <p>{t("aboutPage.historyPara3")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-fade-in animation-delay-200">
              {[
                { value: "1995", label: t("aboutPage.stats.yearFounded") },
                { value: "1,200+", label: t("aboutPage.stats.students") },
                { value: "80+", label: t("aboutPage.stats.facultyMembers") },
                { value: "95%", label: t("aboutPage.stats.universityPlacement") },
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
                titleKey: "aboutPage.missionTitle",
                contentKey: "aboutPage.missionContent",
              },
              {
                icon: Eye,
                titleKey: "aboutPage.visionTitle",
                contentKey: "aboutPage.visionContent",
              },
              {
                icon: Heart,
                titleKey: "aboutPage.valuesTitle",
                contentKey: "aboutPage.valuesContent",
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
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(item.contentKey)}
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
              {t("aboutPage.whatWeOffer")}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
              {t("aboutPage.programsFacilities")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                titleKey: "aboutPage.academicPrograms",
                itemKeys: [
                  "aboutPage.academicProgramsItem1",
                  "aboutPage.academicProgramsItem2",
                  "aboutPage.academicProgramsItem3",
                  "aboutPage.academicProgramsItem4",
                ],
              },
              {
                icon: Award,
                titleKey: "aboutPage.extracurricular",
                itemKeys: [
                  "aboutPage.extracurricularItem1",
                  "aboutPage.extracurricularItem2",
                  "aboutPage.extracurricularItem3",
                  "aboutPage.extracurricularItem4",
                ],
              },
              {
                icon: Users,
                titleKey: "aboutPage.supportServices",
                itemKeys: [
                  "aboutPage.supportServicesItem1",
                  "aboutPage.supportServicesItem2",
                  "aboutPage.supportServicesItem3",
                  "aboutPage.supportServicesItem4",
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
                      {t(section.titleKey)}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {section.itemKeys.map((key, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {t(key)}
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
