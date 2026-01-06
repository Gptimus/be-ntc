#!/usr/bin/env bash

# Color Validation Script
# Checks for hardcoded Tailwind color tokens in the codebase
# Usage: ./scripts/validate-colors.sh [directory]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default directory to check
DIR="${1:-apps}"

echo "🎨 Validating color tokens in: $DIR"
echo ""

# Hardcoded color patterns to check
PATTERNS=(
  "text-red-"
  "text-blue-"
  "text-green-"
  "text-yellow-"
  "text-purple-"
  "text-pink-"
  "text-indigo-"
  "text-orange-"
  "text-teal-"
  "text-cyan-"
  "text-lime-"
  "text-emerald-"
  "text-violet-"
  "text-fuchsia-"
  "text-rose-"
  "text-sky-"
  "text-amber-"
  "text-gray-"
  "text-slate-"
  "text-zinc-"
  "text-neutral-"
  "text-stone-"
  "bg-red-"
  "bg-blue-"
  "bg-green-"
  "bg-yellow-"
  "bg-purple-"
  "bg-pink-"
  "bg-indigo-"
  "bg-orange-"
  "bg-teal-"
  "bg-cyan-"
  "bg-lime-"
  "bg-emerald-"
  "bg-violet-"
  "bg-fuchsia-"
  "bg-rose-"
  "bg-sky-"
  "bg-amber-"
  "bg-gray-"
  "bg-slate-"
  "bg-zinc-"
  "bg-neutral-"
  "bg-stone-"
  "border-red-"
  "border-blue-"
  "border-green-"
  "border-yellow-"
  "border-purple-"
  "border-pink-"
  "border-indigo-"
  "border-orange-"
  "border-teal-"
  "border-cyan-"
  "border-lime-"
  "border-emerald-"
  "border-violet-"
  "border-fuchsia-"
  "border-rose-"
  "border-sky-"
  "border-amber-"
  "border-gray-"
  "border-slate-"
  "border-zinc-"
  "border-neutral-"
  "border-stone-"
)

# Allowed exceptions (for specific use cases like the hero demo)
EXCEPTIONS=(
  "apps/landing/src/components/sections/hero.tsx"
)

# Function to check if file is in exceptions
is_exception() {
  local file="$1"
  for exception in "${EXCEPTIONS[@]}"; do
    if [[ "$file" == *"$exception"* ]]; then
      return 0
    fi
  done
  return 1
}

# Track violations
VIOLATIONS=0
VIOLATION_FILES=()

# Check each pattern
for pattern in "${PATTERNS[@]}"; do
  # Search for the pattern in TypeScript/JavaScript files
  while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    
    # Skip if file is in exceptions
    if is_exception "$file"; then
      continue
    fi
    
    # Add to violations
    VIOLATIONS=$((VIOLATIONS + 1))
    VIOLATION_FILES+=("$line")
  done < <(grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "$pattern" "$DIR" 2>/dev/null || true)
done

# Print results
echo ""
if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✅ No hardcoded color tokens found!${NC}"
  echo ""
  echo "All components are using semantic color tokens. Great job! 🎉"
  exit 0
else
  echo -e "${RED}❌ Found $VIOLATIONS hardcoded color token(s)${NC}"
  echo ""
  echo "The following files contain hardcoded color tokens:"
  echo ""
  
  for violation in "${VIOLATION_FILES[@]}"; do
    echo -e "${YELLOW}  $violation${NC}"
  done
  
  echo ""
  echo -e "${YELLOW}⚠️  Please replace hardcoded tokens with semantic colors:${NC}"
  echo ""
  echo "  ❌ WRONG:"
  echo "    text-red-500, bg-blue-600, border-gray-300"
  echo ""
  echo "  ✅ CORRECT:"
  echo "    text-destructive, bg-primary, border-border"
  echo ""
  echo "Semantic color tokens:"
  echo "  - primary, secondary, accent, destructive"
  echo "  - background, foreground, card, popover, muted"
  echo "  - border, input, ring"
  echo ""
  echo "See .agent/design-guidelines.md for complete documentation."
  echo ""
  exit 1
fi
