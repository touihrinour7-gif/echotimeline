# GitHub Token Creation Helper

## Create a Personal Access Token (1 minute)

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. **Note:** EchoTimeline Deploy
4. **Expiration:** No expiration
5. **Scopes:** Select `repo` (full control of private repositories)
6. Click **Generate token**
7. **Copy your token** - you'll need it!

## Quick Commands (Run in echotimeline folder)

```bash
# Set your username
set GH_USER=touihrinour7-gif

# Create repo (requires token)
set /p GH_TOKEN=Enter your GitHub token:
curl -X POST "https://api.github.com/user/repos" ^
  -H "Accept: application/vnd.github.v3+json" ^
  -H "Authorization: token %GH_TOKEN%" ^
  -d "{\"name\":\"echotimeline\",\"description\":\"Turn dusty albums into living timelines\",\"private\":false}"

# Push code
git remote add origin https://%GH_USER%@github.com/%GH_USER%/echotimeline.git
git branch -M main
git push -u origin main
```

## Then Deploy to Vercel

1. https://vercel.com/new
2. Import echotimeline repo
3. Add Firebase config
4. Deploy!
