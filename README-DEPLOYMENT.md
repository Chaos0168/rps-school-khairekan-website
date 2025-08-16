# 🚀 Deployment Guide

## Prerequisites

### Database Setup

1. **PostgreSQL Database** (Required for both environments)
   - **For Vercel Demo**: Use [Neon](https://neon.tech/) or [Supabase](https://supabase.com/) (free tiers available)
   - **For Hostinger VPS**: Install PostgreSQL locally

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# NextAuth Configuration  
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# File Upload Configuration
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760

# Admin Configuration
ADMIN_EMAIL="admin@school.com"
ADMIN_PASSWORD="admin123"
```

## 🌐 Vercel Deployment (Demo)

### 1. Database Setup
```bash
# 1. Create a Neon/Supabase PostgreSQL database
# 2. Get the connection string
# 3. Update DATABASE_URL in Vercel environment variables
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
```

### 3. Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

## 🖥️ Hostinger VPS Deployment (Production)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE indian_school_prod;
CREATE USER school_admin WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE indian_school_prod TO school_admin;
\q
```

### 3. Application Deployment

```bash
# Clone your repository
git clone <your-repo-url>
cd indian-school-demo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your production values

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "indian-school" -- start
pm2 save
pm2 startup
```

### 4. Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/indian-school

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads directory
    location /uploads/ {
        alias /path/to/your/app/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/indian-school /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Setup (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 Maintenance Commands

### Development
```bash
# Start development server
npm run dev

# Database operations
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Run migrations
npm run db:seed        # Seed data
npm run db:reset       # Reset and reseed database
```

### Production
```bash
# PM2 operations
pm2 status            # Check status
pm2 restart indian-school  # Restart app
pm2 logs indian-school     # View logs
pm2 stop indian-school     # Stop app

# Update application
git pull origin main
npm install
npm run build
pm2 restart indian-school
```

## 📱 Features Available

### ✅ Authentication System
- Admin/Teacher/Student roles
- Secure login with bcrypt
- Session management

### ✅ File Upload System
- PDF, DOC, DOCX, Images support
- 10MB file size limit
- Secure file storage

### ✅ Quiz System
- Interactive quiz creation
- Automatic scoring
- Progress tracking
- Detailed results

### ✅ Resource Management
- Syllabus uploads
- Question papers
- Quiz creation and management

### ✅ Class Structure
- 15 classes (Nursery to XII)
- Term-wise organization
- Subject-wise resources

## 🔐 Default Login Credentials

```
Admin: admin@school.com / admin123
Teacher: teacher@school.com / teacher123
```

**⚠️ Important**: Change these credentials in production!

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check connection
psql -h localhost -U school_admin -d indian_school_prod
```

### File Upload Issues
```bash
# Check upload directory permissions
sudo chown -R www-data:www-data /path/to/app/public/uploads
sudo chmod -R 755 /path/to/app/public/uploads
```

### Application Issues
```bash
# Check PM2 logs
pm2 logs indian-school

# Restart application
pm2 restart indian-school

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
``` 