# Promptul de start pentru Claude Code

---

Copiază tot ce e de mai jos și dă-i lui Claude Code:

---

Citește complet fișierul `CLAUDE.md` din directorul curent, apoi construiește aplicația **FloriShop** de la zero, respectând EXACT tot ce e specificat acolo.

**Contextul proiectului:**
Este un proiect academic pentru materia "Transmisia Datelor". Trebuie să obținem nota maximă. Cerințele obligatorii din curs sunt:
- Aplicație client cu login, CRUD, salvare locală a selecțiilor (localStorage)
- Aplicație server care acceptă conexiuni multiple, cu bază de date (JSON), testată cu Postman
- Comunicare demonstrabilă frontend ↔ backend

**Ce să construiești:**
Un monorepo cu 3 aplicații: `server/` (Node.js + Express), `client/` (React, portul 5173) și `admin/` (React, portul 5174).

**Ordinea de lucru obligatorie** (specificată în CLAUDE.md secțiunea 11):
1. Faza 1: Backend complet și funcțional, inclusiv seed cu date demo
2. Faza 2: Client frontend complet
3. Faza 3: Admin frontend complet
4. Faza 4: README și verificare finală

**Reguli stricte:**
- Folosește EXCLUSIV JavaScript (fără TypeScript)
- Baza de date: lowdb 7.x cu fișier JSON (nu SQLite, nu MongoDB)
- Stilizare: Tailwind CSS (nu altceva)
- Urmează EXACT structura de foldere din CLAUDE.md
- Nu sări pești în implementare — construiește fiecare fișier complet
- Verifică că serverul pornește înainte de a trece la frontend

**Credențiale demo după seed:**
- Admin: `admin@florishop.me` / `Admin123!`
- Client: `ion@test.com` / `Test123!`

Pornește imediat. Începe cu `server/package.json`, apoi `server/index.js`, middleware, db, routes, seed. Nu mă întreba nimic — ia toate deciziile conform CLAUDE.md.
