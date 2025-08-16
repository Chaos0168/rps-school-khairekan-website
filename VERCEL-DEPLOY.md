# 🚀 Deploy to Vercel (FREE)

## 1. Setup Free Database

### Option A: Neon.tech (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project → "indian-school-demo"
4. Copy the connection string

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub  
3. Create new project → "indian-school-demo"
4. Go to Settings → Database → Copy connection string

## 2. Deploy to Vercel

### Method 1: GitHub Integration (Recommended)
```bash
# Push your code to GitHub first
git add .
git commit -m "feat: examination portal with backend"
git push origin main
```

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure deployment:
   - **Framework**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# ? Set up and deploy "~/indian-school-demo"? Y
# ? Which scope? Your username
# ? Link to existing project? N
# ? What's your project's name? indian-school-demo
# ? In which directory is your code located? ./
```

## 3. Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-random-secret-string-here
NEXTAUTH_URL=https://your-app.vercel.app
```

**⚠️ Important**: 
- Use the FULL connection string from Neon/Supabase
- Include `?sslmode=require` at the end
- Set NEXTAUTH_URL to your Vercel app URL

## 4. Database Setup

After deployment, run these commands ONCE:

### Option A: Local Development
```bash
# Set your environment variables locally
echo 'DATABASE_URL="your_neon_connection_string"' > .env
echo 'NEXTAUTH_SECRET="your-secret"' >> .env

# Setup database
npm run db:generate
npm run db:migrate  
npm run db:seed
```

### Option B: Vercel CLI
```bash
# Pull environment variables
vercel env pull .env

# Run database setup locally
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 5. Test Your Deployment

1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Navigate to `/examinations`
3. Click "Login" 
4. Use credentials:
   - **Admin**: admin@school.com / admin123
   - **Teacher**: teacher@school.com / teacher123

## 6. What Works on Vercel

✅ **Authentication** - Full login system
✅ **Database** - PostgreSQL with Neon/Supabase  
✅ **File Uploads** - Temporary storage (files deleted after 24h)
✅ **Quiz System** - Full functionality
✅ **Admin Panel** - Resource management

⚠️ **Note**: File uploads on Vercel are temporary. For permanent files, you'd need:
- Vercel Blob (paid)
- Cloudinary (free tier available)
- AWS S3 (paid)

## 7. Free Tier Limits

### Neon.tech Free Tier:
- 512 MB storage
- 1 database
- Perfect for demo/testing

### Vercel Free Tier:
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for school demo

### Your Total Cost: $0 🎉

## 8. Going to Production (Later)

When ready for Hostinger VPS:
1. Export data from Neon
2. Set up PostgreSQL on VPS
3. Import data
4. Update connection string
5. Deploy to VPS

## 9. Troubleshooting

**Build fails?**
- Check all environment variables are set
- Ensure DATABASE_URL includes `?sslmode=require`

**Database connection error?**
- Verify connection string format
- Check Neon/Supabase is not paused

**Login not working?**
- Run `npm run db:seed` locally first
- Check NEXTAUTH_SECRET is set

## 10. Demo Workflow

Perfect for client presentation:
1. **Show admin login** → Upload syllabus/create quiz
2. **Show student view** → Browse resources, take quizzes  
3. **Highlight features** → Real-time scoring, file management
4. **Discuss production** → Migration to VPS later

Your app will be live at: `https://indian-school-demo.vercel.app` 🚀 