# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment (CRITICAL - Must Complete)

### 1. Environment Configuration
- [ ] **Update `.env.local` with real Supabase credentials**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` - Get from Supabase project settings
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Get from Supabase API settings
  - [ ] `NEXT_PUBLIC_APP_URL` - Set to production domain

- [ ] **Create `.env.production` for production environment**
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
  NEXT_PUBLIC_APP_URL=https://yourdomain.com
  NEXT_PUBLIC_APP_NAME=StandBy
  ```

### 2. Database Setup
- [ ] **Apply schema to production Supabase database**
  - [ ] Run `supabase/schema.sql` in Supabase SQL Editor
  - [ ] Verify all tables created successfully
  - [ ] Check RLS policies are active
  - [ ] (Optional) Run `supabase/seed.sql` for sample recipes

### 3. Build Verification
- [ ] **Run production build locally**
  ```bash
  npm run build
  npm run start
  ```
- [ ] Test all critical flows:
  - [ ] User registration
  - [ ] Login/Logout
  - [ ] Create transaction
  - [ ] Browse recipes
  - [ ] Create calendar event
  - [ ] Add savings goal

### 4. Code Quality
- [ ] **Run all checks**
  ```bash
  npm run type-check  # Should pass with 0 errors
  npm run lint        # Should pass
  npm run test:unit   # Should pass all tests
  ```

### 5. Security
- [ ] **Verify no secrets in code**
  - [ ] Search for hardcoded API keys
  - [ ] Check `.env.local` is in `.gitignore`
  - [ ] Remove all `console.log` statements (optional but recommended)

- [ ] **Test authentication flows**
  - [ ] Password reset email delivery
  - [ ] Session management
  - [ ] Protected routes

## 📦 Deployment Steps

### Vercel Deployment (Recommended)

1. **Connect to GitHub**
   - [ ] Push code to GitHub repository
   - [ ] Go to [vercel.com](https://vercel.com)
   - [ ] Import project from GitHub

2. **Configure Environment Variables**
   Add these in Vercel project settings:
   - [ ] `NEXT_PUBLIC_SUPABASE_URL`
   - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - [ ] `NEXT_PUBLIC_APP_URL`
   - [ ] `NEXT_PUBLIC_APP_NAME`

3. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for build to complete
   - [ ] Test deployment URL

4. **Configure Custom Domain (Optional)**
   - [ ] Add custom domain in Vercel settings
   - [ ] Update DNS records
   - [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain
   - [ ] Redeploy

### Alternative: Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

3. **Use PM2 for production (optional)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "standby-web" -- start
   pm2 save
   pm2 startup
   ```

## 🧪 Post-Deployment Testing

### Critical User Flows
- [ ] **Authentication**
  - [ ] Register new user → Check profile created in Supabase
  - [ ] Login with created user → Redirects to dashboard
  - [ ] Logout → Redirects to landing page
  - [ ] Password reset → Receive email

- [ ] **Dashboard**
  - [ ] Loads with correct stats
  - [ ] All navigation links work
  - [ ] Theme switcher works

- [ ] **Budget**
  - [ ] Create income transaction
  - [ ] Create expense transaction
  - [ ] View charts (should show data)
  - [ ] Edit transaction
  - [ ] Delete transaction

- [ ] **Savings Goals**
  - [ ] Create savings goal
  - [ ] Add/subtract amount
  - [ ] View progress
  - [ ] Edit goal
  - [ ] Delete goal

- [ ] **Recipes**
  - [ ] Browse recipes
  - [ ] Apply filters
  - [ ] View recipe details
  - [ ] Add to favorites
  - [ ] Add ingredients to shopping list

- [ ] **Shopping List**
  - [ ] Add manual item
  - [ ] Check/uncheck items
  - [ ] Delete items
  - [ ] Clear checked items

- [ ] **Calendar**
  - [ ] Create event
  - [ ] View events
  - [ ] Edit event
  - [ ] Delete event

- [ ] **Settings**
  - [ ] Edit profile (name, avatar)
  - [ ] Change theme
  - [ ] Verify changes persist

### Performance Testing
- [ ] **Page Load Times**
  - [ ] Landing page < 2s
  - [ ] Dashboard < 3s
  - [ ] Recipe browsing < 2s

- [ ] **Lighthouse Scores** (run in Chrome DevTools)
  - [ ] Performance > 80
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## 📊 Monitoring Setup (Post-Launch)

### Error Tracking
- [ ] **Set up Sentry** (recommended)
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard -i nextjs
  ```
  - [ ] Configure Sentry DSN
  - [ ] Test error reporting
  - [ ] Set up alerts

### Analytics
- [ ] **Google Analytics** (optional)
  - [ ] Add GA4 tracking code
  - [ ] Set up conversions
  - [ ] Configure events

- [ ] **Vercel Analytics** (if using Vercel)
  - [ ] Enable Web Analytics
  - [ ] Enable Speed Insights

### Uptime Monitoring
- [ ] Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- [ ] Configure alert emails
- [ ] Test alerting

## 🔒 Security Hardening

### Supabase Configuration
- [ ] **Email Auth Settings**
  - [ ] Confirm email required: ON
  - [ ] Enable email confirmations
  - [ ] Set redirect URLs

- [ ] **RLS Policies**
  - [ ] Verify all tables have RLS enabled
  - [ ] Test policies with different users
  - [ ] Check no data leakage between users

- [ ] **Database Backups**
  - [ ] Enable automatic backups in Supabase
  - [ ] Set retention period
  - [ ] Test restoration

### Application Security
- [ ] **Rate Limiting** (if needed)
  - [ ] Consider adding rate limiting for API routes

- [ ] **CORS Configuration**
  - [ ] Verify only your domain can access API

## 📝 Documentation

- [ ] **Update README.md**
  - [ ] Add production URL
  - [ ] Update deployment instructions
  - [ ] Add troubleshooting section

- [ ] **Create User Guide** (optional)
  - [ ] How to use each feature
  - [ ] FAQ section
  - [ ] Contact information

## 🎯 Go-Live Checklist

### Final Verification
- [ ] All environment variables set
- [ ] Database schema applied
- [ ] Build succeeds with no errors
- [ ] All critical tests pass
- [ ] Error boundaries tested
- [ ] Security headers configured
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring/error tracking active

### Launch Day
- [ ] Monitor error tracking dashboard
- [ ] Watch for unexpected errors
- [ ] Be ready for quick fixes
- [ ] Have rollback plan ready

### Post-Launch (First 48 Hours)
- [ ] Monitor user feedback
- [ ] Check error rates in Sentry
- [ ] Review performance metrics
- [ ] Fix critical issues immediately
- [ ] Document issues and solutions

## 📈 Recommended Improvements

### Short-term (Before Launch)
- [ ] Add loading skeletons to improve perceived performance
- [ ] Implement proper error logging (replace console.error)
- [ ] Add meta tags for better SEO
- [ ] Create favicon and app icons
- [ ] Add robots.txt and sitemap.xml

### Medium-term (1-2 weeks after launch)
- [ ] Increase test coverage to >60%
- [ ] Add E2E tests for critical flows
- [ ] Implement proper logging infrastructure
- [ ] Add performance monitoring
- [ ] Optimize bundle size

### Long-term (Future Releases)
- [ ] PWA support for offline access
- [ ] Push notifications
- [ ] Budget export (CSV/PDF)
- [ ] Recurring calendar events
- [ ] Email notifications
- [ ] Multi-language support

---

## ✅ Sign-off

**Deployment Date:** _______________

**Deployed By:** _______________

**Production URL:** _______________

**All checklist items completed:** ☐ YES ☐ NO

**Ready for production:** ☐ YES ☐ NO

---

**Notes:**

_______________________________________________________________________

_______________________________________________________________________

_______________________________________________________________________
