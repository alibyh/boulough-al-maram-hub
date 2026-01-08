import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { name: t("common.home"), path: "/" },
    { name: t("common.about"), path: "/about" },
    { name: t("common.news"), path: "/news" },
    { name: t("common.timetable"), path: "/timetable" },
    { name: t("common.contact"), path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold text-foreground leading-tight">
              {t("header.schoolName")}
            </span>
            <span className="text-xs text-muted-foreground">{t("header.schoolType")}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={location.pathname === link.path ? "nav-active" : "nav"}
                size="sm"
              >
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Language Switcher & Student Login Button */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/student-login">
            <Button variant="gold" size="default">
              {t("common.studentPortal")}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={location.pathname === link.path ? "nav-active" : "nav"}
                  className="w-full justify-start"
                >
                  {link.name}
                </Button>
              </Link>
            ))}
            <Link to="/student-login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="gold" className="w-full mt-2">
                {t("common.studentPortal")}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
