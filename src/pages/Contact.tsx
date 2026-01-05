import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
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
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
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
              Get in Touch
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mt-2 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
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
                  title: "Address",
                  content: "123 Education Street\nKnowledge City, KC 12345",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: "+1 234 567 8900\n+1 234 567 8901",
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: "info@bouloughalmaram.edu\nadmissions@bouloughalmaram.edu",
                },
                {
                  icon: Clock,
                  title: "Office Hours",
                  content: "Mon - Fri: 7:30 AM - 4:00 PM\nSat: 8:00 AM - 12:00 PM",
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
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {item.content}
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
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Your Name
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
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
                      Subject
                    </label>
                    <Input
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Message
                    </label>
                    <Textarea
                      placeholder="Your message..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" variant="gold" size="lg">
                    Send Message
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
                Map will be displayed here
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
