#!/bin/bash

# Script to replace 'any' types with proper types in frontend files
# This script will be run to complete the type safety improvements

echo "Starting batch replacement of 'any' types..."

# Replace ': any' with proper error handling pattern in catch blocks
find /home/amruth/Desktop/Stratify/frontend/src/features -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/} catch (err: any) {/} catch (err) {\n      const error = err as { message?: string };/g' {} \;
find /home/amruth/Desktop/Stratify/frontend/src/features -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/} catch (error: any) {/} catch (error) {\n      const err = error as { message?: string };/g' {} \;
find /home/amruth/Desktop/Stratify/frontend/src/features -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\.catch((err: any)/\.catch((err)/g' {} \;

echo "Completed batch replacement!"
echo "Please review the changes and run TypeScript compiler to verify."
