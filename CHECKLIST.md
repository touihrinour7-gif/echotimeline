# Pre-Deployment Checklist

Use this checklist before deploying to production.

## ✅ Code Quality

- [ ] All ESLint warnings fixed
- [ ] No console.errors in production code
- [ ] All TODO comments addressed or documented
- [ ] Code is properly formatted
- [ ] No hardcoded credentials
- [ ] All imports are used
- [ ] No unused variables

## ✅ Functionality Testing

### Demo Mode
- [ ] Can access demo mode from login page
- [ ] Can create timelines in demo mode
- [ ] Can upload photos in demo mode
- [ ] Can delete items in demo mode
- [ ] Data persists after refresh
- [ ] Can switch to real mode
- [ ] Demo badge displays correctly

### Authentication
- [ ] Email signup works
- [ ] Email login works
- [ ] Google OAuth works (if configured)
- [ ] Session persists across refreshes
- [ ] Logout works correctly
- [ ] Protected routes redirect when not authenticated
- [ ] Auth errors show user-friendly messages

### Timeline Management
- [ ] Can create timeline with title and description
- [ ] Timeline appears in dashboard immediately
- [ ] Can view timeline details
- [ ] Can delete timeline
- [ ] Deleting timeline asks for confirmation
- [ ] Photo count updates correctly
- [ ] Empty state shows when no timelines exist

### Photo Management  
- [ ] Can upload single photo
- [ ] Can upload multiple photos
- [ ] Upload progress shows
- [ ] Photos appear in timeline
- [ ] Can view photo in fullscreen
- [ ] Can delete individual photos
- [ ] Storage cleanup works on delete
- [ ] Photo metadata is saved

### UI/UX
- [ ] Loading states appear appropriately
- [ ] Error messages are clear and helpful
- [ ] Success messages confirm actions
- [ ] All buttons have hover states
- [ ] Mobile responsive (test on phone)
- [ ] Tablet responsive (test on iPad)
- [ ] Desktop looks good (1920x1080)
- [ ] No layout shifts during loading
- [ ] Images load smoothly
- [ ] Modals can be closed
- [ ] Forms validate properly

## ✅ Supabase Configuration

### Database
- [ ] `timelines` table created
- [ ] `photos` table created
- [ ] Indexes created for performance
- [ ] RLS enabled on all tables
- [ ] Policies created for timelines (SELECT, INSERT, UPDATE, DELETE)
- [ ] Policies created for photos (SELECT, INSERT, UPDATE, DELETE)
- [ ] Trigger for photo count works
- [ ] Foreign key constraints set

### Storage
- [ ] `photos` bucket created
- [ ] Bucket set to public
- [ ] Storage policies created (INSERT, SELECT, DELETE)
- [ ] File upload works
- [ ] Public URLs work
- [ ] File deletion works

### Authentication
- [ ] Email provider enabled
- [ ] Confirmation emails send (if required)
- [ ] Google OAuth configured (if using)
- [ ] Password requirements set
- [ ] Site URL configured correctly
- [ ] Redirect URLs added

## ✅ Environment Variables

### Local Development
- [ ] `.env` file created
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] Optional AI keys set (if using)
- [ ] `.env` is in `.gitignore`

### Vercel Production
- [ ] All env vars added to Vercel
- [ ] Env vars are not committed to Git
- [ ] Production values different from dev (if applicable)

## ✅ Security

- [ ] No API keys in code
- [ ] No passwords in code
- [ ] RLS policies tested
- [ ] Storage policies tested
- [ ] Auth flow is secure
- [ ] CORS configured correctly
- [ ] Rate limiting considered
- [ ] Input validation on forms
- [ ] SQL injection not possible (using Supabase client)
- [ ] XSS protection (React escapes by default)

## ✅ Performance

- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Bundle size reasonable (< 1MB)
- [ ] Initial load fast (< 3s)
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Proper indexes on database
- [ ] CDN configured (Vercel does this)

## ✅ Documentation

- [ ] README.md complete
- [ ] DEPLOYMENT.md complete
- [ ] API.md complete
- [ ] TESTING.md complete
- [ ] CHANGELOG.md updated
- [ ] Code comments where needed
- [ ] Environment variables documented
- [ ] Setup instructions clear

## ✅ Git & GitHub

- [ ] All changes committed
- [ ] Commit messages are descriptive
- [ ] `.gitignore` includes `.env`
- [ ] `.gitignore` includes `node_modules`
- [ ] `.gitignore` includes `dist`
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] GitHub repo created
- [ ] Code pushed to GitHub

## ✅ Vercel Deployment

- [ ] Vercel project created
- [ ] Connected to GitHub repo
- [ ] Build settings correct:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- [ ] Environment variables added
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] Deployment successful
- [ ] No build errors
- [ ] No runtime errors in logs

## ✅ Post-Deployment Testing

- [ ] Visit deployed URL
- [ ] Test demo mode on production
- [ ] Test real mode signup
- [ ] Test real mode login
- [ ] Test timeline creation
- [ ] Test photo upload
- [ ] Test photo deletion
- [ ] Test timeline deletion
- [ ] Test on mobile device
- [ ] Test on different browsers:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test error scenarios:
  - [ ] Network offline
  - [ ] Invalid credentials
  - [ ] Large file upload
  - [ ] Session expiry

## ✅ Monitoring & Analytics

- [ ] Vercel Analytics enabled (optional)
- [ ] Sentry error tracking (optional)
- [ ] Google Analytics (optional)
- [ ] Supabase logs checked
- [ ] No errors in production logs
- [ ] Performance metrics acceptable

## ✅ User Experience

- [ ] First-time user can understand the app
- [ ] Demo mode explanation is clear
- [ ] Help/documentation is accessible
- [ ] Error messages are helpful
- [ ] Loading states are clear
- [ ] Success feedback is clear
- [ ] Mobile UX is good
- [ ] Accessibility basics covered

## ✅ Business/Legal (Optional)

- [ ] Privacy policy (if collecting data)
- [ ] Terms of service
- [ ] Cookie notice (if using cookies)
- [ ] GDPR compliance (if targeting EU)
- [ ] Contact information visible
- [ ] Support email configured

## 🎯 Final Checks Before Launch

### Quick Test Flow
1. [ ] Visit site
2. [ ] Try demo mode
3. [ ] Create timeline
4. [ ] Upload photo
5. [ ] Switch to real mode
6. [ ] Sign up
7. [ ] Create timeline
8. [ ] Upload photo
9. [ ] Refresh page
10. [ ] Verify data persists
11. [ ] Delete photo
12. [ ] Delete timeline
13. [ ] Sign out
14. [ ] Sign in again
15. [ ] Verify data still there

### Performance Check
- [ ] Lighthouse score > 90
- [ ] PageSpeed Insights green
- [ ] No console errors
- [ ] No console warnings (or all explained)

### Mobile Check
- [ ] Open on phone
- [ ] All features work
- [ ] Layout looks good
- [ ] Touch targets are large enough
- [ ] No horizontal scroll

## 📋 Sign Off

- [ ] Developer tested: _______________
- [ ] QA tested: _______________
- [ ] Product owner approved: _______________
- [ ] Ready for production: _______________

## 🚀 Launch!

Once all items are checked:

```bash
# Final build
npm run build

# Deploy to production
vercel --prod

# Monitor for issues
# Check Vercel dashboard
# Check Supabase dashboard
# Monitor user feedback
```

## 📊 Post-Launch Monitoring

First 24 hours:
- [ ] Check error logs every 2 hours
- [ ] Monitor user signups
- [ ] Check performance metrics
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately

First week:
- [ ] Daily log checks
- [ ] Weekly analytics review
- [ ] User feedback collection
- [ ] Bug triage and fixes
- [ ] Performance optimization

---

**Remember:** It's better to delay launch and fix issues than to launch with bugs!
