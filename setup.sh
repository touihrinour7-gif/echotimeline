#!/bin/bash

echo "============================================"
echo "EchoTimeline - GitHub Setup Script"
echo "============================================"
echo ""

# Check if already has remote
if git remote geturl origin >/dev/null 2>&1; then
    echo "[OK] Git remote already configured"
else
    read -p "Enter your GitHub username: " GH_USERNAME
    echo ""
    echo "Creating GitHub repository..."
    
    # Create repo (requires GitHub token)
    read -p "Enter your GitHub Personal Access Token: " GH_TOKEN
    
    curl -s -X POST "https://api.github.com/user/repos" \
      -H "Accept: application/vnd.github.v3+json" \
      -H "Authorization: token $GH_TOKEN" \
      -d '{"name":"echotimeline","description":"Turn dusty albums into living timelines - free, private, forever","private":false}'
    
    echo ""
    echo "Adding Git remote..."
    git remote add origin "https://$GH_USERNAME@github.com/$GH_USERNAME/echotimeline.git"
fi

echo ""
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "============================================"
echo "GitHub Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your echotimeline repo"
echo "3. Add Firebase config environment variables"
echo "4. Deploy!"
