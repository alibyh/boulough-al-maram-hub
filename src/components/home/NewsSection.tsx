import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, ImageIcon } from "lucide-react";
import { useNewsList } from "@/hooks/useNews";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const NewsSection = () => {
  const { t } = useTranslation();
  const { data: news, isLoading, error } = useNewsList();
  
  // Only show the 3 most recent news items
  const displayNews = news?.slice(0, 3) || [];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              {t("newsSection.subtitle")}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
              {t("newsSection.title")}
            </h2>
          </div>
          <Link to="/news">
            <Button variant="outline" className="group">
              {t("newsSection.viewAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("common.error")}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && displayNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("newsSection.noNews")}</p>
          </div>
        )}

        {/* News Grid */}
        {!isLoading && !error && displayNews.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNews.map((item, index) => (
              <Link to={`/news/${item.id}`} key={item.id}>
                <Card
                  className="group overflow-hidden border-border/50 hover:border-gold/50 transition-all duration-300 hover:shadow-elegant animate-fade-in h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Main Photo */}
                  <div className="relative h-48 bg-muted overflow-hidden">
                    {item.main_photo ? (
                      <img
                        src={item.main_photo}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(item.date), "MMMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
