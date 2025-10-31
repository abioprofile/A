set -e

BRANCH="laitan"

echo "🔍 Running build to detect missing dependencies..."

# Capture build output
BUILD_LOG=$(npm run build 2>&1 || true)

# Extract missing module names from build errors
MISSING_DEPS=$(echo "$BUILD_LOG" | grep -oE "Can't resolve '([^']+)'" | awk -F"'" '{print $2}' | sort -u)

if [ -z "$MISSING_DEPS" ]; then
  echo "✅ No missing dependencies detected!"
else
  echo "⚠️ Missing dependencies found:"
  echo "$MISSING_DEPS"
  echo

  # Step 1: Install each missing package
  for dep in $MISSING_DEPS; do
    # Ignore relative imports and local paths
    if [[ $dep != .* && $dep != /* ]]; then
      echo "📦 Installing $dep ..."
      npm install $dep || echo "❌ Failed to install $dep"
    fi
  done
fi

# Step 2: Clean node_modules and reinstall fresh
echo "🧹 Cleaning and reinstalling..."
rm -rf node_modules package-lock.json
npm install

# Step 3: Test build again
echo "🧪 Verifying build..."
npm run build

# Step 4: Commit & push changes
echo "📤 Committing and pushing to branch '$BRANCH'..."
git add package.json package-lock.json
git commit -m "fix: auto-install missing dependencies"
git push origin $BRANCH

echo "🚀 Done! All missing dependencies fixed and pushed successfully."
