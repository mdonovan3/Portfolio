# Data Portfolio Deployment Guide

## Local Development

```bash
# Start development server
npm start
```

Visit http://localhost:3000

## Build for Production

```bash
npm run build
```

## Deploy to S3

### Prerequisites
- AWS CLI installed and configured
- S3 bucket created with static website hosting enabled
- Bucket policy set for public read access

### Deploy

```bash
./deploy-to-s3.sh YOUR-BUCKET-NAME
```

### Manual Deployment

```bash
npm run build
aws s3 sync build/ s3://YOUR-BUCKET-NAME --delete
```

## Customization

Edit `src/App.js` to customize:
- GitHub Gists URLs (lines 45-48)
- R Shiny Apps URLs (lines 51-54)
- Skills (lines 57-64)
- Experience (lines 67-85)
- Social links in About section (line 188)

## S3 Bucket Setup

1. Create bucket in S3
2. Enable static website hosting
3. Set index document: `index.html`
4. Set error document: `index.html`
5. Add bucket policy for public access
6. Note the bucket website endpoint URL
