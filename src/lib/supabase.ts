import { createClient } from '@supabase/supabase-js';

// Use placeholder values during build if env vars not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Reel {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  genre: string;
  platform?: string;
  tools: string[];
  stats: {
    views: string;
    engagement: string;
  };
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Upload {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: 'video' | 'image';
  category: string;
  tags: string[];
  metadata: {
    duration?: string;
    resolution?: string;
    size?: string;
  };
  createdAt: string;
}
