#!/bin/sh

# Move CNAME to the root
mv docs/CNAME .

# Delete the docs folder and all its contents
rm -rf docs

# Run npx nuxi generate
npx nuxi generate

# Make the docs folder again
mkdir docs

# Move everything from .output/public into docs
mv .output/public/* docs

# Move the CNAME file back into docs
mv CNAME docs

# Add everything to git
git add .

# Commit with the message "build"
git commit -m "build"

# Push to GitHub
git push