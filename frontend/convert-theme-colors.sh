#!/bin/bash

# Batch Color Replacement Script for Theme Migration
# This script helps convert hardcoded colors to theme variables

echo "🎨 Theme Color Batch Converter"
echo "=============================="
echo ""

# Define color mappings
declare -A COLOR_MAP
COLOR_MAP["#009063"]="theme.primaryColor"
COLOR_MAP["#3b3b3b"]="theme.secondaryColor"
COLOR_MAP["#fbfbfb"]="theme.backgroundColor"
COLOR_MAP["#dfdcef"]="theme.accentColor"

# Files to process (add more as needed)
FILES=(
  "src/shared/components/Forms/DynamicForm.tsx"
  "src/shared/components/Chat/ChatBox.tsx"
  "src/shared/components/Chat/GroupChatBox.tsx"
  "src/shared/components/Chat/CreateGroupModal.tsx"
  "src/shared/components/Table/Pagination.tsx"
  "src/shared/components/FilterBar/TableFilterBar.tsx"
  "src/shared/components/KanbanBoard/KanbanBoard.tsx"
  "src/shared/components/KanbanBoard/SubtaskCard.tsx"
  "src/shared/components/CollapsibleSection/CollapsibleSection.tsx"
)

echo "This script WILL NOT automatically replace colors."
echo "It will show you what needs to be changed."
echo ""
echo "📋 Analyzing files for hardcoded colors..."
echo ""

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🔍 Checking: $file"
    
    # Count occurrences of each color
    for color in "${!COLOR_MAP[@]}"; do
      count=$(grep -o "$color" "$file" | wc -l)
      if [ $count -gt 0 ]; then
        echo "   - Found $count instances of $color (should be ${COLOR_MAP[$color]})"
      fi
    done
    echo ""
  fi
done

echo "=============================="
echo "📝 Manual Steps Required:"
echo ""
echo "1. For each file listed above, open it in your editor"
echo "2. Import theme: "
echo "   import { useSelector } from 'react-redux';"
echo "   import { RootState } from '@/store';"
echo "   const theme = useSelector((state: RootState) => state.theme);"
echo ""
echo "3. Use find & replace (Ctrl/Cmd + H) for each color:"

for color in "${!COLOR_MAP[@]}"; do
  echo "   - Find: \"$color\" → Replace: {${COLOR_MAP[$color]}}"
done

echo ""
echo "4. Update style props to use template string or object"
echo "   Before: style={{ backgroundColor: '#009063' }}"
echo "   After:  style={{ backgroundColor: theme.primaryColor }}"
echo ""
echo "5. For className with arbitrary values like bg-[#009063]:"
echo "   Convert to inline style or use CSS variable classes"
echo ""
echo "✅ Done! Please process files manually using the guide above."
