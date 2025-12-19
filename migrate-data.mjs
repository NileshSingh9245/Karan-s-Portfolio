/**
 * Data Migration Script
 * Migrates all existing JSON data to Supabase database
 * 
 * Run with: node migrate-data.mjs
 * Or: npm run migrate
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local file
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found');
    process.exit(1);
  }
  
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
}

loadEnv();

// Load environment variables - try service role first, then anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!serviceRoleKey && !supabaseAnonKey)) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabaseKey = serviceRoleKey || supabaseAnonKey;

if (!serviceRoleKey) {
  console.log('⚠️  Using ANON KEY - RLS policies will block inserts!');
  console.log('   Solution 1: Add SUPABASE_SERVICE_ROLE_KEY to .env.local');
  console.log('   Solution 2: Temporarily disable RLS in Supabase Dashboard\n');
  console.log('   See MIGRATION_GUIDE.md for detailed instructions\n');
} else {
  console.log('✅ Using SERVICE ROLE KEY - RLS will be bypassed\n');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to read JSON files
function readJSON(filename) {
  const filePath = path.join(__dirname, 'src', 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Migrate Services
async function migrateServices() {
  console.log('\n📦 Migrating Services...');
  const services = readJSON('services.json');
  
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    const { error } = await supabase
      .from('services')
      .insert({
        title: service.title,
        icon: service.icon,
        short_description: service.shortDescription,
        description: service.description,
        deliverables: service.deliverables,
        ideal_client: service.idealClient,
        pricing_note: service.pricingNote,
        featured: service.featured || false,
        display_order: i,
      });
    
    if (error) {
      console.error(`   ❌ Failed to insert ${service.title}:`, error.message);
    } else {
      console.log(`   ✅ Migrated: ${service.title}`);
    }
  }
}

// Migrate Testimonials
async function migrateTestimonials() {
  console.log('\n💬 Migrating Testimonials...');
  const testimonials = readJSON('testimonials.json');
  
  for (let i = 0; i < testimonials.length; i++) {
    const testimonial = testimonials[i];
    const { error } = await supabase
      .from('testimonials')
      .insert({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        image: testimonial.image || '',
        rating: testimonial.rating || 5,
        text: testimonial.text,
        project_type: testimonial.projectType || '',
        results: testimonial.results || '',
        featured: false,
        display_order: i,
      });
    
    if (error) {
      console.error(`   ❌ Failed to insert ${testimonial.name}:`, error.message);
    } else {
      console.log(`   ✅ Migrated: ${testimonial.name}`);
    }
  }
}

// Migrate Team Members
async function migrateTeam() {
  console.log('\n👥 Migrating Team Members...');
  const team = readJSON('team.json');
  
  for (let i = 0; i < team.length; i++) {
    const member = team[i];
    const { error } = await supabase
      .from('team_members')
      .insert({
        name: member.name,
        roles: member.roles,
        email: member.email,
        phone: member.phone,
        bio: member.bio || '',
        image: member.image || '',
        display_order: i,
      });
    
    if (error) {
      console.error(`   ❌ Failed to insert ${member.name}:`, error.message);
    } else {
      console.log(`   ✅ Migrated: ${member.name}`);
    }
  }
}

// Migrate Stock Videos
async function migrateStockVideos() {
  console.log('\n🎬 Migrating Stock Videos...');
  const videos = readJSON('stockVideos.json');
  
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const { error } = await supabase
      .from('stock_videos')
      .insert({
        title: video.title,
        description: video.description || '',
        category: video.category || 'General',
        tags: video.tags || [],
        video_url: video.videoPath || video.videoUrl || '',
        thumbnail_url: video.thumbnailPath || video.thumbnailUrl || '',
        duration: video.duration || '',
        resolution: video.resolution || '1080p',
        price: parseFloat(video.price || 0),
        is_free: video.isFree || video.is_free || true,
        featured: video.featured || false,
        download_count: 0,
        display_order: i,
      });
    
    if (error) {
      console.error(`   ❌ Failed to insert ${video.title}:`, error.message);
    } else {
      console.log(`   ✅ Migrated: ${video.title}`);
    }
  }
}

// Migrate Homepage Stats
async function migrateHomepageStats() {
  console.log('\n📊 Migrating Homepage Stats...');
  
  const stats = [
    { icon: 'Users', value: '100+', label: 'Happy Clients', display_order: 0 },
    { icon: 'Video', value: '500+', label: 'Reels Created', display_order: 1 },
    { icon: 'TrendingUp', value: '50M+', label: 'Total Reach', display_order: 2 },
    { icon: 'Zap', value: '5+', label: 'Years Experience', display_order: 3 },
  ];
  
  for (const stat of stats) {
    const { error } = await supabase
      .from('homepage_stats')
      .insert(stat);
    
    if (error) {
      console.error(`   ❌ Failed to insert ${stat.label}:`, error.message);
    } else {
      console.log(`   ✅ Migrated: ${stat.label}`);
    }
  }
}

// Migrate About Tools
async function migrateAboutTools() {
  console.log('\n🛠️  Migrating About Tools...');
  
  const tools = [
    { name: 'DaVinci Resolve', icon: 'Video', category: 'Video Editing', display_order: 0 },
    { name: 'Photoshop', icon: 'Palette', category: 'Image Editing', display_order: 1 },
    { name: 'Illustrator', icon: 'Code', category: 'Graphic Design', display_order: 2 },
    { name: 'Canva', icon: 'Sparkles', category: 'Design', display_order: 3 },
    { name: 'Sora', icon: 'Wand2', category: 'AI Video', display_order: 4 },
    { name: 'OpenAI', icon: 'Brain', category: 'AI Tools', display_order: 5 },
    { name: 'Gemini', icon: 'Brain', category: 'AI Tools', display_order: 6 },
  ];
  
  for (const tool of tools) {
    const { error } = await supabase
      .from('about_tools')
      .insert(tool);
    
    if (error) {
      console.error(`   ❌ Failed to insert ${tool.name}:`, error.message);
    } else {
      console.log(`   ✅ Migrated: ${tool.name}`);
    }
  }
}

// Migrate About Values
async function migrateAboutValues() {
  console.log('\n💎 Migrating About Values...');
  
  const values = [
    {
      icon: 'Target',
      title: 'Results-Focused',
      description: 'Every project is approached with clear goals and measurable outcomes in mind.',
      display_order: 0
    },
    {
      icon: 'Heart',
      title: 'Client-Centric',
      description: 'Your success is my success. I\'m committed to understanding and exceeding your expectations.',
      display_order: 1
    },
    {
      icon: 'Award',
      title: 'Quality First',
      description: 'Premium quality work that stands out and delivers real value to your business.',
      display_order: 2
    },
    {
      icon: 'TrendingUp',
      title: 'Continuous Learning',
      description: 'Always staying updated with the latest trends, tools, and strategies in digital marketing.',
      display_order: 3
    },
  ];
  
  for (const value of values) {
    const { error } = await supabase
      .from('about_values')
      .insert(value);
    
    if (error) {
      console.error(`   ❌ Failed to insert ${value.title}:`, error.message);
    } else {
      console.log(`   ✅ Migrated: ${value.title}`);
    }
  }
}

// Migrate About Journey
async function migrateAboutJourney() {
  console.log('\n🚀 Migrating About Journey...');
  
  const journey = [
    {
      year: '2019',
      title: 'Started Freelancing',
      description: 'Began offering video editing services to local businesses in India.',
      display_order: 0
    },
    {
      year: '2020',
      title: 'Instagram Focus',
      description: 'Expanded to manage all social media platforms and short-form content across Instagram, Facebook, YouTube, LinkedIn, and more.',
      display_order: 1
    },
    {
      year: '2021',
      title: 'Digital Marketing',
      description: 'Expanded services to include comprehensive digital marketing strategies.',
      display_order: 2
    },
    {
      year: '2022',
      title: '100+ Clients',
      description: 'Reached milestone of serving over 100 satisfied clients across India.',
      display_order: 3
    },
    {
      year: '2023-24',
      title: 'Agency-Level Quality',
      description: 'Established reputation for delivering premium, agency-level work at competitive freelancer rates.',
      display_order: 4
    },
  ];
  
  for (const item of journey) {
    const { error } = await supabase
      .from('about_journey')
      .insert(item);
    
    if (error) {
      console.error(`   ❌ Failed to insert ${item.title}:`, error.message);
    } else {
      console.log(`   ✅ Migrated: ${item.title}`);
    }
  }
}

// Migrate Contact Info
async function migrateContactInfo() {
  console.log('\n📧 Migrating Contact Info...');
  
  const contactInfo = {
    email: 'kdkaranwork@gmail.com',
    phone: '+91-6201821776',
    address: 'India',
    instagram_url: 'https://instagram.com/your_handle',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
  };
  
  const { error } = await supabase
    .from('contact_info')
    .insert(contactInfo);
  
  if (error) {
    console.error(`   ❌ Failed to insert contact info:`, error.message);
  } else {
    console.log(`   ✅ Migrated: Contact Information`);
  }
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting Data Migration...\n');
  console.log('⚠️  Make sure you have run database-schema-full.sql in Supabase first!\n');
  
  try {
    await migrateServices();
    await migrateTestimonials();
    await migrateTeam();
    await migrateStockVideos();
    await migrateHomepageStats();
    await migrateAboutTools();
    await migrateAboutValues();
    await migrateAboutJourney();
    await migrateContactInfo();
    
    console.log('\n✅ Migration Complete!\n');
    console.log('📋 Next Steps:');
    console.log('   1. Visit http://localhost:3000/admin/services to verify');
    console.log('   2. Check other admin pages to see your migrated data');
    console.log('   3. Update frontend pages to fetch from database\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
