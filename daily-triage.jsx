import React, { useState, useEffect } from "react";

const KEY = "todos-v3";

const LEVELS = [
  { id: "high", label: "High", mark: "▲", pill: "#FCE9EA", text: "#D14343" },
  { id: "med", label: "Medium", mark: "●", pill: "#FBEEDF", text: "#C4802B" },
  { id: "low", label: "Low", mark: "▼", pill: "#E9EDFA", text: "#5B6BC0" },
];

const TIMES = [15, 30, 60, 120];
const fmt = (m) => (m < 60 ? `${m}m` : m % 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m / 60}h`);

const ICONS = [
  [/bill|pay|invoice|rent/i, "💸", "#FEF3C7"],
  [/budget|money|finance|bank/i, "💰", "#FDE8D7"],
  [/doctor|appointment|dentist|health|clinic/i, "🩺", "#DDF1F7"],
  [/resume|cv|cover letter/i, "📄", "#E7E4FA"],
  [/interview|screen|recruiter|apply/i, "🎯", "#FCE0E4"],
  [/meeting|brainstorm|standup|sync/i, "🧠", "#FBDDE6"],
  [/call|phone|mom|dad|ring/i, "📞", "#E3F5DE"],
  [/email|send|reply|follow.?up|outreach/i, "✉️", "#E4EEFB"],
  [/laundry|fold|clean|dishes|tidy/i, "🧺", "#EAF0DC"],
  [/grocer|shop|store|buy|order/i, "🛒", "#FDE7DC"],
  [/gym|run|workout|walk|train/i, "🏋️", "#DFF0EC"],
  [/code|deploy|bug|build|app|ship/i, "💻", "#E5E7F5"],
  [/read|study|learn|course/i, "📖", "#F2E7DA"],
  [/car|drive|gas|oil/i, "🚗", "#E6ECF3"],
  [/gift|birthday|card/i, "🎁", "#FBE1EC"],
  [/trip|flight|travel|hotel/i, "✈️", "#DEEDF7"],
  [/water|plant|garden/i, "🪴", "#E2F1DC"],
  [/eat|lunch|dinner|cook|meal/i, "🍽️", "#FBE9D8"],
  [/write|draft|post|note/i, "✍️", "#EDE6F7"],
  [/pack|move|box/i, "📦", "#F0E9DE"],
];

function iconFor(text) {
  for (const [re, emoji, bg] of ICONS) if (re.test(text)) return { emoji, bg };
  return { emoji: "📌", bg: "#EEEDEA" };
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap');
.tt * { box-sizing: border-box; }
.tt {
  background:#FBFAF9; color:#1A1A18; min-height:100%; padding:24px 16px 70px;
  max-width:620px; margin:0 auto; font-family:'DM Sans',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.tt button { font-family:inherit; cursor:pointer; border:none; background:none; color:inherit; padding:0; }
.tt :focus-visible { outline:2px solid #8E8CE8; outline-offset:2px; border-radius:6px; }

.top { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
.tt h1 { font-family:'Instrument Serif',Georgia,serif; font-size:38px; font-weight:400; letter-spacing:-.01em; margin:0; }
.count { font-size:12px; letter-spacing:.1em; text-transform:uppercase; color:#9A9891; font-weight:500; text-align:right; line-height:1.6; }
.count b { display:block; color:#1A1A18; font-weight:700; letter-spacing:.06em; }

.composer { display:flex; gap:8px; align-items:center; background:#fff; border:1px solid #EFEDE9; border-radius:16px; padding:8px 8px 8px 14px; box-shadow:0 1px 3px rgba(26,26,24,.04); }
.tin { flex:1; border:none; outline:none; background:transparent; font-family:inherit; font-size:16px; color:#1A1A18; padding:8px 0; }
.tin::placeholder { color:#B4B1AA; }
.plus { width:36px; height:36px; border-radius:12px; background:#1A1A18; color:#fff; font-size:19px; line-height:1; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.plus:disabled { background:#E4E2DD; color:#B4B1AA; }

.picker { display:flex; flex-wrap:wrap; gap:7px; margin:10px 0 6px; }
.picker.last { margin-bottom:26px; }
.pchip { border-radius:999px; padding:7px 14px; font-size:12.5px; font-weight:500; letter-spacing:.02em; background:#fff; border:1px solid #EFEDE9; color:#8A8880; display:flex; align-items:center; gap:5px; }
.pchip .m { font-size:9px; }
.pchip.on { border-color:transparent; }
.pchip.time.on { background:#1A1A18; color:#fff; }

.group { margin-bottom:22px; }
.ghead { display:inline-flex; align-items:center; gap:7px; border-radius:999px; padding:6px 13px; font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; margin-bottom:10px; }
.ghead .m { font-size:9px; }
.ghead .tot { font-weight:500; opacity:.75; }
.chev { font-size:10px; opacity:.6; transition:transform .2s ease; }
.chev.up { transform:rotate(180deg); }

.item { display:flex; align-items:center; gap:12px; background:#fff; border:1px solid #F1EFEB; border-radius:16px; padding:13px 15px; margin-bottom:8px; box-shadow:0 1px 2px rgba(26,26,24,.035); }
.bubble { width:34px; height:34px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.mid { flex:1; min-width:0; }
.txt { font-size:15.5px; font-weight:500; line-height:1.35; word-break:break-word; }
.time { margin-top:4px; font-size:11.5px; font-weight:500; color:#9A9891; letter-spacing:.02em; }
.item.done .txt { text-decoration:line-through; color:#B4B1AA; }
.item.done { background:#F7F6F4; box-shadow:none; }
.circle { width:23px; height:23px; border-radius:50%; border:1.8px solid #DAD7D1; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:12px; color:#fff; }
.circle.on { background:#1A1A18; border-color:#1A1A18; }
.del { font-size:16px; color:#D6D3CD; padding:0 3px; }

.empty { text-align:center; padding:44px 20px; color:#A9A69F; }
.empty .big { font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:22px; color:#8A8880; margin-bottom:6px; }
.empty .sm { font-size:14px; }
.donehead { font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#A9A69F; margin:26px 0 10px; }
@media (prefers-reduced-motion: reduce) { .tt * { transition:none !important; } }
`;

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [level, setLevel] = useState("high");
  const [minutes, setMinutes] = useState(30);
  const [loaded, setLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(KEY);
        if (r) setTasks(JSON.parse(r.value));
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) window.storage.set(KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks, loaded]);

  const add = () => {
    if (!text.trim()) return;
    setTasks((p) => [...p, { id: Date.now(), text: text.trim(), level, minutes, done: false }]);
    setText("");
  };
  const toggle = (id) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const drop = (id) => setTasks((p) => p.filter((t) => t.id !== id));
  const cycleTime = (id) =>
    setTasks((p) =>
      p.map((t) =>
        t.id === id ? { ...t, minutes: TIMES[(TIMES.indexOf(t.minutes) + 1) % TIMES.length] } : t
      )
    );

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const totalLeft = open.reduce((s, t) => s + (t.minutes || 0), 0);

  const Row = ({ t }) => {
    const ic = iconFor(t.text);
    return (
      <div className={`item ${t.done ? "done" : ""}`}>
        <span className="bubble" style={{ background: t.done ? "#EDEBE7" : ic.bg }}>{ic.emoji}</span>
        <div className="mid">
          <div className="txt">{t.text}</div>
          <button className="time" onClick={() => cycleTime(t.id)} aria-label="Change time estimate">
            ⏱ {fmt(t.minutes || 30)}
          </button>
        </div>
        <button className="del" onClick={() => drop(t.id)} aria-label="Delete task">×</button>
        <button
          className={`circle ${t.done ? "on" : ""}`}
          onClick={() => toggle(t.id)}
          aria-label={t.done ? "Mark as not done" : "Mark as done"}
        >
          {t.done ? "✓" : ""}
        </button>
      </div>
    );
  };

  return (
    <div className="tt">
      <style>{CSS}</style>

      <div className="top">
        <h1>To-Do's</h1>
        <span className="count">
          <b>{fmt(totalLeft)}</b>
          {open.length} left
        </span>
      </div>

      <div className="composer">
        <input
          className="tin"
          placeholder="Add a task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="plus" onClick={add} disabled={!text.trim()} aria-label="Add task">+</button>
      </div>

      <div className="picker">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={`pchip ${level === l.id ? "on" : ""}`}
            onClick={() => setLevel(l.id)}
            style={level === l.id ? { background: l.pill, color: l.text } : {}}
          >
            <span className="m">{l.mark}</span>
            {l.label}
          </button>
        ))}
      </div>
      <div className="picker last">
        {TIMES.map((m) => (
          <button
            key={m}
            className={`pchip time ${minutes === m ? "on" : ""}`}
            onClick={() => setMinutes(m)}
          >
            {fmt(m)}
          </button>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="empty">
          <div className="big">Nothing here yet</div>
          <div className="sm">Add what matters most first.</div>
        </div>
      )}

      {LEVELS.map((l) => {
        const group = open.filter((t) => t.level === l.id);
        if (!group.length) return null;
        const isOpen = !collapsed[l.id];
        const groupMin = group.reduce((s, t) => s + (t.minutes || 0), 0);
        return (
          <div className="group" key={l.id}>
            <button
              className="ghead"
              style={{ background: l.pill, color: l.text }}
              onClick={() => setCollapsed((c) => ({ ...c, [l.id]: !c[l.id] }))}
            >
              <span className="m">{l.mark}</span>
              {l.label} ({group.length})
              <span className="tot">· {fmt(groupMin)}</span>
              <span className={`chev ${isOpen ? "up" : ""}`}>▾</span>
            </button>
            {isOpen && group.map((t) => <Row key={t.id} t={t} />)}
          </div>
        );
      })}

      {done.length > 0 && (
        <>
          <div className="donehead">Done ({done.length})</div>
          {done.map((t) => <Row key={t.id} t={t} />)}
        </>
      )}
    </div>
  );
}
