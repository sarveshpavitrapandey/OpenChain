
-- Create table for paper metadata (off-chain data)
CREATE TABLE IF NOT EXISTS public.paper_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  abstract TEXT,
  keywords TEXT[],
  authors TEXT[],
  institutions TEXT[],
  publication_date TIMESTAMP WITH TIME ZONE,
  additional_links TEXT[],
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS paper_metadata_paper_id_idx ON public.paper_metadata(paper_id);
CREATE INDEX IF NOT EXISTS paper_metadata_user_id_idx ON public.paper_metadata(user_id);

-- Enable RLS
ALTER TABLE public.paper_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read any paper metadata
CREATE POLICY "Anyone can view paper metadata" 
ON public.paper_metadata 
FOR SELECT
USING (true);

-- Create policy to allow users to insert their own paper metadata
CREATE POLICY "Users can insert their own paper metadata" 
ON public.paper_metadata 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own paper metadata
CREATE POLICY "Users can update their own paper metadata" 
ON public.paper_metadata 
FOR UPDATE 
USING (auth.uid()::text = user_id);
