# Freelancer Portfolio Website

A professional, modern freelancer portfolio website built with Next.js, TypeScript, and Tailwind CSS. This website showcases Instagram Reels, stock videos, services, and includes a contact form - all optimized for Vercel free tier hosting.

![Portfolio Preview](https://via.placeholder.com/1200x600?text=Portfolio+Preview)

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first, works perfectly on all devices
- **Dark/Light Mode**: Built-in theme switcher with persistence
- **SEO Optimized**: Proper meta tags, OpenGraph, and structured data
- **Performance**: Optimized for Core Web Vitals (90+ Lighthouse score)
- **Instagram Reels Integration**: Showcase client work with embedded reels
- **Stock Videos Gallery**: Display your video templates and assets
- **Contact Form**: Integrated with free form services (Formspree/Web3Forms)
- **Zero Cost**: No paid dependencies or subscriptions required
- **Easy Content Management**: Update content via JSON files

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout with theme
│   ├── portfolio/           # Portfolio page
│   ├── stock-videos/        # Stock videos page
│   ├── services/            # Services page
│   ├── about/               # About page
│   └── contact/             # Contact form page
│
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── portfolio/           # Portfolio-specific components
│   ├── services/            # Service cards
│   ├── testimonials/        # Testimonial components
│   ├── videos/              # Video components
│   └── ThemeProvider.tsx    # Theme context provider
│
├── data/                    # Content data (JSON)
│   ├── reels.json          # Instagram Reels data
│   ├── services.json       # Services information
│   ├── testimonials.json   # Client testimonials
│   └── stockVideos.json    # Stock video catalog
│
├── lib/                     # Utility functions
│   ├── utils.ts            # Helper functions
│   └── seo.ts              # SEO utilities
│
└── styles/
    └── globals.css          # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Quick Start

1. **Clone or download the project**

```bash
cd d:\KARAN
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Open in browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Content Management Guide

### How to Update Content

All content is stored in JSON files in the `src/data/` directory. No coding required!

#### 1. Adding New Instagram Reels

Edit `src/data/reels.json`:

```json
{
  "id": "reel-007",
  "title": "Your Reel Title",
  "description": "Describe what this reel achieved",
  "embedUrl": "https://www.instagram.com/reel/YOUR_REEL_ID/embed",
  "thumbnailUrl": "/images/reels/reel-007-thumb.jpg",
  "genre": "Digital Marketing",
  "industry": "Technology",
  "tools": ["DaVinci Resolve", "Photoshop"],
  "stats": {
    "views": "1M+",
    "engagement": "50K+"
  },
  "clientName": "Client Name",
  "dateCreated": "2024-12-01"
}
```

**How to get Instagram embed URL:**

- Go to the Instagram Reel
- Click the three dots (•••)
- Select "Embed"
- Copy the embed code and extract the URL
- OR use format: `https://www.instagram.com/reel/REEL_ID/embed`

#### 2. Updating Services

Edit `src/data/services.json`:

```json
{
  "id": "service-005",
  "title": "Your Service Name",
  "icon": "megaphone",
  "shortDescription": "Brief one-liner",
  "description": "Detailed description of the service",
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "idealClient": "Who is this service perfect for?",
  "pricingNote": "Pricing information",
  "featured": true
}
```

**Available Icons:** `megaphone`, `users`, `film`, `palette`

#### 3. Adding Stock Videos

Edit `src/data/stockVideos.json`:

```json
{
  "id": "video-009",
  "title": "Video Title",
  "description": "What this video is about",
  "videoPath": "/videos/your-video.mp4",
  "thumbnailPath": "/images/videos/your-thumb.jpg",
  "category": "Product Showcase",
  "duration": "0:30",
  "resolution": "1080x1920",
  "usage": "Best for...",
  "tags": ["tag1", "tag2"]
}
```

**Video Storage:**

- Place videos in `public/videos/` folder
- Place thumbnails in `public/images/videos/` folder

#### 4. Managing Testimonials

Edit `src/data/testimonials.json`:

```json
{
  "id": "testimonial-007",
  "name": "Client Name",
  "role": "Position",
  "company": "Company Name",
  "image": "/images/testimonials/client.jpg",
  "rating": 5,
  "text": "The testimonial quote",
  "projectType": "Service Type",
  "results": "Key results achieved"
}
```

### Contact Form Setup

The contact form uses Formspree (free tier: 50 submissions/month).

1. **Sign up at [Formspree.io](https://formspree.io)**
2. **Create a new form**
3. **Copy your form ID**
4. **Update the form endpoint** in `src/app/contact/page.tsx`:

```typescript
const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
  // ... rest of the code
});
```

**Alternative: Web3Forms**

- Sign up at [Web3Forms.com](https://web3forms.com)
- Get your access key
- Update the form endpoint accordingly

### Customization

#### Changing Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Your primary color shades
    500: "#0ea5e9",
    600: "#0284c7",
    // ...
  },
  accent: {
    // Your accent color shades
    500: "#d946ef",
    600: "#c026d3",
    // ...
  },
}
```

#### Updating Contact Information

Edit the following files:

- `src/components/layout/Footer.tsx` - Footer contact details
- `src/app/contact/page.tsx` - Contact page info
- `src/lib/seo.ts` - Update `siteConfig` object

#### Adding Your Domain

In `src/lib/seo.ts`:

```typescript
export const siteConfig = {
  name: "Your Name",
  description: "Your description",
  url: "https://yourdomain.com", // Update this
  // ...
};
```

## 🚀 Deployment to Vercel

### Step 1: Prepare for Deployment

1. **Update your content** in JSON files
2. **Replace placeholder images** in `public/` folder
3. **Update contact form** with your Formspree ID
4. **Update domain** in `src/lib/seo.ts`

### Step 2: Deploy to Vercel

#### Method 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Method 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository (or upload folder)
4. Vercel will auto-detect Next.js
5. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## 📊 Performance Optimization

The website is already optimized for:

- ✅ Image lazy loading
- ✅ Code splitting
- ✅ Minimal bundle size
- ✅ Server-side rendering
- ✅ Static generation where possible
- ✅ Optimized fonts
- ✅ Core Web Vitals

**Lighthouse Score Target:** 90+

## 🎨 Adding Images & Assets

### Where to Place Files

```
public/
├── images/
│   ├── reels/              # Reel thumbnails
│   ├── videos/             # Video thumbnails
│   ├── testimonials/       # Client photos
│   └── og-image.jpg        # Social sharing image
│
└── videos/                 # Stock video files
```

### Image Recommendations

- **Format:** WebP or JPEG
- **Reel Thumbnails:** 1080x1920px (9:16 ratio)
- **Video Thumbnails:** 1080x1920px (9:16 ratio)
- **OG Image:** 1200x630px
- **Optimize:** Use tools like [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🌐 Environment Variables (Optional)

Create `.env.local` for sensitive data:

```env
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_id
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🐛 Troubleshooting

### Common Issues

**Issue: Dark mode not working**

- Clear browser cache
- Check localStorage for `theme` key

**Issue: Form not submitting**

- Verify Formspree ID is correct
- Check browser console for errors
- Ensure you haven't exceeded free tier limit

**Issue: Instagram embeds not loading**

- Verify Instagram URL is correct
- Check if the post is public
- Test with different reels

**Issue: Build errors**

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 📈 Analytics (Optional)

Add analytics by installing:

**Google Analytics:**

```bash
npm install @next/third-parties
```

**Vercel Analytics (Free):**

```bash
npm install @vercel/analytics
```

## 🔐 Admin Panel

This portfolio includes a powerful **no-code admin panel** powered by Supabase, allowing you to manage your content without editing JSON files or redeploying.

### Setting Up the Admin Panel

#### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" and fill in:
   - **Project Name:** Your portfolio name
   - **Database Password:** Choose a secure password (save it!)
   - **Region:** Select closest to your location
3. Wait for the project to initialize (~2 minutes)

#### 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

#### 3. Configure Environment Variables

1. Create `.env.local` file in your project root (or copy from `.env.example`)
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase/schema.sql` from your project
3. Copy all the SQL code and paste it into the Supabase SQL Editor
4. Click **Run** to create all tables and policies
5. This creates:
   - `reels` table (for Instagram reels)
   - `uploads` table (for stock videos/images)
   - Row-level security policies
   - Performance indexes

#### 5. Create Your Admin Account

1. In Supabase dashboard, go to **Authentication → Users**
2. Click **Add User** (via email)
3. Enter your admin email and password
4. Click **Create User**
5. ✅ You can now log in to your admin panel!

### Using the Admin Panel

#### Accessing the Admin Panel

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/admin/login`
3. Enter your Supabase admin credentials
4. You'll be redirected to the dashboard

#### Managing Reels

**Location:** `/admin/reels`

**Add a New Reel:**

1. Click "Add Reel"
2. Fill in the form:
   - **Title:** Name of the project/reel
   - **Description:** What the reel achieved
   - **Instagram Embed URL:** Full Instagram reel URL (e.g., `https://www.instagram.com/reel/ABC123/`)
   - **Thumbnail URL:** Optional custom thumbnail
   - **Genre:** Category (Corporate, Tech, Lifestyle, etc.)
   - **Tools:** Comma-separated (After Effects, Premiere Pro, etc.)
   - **Views:** Number of views (e.g., "50K")
   - **Engagement:** Engagement rate (e.g., "5.2%")
   - **Client Name:** Who the project was for
3. Click "Create"
4. ✅ The reel appears instantly on your portfolio!

**Edit a Reel:**

- Click the pencil icon next to any reel
- Update the fields
- Click "Update"

**Delete a Reel:**

- Click the trash icon
- Confirm deletion

#### Managing Uploads (Stock Videos/Images)

**Location:** `/admin/uploads`

**Add a New Upload:**

1. Click "Add Upload"
2. Fill in the form:
   - **Filename:** Name of the file
   - **File URL:** Full URL to the file (use Supabase Storage or external CDN)
   - **File Type:** Video or Image
   - **Category:** Type (Nature, Business, Tech, etc.)
   - **Tags:** Comma-separated keywords
   - **Duration:** Length (e.g., "0:30")
   - **Resolution:** Quality (e.g., "1920x1080")
   - **Size:** File size (e.g., "25MB")
3. Click "Create"

**Delete an Upload:**

- Click "Delete" on any upload card
- Confirm deletion

#### Using Supabase Storage (Optional)

For hosting video/image files:

1. In Supabase dashboard, go to **Storage**
2. Click **New Bucket** → Name it `uploads`
3. Make it **Public** if you want direct access
4. Upload your files via the UI
5. Copy the public URL for each file
6. Use these URLs in the admin panel forms

### Admin Panel Features

✅ **Instant Updates:** All changes reflect immediately on the live site (no redeploy!)
✅ **Authentication:** Secure login with Supabase Auth
✅ **CRUD Operations:** Create, Read, Update, Delete reels and uploads
✅ **Responsive Design:** Works on desktop, tablet, and mobile
✅ **Dark Mode:** Matches your site's theme
✅ **Data Validation:** Forms ensure correct data format
✅ **Row-Level Security:** Database policies protect your data

### Admin Routes

- `/admin/login` - Login page
- `/admin/dashboard` - Overview and quick access
- `/admin/reels` - Manage Instagram reels
- `/admin/uploads` - Manage stock videos/images

### Security Best Practices

1. **Never commit `.env.local`** to Git (it's in `.gitignore`)
2. **Use strong passwords** for your Supabase admin account
3. **Enable 2FA** on your Supabase account (Settings → Account)
4. **Rotate keys** if they're ever exposed
5. **Row-Level Security** is enabled by default - only authenticated users can write

### Troubleshooting Admin Panel

**Can't log in?**

- Verify your email/password in Supabase Authentication → Users
- Check that environment variables are set correctly
- Clear browser cache and try again

**Changes not appearing?**

- Check browser console for errors
- Verify Supabase tables exist (run schema.sql)
- Ensure RLS policies are enabled

**Database errors?**

- Check Supabase logs: Database → Logs
- Verify column names match (snake_case in DB, camelCase in code)
- Run the schema.sql file again to reset

## 🎯 Future Enhancements

Potential features to add:

- Blog section using MDX
- Case studies with detailed breakdowns
- Client portal for file delivery
- WhatsApp integration
- Multi-language support
- Advanced analytics dashboard

## 📄 License

This project is open source and available for personal and commercial use.

## 💬 Support

For questions or issues:

- Email: your.email@example.com
- Instagram: @yourusername

## 🙏 Credits

- **Framework:** Next.js
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Database:** Supabase
- **Hosting:** Vercel

---

**Built with ❤️ for freelancers who want a professional online presence without breaking the bank.**

Happy freelancing! 🚀
