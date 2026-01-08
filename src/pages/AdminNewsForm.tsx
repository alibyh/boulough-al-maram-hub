import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  ArrowLeft,
  LogOut,
  Loader2,
  Upload,
  X,
  Star,
  ImageIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNewsDetail } from "@/hooks/useNews";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PhotoUpload {
  id?: string;
  file?: File;
  url: string;
  isMain: boolean;
  isNew: boolean;
}

const AdminNewsForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { user, profile, isLoading: authLoading, isAdmin, signOut } = useAuth();
  const { data: existingNews, isLoading: newsLoading } = useNewsDetail(id || "");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Load existing news data when editing
  useEffect(() => {
    if (isEditing && existingNews) {
      setTitle(existingNews.title);
      setDescription(existingNews.description);
      setDate(existingNews.date);
      setPhotos(
        existingNews.photos.map((p) => ({
          id: p.id,
          url: p.photo_url,
          isMain: p.is_main,
          isNew: false,
        }))
      );
    }
  }, [isEditing, existingNews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: PhotoUpload[] = files.map((file, index) => ({
      file,
      url: URL.createObjectURL(file),
      isMain: photos.length === 0 && index === 0,
      isNew: true,
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    const photo = photos[index];
    if (!photo.isNew && photo.id) {
      setPhotosToDelete([...photosToDelete, photo.id]);
    }
    const newPhotos = photos.filter((_, i) => i !== index);
    // If removed was main, make first one main
    if (photo.isMain && newPhotos.length > 0) {
      newPhotos[0].isMain = true;
    }
    setPhotos(newPhotos);
  };

  const setMainPhoto = (index: number) => {
    setPhotos(
      photos.map((p, i) => ({
        ...p,
        isMain: i === index,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);

    try {
      let newsId = id;

      // Create or update news
      if (isEditing) {
        const { error } = await supabase
          .from("news")
          .update({ title, description, date })
          .eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("news")
          .insert({ title, description, date })
          .select()
          .single();
        if (error) throw error;
        newsId = data.id;
      }

      // Delete removed photos
      for (const photoId of photosToDelete) {
        const { data: photoData } = await supabase
          .from("news_photos")
          .select("photo_url")
          .eq("id", photoId)
          .single();

        if (photoData) {
          const path = photoData.photo_url.split("/news-photos/")[1];
          if (path) {
            await supabase.storage.from("news-photos").remove([path]);
          }
        }
        await supabase.from("news_photos").delete().eq("id", photoId);
      }

      // Update main status for existing photos
      for (const photo of photos.filter((p) => !p.isNew && p.id)) {
        await supabase
          .from("news_photos")
          .update({ is_main: photo.isMain })
          .eq("id", photo.id);
      }

      // Upload new photos
      for (const photo of photos.filter((p) => p.isNew && p.file)) {
        const fileName = `${newsId}/${Date.now()}-${photo.file!.name}`;
        const { error: uploadError } = await supabase.storage
          .from("news-photos")
          .upload(fileName, photo.file!);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("news-photos")
          .getPublicUrl(fileName);

        await supabase.from("news_photos").insert({
          news_id: newsId,
          photo_url: urlData.publicUrl,
          is_main: photo.isMain,
        });
      }

      toast({
        title: isEditing ? "News Updated" : "News Created",
        description: `The news article has been ${isEditing ? "updated" : "created"} successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ["news"] });
      navigate("/admin/news");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save news",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (isEditing && newsLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold">Admin Portal</span>
              <p className="text-xs text-primary-foreground/70">
                {isEditing ? "Edit News" : "Add News"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">
              {profile?.full_name || user.email}
            </span>
            <Button variant="hero-outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/news">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {isEditing ? "Edit News Article" : "Add News Article"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-border/50 mb-6">
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter news title"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Description *
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter news description"
                  rows={6}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Date *
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 mb-6">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload photos for this article. Click the star to set the main image.
              </p>
            </CardHeader>
            <CardContent>
              {/* Photo Grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                    >
                      <img
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMainPhoto(index)}
                          className={`p-2 rounded-full ${
                            photo.isMain
                              ? "bg-gold text-foreground"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                          title="Set as main photo"
                        >
                          <Star className="h-4 w-4" fill={photo.isMain ? "currentColor" : "none"} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="p-2 rounded-full bg-destructive/80 text-white hover:bg-destructive"
                          title="Remove photo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {photo.isMain && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-gold text-foreground text-xs font-semibold rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload photos
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </label>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={isSubmitting || !title || !description}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Article"
              ) : (
                "Create Article"
              )}
            </Button>
            <Link to="/admin/news">
              <Button type="button" variant="outline" size="lg" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminNewsForm;
