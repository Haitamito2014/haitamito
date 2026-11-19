// NSM Messenger: real accounts and live chat, using Firebase Authentication + Cloud Firestore.
import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
const params = new URLSearchParams(location.search);
const useEmulator = params.has("emulator"); // local testing only: ?emulator

const $ = id => document.getElementById(id);
const show = id => { for (const s of ["loading", "setup", "auth", "app"]) $(s).hidden = s !== id; };

if (!firebaseConfig && !useEmulator) {
  show("setup");
  await new Promise(() => {}); // stop here quietly until firebase-config.js is filled in
}

const { initializeApp } = await import(SDK + "firebase-app.js");
const {
  getAuth, connectAuthEmulator, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile
} = await import(SDK + "firebase-auth.js");
const {
  getFirestore, connectFirestoreEmulator, doc, collection, getDoc, setDoc, updateDoc, deleteDoc, addDoc,
  onSnapshot, query, where, orderBy, limitToLast, getDocs, writeBatch, serverTimestamp, arrayUnion, runTransaction
} = await import(SDK + "firebase-firestore.js");

const fbApp = initializeApp(useEmulator ? { apiKey: "demo-key", authDomain: "demo-nsm.firebaseapp.com", projectId: "demo-nsm" } : firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);
if (useEmulator) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

/* =============== Constants =============== */
const STATUS = { online: "Online", busy: "Busy", brb: "Be right back", away: "Away", phone: "On the phone", lunch: "Out to lunch", offline: "Offline" };
const GROUPS = ["Friends", "Family", "Work", "School"];
const STALE_MS = 150000;     // no heartbeat for 2.5 min = offline
const HEARTBEAT_MS = 60000;

const PICS = {
  turtle: ["🐢", "#2e8a62", "#9be0b8"], cactus: ["🌵", "#6b8f2a", "#d8e98f"], guitar: ["🎸", "#b4532a", "#f6b98a"],
  ball: ["⚽", "#3d5fa8", "#a8c3f0"], moon: ["🌙", "#28305e", "#7d86c9"], cat: ["🐱", "#a33d63", "#f2a7c3"],
  melon: ["🍉", "#2e9e5b", "#f28b8b"], rocket: ["🚀", "#1f2f4f", "#5fa8d3"], sun: ["🌻", "#d9901a", "#ffe08a"],
  game: ["🎮", "#6b4fa3", "#c4b2ec"], fox: ["🦊", "#c2541b", "#ffc48a"], island: ["🏝️", "#1f8b8b", "#a6eadf"],
  coffee: ["☕", "#6e4a2f", "#d9b48f"], butterfly: ["🦋", "#3b7c84", "#b3e0ff"], pizza: ["🍕", "#c23b2a", "#ffd27a"],
  star: ["⭐", "#8a6a1f", "#ffe9a8"]
};
const FONTS = {
  body: { name: "Clean", css: "var(--font-body)" },
  comic: { name: "Comic", css: "'Comic Neue', 'Comic Sans MS', cursive" },
  serif: { name: "Classic", css: "Georgia, 'Times New Roman', serif" },
  mono: { name: "Typewriter", css: "'Courier New', Courier, monospace" },
  bold: { name: "Display", css: "var(--font-display)" }
};
const TEXT_COLORS = ["", "#d64545", "#e07b26", "#2e9e5b", "#1aa3a3", "#3d7fd6", "#8a5cd6", "#d14d9a", "#8a7a5c"];
const EMOTICONS = [
  [":-)", "🙂"], [":)", "🙂"], [":-D", "😄"], [":D", "😄"], [";-)", "😉"], [";)", "😉"], [":-(", "🙁"], [":(", "🙁"],
  [":-P", "😛"], [":P", "😛"], [":p", "😛"], [":-O", "😮"], [":O", "😮"], [":o", "😮"], [":'(", "😢"], [":@", "😠"],
  [":$", "😳"], [":S", "😕"], [":s", "😕"], [":|", "😐"], ["8-)", "🙄"], ["(H)", "😎"], ["(h)", "😎"], ["(A)", "😇"], ["(a)", "😇"],
  ["<3", "❤️"], ["(L)", "❤️"], ["(l)", "❤️"], ["(U)", "💔"], ["(u)", "💔"], ["(Y)", "👍"], ["(y)", "👍"], ["(N)", "👎"], ["(n)", "👎"],
  ["(*)", "⭐"], ["(F)", "🌹"], ["(f)", "🌹"], ["(K)", "💋"], ["(k)", "💋"], ["(G)", "🎁"], ["(g)", "🎁"], ["(^)", "🎂"],
  ["(coffee)", "☕"], ["(C)", "☕"], ["(c)", "☕"], ["(pi)", "🍕"], ["(mp)", "📱"], ["(e)", "📧"], ["(E)", "📧"],
  ["(8)", "🎵"], ["(S)", "🌙"], ["(#)", "☀️"], ["(R)", "🌈"], ["(r)", "🌈"], ["(Z)", "👦"], ["(X)", "👧"], ["(6)", "😈"],
  ["(ap)", "✈️"], ["(co)", "💻"], ["(so)", "⚽"], ["(%)", "🔗"], ["+o(", "🤢"], ["(brb)", "🔜"], ["(@)", "🐱"], ["(&)", "🐶"]
];
const PICKER = ["🙂","😄","😉","😛","😮","😢","😠","😳","😕","😐","🙄","😎","😇","😈","🤢","😂","🥰","🤔","😴","🥳",
  "❤️","💔","👍","👎","👋","🙌","👏","💪","⭐","🌹","💋","🎁","🎂","☕","🍕","🎵","🌙","☀️","🌈","✈️","💻","📱","⚽","🐱","🐶","🔥","🎉","💯"];
const WINKS = [
  { id: "hearts", name: "Hearts", e: "💖", mode: "rise", set: ["❤️", "💕", "💖", "💗"] },
  { id: "kiss", name: "Big kiss", e: "💋", mode: "zoom" },
  { id: "lol", name: "LOL", e: "😂", mode: "zoom" },
  { id: "party", name: "Party", e: "🎉", mode: "fall", set: ["🎉", "🎊", "✨", "🥳"] },
  { id: "fireworks", name: "Fireworks", e: "🎆", mode: "burst", set: ["✨", "🎆", "💥", "⭐", "🌟"] },
  { id: "rain", name: "Rainy day", e: "🌧️", mode: "fall", set: ["💧", "💧", "🌧️"] },
  { id: "flowers", name: "Flowers", e: "🌸", mode: "rise", set: ["🌸", "🌷", "🌼", "🌹"] },
  { id: "rocket", name: "Rocket", e: "🚀", mode: "fly" },
  { id: "hug", name: "Hug", e: "🤗", mode: "zoom" },
  { id: "snow", name: "Snow", e: "❄️", mode: "fall", set: ["❄️", "❄️", "☃️"] },
  { id: "angry", name: "Grrr", e: "😡", mode: "zoom" },
  { id: "money", name: "Rich!", e: "💸", mode: "fall", set: ["💸", "💰", "🪙"] }
];
const SCENES = {
  none: { name: "Plain", css: "none" },
  dawn: { name: "Sunset", css: "linear-gradient(170deg, rgba(242,165,65,.22), rgba(214,69,69,.10) 55%, rgba(242,165,65,0))" },
  ocean: { name: "Ocean", css: "linear-gradient(180deg, rgba(31,111,139,.24), rgba(79,179,211,.06))" },
  meadow: { name: "Meadow", css: "linear-gradient(180deg, rgba(46,158,91,0) 45%, rgba(46,158,91,.22))" },
  grid: { name: "Notebook", css: "linear-gradient(rgba(61,127,214,.13) 1px, transparent 1px) 0 0 / 100% 26px" },
  dots: { name: "Dots", css: "radial-gradient(rgba(127,140,155,.35) 1.5px, transparent 1.7px) 0 0 / 18px 18px" },
  candy: { name: "Candy", css: "repeating-linear-gradient(135deg, rgba(209,77,154,.08) 0 14px, rgba(209,77,154,0) 14px 28px)" },
  night: { name: "Night", css: "radial-gradient(rgba(255,255,255,.6) 1px, transparent 1.4px) 0 0 / 46px 46px, linear-gradient(180deg, rgba(40,48,94,.35), rgba(40,48,94,.12))" }
};

/* =============== State =============== */
let uid = null;              // signed-in user id
let me = null;               // my profile
const contacts = new Map();  // contactUid -> { group, blocked }
const profiles = new Map();  // uid -> profile
const profileUnsubs = new Map();
let requests = [];
const convos = new Map();    // convoId -> data
let openTabs = [];
let active = null;
let msgs = [];
let msgsUnsub = null;
let unsubs = [];
let firstConvoSnap = true;
let heartbeat = null, ticker = null, slowTicker = null;
let pop = null, menuFor = null, gameOpenFor = null;
let pendingSignup = null;    // { name } while creating an account
let pendingStatus = null;
let typingSent = 0;
const collapsed = {};
const local = (k, v) => { try { if (v === undefined) return localStorage.getItem("nsm-" + k); localStorage.setItem("nsm-" + k, v); } catch { return null; } };
let sort = local("sort") || "groups";
let sound = local("sound") !== "off";

/* =============== Helpers =============== */
const esc = s => String(s ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const fmtTime = t => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtDate = t => new Date(t).toLocaleDateString();
const fmtSize = b => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB";
const emoticonize = text => {
  let out = text;
  for (const [code, emo] of EMOTICONS) {
    const re = new RegExp("(^|\\s)" + code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s|$|[.,!?])", "g");
    out = out.replace(re, "$1" + emo);
  }
  return out;
};
const prof = id => id === uid ? me : profiles.get(id);
const nameOf = id => (prof(id) && prof(id).name) || "…";
const isBlocked = id => !!(contacts.get(id) && contacts.get(id).blocked);
function statusOf(id) {
  const p = prof(id);
  if (!p) return "offline";
  if (id !== uid && (p.status === "offline" || Date.now() - (p.lastSeen || 0) > STALE_MS)) return "offline";
  return p.status || "online";
}
const isOff = id => statusOf(id) === "offline" || isBlocked(id);
const pmOf = p => p ? (p.music && p.music.on && p.music.song ? "♫ " + p.music.song : (p.pm || "")) : "";

function dp(pic, status, size = "", extra = "") {
  const p = PICS[(pic && pic.preset) || "star"] || PICS.star;
  const inner = pic && pic.img ? `<img src="${esc(pic.img)}" alt="">` : `<span class="dp-emo">${p[0]}</span>`;
  return `<span class="dp ${size} st-${status} ${extra}" style="--g1:${p[1]};--g2:${p[2]}">${inner}</span>`;
}
const personDp = (id, size) => {
  const p = prof(id) || {};
  return dp(p.pic, isBlocked(id) ? "offline" : statusOf(id), size, (isBlocked(id) ? "blocked " : "") + (id !== uid && isOff(id) ? "offline-look" : ""));
};
const fontStyle = f => {
  f = f || {};
  const color = TEXT_COLORS.includes(f.color) ? f.color : "";
  return `font-family:${(FONTS[f.family] || FONTS.body).css};${color ? "color:" + color + ";" : ""}font-weight:${f.bold ? 700 : 400};font-style:${f.italic ? "italic" : "normal"}`;
};
const convoIdWith = other => [uid, other].sort().join("__");
const othersIn = c => (c ? c.members : []).filter(x => x !== uid);
const convoTitle = c => othersIn(c).map(nameOf).join(", ") || "Conversation";
const unread = c => !!(c && c.last && c.last.from !== uid && !isBlocked(c.last.from) && c.last.t > ((c.reads || {})[uid] || 0));

function watchProfile(id) {
  if (!id || id === uid || profileUnsubs.has(id)) return;
  profileUnsubs.set(id, onSnapshot(doc(db, "users", id), s => {
    if (s.exists()) profiles.set(id, { id, ...s.data() });
    renderSoon();
  }, () => {}));
}

let renderQueued = false;
function renderSoon() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    if ($("app").hidden) return;
    renderContacts(); renderTabs(); renderHeader(); renderStatusline();
    if (gameOpenFor) renderGame();
  });
}

function friendlyError(e) {
  const code = (e && e.code) || "";
  const map = {
    "auth/email-already-in-use": "An account already uses this e-mail. Sign in instead.",
    "auth/invalid-email": "This e-mail address doesn't look right.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/missing-password": "Enter your password.",
    "auth/invalid-credential": "Wrong e-mail or password.",
    "auth/wrong-password": "Wrong e-mail or password.",
    "auth/user-not-found": "No account uses this e-mail. Create one instead.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
    "auth/network-request-failed": "Can't reach the server. Check your internet connection.",
    "auth/operation-not-allowed": "E-mail sign-in isn't turned on yet. The site owner must enable it in Firebase.",
    "permission-denied": "You're not allowed to do that.",
    "unavailable": "Can't reach the server. Check your internet connection."
  };
  return map[code] || (e && e.message) || "Something went wrong. Try again.";
}

/* =============== Sounds =============== */
let ac = null;
function tone(freqs, dur = 0.12, type = "sine", vol = 0.16) {
  if (!sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    let t = ac.currentTime;
    for (const f of freqs) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
      t += dur * 0.8;
    }
  } catch {}
}
const sfx = {
  message: () => tone([880, 1175]),
  signin: () => tone([523, 659, 784, 1046], 0.13),
  wizz: () => tone([150, 120, 150, 120, 150, 120], 0.07, "square", 0.08),
  wink: () => tone([660, 880, 1320], 0.1, "triangle"),
  done: () => tone([1046, 1318], 0.09, "triangle")
};

/* =============== Auth screens =============== */
const fillStatus = sel => { sel.innerHTML = Object.entries(STATUS).map(([k, v]) => `<option value="${k}">${k === "offline" ? "Appear offline" : v}</option>`).join(""); };
fillStatus($("inStatus")); fillStatus($("meStatus"));

function setTab(up) {
  $("tabIn").setAttribute("aria-selected", String(!up)); $("tabUp").setAttribute("aria-selected", String(up));
  $("formIn").hidden = up; $("formUp").hidden = !up;
  (up ? $("upName") : $("inEmail")).focus();
}
$("tabIn").addEventListener("click", () => setTab(false));
$("tabUp").addEventListener("click", () => setTab(true));
const formMsg = (id, text, ok) => { const el = $(id); el.hidden = !text; el.textContent = text || ""; el.className = "form-msg " + (ok ? "ok" : "err"); };

$("formIn").addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("inEmail").value.trim(), pass = $("inPass").value;
  if (!email || !pass) return formMsg("inMsg", "Enter your e-mail and password.");
  formMsg("inMsg", ""); $("inBtn").disabled = true;
  pendingStatus = $("inStatus").value;
  try { await signInWithEmailAndPassword(auth, email, pass); }
  catch (err) { formMsg("inMsg", friendlyError(err)); pendingStatus = null; }
  finally { $("inBtn").disabled = false; }
});
$("formUp").addEventListener("submit", async e => {
  e.preventDefault();
  const name = $("upName").value.trim(), email = $("upEmail").value.trim(), pass = $("upPass").value;
  if (!name) return formMsg("upMsg", "Choose a display name.");
  if (!email) return formMsg("upMsg", "Enter your e-mail address.");
  if (pass.length < 6) return formMsg("upMsg", "Choose a password with at least 6 characters.");
  formMsg("upMsg", ""); $("upBtn").disabled = true;
  pendingSignup = { name };
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name }).catch(() => {});
  } catch (err) { formMsg("upMsg", friendlyError(err)); pendingSignup = null; }
  finally { $("upBtn").disabled = false; }
});
$("forgotBtn").addEventListener("click", async () => {
  const email = $("inEmail").value.trim();
  if (!email) return formMsg("inMsg", "Type your e-mail above, then click “Forgot your password?” again.");
  try { await sendPasswordResetEmail(auth, email); formMsg("inMsg", `If an account uses ${email}, a reset link is on its way. Check your inbox and spam folder.`, true); }
  catch (err) { formMsg("inMsg", friendlyError(err)); }
});

onAuthStateChanged(auth, async user => {
  if (!user) { stopSession(); show("auth"); return; }
  uid = user.uid;
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    const email = (user.email || "").toLowerCase();
    if (!snap.exists()) {
      const name = (pendingSignup && pendingSignup.name) || user.displayName || email.split("@")[0];
      await setDoc(ref, {
        name, email, status: "online", pm: "", music: { on: false, song: "" },
        pic: { preset: rand(Object.keys(PICS)) }, font: { family: "body", color: "", bold: false, italic: false },
        lastSeen: Date.now(), created: Date.now()
      });
    } else {
      await updateDoc(ref, { lastSeen: Date.now(), ...(pendingStatus ? { status: pendingStatus } : {}) });
    }
    pendingSignup = null; pendingStatus = null;
    startSession();
  } catch (err) {
    show("auth"); setTab(false);
    formMsg("inMsg", "Signed in, but your profile couldn't be loaded: " + friendlyError(err));
  }
});

/* =============== Session: live listeners =============== */
function startSession() {
  stopListeners();
  firstConvoSnap = true;
  let shown = false;
  unsubs.push(onSnapshot(doc(db, "users", uid), s => {
    if (!s.exists()) return;
    me = { id: uid, ...s.data() };
    if (!shown) { shown = true; show("app"); sfx.signin(); renderMe(); renderSoon(); applyInputFont(); }
    else renderMe();
    renderSoon();
  }, err => toast(null, friendlyError(err))));

  unsubs.push(onSnapshot(collection(db, "users", uid, "contacts"), s => {
    contacts.clear();
    s.forEach(d => { contacts.set(d.id, d.data()); watchProfile(d.id); });
    renderSoon();
  }, err => toast(null, friendlyError(err))));

  unsubs.push(onSnapshot(collection(db, "users", uid, "requests"), s => {
    requests = [];
    s.forEach(d => {
      if (contacts.has(d.id)) { deleteDoc(d.ref).catch(() => {}); return; }
      const r = { id: d.id, ...d.data() };
      requests.push(r);
    });
    s.docChanges().forEach(ch => { if (ch.type === "added" && !contacts.has(ch.doc.id)) { sfx.signin(); toast({ name: ch.doc.data().name }, "added you to their contact list."); } });
    renderSoon();
  }, () => {}));

  unsubs.push(onSnapshot(query(collection(db, "convos"), where("members", "array-contains", uid)), s => {
    const first = firstConvoSnap; firstConvoSnap = false;
    s.docChanges().forEach(ch => {
      const id = ch.doc.id;
      if (ch.type === "removed") { convos.delete(id); return; }
      const prev = convos.get(id);
      const d = { id, ...ch.doc.data() };
      convos.set(id, d);
      d.members.forEach(watchProfile);
      const L = d.last;
      if (!first && L && L.from !== uid && !isBlocked(L.from) && (!prev || !prev.last || prev.last.t !== L.t || prev.last.from !== L.from)) onIncoming(d, L);
    });
    markRead();
    renderSoon();
  }, err => toast(null, friendlyError(err))));

  heartbeat = setInterval(() => { if (me) updateDoc(doc(db, "users", uid), { lastSeen: Date.now() }).catch(() => {}); }, HEARTBEAT_MS);
  ticker = setInterval(() => { renderStatusline(); }, 1000);
  slowTicker = setInterval(renderSoon, 30000);
}
function stopListeners() {
  unsubs.forEach(u => u()); unsubs = [];
  profileUnsubs.forEach(u => u()); profileUnsubs.clear();
  if (msgsUnsub) { msgsUnsub(); msgsUnsub = null; }
  clearInterval(heartbeat); clearInterval(ticker); clearInterval(slowTicker);
}
function stopSession() {
  stopListeners();
  uid = null; me = null; contacts.clear(); profiles.clear(); convos.clear(); requests = [];
  openTabs = []; active = null; msgs = []; closePop(); closeMenu(); closeModal();
  $("app").classList.remove("chatting");
}
window.addEventListener("pagehide", () => { if (uid && me) updateDoc(doc(db, "users", uid), { lastSeen: 0 }).catch(() => {}); });
document.addEventListener("visibilitychange", () => {
  if (!uid) return;
  if (!document.hidden) { updateDoc(doc(db, "users", uid), { lastSeen: Date.now() }).catch(() => {}); markRead(); renderSoon(); }
});

/* =============== Incoming events (from the conversation's "last" field) =============== */
function onIncoming(d, L) {
  if (!openTabs.includes(d.id)) openTabs.push(d.id);
  const viewing = d.id === active && !document.hidden;
  if (L.kind === "wizz") { sfx.wizz(); shake(); }
  else if (L.kind === "wink") { sfx.wink(); if (d.id === active) playWink(L.wink); }
  else if (L.kind === "game") sfx.wink();
  else sfx.message();
  if (!active) openChat(d.id);
  else if (!viewing) {
    toast(prof(L.from) ? { id: L.from } : { name: L.name }, L.preview || "sent you a message", d.id, L.kind === "wizz");
    setTimeout(() => { const t = document.querySelector(`[data-tab="${d.id}"]`); t && t.classList.add("flash"); }, 50);
  }
}

function markRead() {
  if (!active || document.hidden) return;
  const c = convos.get(active);
  if (unread(c)) updateDoc(doc(db, "convos", active), { [`reads.${uid}`]: c.last.t }).catch(() => {});
}

/* =============== Render: me & contacts =============== */
function renderMe() {
  if (!me) return;
  if (document.activeElement !== $("meName")) $("meName").value = me.name || "";
  $("meStatus").value = me.status || "online";
  if (document.activeElement !== $("mePm")) $("mePm").value = me.pm || "";
  $("meMail").textContent = me.email || "";
  $("meDpBtn").innerHTML = dp(me.pic, me.status, "lg");
  $("musicOn").checked = !!(me.music && me.music.on);
  if (document.activeElement !== $("musicSong")) $("musicSong").value = (me.music && me.music.song) || "";
  $("musicSong").disabled = !$("musicOn").checked;
  const sb = $("soundBtn");
  sb.title = sound ? "Sounds on" : "Sounds off";
  sb.setAttribute("aria-label", sound ? "Turn sounds off" : "Turn sounds on");
  sb.style.opacity = sound ? 1 : 0.45;
  document.querySelectorAll("[data-sort]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.sort === sort)));
}

function contactRow(id) {
  const p = profiles.get(id);
  const c = convos.get(convoIdWith(id));
  const st = statusOf(id);
  const label = isBlocked(id) ? "Blocked" : st !== "online" && st !== "offline" ? STATUS[st] : "";
  return `<div class="contact ${isOff(id) ? "is-offline" : ""} ${convoIdWith(id) === active ? "active" : ""}" data-id="${id}" tabindex="0" role="button" aria-label="Chat with ${esc(nameOf(id))}, ${isBlocked(id) ? "blocked" : STATUS[st]}">
    ${personDp(id, "sm")}
    <span class="c-info">
      <span class="c-name">${esc(p ? p.name : "Loading…")}${label ? ` <small>(${label})</small>` : ""}</span>
      ${pmOf(p) ? `<span class="c-pm">${esc(emoticonize(pmOf(p)))}</span>` : ""}
    </span>
    ${unread(c) ? `<span class="badge" aria-label="Unread messages">●</span>` : ""}
    <button class="c-menu" data-menu="${id}" aria-label="More actions for ${esc(nameOf(id))}" aria-haspopup="menu">⋯</button>
  </div>`;
}

function renderContacts() {
  const q = $("search").value.trim().toLowerCase();
  const ids = [...contacts.keys()].filter(id => {
    const p = profiles.get(id);
    return !q || (p && (p.name.toLowerCase().includes(q) || pmOf(p).toLowerCase().includes(q) || (p.email || "").includes(q)));
  });
  const byName = (a, b) => (isOff(a) - isOff(b)) || nameOf(a).localeCompare(nameOf(b));
  const section = (key, label, items, count) => `
    <button class="group-title" data-group="${key}" aria-expanded="${!collapsed[key]}"><span class="chev">▾</span>${esc(label)} (${count})</button>
    ${collapsed[key] ? "" : items.map(contactRow).join("")}`;
  let html = requests.filter(r => !contacts.has(r.id)).map(r => `
    <div class="req">
      <div class="r-top">${dp(r.pic, "online", "sm")}<span><b>${esc(r.name)}</b> (${esc(r.email)}) added you to their contact list.</span></div>
      <div class="row"><button class="btn" data-accept="${r.id}">Add to my contacts</button><button class="btn ghost" data-ignore="${r.id}">Ignore</button></div>
    </div>`).join("");
  if (sort === "groups") {
    for (const g of GROUPS) {
      const items = ids.filter(id => (contacts.get(id).group || "Friends") === g).sort(byName);
      if (!items.length && q) continue;
      html += section("g-" + g, g, items, `${items.filter(id => !isOff(id)).length}/${items.length}`);
    }
  } else {
    const on = ids.filter(id => !isOff(id)).sort(byName), off = ids.filter(isOff).sort(byName);
    html += section("s-on", "Online", on, on.length) + section("s-off", "Offline", off, off.length);
  }
  if (!contacts.size && !requests.length) html += `<div class="sys" style="margin:12px 8px">Your contact list is empty. Click the <b>add contact</b> button above and type a friend's e-mail. They need an NSM account too.</div>`;
  else if (q && !ids.length) html += `<p style="color:var(--muted);padding:12px 8px;margin:0">No contact matches “${esc(q)}”.</p>`;
  $("contacts").innerHTML = html;
}

/* =============== Render: tabs & conversation =============== */
function renderTabs() {
  openTabs = openTabs.filter(id => convos.has(id));
  if (active && !convos.has(active)) active = openTabs[openTabs.length - 1] || null;
  $("tabs").innerHTML = openTabs.map(id => {
    const c = convos.get(id), others = othersIn(c);
    const st = others.length > 1 ? "online" : isBlocked(others[0]) ? "offline" : statusOf(others[0]);
    return `<div class="tab ${id === active ? "active" : ""}" role="tab" aria-selected="${id === active}" data-tab="${id}" tabindex="0">
      <span class="tab-dot st-${st}"></span><span class="t-name">${esc(convoTitle(c))}</span>${unread(c) && id !== active ? `<span class="badge">●</span>` : ""}
      <button class="x" data-close="${id}" aria-label="Close conversation">✕</button>
    </div>`;
  }).join("");
  $("empty").hidden = !!active;
  $("convo").hidden = !active;
  if (!active) {
    $("emptyTitle").textContent = contacts.size ? "No conversation open" : `Welcome, ${me ? me.name : ""}!`;
    $("emptyText").textContent = contacts.size ? "Click a contact to start a conversation. Use the ⋯ button next to a contact to send a Wizz, block or move them." : "Add your first contact with the button at the top of your contact list.";
  }
}

function renderHeader() {
  if (!active) return;
  const c = convos.get(active), others = othersIn(c);
  if (others.length === 1) {
    const o = others[0], p = profiles.get(o);
    $("hDp").innerHTML = personDp(o, "");
    $("hName").textContent = nameOf(o);
    $("hSub").textContent = (isBlocked(o) ? "Blocked" : STATUS[statusOf(o)]) + (pmOf(p) ? " · " + emoticonize(pmOf(p)) : "") + (contacts.has(o) ? "" : " · not in your contacts");
  } else {
    $("hDp").innerHTML = dp({ preset: "star" }, "online", "");
    $("hName").textContent = convoTitle(c);
    $("hSub").textContent = `Group conversation · ${c.members.length} people`;
  }
  $("side").innerHTML = `
    <div class="who-pic">${others[0] ? personDp(others[0], "xl") : ""}<span>${others[0] ? esc(nameOf(others[0])) : ""}</span></div>
    <div class="who-pic"><button id="sideMe" title="Change your display picture">${dp(me.pic, me.status, "xl")}</button><span>${esc(me.name)} (you)</span></div>`;
  $("messages").style.background = SCENES[c.scene] ? SCENES[c.scene].css : "none";
  $("gameBtn").disabled = others.length !== 1;
}

function renderMessages() {
  if (!active) return;
  const c = convos.get(active), others = othersIn(c);
  const box = $("messages");
  const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  let html = "";
  if (!msgs.length) html += `<div class="sys">This is the start of your conversation with ${esc(convoTitle(c))}. Say hi :)</div>`;
  if (others.length === 1 && isBlocked(others[0])) html += `<div class="sys">You have blocked ${esc(nameOf(others[0]))}. They can't send you messages. Unblock them from the ⋯ menu to chat again.</div>`;
  else if (others.length === 1 && statusOf(others[0]) === "offline") html += `<div class="sys">${esc(nameOf(others[0]))} is offline. They'll see your messages next time they sign in.</div>`;
  let prev = null, prevT = 0;
  for (const m of msgs) {
    if (m.from !== uid && isBlocked(m.from)) continue;
    const mine = m.from === uid, t = m.tc || Date.now();
    if (m.kind === "text") {
      const head = prev !== m.from || t - prevT > 5 * 60000;
      html += `<div class="m ${mine ? "mine" : ""}">
        ${head ? `<div class="who"><span>${esc(nameOf(m.from))} says:</span><time>${fmtTime(t)}</time></div>` : ""}
        <div class="txt" style="${fontStyle(m.font)}">${esc(m.text)}</div></div>`;
      prev = m.from; prevT = t; continue;
    }
    prev = null;
    if (m.kind === "wizz") html += `<div class="sys wizz">${mine ? "You have just sent a Wizz!" : esc(nameOf(m.from)) + " has just sent you a Wizz!"} <time>${fmtTime(t)}</time></div>`;
    else if (m.kind === "wink") {
      const w = WINKS.find(x => x.id === m.wink) || WINKS[0];
      html += `<div class="sys wink">${mine ? "You sent a wink:" : esc(nameOf(m.from)) + " sent you a wink:"} ${w.e} ${esc(w.name)} <button class="linkish" data-replay="${w.id}">Play again</button></div>`;
    } else if (m.kind === "photo" || m.kind === "ink") {
      html += `<div class="m ${mine ? "mine" : ""}"><div class="who"><span>${esc(nameOf(m.from))} ${m.kind === "ink" ? "says (handwriting)" : "sent a photo"}:</span><time>${fmtTime(t)}</time></div>
        <div class="card">${m.img ? `<img src="${esc(m.img)}" alt="${m.kind === "ink" ? "Handwritten message" : esc(m.name || "Photo")}">` : ""}
        ${m.kind === "photo" ? `<div class="f-meta">${esc(m.name || "photo")} · ${fmtSize(m.size || 0)}</div>` : ""}</div></div>`;
    } else if (m.kind === "game") {
      html += `<div class="sys wink">${mine ? "You invited them to play tic-tac-toe." : esc(nameOf(m.from)) + " invited you to play tic-tac-toe."} <button class="linkish" data-opengame="1">Open the game</button></div>`;
    } else if (m.kind === "sys") html += `<div class="sys">${esc(m.text)}</div>`;
  }
  box.innerHTML = html;
  if (nearBottom || box.dataset.conv !== active) box.scrollTop = box.scrollHeight;
  box.dataset.conv = active;
}

function renderStatusline() {
  const el = $("statusline");
  if (!active || !convos.has(active)) return;
  const c = convos.get(active);
  const typer = Object.entries(c.typing || {}).find(([id, t]) => id !== uid && !isBlocked(id) && Date.now() - t < 6000);
  if (typer) {
    el.className = "statusline typing";
    const html = `${esc(nameOf(typer[0]))} is writing a message<span class="dots"><span>.</span><span>.</span><span>.</span></span>`;
    if (el.innerHTML !== html) el.innerHTML = html;
    return;
  }
  el.className = "statusline";
  const L = c.last && c.last.from !== uid ? c.last : null;
  const text = L ? `Last message received at ${fmtTime(L.t)} on ${fmtDate(L.t)}.` : "";
  if (el.textContent !== text) el.textContent = text;
}

function applyInputFont() {
  const ta = $("input"), f = (me && me.font) || {};
  ta.style.fontFamily = (FONTS[f.family] || FONTS.body).css;
  ta.style.color = f.color || "";
  ta.style.fontWeight = f.bold ? 700 : 400;
  ta.style.fontStyle = f.italic ? "italic" : "normal";
}

/* =============== Opening conversations =============== */
async function chatWith(other) {
  const id = convoIdWith(other);
  if (!convos.has(id)) {
    const members = [uid, other].sort();
    try { await setDoc(doc(db, "convos", id), { members, group: false }, { merge: true }); }
    catch (err) { toast(null, friendlyError(err)); return; }
    if (!convos.has(id)) convos.set(id, { id, members, group: false });
  }
  openChat(id);
}
function openChat(id) {
  if (!convos.has(id)) return;
  if (!openTabs.includes(id)) openTabs.push(id);
  if (active !== id) {
    active = id; msgs = [];
    if (msgsUnsub) msgsUnsub();
    msgsUnsub = onSnapshot(query(collection(db, "convos", id, "msgs"), orderBy("tc"), limitToLast(200)), s => {
      if (active !== id) return;
      msgs = s.docs.map(d => ({ id: d.id, ...d.data() }));
      renderMessages();
    }, err => toast(null, "Couldn't load messages: " + friendlyError(err)));
  }
  $("app").classList.add("chatting");
  closePop(); markRead();
  renderContacts(); renderTabs(); renderHeader(); renderMessages(); renderStatusline();
  setTimeout(() => $("input").focus({ preventScroll: true }), 0);
}
function closeChat(id) {
  openTabs = openTabs.filter(x => x !== id);
  if (active === id) {
    active = null; msgs = [];
    if (msgsUnsub) { msgsUnsub(); msgsUnsub = null; }
    const next = openTabs[openTabs.length - 1];
    if (next) openChat(next);
  }
  if (!active) $("app").classList.remove("chatting");
  closePop(); renderContacts(); renderTabs(); renderHeader();
}

/* =============== Sending =============== */
function canSend() {
  const c = convos.get(active), others = othersIn(c);
  if (others.length === 1 && isBlocked(others[0])) { toast(null, `You blocked ${nameOf(others[0])}. Unblock them to send messages.`); return false; }
  return true;
}
async function sendMsg(cid, m, preview) {
  const now = Date.now();
  const b = writeBatch(db);
  b.set(doc(collection(db, "convos", cid, "msgs")), { from: uid, t: serverTimestamp(), tc: now, ...m });
  b.update(doc(db, "convos", cid), {
    updated: now,
    last: { from: uid, name: me.name, kind: m.kind, preview: String(preview).slice(0, 90), t: now, wink: m.wink || null },
    [`reads.${uid}`]: now, [`typing.${uid}`]: 0
  });
  try { await b.commit(); return true; }
  catch (err) {
    toast(null, err.code === "permission-denied" ? "Your message couldn't be delivered. This person may have blocked you." : "Couldn't send: " + friendlyError(err));
    return false;
  }
}
function sendText(text) {
  text = emoticonize(text.trim()).slice(0, 4000);
  if (!text || !active || !canSend()) return;
  sendMsg(active, { kind: "text", text, font: { ...(me.font || {}) } }, text);
}
let lastWizz = 0;
function sendWizz() {
  if (!active || !canSend()) return;
  if (Date.now() - lastWizz < 5000) { toast(null, "You can't send Wizzes too often. Wait a few seconds."); return; }
  lastWizz = Date.now();
  sfx.wizz(); shake();
  sendMsg(active, { kind: "wizz" }, "has just sent you a Wizz!");
}
function sendWink(id) {
  if (!active || !canSend()) return;
  const w = WINKS.find(x => x.id === id);
  sfx.wink(); playWink(id);
  sendMsg(active, { kind: "wink", wink: id }, `sent you a wink: ${w.e} ${w.name}`);
}
function shrinkImage(file, max, type, cb) {
  const r = new FileReader();
  r.onload = () => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = Math.max(1, Math.round(img.width * s)); cv.height = Math.max(1, Math.round(img.height * s));
      const g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height);
      g.drawImage(img, 0, 0, cv.width, cv.height);
      try { cb(cv.toDataURL(type || "image/jpeg", 0.8)); } catch { cb(null); }
    };
    img.onerror = () => cb(null);
    img.src = r.result;
  };
  r.onerror = () => cb(null);
  r.readAsDataURL(file);
}
function sendPhoto(file) {
  if (!active || !file || !canSend()) return;
  if (!/^image\//.test(file.type)) { toast(null, "Only photos can be sent. Other files need paid storage, which NSM doesn't use."); return; }
  const cid = active;
  toast(null, `Sending ${file.name}…`);
  shrinkImage(file, 720, "image/jpeg", async url => {
    if (!url) { toast(null, "This picture couldn't be read. Try another one."); return; }
    if (await sendMsg(cid, { kind: "photo", img: url, name: file.name.slice(0, 80), size: file.size }, "sent you a photo")) sfx.done();
  });
}

/* =============== Winks & Wizz animation =============== */
function shake() {
  const a = $("app");
  a.classList.remove("shake"); void a.offsetWidth; a.classList.add("shake");
}
function playWink(id) {
  const w = WINKS.find(x => x.id === id); if (!w) return;
  const layer = document.createElement("div");
  layer.className = "wink-layer";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const add = (cls, e, style) => { const s = document.createElement("span"); s.className = "wp " + cls; s.textContent = e; s.style.cssText = style; layer.appendChild(s); };
  if (w.mode === "zoom" || reduce) add("zoom", w.e, "");
  else if (w.mode === "rise" || w.mode === "fall") {
    for (let i = 0; i < 28; i++) add(w.mode, rand(w.set), `left:${Math.random() * 96}%;font-size:${22 + Math.random() * 30}px;--d:${2 + Math.random() * 1.6}s;--delay:${Math.random() * 1.4}s`);
  } else if (w.mode === "burst") {
    for (let b = 0; b < 3; b++) for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, r = 110 + Math.random() * 120;
      add("burst", rand(w.set), `font-size:${18 + Math.random() * 18}px;--dx:${Math.cos(a) * r + (b - 1) * 140}px;--dy:${Math.sin(a) * r + (b === 1 ? -60 : 30)}px;--delay:${b * 0.55}s`);
    }
  } else if (w.mode === "fly") add("fly", w.e, "");
  $("chatPane").appendChild(layer);
  setTimeout(() => layer.remove(), 4200);
}

/* =============== Toasts =============== */
function toast(who, text, convoId, isWizz) {
  const el = document.createElement("button");
  el.className = "toast" + (isWizz ? " wizz" : "");
  const name = who ? (who.id ? nameOf(who.id) : who.name) : "";
  el.innerHTML = who
    ? `${who.id ? personDp(who.id, "sm") : dp(null, "online", "sm")}<div style="min-width:0"><b>${esc(name)}</b><span class="t">${esc(text)}</span></div>`
    : `<div><span class="t" style="white-space:normal">${esc(text)}</span></div>`;
  el.addEventListener("click", () => { if (convoId) openChat(convoId); el.remove(); });
  $("toasts").appendChild(el);
  while ($("toasts").children.length > 4) $("toasts").firstChild.remove();
  setTimeout(() => el.remove(), 6000);
}

/* =============== Composer popovers =============== */
function closePop() {
  pop = null; $("pop").hidden = true;
  document.querySelectorAll("[data-pop]").forEach(b => b.setAttribute("aria-expanded", "false"));
}
function openPop(kind) {
  if (pop === kind) { closePop(); return; }
  pop = kind;
  document.querySelectorAll("[data-pop]").forEach(b => b.setAttribute("aria-expanded", String(b.dataset.pop === kind)));
  const p = $("pop"); p.hidden = false;
  if (kind === "emo") {
    p.innerHTML = `<div class="grid">${PICKER.map(e => `<button type="button" data-emo="${e}" aria-label="Insert ${e}">${e}</button>`).join("")}</div>
      <div class="hint">Shortcuts work too: :) :D ;) :P :( :'( (H) (L) (Y) (N) (K) (F) (coffee) (8) &lt;3</div>`;
  } else if (kind === "wink") {
    p.innerHTML = `<div class="label">Send a wink</div><div class="wink-grid">${WINKS.map(w => `<button type="button" data-wink="${w.id}"><span>${w.e}</span>${esc(w.name)}</button>`).join("")}</div>`;
  } else if (kind === "font") {
    const f = me.font || {};
    p.innerHTML = `<div class="label">Font</div>
      <div class="chips">${Object.entries(FONTS).map(([k, v]) => `<button type="button" class="chip" data-family="${k}" aria-pressed="${(f.family || "body") === k}" style="font-family:${v.css}">${v.name}</button>`).join("")}</div>
      <div class="label">Colour</div>
      <div class="chips">${TEXT_COLORS.map(c => `<button type="button" class="swatch" data-color="${c}" aria-pressed="${(f.color || "") === c}" aria-label="${c ? "Colour " + c : "Default colour"}" style="background:${c || "var(--fg)"}"></button>`).join("")}</div>
      <div class="chips">
        <button type="button" class="chip" data-style="bold" aria-pressed="${!!f.bold}" style="font-weight:700">Bold</button>
        <button type="button" class="chip" data-style="italic" aria-pressed="${!!f.italic}" style="font-style:italic">Italic</button>
      </div>
      <div class="hint">Your contacts see your messages in this style.</div>`;
  }
}
$("pop").addEventListener("click", e => {
  e.stopPropagation(); // the popover re-renders itself; keep the outside-click handler from closing it
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.emo) {
    const ta = $("input"), s = ta.selectionStart ?? ta.value.length, en = ta.selectionEnd ?? s;
    ta.value = ta.value.slice(0, s) + t.dataset.emo + ta.value.slice(en);
    ta.focus(); ta.selectionStart = ta.selectionEnd = s + t.dataset.emo.length;
  } else if (t.dataset.wink) { closePop(); sendWink(t.dataset.wink); }
  else if (t.dataset.family || t.dataset.color !== undefined || t.dataset.style) {
    const f = { family: "body", color: "", bold: false, italic: false, ...(me.font || {}) };
    if (t.dataset.family) f.family = t.dataset.family;
    else if (t.dataset.style) f[t.dataset.style] = !f[t.dataset.style];
    else f.color = t.dataset.color;
    me.font = f; applyInputFont(); pop = null; openPop("font");
    updateDoc(doc(db, "users", uid), { font: f }).catch(err => toast(null, friendlyError(err)));
  }
});

/* =============== Modals =============== */
let lastFocus = null;
function openModal(html, mount) {
  lastFocus = document.activeElement;
  $("modal").innerHTML = html;
  $("modalBack").hidden = false;
  mount && mount($("modal"));
  const f = $("modal").querySelector("input, button:not([data-close-modal]), select"); f && f.focus();
}
function closeModal() {
  $("modalBack").hidden = true; $("modal").innerHTML = ""; gameOpenFor = null;
  lastFocus && lastFocus.focus && lastFocus.focus();
}
$("modalBack").addEventListener("click", e => { if (e.target === $("modalBack") || e.target.closest("[data-close-modal]")) closeModal(); });

function dpModal() {
  let choice = me.pic || { preset: "star" };
  openModal(`<h2>Change display picture</h2>
    <div class="dp-grid">${Object.keys(PICS).map(k => `<button type="button" data-pic="${k}" aria-pressed="${choice.preset === k && !choice.img}" aria-label="Picture ${k}">${dp({ preset: k }, me.status, "lg")}</button>`).join("")}</div>
    <div class="field"><label for="dpFile">Or use your own picture</label><input type="file" id="dpFile" accept="image/*"></div>
    <div id="dpPreview" style="display:flex;gap:12px;align-items:center"></div>
    <div class="row"><button class="btn ghost" data-close-modal>Cancel</button><button class="btn" id="dpSave">Save picture</button></div>`, m => {
    const preview = () => { m.querySelector("#dpPreview").innerHTML = dp(choice, me.status, "lg") + `<span style="color:var(--muted)">Preview</span>`; };
    preview();
    m.querySelector(".dp-grid").addEventListener("click", e => {
      const b = e.target.closest("[data-pic]"); if (!b) return;
      choice = { preset: b.dataset.pic };
      m.querySelectorAll("[data-pic]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      preview();
    });
    m.querySelector("#dpFile").addEventListener("change", e => {
      const f = e.target.files[0]; if (!f) return;
      shrinkImage(f, 160, "image/jpeg", url => { if (url) { choice = { preset: "star", img: url }; m.querySelectorAll("[data-pic]").forEach(x => x.setAttribute("aria-pressed", "false")); preview(); } });
    });
    m.querySelector("#dpSave").addEventListener("click", async () => {
      try { await updateDoc(doc(db, "users", uid), { pic: choice }); closeModal(); }
      catch (err) { toast(null, friendlyError(err)); }
    });
  });
}

function addContactModal(prefill = "") {
  openModal(`<h2>Add a contact</h2>
    <div class="field"><label for="acEmail">Their e-mail address</label><input id="acEmail" type="email" placeholder="friend@example.com" value="${esc(prefill)}"></div>
    <div class="field"><label for="acGroup">Group</label><select id="acGroup">${GROUPS.map(g => `<option>${g}</option>`).join("")}</select></div>
    <p class="form-msg" id="acMsg" hidden></p>
    <div class="row"><button class="btn ghost" data-close-modal>Cancel</button><button class="btn" id="acAdd">Add contact</button></div>`, m => {
    const go = async () => {
      const email = m.querySelector("#acEmail").value.trim().toLowerCase();
      if (!email) { formMsg("acMsg", "Type your friend's e-mail address."); return; }
      if (email === me.email) { formMsg("acMsg", "That's your own e-mail address."); return; }
      m.querySelector("#acAdd").disabled = true;
      try {
        const found = await getDocs(query(collection(db, "users"), where("email", "==", email)));
        if (found.empty) {
          formMsg("acMsg", `Nobody has an NSM account with ${email} yet. Send them this page's address so they can create one: ${location.origin + location.pathname}`);
          return;
        }
        const other = found.docs[0];
        if (contacts.has(other.id)) { formMsg("acMsg", `${other.data().name} is already in your contacts.`); return; }
        await setDoc(doc(db, "users", uid, "contacts", other.id), { group: m.querySelector("#acGroup").value, blocked: false, added: Date.now() });
        await setDoc(doc(db, "users", other.id, "requests", uid), { name: me.name, email: me.email, pic: me.pic || null, t: Date.now() });
        closeModal();
        toast({ id: other.id }, "was added to your contacts.");
      } catch (err) { formMsg("acMsg", friendlyError(err)); }
      finally { const b = m.querySelector("#acAdd"); if (b) b.disabled = false; }
    };
    m.querySelector("#acAdd").addEventListener("click", go);
    m.querySelector("#acEmail").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
  });
}

function inviteModal() {
  const c = convos.get(active);
  const choices = [...contacts.keys()].filter(id => !isOff(id) && !c.members.includes(id));
  openModal(`<h2>Invite someone to this conversation</h2>
    ${choices.length ? `<div class="pick-list">${choices.map(id => `<button data-invite="${id}">${personDp(id, "sm")}<span><b>${esc(nameOf(id))}</b><br><small style="color:var(--muted)">${STATUS[statusOf(id)]}</small></span></button>`).join("")}</div>`
      : `<p style="margin:0;color:var(--muted)">None of your other contacts is online right now.</p>`}
    <div class="row"><button class="btn ghost" data-close-modal>Close</button></div>`, m => {
    const list = m.querySelector(".pick-list");
    list && list.addEventListener("click", async e => {
      const b = e.target.closest("[data-invite]"); if (!b) return;
      const who = b.dataset.invite;
      closeModal();
      try {
        let id = c.id;
        if (!c.group) {
          const members = [...c.members, who];
          const ref = await addDoc(collection(db, "convos"), { members, group: true, updated: Date.now(), scene: c.scene || "none" });
          id = ref.id;
          convos.set(id, { id, members, group: true });
        } else {
          await updateDoc(doc(db, "convos", id), { members: arrayUnion(who) });
        }
        await sendMsg(id, { kind: "sys", text: `${me.name} invited ${nameOf(who)} to the conversation.` }, `added you to a conversation`);
        openChat(id);
      } catch (err) { toast(null, friendlyError(err)); }
    });
  });
}

function sceneModal() {
  const c = convos.get(active);
  openModal(`<h2>Conversation background</h2>
    <p style="margin:0;color:var(--muted)">Everyone in this conversation sees the same background.</p>
    <div class="scene-grid">${Object.entries(SCENES).map(([k, s]) => `<button data-scene="${k}" aria-pressed="${(c.scene || "none") === k}" style="background:${s.css === "none" ? "var(--panel)" : s.css}">${s.name}</button>`).join("")}</div>
    <div class="row"><button class="btn ghost" data-close-modal>Done</button></div>`, m => {
    m.querySelector(".scene-grid").addEventListener("click", e => {
      const b = e.target.closest("[data-scene]"); if (!b) return;
      updateDoc(doc(db, "convos", c.id), { scene: b.dataset.scene }).catch(err => toast(null, friendlyError(err)));
      m.querySelectorAll("[data-scene]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    });
  });
}

function inkModal() {
  if (!active || !canSend()) return;
  const cid = active;
  const inks = ["#16212c", "#d64545", "#2e9e5b", "#3d7fd6", "#8a5cd6", "#e07b26"];
  openModal(`<h2>Handwriting</h2>
    <div class="ink-wrap"><canvas id="inkCanvas" aria-label="Drawing area"></canvas></div>
    <div class="chips" id="inkColors">${inks.map((c, i) => `<button type="button" class="swatch" data-ink="${c}" aria-pressed="${i === 0}" aria-label="Ink ${c}" style="background:${c}"></button>`).join("")}
      <button type="button" class="chip" data-size="3" aria-pressed="true">Thin</button><button type="button" class="chip" data-size="7" aria-pressed="false">Thick</button>
      <button type="button" class="chip" id="inkClear">Clear</button></div>
    <div class="row"><button class="btn ghost" data-close-modal>Cancel</button><button class="btn" id="inkSend">Send drawing</button></div>`, m => {
    const cvs = m.querySelector("#inkCanvas");
    const r = cvs.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cvs.width = Math.round(r.width * dpr); cvs.height = Math.round(240 * dpr);
    const g = cvs.getContext("2d");
    g.scale(dpr, dpr); g.lineCap = "round"; g.lineJoin = "round";
    let color = inks[0], size = 3, drawing = false, drawn = false;
    const clear = () => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, r.width, 240); drawn = false; };
    clear();
    const pos = e => { const b = cvs.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    cvs.addEventListener("pointerdown", e => { drawing = true; drawn = true; cvs.setPointerCapture(e.pointerId); const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); g.lineTo(x + .01, y); g.strokeStyle = color; g.lineWidth = size; g.stroke(); });
    cvs.addEventListener("pointermove", e => { if (!drawing) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); });
    const end = () => { drawing = false; };
    cvs.addEventListener("pointerup", end); cvs.addEventListener("pointercancel", end);
    m.querySelector("#inkColors").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.ink) { color = b.dataset.ink; m.querySelectorAll("[data-ink]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); }
      if (b.dataset.size) { size = +b.dataset.size; m.querySelectorAll("[data-size]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); }
      if (b.id === "inkClear") clear();
    });
    m.querySelector("#inkSend").addEventListener("click", () => {
      if (!drawn) { closeModal(); return; }
      let url = null; try { url = cvs.toDataURL("image/jpeg", 0.8); } catch {}
      closeModal();
      if (url) sendMsg(cid, { kind: "ink", img: url }, "sent you a handwritten message");
    });
  });
}

/* =============== Tic-tac-toe, played live between two people =============== */
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const winnerOf = b => { for (const l of LINES) if (b[l[0]] !== "_" && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]]) return b[l[0]]; return b.includes("_") ? null : "draw"; };

async function startGame() {
  const c = convos.get(active), others = othersIn(c);
  if (others.length !== 1) { toast(null, "Tic-tac-toe is for one-to-one conversations."); return; }
  if (!canSend()) return;
  if (isOff(others[0])) { toast(null, `${nameOf(others[0])} needs to be online to play.`); return; }
  const g = c.game;
  if (g && !g.winner) { openGame(); return; }
  try {
    await updateDoc(doc(db, "convos", c.id), { game: { board: "_________", x: uid, o: others[0], turn: uid, winner: null, n: Date.now() } });
    await sendMsg(c.id, { kind: "game" }, "invited you to play tic-tac-toe");
    openGame();
  } catch (err) { toast(null, friendlyError(err)); }
}
function openGame() {
  gameOpenFor = active;
  openModal(`<h2 id="gTitle">Tic-tac-toe</h2>
    <div class="ttt-status" id="tttStatus"></div>
    <div class="ttt" id="ttt">${[...Array(9)].map((_, i) => `<button type="button" data-cell="${i}" aria-label="Cell ${i + 1}"></button>`).join("")}</div>
    <div class="row"><button class="btn ghost" id="tttAgain">New game</button><button class="btn" data-close-modal>Close</button></div>`, m => {
    gameOpenFor = active;
    m.querySelector("#ttt").addEventListener("click", e => { const b = e.target.closest("[data-cell]"); if (b) playCell(+b.dataset.cell); });
    m.querySelector("#tttAgain").addEventListener("click", () => {
      const c = convos.get(gameOpenFor), other = othersIn(c)[0];
      updateDoc(doc(db, "convos", c.id), { game: { board: "_________", x: uid, o: other, turn: uid, winner: null, n: Date.now() } })
        .then(() => sendMsg(c.id, { kind: "game" }, "invited you to a new game of tic-tac-toe"))
        .catch(err => toast(null, friendlyError(err)));
    });
  });
  renderGame();
}
function renderGame() {
  if (!gameOpenFor || $("modalBack").hidden) return;
  const c = convos.get(gameOpenFor), g = c && c.game;
  const st = $("tttStatus"); if (!st) return;
  const other = othersIn(c)[0];
  $("gTitle").textContent = `Tic-tac-toe with ${nameOf(other)}`;
  if (!g) { st.textContent = "No game yet. Click New game."; return; }
  const mark = g.x === uid ? "X" : "O";
  document.querySelectorAll("#ttt [data-cell]").forEach((el, i) => {
    const v = g.board[i] === "_" ? "" : g.board[i];
    el.textContent = v; el.className = v === "X" ? "x" : v === "O" ? "o" : "";
  });
  if (g.winner === "draw") st.textContent = "It's a draw!";
  else if (g.winner) st.textContent = g.winner === mark ? "You win! 🎉" : `${nameOf(other)} wins!`;
  else st.textContent = g.turn === uid ? `Your turn: you are ${mark}` : `Waiting for ${nameOf(other)}…`;
}
async function playCell(i) {
  const cid = gameOpenFor, ref = doc(db, "convos", cid);
  let finished = null;
  try {
    await runTransaction(db, async tx => {
      const s = await tx.get(ref);
      const g = s.data().game;
      if (!g || g.winner || g.turn !== uid || g.board[i] !== "_") return;
      const mark = g.x === uid ? "X" : "O";
      const board = g.board.slice(0, i) + mark + g.board.slice(i + 1);
      const winner = winnerOf(board);
      finished = winner ? { winner, mark } : null;
      tx.update(ref, { game: { ...g, board, turn: g.x === uid ? g.o : g.x, winner } });
    });
    if (finished) {
      const other = othersIn(convos.get(cid))[0];
      const text = finished.winner === "draw" ? "Tic-tac-toe: it's a draw." : `Tic-tac-toe: ${finished.winner === finished.mark ? me.name : nameOf(other)} won.`;
      sendMsg(cid, { kind: "sys", text }, text);
    }
  } catch (err) { toast(null, friendlyError(err)); }
}

/* =============== Contact menu =============== */
function openMenu(id, anchor) {
  menuFor = id;
  const c = contacts.get(id) || {};
  const menu = $("menu");
  menu.innerHTML = `
    <button role="menuitem" data-act="chat">💬 Send an instant message</button>
    <button role="menuitem" data-act="wizz" ${c.blocked ? "disabled" : ""}>📳 Send a Wizz</button>
    <div class="sep"></div>
    <div class="label">Move to group</div>
    ${GROUPS.filter(g => g !== (c.group || "Friends")).map(g => `<button role="menuitem" data-act="move" data-group="${g}">↳ ${g}</button>`).join("")}
    <div class="sep"></div>
    <button role="menuitem" data-act="block">${c.blocked ? "✅ Unblock contact" : "⛔ Block contact"}</button>
    <button role="menuitem" data-act="delete" class="danger">🗑️ Delete contact</button>`;
  menu.hidden = false;
  const r = anchor.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
  menu.style.left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8)) + "px";
  menu.style.top = (r.bottom + mh + 8 > window.innerHeight ? Math.max(8, r.top - mh - 4) : r.bottom + 4) + "px";
  menu.querySelector("button:not([disabled])").focus();
}
function closeMenu() { $("menu").hidden = true; menuFor = null; }
$("menu").addEventListener("click", async e => {
  const b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
  const id = menuFor, act = b.dataset.act, name = nameOf(id);
  if (act === "delete" && !b.dataset.sure) { b.dataset.sure = "1"; b.textContent = "Click again to delete " + name; return; }
  closeMenu();
  const ref = doc(db, "users", uid, "contacts", id);
  try {
    if (act === "chat") await chatWith(id);
    else if (act === "wizz") { await chatWith(id); sendWizz(); }
    else if (act === "move") { await updateDoc(ref, { group: b.dataset.group }); toast(null, `${name} moved to ${b.dataset.group}.`); }
    else if (act === "block") {
      const blocked = !(contacts.get(id) || {}).blocked;
      await updateDoc(ref, { blocked });
      toast(null, blocked ? `${name} is blocked and can't send you messages any more.` : `${name} is unblocked.`);
    } else if (act === "delete") {
      await deleteDoc(ref);
      toast(null, `${name} was deleted from your contacts.`);
    }
  } catch (err) { toast(null, friendlyError(err)); }
});

/* =============== Events =============== */
const saveMe = fields => updateDoc(doc(db, "users", uid), fields).catch(err => toast(null, friendlyError(err)));
$("meName").addEventListener("change", e => { const v = e.target.value.trim().slice(0, 32); if (v) saveMe({ name: v }); else e.target.value = me.name; });
$("meStatus").addEventListener("change", e => saveMe({ status: e.target.value, lastSeen: Date.now() }));
$("mePm").addEventListener("change", e => saveMe({ pm: e.target.value.trim().slice(0, 80) }));
$("musicOn").addEventListener("change", e => { saveMe({ music: { on: e.target.checked, song: $("musicSong").value.trim().slice(0, 60) } }); if (e.target.checked) $("musicSong").focus(); });
$("musicSong").addEventListener("change", e => saveMe({ music: { on: $("musicOn").checked, song: e.target.value.trim().slice(0, 60) } }));
$("soundBtn").addEventListener("click", () => { sound = !sound; local("sound", sound ? "on" : "off"); renderMe(); });
$("signoutBtn").addEventListener("click", async () => {
  try { await updateDoc(doc(db, "users", uid), { lastSeen: 0 }); } catch {}
  signOut(auth);
});
$("meDpBtn").addEventListener("click", dpModal);
$("addBtn").addEventListener("click", () => addContactModal());
$("search").addEventListener("input", renderContacts);
document.querySelectorAll("[data-sort]").forEach(b => b.addEventListener("click", () => { sort = b.dataset.sort; local("sort", sort); renderMe(); renderContacts(); }));

$("contacts").addEventListener("click", async e => {
  const acc = e.target.closest("[data-accept]"), ign = e.target.closest("[data-ignore]");
  if (acc || ign) {
    const id = (acc || ign).dataset.accept || (acc || ign).dataset.ignore;
    try {
      if (acc) { await setDoc(doc(db, "users", uid, "contacts", id), { group: "Friends", blocked: false, added: Date.now() }); watchProfile(id); }
      await deleteDoc(doc(db, "users", uid, "requests", id));
    } catch (err) { toast(null, friendlyError(err)); }
    return;
  }
  const g = e.target.closest("[data-group]");
  if (g) { collapsed[g.dataset.group] = !collapsed[g.dataset.group]; renderContacts(); return; }
  const mb = e.target.closest("[data-menu]");
  if (mb) { e.stopPropagation(); menuFor === mb.dataset.menu ? closeMenu() : openMenu(mb.dataset.menu, mb); return; }
  const row = e.target.closest(".contact");
  if (row) chatWith(row.dataset.id);
});
$("contacts").addEventListener("keydown", e => {
  const row = e.target.closest(".contact");
  if (row && e.target === row && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); chatWith(row.dataset.id); }
});
$("tabs").addEventListener("click", e => {
  const x = e.target.closest("[data-close]");
  if (x) { e.stopPropagation(); closeChat(x.dataset.close); return; }
  const t = e.target.closest("[data-tab]");
  if (t) openChat(t.dataset.tab);
});
$("tabs").addEventListener("keydown", e => {
  const t = e.target.closest("[data-tab]");
  if (t && e.target === t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openChat(t.dataset.tab); }
});
$("backBtn").addEventListener("click", () => { $("app").classList.remove("chatting"); closePop(); });
$("inviteBtn").addEventListener("click", inviteModal);
$("gameBtn").addEventListener("click", startGame);
$("sceneBtn").addEventListener("click", sceneModal);
$("side").addEventListener("click", e => { if (e.target.closest("#sideMe")) dpModal(); });
$("messages").addEventListener("click", e => {
  const r = e.target.closest("[data-replay]"); if (r) playWink(r.dataset.replay);
  if (e.target.closest("[data-opengame]")) openGame();
});

$("sendForm").addEventListener("submit", e => {
  e.preventDefault();
  sendText($("input").value);
  $("input").value = ""; $("input").style.height = "";
});
$("input").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("sendForm").requestSubmit(); }
});
$("input").addEventListener("input", e => {
  const ta = e.target; ta.style.height = "48px"; ta.style.height = Math.min(ta.scrollHeight + 2, 140) + "px";
  if (active && ta.value && Date.now() - typingSent > 3000) {
    typingSent = Date.now();
    updateDoc(doc(db, "convos", active), { [`typing.${uid}`]: typingSent }).catch(() => {});
  }
});
document.querySelectorAll("[data-pop]").forEach(b => b.addEventListener("click", () => openPop(b.dataset.pop)));
$("wizzBtn").addEventListener("click", sendWizz);
$("fileBtn").addEventListener("click", () => { if (active && canSend()) $("fileInput").click(); });
$("fileInput").addEventListener("change", e => { sendPhoto(e.target.files[0]); e.target.value = ""; });
$("inkBtn").addEventListener("click", inkModal);

document.addEventListener("click", e => {
  if (pop && !e.target.closest("#pop") && !e.target.closest("[data-pop]")) closePop();
  if (menuFor && !e.target.closest("#menu") && !e.target.closest("[data-menu]")) closeMenu();
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!$("modalBack").hidden) closeModal(); else if (menuFor) closeMenu(); else if (pop) closePop();
});
