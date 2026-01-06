# Deployment Guide

## GitHub Deployment ✅

The code has been successfully pushed to GitHub:
- Repository: https://github.com/draphael123/fountain-birthdays.git
- Branch: `main`

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New Project"
3. Import the repository: `draphael123/fountain-birthdays`
4. Vercel will automatically detect Next.js and configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Click "Deploy"
6. Your app will be live in a few minutes!

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Environment Variables

No environment variables are required for this app. All data is stored in browser localStorage.

### Post-Deployment

After deployment, your app will be available at:
- `https://fountain-birthdays.vercel.app` (or your custom domain)

The app will:
- Automatically load the default CSV from `/public/data/birthdays.csv`
- Save all user data to browser localStorage
- Work as a fully client-side application

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys:
- Every push to `main` branch → Production deployment
- Pull requests → Preview deployments

No additional configuration needed!


