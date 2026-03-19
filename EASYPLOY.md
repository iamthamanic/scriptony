# Scriptony Deployment mit Easyploy

## 🚀 Quick Start

```bash
# Im Projektverzeichnis
cd /data/.openclaw/workspace/scriptonyapp

# Umgebungsvariablen setzen
export SSH_HOST=deine-server-ip
export SSH_USER=root
export SSH_PRIVATE_KEY="$(cat ~/.ssh/id_rsa)"
export DOMAIN=scriptony.raccoova.com
export DATABASE_URL="postgresql://scriptony:password@localhost:5432/scriptony"
export JWT_SECRET="$(openssl rand -base64 32)"

# Deploy!
easyploy deploy
```

## 📋 Konfiguration

Die `easyploy.config.json` definiert:

- **Frontend**: Vite/React App (Port 8080)
- **Backend**: Fastify API (Port 3000)
- **Datenbank**: PostgreSQL 15 (Port 5432)
- **Storage**: MinIO (Port 9000/9001)
- **Nginx**: Reverse Proxy mit SSL

## 🔧 Umgebungsvariablen

Erstelle eine `.env` Datei:

```bash
# Server
SSH_HOST=deine-hostinger-ip
SSH_USER=root
SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

# Domain
DOMAIN=scriptony.raccoova.com

# Datenbank
DB_USER=scriptony
DB_PASSWORD=dein-sicheres-passwort
DATABASE_URL=postgresql://scriptony:dein-sicheres-passwort@localhost:5432/scriptony

# JWT
JWT_SECRET=dein-jwt-secret-mindestens-32-zeichen

# MinIO
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin-sicheres-passwort
```

## 🎯 Deployment Befehle

```bash
# Analysieren
easyploy analyze

# Deploy (erstmalig oder Update)
easyploy deploy

# Status prüfen
easyploy status

# Logs ansehen
easyploy logs

# Update (nur geänderte Services)
easyploy update

# Löschen (Vorsicht!)
easyploy destroy
```

## 🔄 CI/CD Integration

### Mit GitHub Actions

```yaml
name: Deploy with Easyploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Easyploy
        run: npm install -g @easyploy/cli
      
      - name: Deploy
        env:
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_USER: ${{ secrets.SSH_USER }}
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          DOMAIN: ${{ secrets.DOMAIN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          MINIO_ACCESS_KEY: ${{ secrets.MINIO_ACCESS_KEY }}
          MINIO_SECRET_KEY: ${{ secrets.MINIO_SECRET_KEY }}
        run: easyploy deploy
```

### Mit n8n

Der `📊 SCRIPTONYAPP_REWRITE_PHASE2` Cron-Job könnte erweitert werden:

```json
{
  "action": "easyploy",
  "command": "deploy",
  "config": "/var/www/scriptony/easyploy.config.json",
  "notify": "telegram"
}
```

## 📊 Was deployed Easyploy?


1. **Code pullen** vom Repository
2. **Abhängigkeiten** installieren
3. **Build** erstellen (Frontend + Backend)
4. **Docker Images** bauen
5. **Container** starten (App + DB + Storage)
6. **Nginx** konfigurieren (SSL + Reverse Proxy)
7. **Health Checks** einrichten
8. **Backups** konfigurieren

## 🐛 Troubleshooting

```bash
# Deployment fehlgeschlagen?
easyploy logs --service backend
easyploy logs --service frontend

# Datenbank prüfen
easyploy exec postgres psql -U scriptony -d scriptony

# Container neustarten
easyploy restart backend
easyploy restart frontend

# Vollständig neu deployen
easyploy destroy
easyploy deploy
```

## 🎉 Fertig!

Nach dem Deployment läuft Scriptony unter:
- **Web**: https://scriptony.raccoova.com
- **API**: https://scriptony.raccoova.com/api
- **MinIO Console**: https://scriptony.raccoova.com:9001

## 📚 Weitere Infos

- [Easyploy README](../easyploy-work/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Mobile Apps](./MOBILE.md)
