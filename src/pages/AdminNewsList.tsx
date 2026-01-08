import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNewsList } from "@/hooks/useNews";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminNewsList = () => {
  const { user, profile, isLoading: authLoading, isAdmin, signOut } = useAuth();
  const { data: news, isLoading: newsLoading } = useNewsList();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleDelete = async (id: string) => {
    try {
      // First delete photos from storage
      const { data: photos } = await supabase
        .from("news_photos")
        .select("photo_url")
        .eq("news_id", id);

      if (photos) {
        for (const photo of photos) {
          const path = photo.photo_url.split("/news-photos/")[1];
          if (path) {
            await supabase.storage.from("news-photos").remove([path]);
          }
        }
      }

      // Delete news (cascade will delete photos records)
      const { error } = await supabase.from("news").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "News Deleted",
        description: "The news article has been deleted successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["news"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete news",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
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
              <p className="text-xs text-primary-foreground/70">News Management</p>
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
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">
                News Articles
              </h1>
              <p className="text-muted-foreground">
                Manage all news articles
              </p>
            </div>
          </div>
          <Link to="/admin/news/new">
            <Button variant="gold">
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </Link>
        </div>

        {newsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : news && news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item) => (
              <Card key={item.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {item.main_photo ? (
                        <img
                          src={item.main_photo}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-lg font-semibold text-foreground truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(item.date), "MMMM d, yyyy")}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/admin/news/edit/${item.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No news articles yet.</p>
            <Link to="/admin/news/new">
              <Button variant="gold">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Article
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminNewsList;
