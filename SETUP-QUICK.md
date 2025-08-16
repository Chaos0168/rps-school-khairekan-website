# 🚀 Quick Setup for Testing

## 1. Database Setup (Required)

### Option A: Local PostgreSQL (Recommended for VPS)
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb indian_school_demo

# Set connection string in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/indian_school_demo"
```

### Option B: Online Database (Recommended for Vercel)
1. Go to [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com)
2. Create free PostgreSQL database
3. Copy connection string to .env

## 2. Environment Setup

Create `.env` file:
```env
DATABASE_URL="your_postgres_connection_string_here"
NEXTAUTH_SECRET="any-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Install & Run

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed initial data (creates admin/teacher accounts)
npm run db:seed

# Start development server
npm run dev
```

## 4. Test Login Credentials

After seeding, you can login with:

- **Admin**: admin@school.com / admin123
- **Teacher**: teacher@school.com / teacher123

## 5. What Works Now

✅ **Real Authentication** - Login with database users
✅ **File Uploads** - Actually saves files to /public/uploads/
✅ **Quiz Creation** - Stores in PostgreSQL database
✅ **Resource Management** - Full CRUD operations
✅ **Role-based Access** - Admin panel only for admin/teacher roles

## 6. Testing the Features

1. **Login**: Use credentials above
2. **Upload Syllabus**: Select class → term → subject → upload PDF
3. **Create Quiz**: Select class → term → subject → create quiz with questions
4. **Take Quiz**: Login as student, attempt quizzes (coming soon)

## 7. Troubleshooting

**Database connection error?**
- Check your DATABASE_URL in .env
- Ensure PostgreSQL is running
- Try `npm run db:generate` again

**File upload not working?**
- Check if /public/uploads/ directory exists
- Verify file permissions

**"User not found" error?**
- Run `npm run db:seed` to create default users
- Check database connection

## Next Steps

- Deploy to Vercel for demo
- Set up production on Hostinger VPS
- Add student quiz interface
- Implement AI quiz generation from PDFs 