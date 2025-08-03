# Deployment Guide

This guide covers deploying the Podcast to Blog app to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
4. Deploy

#### Backend (Railway)
1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Deploy

### Option 2: Vercel + Render

#### Frontend (Vercel)
Same as above

#### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python main.py`
5. Add environment variables
6. Deploy

## 🔧 Manual Deployment

### Frontend (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variables**:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```

### Backend (Railway)

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Deploy**:
   ```bash
   cd backend
   railway up
   ```

4. **Set environment variables**:
   ```bash
   railway variables set OPENAI_API_KEY=your_key
   ```

## 🌐 Domain Setup

### Custom Domain (Optional)

1. **Frontend**: Add custom domain in Vercel dashboard
2. **Backend**: Add custom domain in Railway/Render dashboard
3. **Update CORS**: Update `ALLOWED_ORIGINS` in backend

## 🔒 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (.env)
```bash
OPENAI_API_KEY=your_openai_api_key
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=https://your-frontend-url.com
```

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics
- Performance monitoring
- Error tracking

### Railway/Render Monitoring
- Logs available in dashboard
- Performance metrics
- Error tracking

## 🔄 CI/CD

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: pip install -r backend/requirements.txt
      - uses: railway/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `ALLOWED_ORIGINS` in backend
   - Ensure frontend URL is included

2. **API Key Issues**
   - Verify OpenAI API key is valid
   - Check billing status

3. **File Upload Issues**
   - Check file size limits
   - Verify supported audio formats

4. **Build Failures**
   - Check Node.js version (18+)
   - Verify Python version (3.8+)
   - Check dependency installation

### Debug Commands

```bash
# Check frontend build
npm run build

# Check backend
cd backend
python -c "import fastapi; print('FastAPI OK')"

# Test API locally
curl -X POST http://localhost:8000/transcribe \
  -F "audio=@test.mp3"
```

## 📈 Scaling

### Frontend Scaling
- Vercel handles scaling automatically
- CDN distribution included

### Backend Scaling
- Railway: Automatic scaling
- Render: Manual scaling options
- Consider Redis for caching

## 🔐 Security

### Environment Variables
- Never commit API keys
- Use secrets management
- Rotate keys regularly

### CORS Configuration
- Restrict origins to production domains
- Use HTTPS only in production

### Rate Limiting
- Consider adding rate limiting
- Monitor API usage

## 📝 Post-Deployment Checklist

- [ ] Test file upload functionality
- [ ] Verify transcription works
- [ ] Check blog generation
- [ ] Test export features
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Configure custom domain (if needed)
- [ ] Set up monitoring alerts

## 🆘 Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/support](https://railway.app/support)
- **Render**: [render.com/docs](https://render.com/docs)
- **OpenAI**: [platform.openai.com/docs](https://platform.openai.com/docs) 