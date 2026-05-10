git push -u origin main
# Ghid Complet Deploy Petunia (petunia.page)

## 1. Conturi si domeniu

### 1.1 Activeaza GitHub Student Pack
- Du-te la https://education.github.com/pack
- Click "Get student benefits"
- Verifica cu email .edu sau documente academice

### 1.2 Cumperi domeniul pe name.com
- Din Student Pack, deschide oferta name.com
- Login/signup pe name.com
- Alege domeniu: `petunia.page`
- Completeaza checkout (1 an gratuit)

## 2. Pregateste repository GitHub

### 2.1 Init local + push pe GitHub
```bash
cd c:\pc fac\an 3\sem2\TD\proiect
git init
git add .
git commit -m "Initial Petunia commit"
git remote add origin https://github.com/[username]/petunia.git
git branch -M main
git push -u origin main
```

## 3. Deploy Backend pe Render

### 3.1 Creeaza serviciul
- Login pe https://render.com (cu GitHub)
- New → Web Service
- Connect GitHub, selecteaza repo petunia
- Configureaza:
  - Name: `petunia-api`
  - Region: Frankfurt
  - Root directory: `server`
  - Build command: `npm install`
  - Start command: `node index.js`

### 3.2 Environment Variables pe Render
Click "Advanced" si adauga:
```
JWT_SECRET = petunia_super_secret_key_change_in_production
CLIENT_URL = https://petunia.page
ADMIN_URL = https://admin.petunia.page
NODE_ENV = production
```

### 3.3 Seed pe plan gratuit (fara Shell)
Varianta 1 (recomandat): modifica Start Command in Render:
```
node seed.js && node index.js
```

Varianta 2: modifica scriptul `start` in `server/package.json`:
```json
"start": "node seed.js && node index.js"
```

Nota: dupa prima populare, revino la `node index.js` ca sa nu resetezi baza de date la fiecare redeploy.

### 3.4 Adauga domeniu API in Render
- In Render Settings → Custom Domain
- Adauga `api.petunia.page`
- Noteaza targetul cerut (ex: `petunia-api.onrender.com`)

## 4. Configureaza DNS pe name.com

Du-te in Dashboard → Domeniu → DNS Records si adauga exact:

| Type | Host | Answer |
|------|------|--------|
| A | @ | 76.76.21.21 |
| CNAME | admin | cname.vercel-dns.com |
| CNAME | api | petunia-api.onrender.com |

Note:
- La CNAME pentru `api`, foloseste exact targetul dat de Render.
- Sterge orice record A/AAAA care intra in conflict pentru `admin` sau `api`.

## 5. Deploy Client pe Vercel

### 5.1 Import proiect
- Login pe https://vercel.com (cu GitHub)
- Add New → Project
- Selecteaza repo petunia
- Configureaza:
  - Root Directory: `client`
  - Framework: Vite
  - Build Command: `npm run build`
  - Output: `dist`

### 5.2 Environment Variables
```
VITE_API_URL = https://api.petunia.page/api
```

### 5.3 Conecteaza domeniu principal
- Settings → Domains
- Adauga: `petunia.page`

## 6. Deploy Admin pe Vercel

### 6.1 Al doilea proiect
- Add New → Project
- Selecteaza repo petunia
- Root Directory: `admin`
- Build Command: `npm run build`

### 6.2 Environment Variables
```
VITE_API_URL = https://api.petunia.page/api
```

### 6.3 Conecteaza subdomain
- Settings → Domains
- Adauga: `admin.petunia.page`

## 7. Testare Live

- `https://petunia.page` → client
- `https://admin.petunia.page` → admin
- Login cu credentialele demo:
  - Admin: `admin@florishop.me` / `Admin123!`
  - Client: `ion@test.com` / `Test123!`

## 8. Note Importante

- Prima cerere pe Render dupa inactivitate poate dura 10-15s
- SSL/HTTPS se genereaza automat pe Render si Vercel
- DNS propagation poate dura pana la 24h
