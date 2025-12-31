# 📘 MYBANQUE – Documentation Technique

## 1. Présentation du projet

**MYBANQUE** est une application bancaire simplifiée permettant à un utilisateur authentifié de gérer ses comptes bancaires, effectuer des opérations (dépôt, retrait, virement) et consulter un relevé de compte.

Le projet est structuré selon une architecture **full‑stack** :

* **Backend** : Node.js, Express, MongoDB
* **Frontend** : React (Vite)
* **Authentification** : JWT

---

## 2. Fonctionnalités développées

### 2.1 Authentification & Sécurité

* Inscription d’un utilisateur
* Connexion avec génération de token JWT
* Protection des routes via middleware d’authentification
* Stockage sécurisé des mots de passe (bcrypt)

### 2.2 Gestion des comptes bancaires

* Création d’un compte bancaire
* Consultation de la liste des comptes de l’utilisateur
* Affichage du solde

### 2.3 Opérations bancaires

* Dépôt d’argent sur un compte
* Retrait d’argent
* Virement entre deux comptes du même utilisateur
* Vérification du solde avant opération

### 2.4 Relevé bancaire

* Historique des transactions
* Distinction débit / crédit
* Affichage chronologique
* Génération de relevé (front)

### 2.5 Interface utilisateur

* Navigation avec barre Navbar
* Pages : Login, Register, Dashboard, Accounts, Statement
* Gestion des états (chargement, erreurs)

---

## 3. API développées (Backend)

### 3.1 Authentification

| Méthode | Endpoint             | Description             |
| ------- | -------------------- | ----------------------- |
| POST    | `/api/auth/register` | Inscription utilisateur |
| POST    | `/api/auth/login`    | Connexion et retour JWT |

### 3.2 Comptes bancaires

| Méthode | Endpoint           | Description                        |
| ------- | ------------------ | ---------------------------------- |
| POST    | `/api/accounts`    | Créer un compte bancaire           |
| GET     | `/api/accounts/my` | Liste des comptes de l’utilisateur |

### 3.3 Transactions

| Méthode | Endpoint                     | Description                 |
| ------- | ---------------------------- | --------------------------- |
| POST    | `/api/accounts/deposit`      | Dépôt d’argent              |
| POST    | `/api/accounts/withdraw`     | Retrait d’argent            |
| POST    | `/api/accounts/transfer`     | Virement                    |
| GET     | `/api/accounts/transactions` | Historique des transactions |

> Toutes les routes `/api/accounts/*` sont protégées par JWT.

---

## 4. Structure du projet

### Backend

```
backend/
 ├─ controllers/
 ├─ models/
 ├─ routes/
 ├─ middleware/
 ├─ config/
 ├─ server.js
```

### Frontend

```
frontend/
 ├─ src/
 │  ├─ components/
 │  ├─ pages/
 │  ├─ services/
 │  ├─ App.jsx
 │  └─ main.jsx
```

---

## 5. Installation et démarrage

### 5.1 Prérequis

* Node.js >= 18
* MongoDB (local ou Atlas)
* npm ou yarn

---

### 5.2 Démarrage du Backend

```bash
cd backend
npm install
npm run dev
```

Variables d’environnement (`.env`) :

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mybanque
JWT_SECRET=supersecretkey
```

---

### 5.3 Démarrage du Frontend

```bash
cd frontend
npm install
npm run dev
```

Application accessible sur :

```
http://localhost:5173
```

---

## 6. Étapes de test de l’application

1. Créer un compte utilisateur (Register)
2. Se connecter (Login)
3. Créer un ou plusieurs comptes bancaires
4. Effectuer un dépôt
5. Effectuer un retrait
6. Réaliser un virement
7. Consulter le relevé de compte
