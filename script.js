const $ = id => document.getElementById(id);
const norm = s => (s || "").toLowerCase().replace(/[^a-z0-9\u0900-\u097F ]/g, "").trim();

let frames = [], aspect = 16 / 9, N = CONFIG.gridSize || 4, cur = 0, order = [], sel = null, img = "", tries = 0;

// ---------- Intro ----------
$("introTitle").textContent = CONFIG.introTitle;
$("introText").textContent = CONFIG.introText;
$("finalTitle").textContent = CONFIG.finalTitle;
$("mTitle").textContent = CONFIG.prizeQuestion;

$("startBtn").onclick = async () => {
  $("startBtn").disabled = true;
  $("startBtn").textContent = "Getting things ready…";
  try { frames = await buildFrames(); }
  catch (e) {
    $("startBtn").disabled = false; $("startBtn").textContent = "Start 💕";
    $("introText").textContent = "Oops, " + e.message + ". Please add the pictures to the frames folder.";
    return;
  }
  $("intro").classList.add("hidden");
  $("game").classList.remove("hidden");
  $("dots").innerHTML = CONFIG.rounds.map(() => "<i></i>").join("");
  cur = 0; showRound();
};

// ---------- Pictures: each round uses its own image from config ----------
function loadImage(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i); i.onerror = () => rej(new Error("Missing picture: " + src)); i.src = src;
  });
}

async function buildFrames() {
  const out = [];
  for (let i = 0; i < CONFIG.rounds.length; i++) {
    const im = await loadImage((CONFIG.rounds[i].image || `frames/frame${i + 1}.jpg`) + "?v=2");
    out.push({ src: im.src, aspect: im.naturalWidth / im.naturalHeight });
  }
  return out;
}

// ---------- Rounds ----------
function showRound() {
  [...$("dots").children].forEach((d, i) => d.classList.toggle("on", i <= cur));
  $("qText").textContent = `Q${cur + 1}. ${CONFIG.rounds[cur].q}`;
  $("ans").value = ""; $("qErr").textContent = ""; tries = 0;
  $("qBox").classList.remove("hidden"); $("pBox").classList.add("hidden");
  $("memMsg").classList.add("hidden"); $("nextBtn").classList.add("hidden");
}

$("ansBtn").onclick = checkAnswer;
$("ans").addEventListener("keydown", e => { if (e.key === "Enter") checkAnswer(); });

function checkAnswer() {
  const r = CONFIG.rounds[cur], a = norm($("ans").value), key = norm(r.a);
  if (!a) { $("qErr").textContent = "Type something, even a guess 😉"; return; }
  if (!key || a.includes(key) || key.includes(a)) { startPuzzle(); return; }
  tries++;
  if (tries >= 3) { $("qErr").textContent = "Okay okay, I'll let you through 😘"; setTimeout(startPuzzle, 900); }
  else if (tries === 2) $("qErr").textContent = "Hint: " + r.hint;
  else $("qErr").textContent = "Not quite… try again 🙈";
}

// ---------- Puzzle ----------
function p_setGrid() { $("puzzle").style.gridTemplateColumns = `repeat(${N}, 1fr)`; }

function startPuzzle() {
  $("qBox").classList.add("hidden"); $("pBox").classList.remove("hidden");
  $("pTitle").textContent = "Correct! Now put our moment back together 🧩";
  $("pHelp").classList.remove("hidden");
  img = frames[cur].src; aspect = frames[cur].aspect;
  p_setGrid();
  const p = $("puzzle"); p.classList.remove("done"); p.style.aspectRatio = aspect;
  order = Array.from({ length: N * N }, (_, i) => i);
  do { for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } }
  while (order.every((v, i) => v === i));
  sel = null; render();
}

function render() {
  const p = $("puzzle"); p.innerHTML = "";
  order.forEach((piece, pos) => {
    const t = document.createElement("div");
    t.className = "tile" + (sel === pos ? " sel" : "");
    t.style.backgroundImage = `url(${img})`;
    t.style.backgroundSize = `${N * 100}% ${N * 100}%`;
    t.style.backgroundPosition = `${(piece % N) * 100 / (N - 1)}% ${Math.floor(piece / N) * 100 / (N - 1)}%`;
    t.onclick = () => tap(pos);
    p.appendChild(t);
  });
}

function tap(pos) {
  if ($("puzzle").classList.contains("done")) return;
  if (sel === null) { sel = pos; render(); return; }
  if (sel !== pos) [order[sel], order[pos]] = [order[pos], order[sel]];
  sel = null; render();
  if (order.every((v, i) => v === i)) solved();
}

function solved() {
  const pz = $("puzzle");
  pz.classList.add("done");
  pz.innerHTML = "";
  const full = document.createElement("div");
  full.className = "full";
  full.style.backgroundImage = `url(${img})`;
  pz.appendChild(full);
  hearts();
  $("pTitle").textContent = "You did it! 🎉";
  $("pHelp").classList.add("hidden");
  const m = $("memMsg"); m.textContent = CONFIG.rounds[cur].m; m.classList.remove("hidden");
  const n = $("nextBtn");
  n.textContent = cur === CONFIG.rounds.length - 1 ? "See the full video 🎬" : "Next 💗";
  n.classList.remove("hidden");
}

$("nextBtn").onclick = () => {
  if (cur < CONFIG.rounds.length - 1) { cur++; showRound(); } else finale();
};

// ---------- Finale ----------
function finale() {
  $("game").classList.add("hidden");
  $("finale").classList.remove("hidden");
  const v = $("finalVid");
  v.onerror = () => {
    const code = v.error ? v.error.code : "?";
    $("videoErr").innerHTML = `Video couldn't play here (error ${code}). <a href="${CONFIG.video}" target="_blank">Tap here to open it directly</a>.`;
  };
  v.src = CONFIG.video;
  v.load();
  $("gift").classList.remove("hidden");
  hearts();
}

$("gift").onclick = () => $("modal").classList.remove("hidden");
$("closeBtn").onclick = () => $("modal").classList.add("hidden");

$("sendBtn").onclick = async () => {
  const w = $("wish").value.trim();
  if (!w) { $("wErr").textContent = "Tell me what you want, I'm listening 🥰"; return; }
  $("wErr").textContent = "";
  const btn = $("sendBtn"); btn.disabled = true; btn.textContent = "Sending…";
  const subject = `🎁 ${CONFIG.herName}'s prize wish!`;
  const body = `My prize wish:\n\n${w}\n\n(Sent from our memory game 💕)`;
  let sent = false;

  if (CONFIG.web3formsKey) {
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ access_key: CONFIG.web3formsKey, subject, from_name: CONFIG.herName, message: body })
      });
      const j = await r.json();
      sent = j.success === true;
    } catch (e) {}
  }

  if (sent) {
    $("mTitle").textContent = "Sent! 💌 Your wish is on its way to me 🥰";
    $("wish").classList.add("hidden"); btn.classList.add("hidden");
    hearts();
  } else {
    const link = `mailto:${CONFIG.yourEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const fb = $("fallback"); fb.classList.remove("hidden");
    fb.innerHTML = `Tap <a href="${link}">here</a> to send it by email, then press Send. 💌`;
    window.location.href = link;
    btn.disabled = false; btn.textContent = "Send my wish 💌";
  }
};

function hearts() {
  const h = $("hearts");
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span");
    s.textContent = ["💖", "💕", "✨", "💗"][i % 4];
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 0.8 + "s";
    h.appendChild(s); setTimeout(() => s.remove(), 4200);
  }
}