# Scriptonyapp Deployment Guide

## 🚀 Server-Release Checklist

### 1. Server-Voraussetzungen
- [ ] Docker & Docker Compose installiert
- [ ] Domain `scriptony.raccoova.com` zeigt auf Server-IP
- [ ] SSL-Zertifikate (Let's Encrypt oder eigene)
- [ ] Ports 80, 443, 3000 freigegeben

### 2. Repository Secrets (GitHub)
Folgende Secrets müssen in GitHub eingetragen werden:

| Secret | Beschreibung |
|--------|--------------|
| `SSH_PRIVATE_KEY` | SSH Private Key für Server-Zugriff |
| `SSH_HOST` | Server IP oder Domain |
| `SSH_USER` | SSH Benutzername |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token für Notifications |
| `TELEGRAM_CHAT_ID` | Telegram Chat ID für Notifications |

### 3. Server-Setup

```bash
# 1. Verzeichnis erstellen
sudo mkdir -p /var/www/scriptony
sudo chown $USER:$USER /var/www/scriptony

# 2. Repository klonen
cd /var/www/scriptony
git clone https://github.com/iamthamanic/scriptony.git .

# 3. Environment-Variablen erstellen
cp .env.example .env
nano .env  # Werte eintragen

# 4. SSL-Zertifikate erstellen (Let's Encrypt)
sudo certbot certonly --standalone -d scriptony.raccoova.com

# 5. SSL-Zertifikate kopieren
sudo cp /etc/letsencrypt/live/scriptony.raccoova.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/scriptony.raccoova.com/privkey.pem ./nginx/ssl/

# 6. Docker-Container starten
docker-compose up -d --build
```

### 4. Backend-API

⚠️ **Wichtig:** Das Fastify-Backend muss separat deployed werden!

Optionen:
1. **Im selben Repository:** Code in `api/` Ordner, wird mit `docker-compose.yml` gestartet
2. **Separates Repository:** Backend in eigenem Repo, eigene Deployment-Pipeline

### 5. Datenbank

- PostgreSQL empfohlen
- Migrationen müssen manuell oder über Backend ausgeführt werden

### 6. SSL-Konfiguration

Für Let's Encrypt erstelle `nginx/prod.conf`:

```nginx
server {
    listen 80;
    server_name scriptony.raccoova.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name scriptony.raccoova.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... (restliche Konfiguration aus nginx.conf)
}
```

### 7. Troubleshooting

**Container starten nicht:**
```bash
docker-compose logs -f
```

**SSL-Fehler:**
- Prüfe ob Zertifikate existieren
- Rechte: `chmod 644 fullchain.pem` und `chmod 600 privkey.pem`

**API nicht erreichbar:**
- Prüfe ob Backend-Container läuft: `docker ps`
- Prüfe Logs: `docker logs scriptony-api`

### 8. Manuelles Deployment

Falls GitHub Actions nicht funktioniert:

```bash
# Auf dem Server ausführen:
cd /var/www/scriptony
git pull origin main
docker-compose down
docker-compose up -d --build
docker system prune -f
```

## 📋 Offene Punkte

- [ ] Backend-API Code bereitstellen
- [ ] Datenbank einrichten
- [ ] SSL-Zertifikate erstellen
- [ ] GitHub Secrets eintragen
- [ ] Erstes Deployment testen
