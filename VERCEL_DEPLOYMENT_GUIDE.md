# Vercel Deployment Guide - Petra AI Dashboard

## Quick Start - Deploy in 3 Steps

### 1. **Install Vercel CLI**
```bash
npm install -g vercel
```

### 2. **Push to GitHub** (Required for Vercel)
```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. **Deploy to Vercel**
```bash
vercel --prod
```

Or connect via Vercel Dashboard:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Node.js and Express
5. Add environment variables (see below)
6. Click "Deploy"

---

## Environment Variables Setup

In Vercel Dashboard, go to **Settings → Environment Variables** and add:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes (for AI features) |
| `NODE_ENV` | `production` | Auto-set by Vercel |
| `PORT` | `3000` | Auto-set by Vercel |

**To get OPENROUTER_API_KEY:**
1. Visit https://openrouter.ai
2. Sign up / Log in
3. Go to API Keys
4. Copy your API key
5. Add it to Vercel environment variables

---

## Project Structure for Vercel

```
your-repo/
├── backend/
│   ├── server.js          # Main Express server
│   ├── package.json       # Node dependencies
│   └── user interface/    # Frontend files (served statically)
│       ├── index.html
│       ├── style.css
│       └── script.js
├── vercel.json            # Vercel configuration
├── package.json           # Root package.json
└── README.md
```

---

## Important Notes

### Static Frontend Hosting
- The `user interface/` folder is served as static files from the Express server
- No separate frontend deployment needed - everything runs on one domain

### Database (SQLite)
⚠️ **Issue**: Vercel uses serverless functions with ephemeral storage. SQLite files don't persist between deployments.

**Solutions:**
1. **Use MongoDB Atlas** (Recommended - Free tier available)
   - Update `server.js` to use MongoDB instead of SQLite
   - Add `MONGODB_URI` to environment variables

2. **Use PostgreSQL** (Vercel Postgres)
   - Create a Vercel Postgres database
   - Update `server.js` to use PostgreSQL client
   - Add connection string to environment variables

3. **Use Vercel KV (Redis)**
   - For caching and session storage
   - Add `KV_URL` and `KV_REST_API_TOKEN` to environment variables

**Current setup**: Uses SQLite which works but data will reset on deployment. For production, migrate to a cloud database.

---

## Deployment Checklist

- [ ] GitHub account created
- [ ] Repository pushed to GitHub
- [ ] Vercel account created (https://vercel.com)
- [ ] OPENROUTER_API_KEY added to Vercel environment variables
- [ ] Project connected to Vercel
- [ ] First deployment successful
- [ ] Test frontend loads: `https://your-project.vercel.app`
- [ ] Test API: `https://your-project.vercel.app/api/health`
- [ ] Custom domain added (optional)

---

## Testing After Deployment

After Vercel deployment, test these endpoints:

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Get activities
curl https://your-project.vercel.app/api/activities

# Get announcements
curl https://your-project.vercel.app/api/announcements

# Test chat (requires OPENROUTER_API_KEY)
curl -X POST https://your-project.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

---

## Troubleshooting

### Deployment Failed
- Check build logs in Vercel Dashboard
- Verify `package.json` has `node_modules` in `.gitignore`
- Ensure `server.js` listens on `process.env.PORT`

### 503 Errors
- Check Vercel function logs
- Verify environment variables are set
- Ensure API keys have correct permissions

### API Returns 404
- Check that backend routes are properly defined
- Verify CORS is enabled
- Check frontend API endpoints match backend routes

### Database Connection Issues
- SQLite won't work reliably on Vercel - migrate to cloud DB
- See "Database" section above for solutions

---

## Next Steps - Database Migration

To make data persistent, follow this guide to migrate from SQLite to MongoDB:

1. Create MongoDB Atlas cluster (free)
2. Install MongoDB driver: `npm install mongodb`
3. Update database code in `server.js`
4. Add `MONGODB_URI` to Vercel environment variables
5. Redeploy

Would you like a migration guide?
