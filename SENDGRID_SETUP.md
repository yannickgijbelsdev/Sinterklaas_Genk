# SendGrid Setup voor Newsletter Systeem

## 1. SendGrid Account Aanmaken

1. Ga naar https://sendgrid.com/
2. Maak een gratis account aan
3. Verifieer je email adres

## 2. API Key Genereren

1. Log in op SendGrid dashboard
2. Ga naar Settings → API Keys
3. Klik "Create API Key"
4. Kies "Full Access" (of minimaal "Mail Send")
5. Geef de key een naam (bijv: "Sinterklaas Newsletter")
6. Kopieer de gegenereerde API key

## 3. Sender Authentication Setup

1. Ga naar Settings → Sender Authentication
2. Klik "Authenticate Your Domain" (aanbevolen)
   - OF gebruik "Single Sender Verification" voor quick setup
3. Volg de instructies om je domain te verifiëren
4. Als je geen eigen domain hebt, gebruik Single Sender met je email

## 4. API Key Configuratie

Voeg je SendGrid API key toe aan het bestand `/app/backend/.env`:

```
SENDGRID_API_KEY=SG.jouw_api_key_hier
SENDER_EMAIL=jouw_geverifieerde_email@domain.com
```

## 5. Test de Integratie

1. Herstart de backend: `sudo supervisorctl restart backend`
2. Log in op het admin dashboard
3. Ga naar Newsletter → Campaigns
4. Maak een test campaign
5. Stuur naar een test email adres

## 6. Troubleshooting

**Fout: "SendGrid API key not configured"**
- Controleer of SENDGRID_API_KEY correct is ingesteld in .env
- Herstart de backend service

**Fout: "Unauthorized"**
- Controleer of je API key de juiste permissions heeft
- Genereer een nieuwe API key met Full Access

**Emails komen niet aan**
- Controleer spam/junk folder
- Controleer sender authentication status
- Gebruik een geverifieerd sender email adres

## 7. Production Setup

Voor productie gebruik:
- Verified domain sender authentication
- Dedicated IP (bij hoge volumes)
- Webhooks voor tracking events
- Monitor bounce en spam rates

## Current Status
✅ SendGrid library geïnstalleerd
✅ Backend endpoints geconfigureerd
✅ Email templates en tracking gereed
⚠️ API key moet nog worden ingesteld
