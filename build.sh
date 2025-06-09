#!/bin/sh

# Move CNAME to the root
mv docs/CNAME .
mv docs/.nojekyll .

# Delete the docs folder and all its contents
rm -rf docs

# Run npx nuxi generate
if ! npx nuxi generate; then
    echo "npx nuxi generate failed, remaking docs and moving CNAME"
    mkdir docs
    mv CNAME docs
    MV .nojekyll docs
    exit 1
fi

# Make the docs folder again
mkdir docs

# Move everything from .output/public into docs
mv .output/public/* docs

# Move the CNAME file back into docs
mv CNAME docs
mv .nojekyll docs

# Add everything to git
git add .

# Commit with the message "build"
git commit -m "build"

# Push to GitHub
git push