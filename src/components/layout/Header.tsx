import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "News", path: "/news" },
  { name: "Timetable", path: "/timetable" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
              Boulough Al-Maram
            </span>
            <span className="text-xs text-muted-foreground">High School</span>
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

        {/* Student Login Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/student-login">
            <Button variant="gold" size="default">
              Student Portal
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
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
                Student Portal
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
