#!/bin/bash

# Code Generation Script for Kosha Backend Modules
# This script creates the directory structure and base files for all modules

echo "🚀 Generating code for all Kosha backend modules..."

# Create module directories
MODULES=("authentication" "bills" "expenses" "income" "investments" "payments" "notifications" "dashboard")

for module in "${MODULES[@]}"; do
  echo "📦 Creating $module module..."
  mkdir -p "src/models/postgres/$module"
  mkdir -p "src/models/mongodb/$module"
  mkdir -p "src/repositories/postgres/$module"
  mkdir -p "src/repositories/mongodb/$module"
  mkdir -p "src/services/$module"
  mkdir -p "src/controllers/$module"
  mkdir -p "src/routes/$module"
done

echo "✅ Directory structure created!"
echo "📝 Now generating module files..."

