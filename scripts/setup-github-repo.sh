#!/bin/bash

# GitHub Repository Setup Script
# This script helps you create a GitHub repository and push your code

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 GitHub Repository Setup Script${NC}"
echo "=================================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it first:"
    echo "  macOS: brew install gh"
    echo "  Linux: https://cli.github.com/"
    echo "  Windows: https://cli.github.com/"
    echo ""
    echo "Alternatively, you can create the repository manually on GitHub.com"
    exit 1
fi

# Check if user is logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  You are not logged in to GitHub CLI.${NC}"
    echo "Please log in first:"
    echo "  gh auth login"
    exit 1
fi

# Get repository name
echo -e "${BLUE}📝 Repository Setup${NC}"
read -p "Enter repository name (default: roam-game-super-app): " REPO_NAME
REPO_NAME=${REPO_NAME:-roam-game-super-app}

# Get repository description
read -p "Enter repository description (default: AI-native multiplayer game engine): " REPO_DESC
REPO_DESC=${REPO_DESC:-AI-native multiplayer game engine}

# Get repository visibility
echo ""
echo "Repository visibility:"
echo "1) Public (recommended for open source)"
echo "2) Private"
read -p "Choose (1-2, default: 1): " VISIBILITY_CHOICE
VISIBILITY_CHOICE=${VISIBILITY_CHOICE:-1}

if [ "$VISIBILITY_CHOICE" = "2" ]; then
    VISIBILITY="--private"
else
    VISIBILITY="--public"
fi

# Create repository
echo ""
echo -e "${BLUE}🔨 Creating GitHub repository...${NC}"
gh repo create "$REPO_NAME" --description "$REPO_DESC" $VISIBILITY --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Repository created successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Repository Information:${NC}"
    echo "  Name: $REPO_NAME"
    echo "  Description: $REPO_DESC"
    echo "  Visibility: $([ "$VISIBILITY_CHOICE" = "2" ] && echo "Private" || echo "Public")"
    echo "  URL: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
    echo ""
    
    # Set up repository settings
    echo -e "${BLUE}⚙️  Configuring repository settings...${NC}"
    
    # Enable issues and projects
    gh api repos/$(gh api user --jq .login)/$REPO_NAME -X PATCH -f has_issues=true -f has_projects=true -f has_wiki=false
    
    # Set up branch protection for main branch
    echo -e "${BLUE}🛡️  Setting up branch protection...${NC}"
    gh api repos/$(gh api user --jq .login)/$REPO_NAME/branches/main/protection -X PUT -f required_status_checks='{"strict":true,"contexts":["test","security","docker"]}' -f enforce_admins=true -f required_pull_request_reviews='{"required_approving_review_count":1}' -f restrictions=null
    
    echo -e "${GREEN}✅ Repository configured successfully!${NC}"
    echo ""
    
    # Display next steps
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. 🌐 Visit your repository: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
    echo "2. 🚀 Deploy to production using DEPLOYMENT_GUIDE.md"
    echo "3. 🔧 Set up environment variables in your hosting platforms"
    echo "4. 🧪 Test all features in production"
    echo "5. 📢 Share your amazing AI game engine with the world!"
    echo ""
    
    # Display important URLs
    echo -e "${BLUE}🔗 Important URLs:${NC}"
    echo "  Repository: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
    echo "  Issues: https://github.com/$(gh api user --jq .login)/$REPO_NAME/issues"
    echo "  Actions: https://github.com/$(gh api user --jq .login)/$REPO_NAME/actions"
    echo "  Settings: https://github.com/$(gh api user --jq .login)/$REPO_NAME/settings"
    echo ""
    
    # Display deployment information
    echo -e "${BLUE}🚀 Deployment Ready:${NC}"
    echo "  Your repository is now ready for deployment to:"
    echo "  • Vercel (Frontend): Connect your GitHub repo"
    echo "  • Railway (Backend + AI): Connect your GitHub repo"
    echo "  • Follow DEPLOYMENT_GUIDE.md for detailed instructions"
    echo ""
    
    echo -e "${GREEN}🎉 Congratulations! Your Roam Game Super App is now on GitHub!${NC}"
    
else
    echo -e "${RED}❌ Failed to create repository.${NC}"
    echo "Please check your GitHub CLI authentication and try again."
    exit 1
fi
