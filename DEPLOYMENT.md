# RedConnect Deployment Guide

## Architecture
- **Frontend**: Vercel (React app)
- **Backend**: Render (Node.js/Express API)
- **Database**: Supabase (PostgreSQL)

## Step 1: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `database/schema.sql`
3. Go to Settings > Database and copy your connection string
4. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres`

## Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Set the following:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. Add Environment Variables in Render:
   ```
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ADMIN_EMAIL=admin@redconnect.org
   ADMIN_PASSWORD=admin123
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

5. Deploy and note your Render URL (e.g., `https://redconnect-backend.onrender.com`)

## Step 3: Update Frontend Environment

1. In Vercel, add environment variable:
   ```
   REACT_APP_API_URL=https://your-render-backend.onrender.com/api
   ```

2. Redeploy your Vercel app

## Step 4: Test the Deployment

1. Visit your Vercel frontend URL
2. Try creating a blood request
3. Try admin login with credentials from environment variables
4. Check that data is saved in Supabase

## Troubleshooting

### CORS Issues
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check that Render backend is accessible

### Database Connection Issues
- Verify Supabase connection string is correct
- Ensure database schema is properly imported
- Check Supabase logs for connection errors

### API Not Working
- Check Render logs for errors
- Verify all environment variables are set correctly
- Test backend endpoints directly (e.g., `https://your-backend.onrender.com/api/health`)

## Free Tier Limitations

### Supabase Free Tier:
- 500MB database
- 2GB bandwidth per month
- 50MB file uploads

### Render Free Tier:
- 750 hours per month
- Sleeps after 15 minutes of inactivity
- 512MB RAM

### Vercel Free Tier:
- 100GB bandwidth per month
- Unlimited static deployments
