# Kosha Backend Deployment Guide

This guide covers deploying the Kosha backend application to various platforms.

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- Database access (PostgreSQL, MongoDB, Redis)
- Environment variables configured

## Local Development Setup

### Using Docker Compose (Recommended)

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env`** with your configuration values

3. **Start all services**:
   ```bash
   docker-compose up -d
   ```

4. **View logs**:
   ```bash
   docker-compose logs -f backend
   ```

5. **Stop services**:
   ```bash
   docker-compose down
   ```

### Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up databases**:
   - PostgreSQL: Create database `kosha_db`
   - MongoDB: Ensure MongoDB is running
   - Redis: Ensure Redis is running

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run database migrations** (if using TypeORM migrations):
   ```bash
   npm run migration:run
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Production Deployment

### Option 1: Railway

[Railway](https://railway.app) is a modern platform for deploying applications.

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize project**:
   ```bash
   railway init
   ```

4. **Add PostgreSQL, MongoDB, and Redis services**:
   - Use Railway's database services
   - Copy connection strings

5. **Set environment variables**:
   ```bash
   railway variables set JWT_SECRET=your-secret
   railway variables set POSTGRES_URL=your-postgres-url
   railway variables set MONGODB_URI=your-mongodb-uri
   railway variables set REDIS_URL=your-redis-url
   # ... set all required variables
   ```

6. **Deploy**:
   ```bash
   railway up
   ```

### Option 2: Render

[Render](https://render.com) provides easy deployment with Docker support.

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. **Add environment variables** in Render dashboard
5. **Add PostgreSQL, MongoDB, and Redis services** from Render marketplace
6. **Deploy**

### Option 3: AWS (EC2/ECS/EKS)

#### Using ECS (Elastic Container Service)

1. **Build and push Docker image**:
   ```bash
   docker build -t kosha-backend .
   docker tag kosha-backend:latest YOUR_ECR_REPO/kosha-backend:latest
   docker push YOUR_ECR_REPO/kosha-backend:latest
   ```

2. **Create ECS task definition** with environment variables
3. **Create ECS service** with the task definition
4. **Set up Application Load Balancer** (optional)
5. **Configure RDS (PostgreSQL), DocumentDB (MongoDB), and ElastiCache (Redis)**

#### Using EC2

1. **Launch EC2 instance** (Ubuntu 22.04 recommended)
2. **SSH into instance**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker ubuntu
   ```

4. **Clone repository**:
   ```bash
   git clone your-repo-url
   cd kosha/backend
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

6. **Start with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

7. **Set up Nginx reverse proxy** (optional):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 4: DigitalOcean App Platform

1. **Create a new App** on DigitalOcean
2. **Connect GitHub repository**
3. **Configure build settings**:
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
4. **Add databases**:
   - Managed PostgreSQL
   - Managed MongoDB
   - Managed Redis
5. **Set environment variables**
6. **Deploy**

### Option 5: Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login**:
   ```bash
   heroku login
   ```

3. **Create app**:
   ```bash
   heroku create kosha-backend
   ```

4. **Add databases**:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   heroku addons:create mongolab:sandbox
   heroku addons:create heroku-redis:hobby-dev
   ```

5. **Set environment variables**:
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set NODE_ENV=production
   # ... set all required variables
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

## Environment Variables

Required environment variables (see `.env.example` for full list):

### Required
- `NODE_ENV` - Environment (production/development)
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `POSTGRES_URL` - PostgreSQL connection string
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string

### Optional
- `GOOGLE_CLIENT_ID` - For Gmail integration
- `GOOGLE_CLIENT_SECRET` - For Gmail integration
- `UPI_PROVIDER_API_KEY` - For payment processing
- `CORS_ORIGIN` - Allowed CORS origins
- `LOG_LEVEL` - Logging level (default: info)

## Database Setup

### PostgreSQL

1. **Create database**:
   ```sql
   CREATE DATABASE kosha_db;
   CREATE USER kosha_user WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE kosha_db TO kosha_user;
   ```

2. **Run migrations** (if using TypeORM migrations):
   ```bash
   npm run migration:run
   ```

### MongoDB

MongoDB will create databases automatically on first connection. No manual setup required.

### Redis

Redis requires no schema setup. Ensure Redis is running and accessible.

## Health Checks

The application includes a health check endpoint:

- **Endpoint**: `GET /health`
- **Response**: `{ "status": "ok", "timestamp": "..." }`

Use this for:
- Load balancer health checks
- Container orchestration health probes
- Monitoring systems

## Monitoring

### Recommended Tools

1. **Application Monitoring**: 
   - [Sentry](https://sentry.io) for error tracking
   - [New Relic](https://newrelic.com) for performance monitoring
   - [Datadog](https://datadoghq.com) for full-stack monitoring

2. **Logging**:
   - Winston is configured for structured logging
   - Consider integrating with ELK stack or CloudWatch

3. **Uptime Monitoring**:
   - [UptimeRobot](https://uptimerobot.com)
   - [Pingdom](https://pingdom.com)

## Security Checklist

- [ ] Change all default secrets (JWT_SECRET, database passwords)
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable Helmet security headers
- [ ] Use environment variables for secrets (never commit `.env`)
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable database SSL connections
- [ ] Set up monitoring and alerting

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Use a load balancer (ALB, NLB, or Cloudflare)
2. **Multiple Instances**: Run multiple backend instances
3. **Session Management**: Ensure JWT tokens work across instances (stateless)
4. **Database Connection Pooling**: Configure connection pools appropriately

### Vertical Scaling

1. **Increase Container Resources**: More CPU/RAM
2. **Database Optimization**: Indexes, query optimization
3. **Caching**: Use Redis for frequently accessed data

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check database credentials
   - Verify network connectivity
   - Check firewall rules

2. **Port Already in Use**:
   - Change PORT in `.env`
   - Kill process using port: `lsof -ti:3000 | xargs kill`

3. **Build Failures**:
   - Check Node.js version (requires 20+)
   - Clear node_modules and reinstall
   - Check TypeScript compilation errors

4. **Memory Issues**:
   - Increase container memory limits
   - Check for memory leaks
   - Optimize database queries

## CI/CD

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
      # Add deployment steps for your platform
```

## Support

For issues or questions:
- Check logs: `docker-compose logs backend`
- Review environment variables
- Check database connectivity
- Verify all services are running

