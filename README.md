# 🔐 Secrets Vault

A full-stack web application where users can register, log in, and privately manage their personal secrets. Each user's secrets are isolated — no one else can see them.

---

## ✨ Features

- **User Registration & Login** — secure per-user accounts
- **Session-based Auth** — stay logged in for 1 hour
- **Private Vault** — each user sees only their own secrets
- **Add Secrets** — write and store new secrets instantly
- **Edit Secrets** — update any secret inline without leaving the page
- **Delete Secrets** — remove secrets permanently
- **Persistent Storage** — all data saved to a local JSON file across restarts

---

## 🖥️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Runtime   | Node.js                           |
| Framework | Express.js                        |
| Sessions  | express-session                   |
| Parsing   | body-parser                       |
| Storage   | JSON file (`db.json`)             |
| Frontend  | Vanilla HTML, CSS, JavaScript     |

---

## 📁 Project Structure

```
secrets-app/
├── index.js              # Express server & API routes
├── package.json          # Project metadata & dependencies
├── db.json               # Auto-generated database file
└── public/
    ├── index.html        # Login page
    ├── register.html     # Registration page
    └── secret.html       # Vault dashboard (add/edit/delete)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/secrets-app.git

# 2. Navigate into the project
cd secrets-app

# 3. Install dependencies
npm install

# 4. Start the server
npm start
```

### Usage

Open your browser and go to:

```
http://localhost:3000
```

- **Register** a new account at `/register.html`
- **Log in** with your credentials
- **Manage** your secrets from the vault dashboard

---

## 🔌 API Reference

All API routes require an active session (must be logged in).

| Method   | Endpoint              | Description              |
|----------|-----------------------|--------------------------|
| `GET`    | `/api/secrets`        | Get all your secrets     |
| `POST`   | `/api/secrets`        | Add a new secret         |
| `PUT`    | `/api/secrets/:id`    | Update a secret by ID    |
| `DELETE` | `/api/secrets/:id`    | Delete a secret by ID    |
| `GET`    | `/api/me`             | Get the logged-in user   |

---

## ⚠️ Security Notes

This project is built for **learning purposes**. Before using in production:

- 🔑 **Hash passwords** using [`bcrypt`](https://www.npmjs.com/package/bcrypt) — plain-text passwords are not safe
- 🗄️ **Use a real database** (PostgreSQL, MongoDB) instead of a JSON file
- 🔒 **Use HTTPS** in production
- 🛡️ **Change the session secret** in `index.js` to a strong random string
- 🌍 **Set `secure: true`** on cookies when deploying over HTTPS

---

## 📸 Pages

| Page        | Route           | Description                  |
|-------------|-----------------|------------------------------|
| Login       | `/`             | Sign in to your vault        |
| Register    | `/register.html`| Create a new account         |
| Vault       | `/secret.html`  | View and manage your secrets |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with Express.js · Designed for learning full-stack Node.js development
