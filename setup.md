# NotesHub - Full Stack Notes Platform

A complete web application for uploading, sharing, and selling educational notes with payment integration.

## 🚀 Features

- **User Authentication**: Sign up/login with email and password
- **File Upload**: Support for PDF, DOCX, PPTX files
- **Payment Integration**: Razorpay for paid notes
- **Admin Dashboard**: Manage users and notes
- **Thumbnail Generation**: Real PDF thumbnails
- **Search & Filter**: Find notes easily
- **Responsive Design**: Works on all devices

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- Razorpay account (for payments)

## 🛠️ Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd notes-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend (.env file in backend directory)

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Razorpay Configuration
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret_key"

# Admin Account
ADMIN_EMAIL="admin@noteshub.com"
ADMIN_PASSWORD="admin123"

# Server Configuration
PORT=5000
NODE_ENV="development"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"
```

#### Frontend (.env.local file in frontend directory)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed admin user
node seed.js
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Test Page**: http://localhost:3000/test

## 🌐 Free Hosting Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from frontend directory
   cd frontend
   vercel

   # Follow prompts:
   # - Link to existing project: No
   # - Project name: noteshub-frontend
   # - Directory: ./
   # - Override settings: No
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
     NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
     ```

#### Backend (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login to Railway
   railway login

   # Initialize Railway project
   cd backend
   railway init

   # Deploy
   railway up
   ```

3. **Configure Environment Variables**
   - Go to Railway Dashboard → Your Project → Variables
   - Add all variables from backend .env file
   - Update DATABASE_URL to Railway's PostgreSQL URL

4. **Database Setup**
   ```bash
   # Connect to Railway shell
   railway service select Postgre
   railway shell

   # Run migrations
   npx prisma migrate deploy
   npx prisma generate

   # Seed admin user
   node seed.js
   ```

### Option 2: Render (Alternative)

#### Frontend (Render Static Sites)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Create new Static Site
   - Connect your GitHub repo
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/out`

#### Backend (Render Web Services)

1. **Deploy Backend**
   - Create new Web Service
   - Connect your GitHub repo
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`

2. **Configure Environment Variables**
   - Add all backend environment variables
   - Use Render's PostgreSQL for database

### Option 3: Netlify + Heroku

#### Frontend (Netlify)

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   ```bash
   # Build the frontend
   cd frontend
   npm run build

   # Deploy to Netlify
   npx netlify-cli deploy --dir=out
   ```

#### Backend (Heroku)

1. **Create Heroku Account**
   - Go to [heroku.com](https://heroku.com)
   - Sign up

2. **Deploy Backend**
   ```bash
   # Install Heroku CLI
   # Download from: https://devcenter.heroku.com/articles/heroku-cli

   # Login to Heroku
   heroku login

   # Create Heroku app
   cd backend
   heroku create your-noteshub-backend

   # Add PostgreSQL
   heroku addons:create heroku-postgresql:mini

   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main

   # Run migrations
   heroku run npx prisma migrate deploy
   heroku run node seed.js
   ```

## 🔧 Production Configuration

### Environment Variables for Production

#### Backend
```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-very-long-secure-jwt-secret"
RAZORPAY_KEY_ID="rzp_live_your_live_key_id"
RAZORPAY_KEY_SECRET="your_live_razorpay_secret"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-admin-password"
PORT=5000
NODE_ENV="production"
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_live_key_id
```

### File Storage

For production, consider using cloud storage:

1. **AWS S3** (Recommended)
2. **Cloudinary**
3. **Firebase Storage**

### Database

For production, use:
1. **PostgreSQL** (Railway, Render, Heroku)
2. **MySQL** (PlanetScale)
3. **MongoDB Atlas** (if switching to MongoDB)

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Update all environment variables
- [ ] Test payment integration with live keys
- [ ] Set up production database
- [ ] Configure file storage
- [ ] Update CORS settings
- [ ] Set up domain and SSL

### Post-Deployment
- [ ] Test user registration/login
- [ ] Test file upload functionality
- [ ] Test payment flow
- [ ] Test admin dashboard
- [ ] Monitor application logs
- [ ] Set up monitoring (optional)

## 🔒 Security Considerations

1. **Environment Variables**: Never commit .env files
2. **JWT Secret**: Use strong, unique secrets
3. **File Upload**: Validate file types and sizes
4. **CORS**: Configure properly for production
5. **HTTPS**: Always use HTTPS in production
6. **Rate Limiting**: Implement API rate limiting
7. **Input Validation**: Validate all user inputs

## 📊 Monitoring and Analytics

### Free Monitoring Options
1. **Sentry** - Error tracking
2. **Google Analytics** - User analytics
3. **Uptime Robot** - Uptime monitoring
4. **LogRocket** - Session replay

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check database connection
   npx prisma db push
   ```

2. **File Upload Issues**
   ```bash
   # Check upload directory permissions
   chmod 755 uploads/
   ```

3. **Payment Integration**
   - Verify Razorpay keys
   - Check webhook URLs
   - Test with test cards

4. **CORS Issues**
   - Update CORS configuration in backend
   - Check frontend API URL

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Test with different browsers
4. Verify environment variables

## 🎯 Next Steps

After successful deployment:
1. Set up custom domain
2. Configure email notifications
3. Implement advanced features
4. Add analytics and monitoring
5. Optimize performance
6. Set up CI/CD pipeline

---

**Happy Deploying! 🚀** 