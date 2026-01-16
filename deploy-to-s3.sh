#!/bin/bash

# Deployment script for S3
# Usage: ./deploy-to-s3.sh YOUR-BUCKET-NAME

if [ -z "$1" ]; then
    echo "Error: Please provide S3 bucket name"
    echo "Usage: ./deploy-to-s3.sh YOUR-BUCKET-NAME"
    exit 1
fi

BUCKET_NAME=$1

echo "🏗️  Building React app..."
npm run build

echo "☁️  Deploying to S3 bucket: $BUCKET_NAME..."
aws s3 sync build/ s3://$BUCKET_NAME --delete

echo "🎯 Setting cache control headers..."
aws s3 cp build/ s3://$BUCKET_NAME/ --recursive --cache-control "max-age=31536000" --exclude "*.html"
aws s3 cp build/index.html s3://$BUCKET_NAME/index.html --cache-control "no-cache"

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: http://$BUCKET_NAME.s3-website-REGION.amazonaws.com"
