# From repo root
# Option A: Keep one (e.g. locallhost) and delete the duplicates
rm -rf Localhost/ localhost.co/

# Option B: Delete all if no longer needed (most common for monorepos)
rm -rf locallhost/ Localhost/ localhost.co/

# Also look for other typo variants or junk
find . -type d -iname "*local*" -print   # list suspects
# Then rm -rf any that are test junk

git add . && git commit -m "Clean up duplicate/test localhost folders"
git push
