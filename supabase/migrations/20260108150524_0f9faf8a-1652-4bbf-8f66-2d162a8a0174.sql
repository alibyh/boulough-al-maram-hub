-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news_photos table for multiple photos per news item
CREATE TABLE public.news_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (news is public content)
CREATE POLICY "News is publicly readable" 
ON public.news 
FOR SELECT 
USING (true);

CREATE POLICY "News photos are publicly readable" 
ON public.news_photos 
FOR SELECT 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_news_date ON public.news(date DESC);
CREATE INDEX idx_news_photos_news_id ON public.news_photos(news_id);
CREATE INDEX idx_news_photos_is_main ON public.news_photos(is_main);

-- Create storage bucket for news photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-photos', 'news-photos', true);

-- Allow public read access to news photos
CREATE POLICY "News photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-photos');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();