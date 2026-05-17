import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const DB_FILE = "./db.json";

// ── DB helpers ────────────────────────────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ users: {} }));
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secrets-app-key-change-in-prod",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);
app.use(express.static(__dirname + "/public"));

function requireAuth(req, res, next) {
  if (req.session.username) return next();
  res.redirect("/");
}

// ── Auth routes ───────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  if (req.session.username) return res.redirect("/secret.html");
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users[username];
  if (!user || user.password !== password) {
    return res.redirect("/?error=invalid");
  }
  req.session.username = username;
  res.redirect("/secret.html");
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.redirect("/register.html?error=empty");
  const db = readDB();
  if (db.users[username]) return res.redirect("/register.html?error=taken");
  db.users[username] = { password, secrets: [] };
  writeDB(db);
  req.session.username = username;
  res.redirect("/secret.html");
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ── Secrets API ───────────────────────────────────────────────────────────────
app.get("/api/secrets", requireAuth, (req, res) => {
  const db = readDB();
  res.json(db.users[req.session.username].secrets);
});

app.post("/api/secrets", requireAuth, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Empty secret" });
  const db = readDB();
  const secrets = db.users[req.session.username].secrets;
  const newSecret = { id: Date.now().toString(), text: text.trim() };
  secrets.push(newSecret);
  writeDB(db);
  res.json(newSecret);
});

app.put("/api/secrets/:id", requireAuth, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Empty secret" });
  const db = readDB();
  const secrets = db.users[req.session.username].secrets;
  const idx = secrets.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  secrets[idx].text = text.trim();
  writeDB(db);
  res.json(secrets[idx]);
});

app.delete("/api/secrets/:id", requireAuth, (req, res) => {
  const db = readDB();
  const user = db.users[req.session.username];
  user.secrets = user.secrets.filter((s) => s.id !== req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ username: req.session.username });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(port, () => console.log(`✨ Secrets app running at http://localhost:${port}`));
