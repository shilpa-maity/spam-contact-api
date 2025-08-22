
# Spam Contact REST API (Node.js + Express + Prisma + PostgreSQL)

A production-grade starter implementing the coding task: register/login users, mark numbers as spam, search by name/phone across the global database (users + contacts), and view person details with conditional email visibility.

## Tech
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT auth, bcrypt hashing
- Zod validation, Helmet, CORS, Rate Limiting
- Prisma seeding for random data

## Quick Start

1) Clone and install
```bash
npm install
```

2) Configure env
```bash
cp .env.example .env
# edit DATABASE_URL + JWT_SECRET
```

3) Migrate + Seed
```bash
npx prisma migrate dev --name init
npm run seed
```

4) Run
```bash
npm run dev
# or
npm start
```

## API Overview

### Auth
- `POST /api/auth/register` { name, phone, password, email? }
- `POST /api/auth/login` { phone, password } -> { token }

### User
- `GET /api/user/profile`
- `PUT /api/user/profile`

### Spam
- `POST /api/spam/:phone`

### Search
- `GET /api/search/name?query=xyz`
- `GET /api/search/phone/:number`
- `GET /api/person/registered/:userId`
- `GET /api/person/contact/:contactId`

### Spam Likelihood
Defined as:
```
likelihood = spamReportsForPhone / (spamReportsForPhone + appearancesOfPhone)
```
Where `appearancesOfPhone` = occurrences in contacts + 1 if a registered user exists with that phone.

---

## ⚡ Thunder Client Testing Guide

You can test all endpoints directly inside VS Code using the **Thunder Client** extension.

### 1. Register a User
- **Method:** `POST`  
- **URL:** `http://localhost:4000/api/auth/register`  
- **Body (JSON):**
```json
{
  "name": "Test User",
  "phone": "9990000001",
  "password": "password123",
  "email": "test@mail.com"
}
```

### 2. Login
- **Method:** `POST`  
- **URL:** `http://localhost:4000/api/auth/login`  
- **Body (JSON):**
```json
{
  "phone": "9990000001",
  "password": "password123"
}
```
- **Response:** returns a JWT token.  
  Copy the token → in Thunder Client, go to **Auth tab → Bearer Token** and paste it.

### 3. Get Profile
- **Method:** `GET`  
- **URL:** `http://localhost:4000/api/user/profile`  
- **Auth:** Bearer Token  

### 4. Mark Number as Spam
- **Method:** `POST`  
- **URL:** `http://localhost:4000/api/spam/9990000002`  
- **Auth:** Bearer Token  

### 5. Search by Name
- **Method:** `GET`  
- **URL:** `http://localhost:4000/api/search/name?query=Test`  
- **Auth:** Bearer Token  

### 6. Search by Phone
- **Method:** `GET`  
- **URL:** `http://localhost:4000/api/search/phone/9990000001`  
- **Auth:** Bearer Token  

### 7. Person Details (Conditional Email)
- **Method:** `GET`  
- **URL:** `http://localhost:4000/api/person/registered/2`  
- **Auth:** Bearer Token  

---

⚡ **Pro Tip:** Save these requests into a **Thunder Client Collection** for quick re-use.

