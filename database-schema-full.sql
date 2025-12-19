-- =====================================================
-- COMPREHENSIVE DATABASE SCHEMA FOR KARAN'S PORTFOLIO
-- This includes ALL content types with ordering support
-- =====================================================

-- ==================
-- SERVICES TABLE
-- ==================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverables JSONB DEFAULT '[]'::jsonb,
  ideal_client TEXT,
  pricing_note TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- TESTIMONIALS TABLE
-- ==================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  image TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  text TEXT NOT NULL,
  project_type TEXT,
  results TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- TEAM MEMBERS TABLE
-- ==================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roles JSONB DEFAULT '[]'::jsonb,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- STOCK VIDEOS TABLE (Enhanced from uploads)
-- ==================
CREATE TABLE IF NOT EXISTS public.stock_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  resolution TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- HOMEPAGE STATS TABLE
-- ==================
CREATE TABLE IF NOT EXISTS public.homepage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- ABOUT PAGE TOOLS TABLE
-- ==================
CREATE TABLE IF NOT EXISTS public.about_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- ABOUT PAGE VALUES TABLE
-- ==================
CREATE TABLE IF NOT EXISTS public.about_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- ABOUT PAGE JOURNEY TABLE
-- ==================
CREATE TABLE IF NOT EXISTS public.about_journey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- CONTACT INFO TABLE (Single row)
-- ==================
CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================
-- PAGE SECTIONS TABLE (For ordering homepage sections)
-- ==================
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL, -- 'home', 'about', 'portfolio', etc.
  section_name TEXT NOT NULL,
  section_type TEXT NOT NULL, -- 'hero', 'stats', 'services', 'testimonials', etc.
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Public read access for all content
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public can view stock videos" ON public.stock_videos FOR SELECT USING (true);
CREATE POLICY "Public can view homepage stats" ON public.homepage_stats FOR SELECT USING (true);
CREATE POLICY "Public can view about tools" ON public.about_tools FOR SELECT USING (true);
CREATE POLICY "Public can view about values" ON public.about_values FOR SELECT USING (true);
CREATE POLICY "Public can view about journey" ON public.about_journey FOR SELECT USING (true);
CREATE POLICY "Public can view contact info" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Public can view page sections" ON public.page_sections FOR SELECT USING (true);

-- Authenticated users can manage all content
CREATE POLICY "Authenticated users can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update services" ON public.services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete services" ON public.services FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert team members" ON public.team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update team members" ON public.team_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete team members" ON public.team_members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert stock videos" ON public.stock_videos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update stock videos" ON public.stock_videos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete stock videos" ON public.stock_videos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert homepage stats" ON public.homepage_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update homepage stats" ON public.homepage_stats FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete homepage stats" ON public.homepage_stats FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert about tools" ON public.about_tools FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update about tools" ON public.about_tools FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete about tools" ON public.about_tools FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert about values" ON public.about_values FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update about values" ON public.about_values FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete about values" ON public.about_values FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert about journey" ON public.about_journey FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update about journey" ON public.about_journey FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete about journey" ON public.about_journey FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can update contact info" ON public.contact_info FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert page sections" ON public.page_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update page sections" ON public.page_sections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete page sections" ON public.page_sections FOR DELETE TO authenticated USING (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_services_featured ON public.services(featured) WHERE featured = true;
CREATE INDEX idx_services_order ON public.services(display_order);

CREATE INDEX idx_testimonials_featured ON public.testimonials(featured) WHERE featured = true;
CREATE INDEX idx_testimonials_order ON public.testimonials(display_order);

CREATE INDEX idx_team_members_order ON public.team_members(display_order);

CREATE INDEX idx_stock_videos_category ON public.stock_videos(category);
CREATE INDEX idx_stock_videos_featured ON public.stock_videos(featured) WHERE featured = true;
CREATE INDEX idx_stock_videos_order ON public.stock_videos(display_order);

CREATE INDEX idx_homepage_stats_order ON public.homepage_stats(display_order);
CREATE INDEX idx_about_tools_order ON public.about_tools(display_order);
CREATE INDEX idx_about_values_order ON public.about_values(display_order);
CREATE INDEX idx_about_journey_order ON public.about_journey(display_order);

CREATE INDEX idx_page_sections_page ON public.page_sections(page_name);
CREATE INDEX idx_page_sections_order ON public.page_sections(page_name, display_order);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_videos_updated_at BEFORE UPDATE ON public.stock_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homepage_stats_updated_at BEFORE UPDATE ON public.homepage_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_tools_updated_at BEFORE UPDATE ON public.about_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_values_updated_at BEFORE UPDATE ON public.about_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_journey_updated_at BEFORE UPDATE ON public.about_journey FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
