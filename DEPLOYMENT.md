# Scriptonyapp Deployment Guide

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/iamthamanic/scriptony.git
cd scriptony

# 2. Copy and edit environment variables
cp .env.example .env
nano .env  # Edit DOMAIN and other settings

# 3. Start with Docker Compose
docker-compose up -d --build
```

## 🔧 Domain Configuration

### Changing the Domain

**Option 1: Environment Variable (Recommended)**

Edit `.env` file:
```bash
DOMAIN=your-domain.com
FRONTEND_PORT=8080
BACKEND_PORT=3000
```

Restart:
```bash
docker-compose down
docker-compose up -d --build
```

**Option 2: Command Line**

```bash
DOMAIN=your-domain.com docker-compose up -d --build
```

**Option 3: Multiple Domains (Traefik)**

Uncomment the Traefik section in `docker-compose.yml` for automatic SSL and multi-domain support.

## 📋 Server Requirements

- Docker 20.10+ & Docker Compose 2.0+
- Ports: 80, 443 (for SSL), 3000 (backend)
- Domain pointing to server IP
- (Optional) SSL certificates

## 🔐 SSL Configuration

### Option A: Let's Encrypt (Automatic)

```bash
# Install certbot
sudo apt install certbot

# Generate certificates
sudo certbot certonly --standalone -d ${DOMAIN}

# Copy to project
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem nginx/ssl/

# Set permissions
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem
```

### Option B: Custom SSL Certificates

Place your certificates in `nginx/ssl/`:
- `fullchain.pem` - Certificate + intermediates
- `privkey.pem` - Private key

### Option C: External Reverse Proxy (Cloudflare, etc.)

If using an external proxy (Cloudflare, Nginx Proxy Manager):
- Set `FRONTEND_PORT=80` or keep default
- No SSL configuration needed in container
- Configure SSL at proxy level

## 🌐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DOMAIN` | `localhost` | Your domain name |
| `FRONTEND_PORT` | `8080` | Port for frontend (host) |
| `BACKEND_PORT` | `3000` | Port for backend API (host) |
| `BACKEND_HOST` | `scriptony-api` | Docker service name for backend |
| `VITE_API_URL` | auto | Full API URL for frontend |
| `DATABASE_URL` | - | PostgreSQL connection string |
| `JWT_SECRET` | - | Secret for JWT tokens |
| `GOOGLE_*` | - | OAuth credentials |
| `MINIO_*` | - | S3/MinIO storage config |

## 🔄 CI/CD Deployment

### GitHub Actions Setup

1. Add these secrets to your GitHub repository:
   - `SSH_HOST` - Your server IP/domain
   - `SSH_USER` - SSH username
   - `SSH_PRIVATE_KEY` - SSH private key
   - `TELEGRAM_BOT_TOKEN` (optional)
   - `TELEGRAM_CHAT_ID` (optional)

2. Push to `main` branch triggers automatic deployment

### Manual Deployment

```bash
# On server:
cd /var/www/scriptony
git pull origin main

# Update environment if needed
nano .env

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Cleanup old images
docker system prune -f
```

## 🐛 Troubleshooting

### Container won't start
```bash
docker-compose logs -f
```

### Domain not working
- Check DNS: `nslookup your-domain.com`
- Check firewall: `sudo ufw status`
- Check ports: `sudo netstat -tlnp | grep 80`

### SSL errors
```bash
# Test SSL config
sudo nginx -t

# Check certificate
openssl x509 -in nginx/ssl/fullchain.pem -text -noout
```

### Backend not reachable
```bash
# Check if backend is running
docker ps | grep scriptony-api

# Check backend logs
docker logs scriptony-api

# Test from frontend container
docker exec scriptony-frontend curl http://scriptony-api:3000/health
```

## 📁 Project Structure

```
scriptony/
├── docker-compose.yml      # Main orchestration
├── Dockerfile             # Frontend image
├── nginx.conf             # Nginx configuration
├── .env.example           # Environment template
├── DEPLOYMENT.md          # This file
├── src/                   # Frontend source
└── api/                   # Backend source (separate)
```

## 📝 Notes

- **Backend Required**: This is only the frontend. You need the Fastify backend running separately or in the `api/` directory.
- **Database**: PostgreSQL database required. Can be external or in docker-compose.
- **Storage**: MinIO or S3 compatible storage for file uploads.

## 🆘 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review `.env` configuration
3. Verify domain DNS settings
4. Check firewall rules
