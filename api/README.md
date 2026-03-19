# Scriptony API

Fastify-powered backend API for Scriptonyapp.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Production (Docker)

```bash
# Build and start with Docker Compose
docker-compose up -d --build
```

## 📋 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user
- `POST /auth/signout` - Logout user
- `GET /auth/session` - Get current session
- `GET /auth/google` - Google OAuth URL
- `POST /auth/callback` - OAuth callback

### Users
- `GET /users/me` - Get current user
- `PATCH /users/me` - Update user
- `DELETE /users/me` - Delete user

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Characters
- `GET /characters` - List characters
- `POST /characters` - Create character
- `PATCH /characters/:id` - Update character
- `DELETE /characters/:id` - Delete character

### Scenes
- `GET /scenes` - List scenes
- `POST /scenes` - Create scene
- `PATCH /scenes/:id` - Update scene
- `DELETE /scenes/:id` - Delete scene

### Episodes
- `GET /episodes` - List episodes
- `POST /episodes` - Create episode
- `PATCH /episodes/:id` - Update episode
- `DELETE /episodes/:id` - Delete episode

### Worlds
- `GET /worlds` - List worlds
- `POST /worlds` - Create world
- `GET /worlds/:id` - Get world
- `PATCH /worlds/:id` - Update world
- `DELETE /worlds/:id` - Delete world
- `GET /worlds/:id/categories` - List world categories

### Storage
- `POST /storage/upload` - Upload file
- `GET /storage/url` - Get presigned URL
- `DELETE /storage/delete` - Delete file

## 🗄️ Database Schema

Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

View database:
```bash
npx prisma studio
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `CORS_ORIGIN` | Allowed CORS origins | ✅ |
| `MINIO_*` | MinIO/S3 configuration | ⚠️ For file uploads |
| `GOOGLE_*` | OAuth credentials | ⚠️ For Google login |

## 🐳 Docker

### Build image
```bash
docker build -t scriptony-api .
```

### Run container
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=secret \
  scriptony-api
```

## 📝 TODO

- [ ] Implement all route handlers
- [ ] Add input validation (Zod)
- [ ] Add error handling
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Add tests
- [ ] Implement Google OAuth
- [ ] Add WebSocket support for real-time features

## 📄 License

MIT
