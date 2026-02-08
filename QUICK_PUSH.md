# ONE-LINE GITHUB PUSH

## Option 1: Create Token + Push (2 minutes)

### Step 1: Create GitHub Token
1. Open: https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. **Note:** EchoTimeline
4. **Expiration:** No expiration
5. **Scopes:** ✅ `repo` (first checkbox)
6. Click **Generate token**
7. **COPY YOUR TOKEN**

### Step 2: Run This Command (replace YOUR_TOKEN with your token)

```bash
cd C:\Users\aziz\.openclaw\workspace\echotimeline

curl -X POST "https://api.github.com/user/repos" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_TOKEN" \
  -d "{\"name\":\"echotimeline\",\"description\":\"Turn dusty albums into living timelines\",\"private\":false}"

git remote add origin https://touihrinour7-gif:YOUR_TOKEN@github.com/touihrinour7-gif/echotimeline.git
git branch -M main
git push -u origin main
```

---

## Option 2: Manual (1 minute)

1. Go to: https://github.com/new
2. **Repository name:** echotimeline
3. **Description:** Turn dusty albums into living timelines
4. **Public:** ✅ Selected
5. Click **Create repository**
6. Run:
```bash
cd C:\Users\aziz\.openclaw\workspace\echotimeline
git remote add origin https://github.com/touihrinour7-gif/echotimeline.git
git branch -M main
git push -u origin main
```

---

## AFTER PUSH:

**Your repo will be at:** https://github.com/touihrinour7-gif/echotimeline

Then give CLAUDE_PROMPT.md to Claude Opus 4!
