import Layout from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("contactPage.messageSent"),
      description: t("contactPage.toastDescription"),
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl animate-fade-in">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              {t("contactPage.headerLabel")}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mt-2 mb-4">
              {t("contactPage.title")}
            </h1>
            <p className="text-lg text-primary-foreground/80">
              {t("contactPage.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  titleKey: "contactPage.address",
                  contentKey: "contactPage.addressContent",
                },
                {
                  icon: Phone,
                  titleKey: "contactPage.phone",
                  contentKey: "contactPage.phoneContent",
                },
                {
                  icon: Mail,
                  titleKey: "contactPage.email",
                  contentKey: "contactPage.emailContent",
                },
                {
                  icon: Clock,
                  titleKey: "contactPage.officeHours",
                  contentKey: "contactPage.officeHoursContent",
                },
              ].map((item, i) => (
                <Card key={i} className="border-border/50 hover:border-gold/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-foreground mb-1">
                          {t(item.titleKey)}
                        </h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {t(item.contentKey)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 border-border/50 shadow-elegant">
              <CardContent className="p-8">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                  {t("contactPage.sendMessage")}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t("contactPage.formName")}
                      </label>
                      <Input
                        placeholder={t("contactPage.namePlaceholder")}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t("contactPage.formEmail")}
                      </label>
                      <Input
                        type="email"
                        placeholder={t("contactPage.emailPlaceholder")}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t("contactPage.formSubject")}
                    </label>
                    <Input
                      placeholder={t("contactPage.subjectPlaceholder")}
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t("contactPage.formMessage")}
                    </label>
                    <Textarea
                      placeholder={t("contactPage.messagePlaceholder")}
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" variant="gold" size="lg">
                    {t("contactPage.formSubmit")}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-border/50 h-80 bg-muted flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {t("contactPage.mapPlaceholder")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
