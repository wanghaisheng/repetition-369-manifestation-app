#!/bin/bash

# Build script with react-snap prerendering
echo "Building application..."
npm run build

echo "Starting prerendering with react-snap..."
npx react-snap

echo "Prerendering complete!"
echo "Prerendered pages are in the build directory"
