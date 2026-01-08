import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t("common.about"), path: "/about" },
    { name: t("common.news"), path: "/news" },
    { name: t("common.timetable"), path: "/timetable" },
    { name: t("common.studentPortal"), path: "/student-login" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* School Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-heading text-xl font-bold">
                {t("header.schoolName")}
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t("footer.contactInfo")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span className="text-primary-foreground/80">
                  123 Education Street, Knowledge City, KC 12345
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <span className="text-primary-foreground/80">+1 234 567 8900</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <span className="text-primary-foreground/80">info@bouloughalmaram.edu</span>
              </li>
            </ul>
          </div>

          {/* Social & Hours */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t("footer.schoolHours")}</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80 mb-6">
              <p>{t("footer.weekdays")}</p>
              <p>{t("footer.saturday")}</p>
            </div>
            <p className="text-sm font-medium mb-3">{t("footer.followUs")}</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground hover:bg-gold hover:text-foreground transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} {t("header.schoolName")}. {t("footer.allRightsReserved")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
