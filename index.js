const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

/**
 * In-memory stores for users, sessions, admins, economy balances, feedback, etc.
 * In production, replace with a database.
 */
const SESSION = {};
const USERS = {}; // { psid: { id, name, admin, ... } }
const ADMINS = new Set();
const ECONOMY = {}; // { psid: { balance, bank, ... } }
const FEEDBACK = [];
const TOKENS = {}; // {session: {accessToken, verifyToken, pageId}}

// Load all commands from the commands folder
const commands = {};
const commandsInfo = [];
require("fs").readdirSync(path.join(__dirname, "commands")).forEach((file) => {
  if (file.endsWith(".js")) {
    const cmd = require(`./commands/${file}`);
    commands[cmd.name] = cmd;
    commandsInfo.push({
      name: cmd.name,
      role: cmd.role,
      description: cmd.description,
      usage: cmd.usage || "",
    });
  }
});

// ========== WEB INTERFACE ==========

// Home: enter tokens
app.get("/", (req, res) => {
  res.render("index", { session: null });
});

// Handle token submission
app.post("/setup", (req, res) => {
  const { accessToken, verifyToken } = req.body;
  if (!accessToken || !verifyToken) {
    return res.render("index", { error: "Both tokens are required", session: null });
  }
  const session = uuidv4();
  TOKENS[session] = {
    accessToken,
    verifyToken,
    pageId: null,
  };
  res.redirect(`/callback?session=${session}`);
});

// Callback URL and copy
app.get("/callback", (req, res) => {
  const { session } = req.query;
  if (!session || !TOKENS[session]) return res.status(400).send("Session not found");
  const callbackUrl = `${req.protocol}://${req.get("host")}/webhook/${session}`;
  res.render("callback", { callbackUrl, session });
});

// After setup, show manager page
app.get("/manager", (req, res) => {
  const { session } = req.query;
  if (!session || !TOKENS[session]) return res.status(400).send("Session not found");
  res.render("manager", {
    admins: Array.from(ADMINS).map((id) => USERS[id]?.name || id),
    users: Object.values(USERS),
    session,
    feedback: FEEDBACK,
  });
});

// Set admin
app.post("/manager/add-admin", (req, res) => {
  const { session, psid } = req.body;
  if (USERS[psid]) {
    ADMINS.add(psid);
    USERS[psid].admin = true;
  }
  res.redirect(`/manager?session=${session}`);
});

// ========== FACEBOOK WEBHOOKS ==========

// GET webhook verification
app.get("/webhook/:session", (req, res) => {
  const { session } = req.params;
  const verifyToken = TOKENS[session]?.verifyToken;
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === verifyToken
  ) {
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    res.status(403).send("Verification failed");
  }
});

// POST webhook events
app.post("/webhook/:session", async (req, res) => {
  const { session } = req.params;
  const { object, entry } = req.body;
  if (!TOKENS[session]) return res.sendStatus(403);
  if (object === "page") {
    for (const ent of entry) {
      for (const msgEvent of ent.messaging) {
        await handleMessage(session, msgEvent);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ========== BOT HANDLER ==========

async function handleMessage(session, event) {
  const accessToken = TOKENS[session].accessToken;
  const senderId = event.sender.id;
  if (!USERS[senderId]) USERS[senderId] = { id: senderId, name: `User${senderId.slice(-4)}`, admin: ADMINS.has(senderId) };
  if (!ECONOMY[senderId]) ECONOMY[senderId] = { balance: 1000, bank: 0 };

  // Extract message text
  const message = event.message?.text || (event.postback && event.postback.payload);
  if (!message) return;

  // Parse command (simple: first word is command)
  const [cmdName, ...args] = message.trim().split(/\s+/);
  const cmd = commands[cmdName.toLowerCase()];
  if (!cmd) {
    await sendMessage(accessToken, senderId, `Unknown command. Type "help" for a list of commands.`);
    return;
  }
  // Role check
  if (cmd.role === 2 && !ADMINS.has(senderId)) {
    await sendMessage(accessToken, senderId, `This command is admin only.`);
    return;
  }
  // Run command
  await cmd.run({
    event,
    args,
    senderId,
    sendMessage: (msg) => sendMessage(accessToken, senderId, msg),
    USERS,
    ADMINS,
    ECONOMY,
    FEEDBACK,
    session,
    broadcast: (msg) => broadcastMessage(session, msg),
  });
}

// Facebook send message
async function sendMessage(accessToken, recipientId, text) {
  await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });
}

// Broadcast to all users (for admin noti)
async function broadcastMessage(session, text) {
  const accessToken = TOKENS[session]?.accessToken;
  if (!accessToken) return;
  for (const psid in USERS) {
    await sendMessage(accessToken, psid, text);
  }
}

// Keep bot always online (dummy ping)
setInterval(() => {
  // This keeps Render.com from idling the app
  fetch(`http://localhost:${PORT}/`).catch(() => {});
}, 4 * 60 * 1000); // every 4 minutes

// Start server
app.listen(PORT, () => {
  console.log(`FB Pagebot runner started on port ${PORT}`);
});