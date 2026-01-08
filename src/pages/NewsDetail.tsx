import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ImageIcon } from "lucide-react";
import { useNewsDetail } from "@/hooks/useNews";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: news, isLoading, error } = useNewsDetail(id || "");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Layout>
        <section className="bg-hero-gradient py-16 md:py-24">
          <div className="container">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-48" />
          </div>
        </section>
        <section className="py-16">
          <div className="container max-w-4xl">
            <Skeleton className="h-96 w-full mb-8 rounded-lg" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !news) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
              {error ? "Error loading news" : "News not found"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error
                ? "There was an error loading this article. Please try again later."
                : "The news article you're looking for doesn't exist."}
            </p>
            <Link to="/news">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const mainPhoto = news.photos.find((p) => p.is_main);
  const otherPhotos = news.photos.filter((p) => !p.is_main);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl animate-fade-in">
            <Link to="/news">
              <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground mb-4 -ml-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mt-2 mb-4">
              {news.title}
            </h1>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Calendar className="h-4 w-4" />
              {format(new Date(news.date), "MMMM d, yyyy")}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          {/* Main Photo */}
          {mainPhoto ? (
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative aspect-video mb-8 rounded-lg overflow-hidden bg-muted cursor-pointer group">
                  <img
                    src={mainPhoto.photo_url}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                <img
                  src={mainPhoto.photo_url}
                  alt={news.title}
                  className="w-full h-auto rounded-lg"
                />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-foreground whitespace-pre-wrap">{news.description}</p>
          </div>

          {/* Other Photos Gallery */}
          {otherPhotos.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {otherPhotos.map((photo) => (
                  <Dialog key={photo.id}>
                    <DialogTrigger asChild>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer group">
                        <img
                          src={photo.photo_url}
                          alt={`${news.title} gallery`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                      <img
                        src={photo.photo_url}
                        alt={`${news.title} gallery`}
                        className="w-full h-auto rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;
