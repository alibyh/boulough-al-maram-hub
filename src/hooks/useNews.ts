import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewsPhoto {
  id: string;
  photo_url: string;
  is_main: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  photos: NewsPhoto[];
  main_photo?: string;
}

// Fetch all news with their main photo
export const useNewsList = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: async (): Promise<NewsItem[]> => {
      const { data: newsData, error: newsError } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });

      if (newsError) throw newsError;

      // Fetch main photos for each news item
      const newsWithPhotos = await Promise.all(
        (newsData || []).map(async (news) => {
          const { data: photos } = await supabase
            .from("news_photos")
            .select("*")
            .eq("news_id", news.id)
            .eq("is_main", true)
            .limit(1);

          return {
            ...news,
            photos: [],
            main_photo: photos?.[0]?.photo_url || null,
          };
        })
      );

      return newsWithPhotos;
    },
  });
};

// Fetch a single news item with all photos
export const useNewsDetail = (id: string) => {
  return useQuery({
    queryKey: ["news", id],
    queryFn: async (): Promise<NewsItem | null> => {
      const { data: newsData, error: newsError } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (newsError) throw newsError;
      if (!newsData) return null;

      const { data: photos, error: photosError } = await supabase
        .from("news_photos")
        .select("*")
        .eq("news_id", id)
        .order("is_main", { ascending: false });

      if (photosError) throw photosError;

      const mainPhoto = photos?.find((p) => p.is_main);

      return {
        ...newsData,
        photos: photos || [],
        main_photo: mainPhoto?.photo_url || photos?.[0]?.photo_url || null,
      };
    },
    enabled: !!id,
  });
};
