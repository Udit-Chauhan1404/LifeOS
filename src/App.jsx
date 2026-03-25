/**
 * LifeOS v5 — Professional, Fully Responsive, Deployable
 * Fixed: full-screen layout, all breakpoints, polish
 */

import { login, register, setToken } from './services/api'

import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";

/* ─── Fonts ─────────────────────────────────────────────────────────── */
const _fontLink = (() => {
  if (typeof document === "undefined") return;
  if (document.getElementById("los-gf")) return;
  const l = document.createElement("link");
  l.id   = "los-gf"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&display=swap";
  document.head.appendChild(l);
})();

/* ─── Design tokens ─────────────────────────────────────────────────── */
const THEMES = {
  dark: {
    id:"dark", emoji:"🌙", label:"Dark",
    bg:"#080C14", card:"#0D1120", cardAlt:"#111827",
    surface:"rgba(255,255,255,0.035)", surfaceHov:"rgba(255,255,255,0.065)",
    border:"rgba(255,255,255,0.07)", borderHov:"rgba(99,102,241,0.45)",
    popup:"#0E1325",
    text:"#E8ECFF", sub:"#8892B0", muted:"#4A5568",
    accent:"#6366F1", accentHi:"#818CF8", accentLo:"rgba(99,102,241,0.15)",
    green:"#10B981", red:"#F43F5E", amber:"#F59E0B", sky:"#38BDF8",
    pink:"#EC4899", purple:"#A855F7", teal:"#14B8A6",
    g1:"linear-gradient(135deg,#6366F1,#8B5CF6)",
    g2:"linear-gradient(135deg,#10B981,#059669)",
    g3:"linear-gradient(135deg,#F59E0B,#EF4444)",
    g4:"linear-gradient(135deg,#38BDF8,#6366F1)",
    g5:"linear-gradient(135deg,#EC4899,#8B5CF6)",
    sidebar:"#08090F", topbar:"rgba(8,12,20,0.92)",
    shadow:"0 20px 60px rgba(0,0,0,0.7)",
    glow:"rgba(99,102,241,0.2)",
  },
  light: {
    id:"light", emoji:"☀️", label:"Light",
    bg:"#F0F2FF", card:"#FFFFFF", cardAlt:"#F7F8FE",
    surface:"rgba(99,102,241,0.04)", surfaceHov:"rgba(99,102,241,0.09)",
    border:"rgba(99,102,241,0.12)", borderHov:"rgba(99,102,241,0.45)",
    popup:"#FFFFFF",
    text:"#0F172A", sub:"#475569", muted:"#94A3B8",
    accent:"#6366F1", accentHi:"#4F46E5", accentLo:"rgba(99,102,241,0.1)",
    green:"#059669", red:"#DC2626", amber:"#D97706", sky:"#0284C7",
    pink:"#DB2777", purple:"#7C3AED", teal:"#0D9488",
    g1:"linear-gradient(135deg,#6366F1,#8B5CF6)",
    g2:"linear-gradient(135deg,#10B981,#059669)",
    g3:"linear-gradient(135deg,#F59E0B,#EF4444)",
    g4:"linear-gradient(135deg,#38BDF8,#6366F1)",
    g5:"linear-gradient(135deg,#EC4899,#8B5CF6)",
    sidebar:"#FFFFFF", topbar:"rgba(240,242,255,0.95)",
    shadow:"0 8px 40px rgba(99,102,241,0.15)",
    glow:"rgba(99,102,241,0.12)",
  },
  neon: {
    id:"neon", emoji:"⚡", label:"Neon",
    bg:"#010208", card:"#050A12", cardAlt:"#070D18",
    surface:"rgba(0,255,163,0.03)", surfaceHov:"rgba(0,255,163,0.07)",
    border:"rgba(0,255,163,0.09)", borderHov:"rgba(0,255,163,0.4)",
    popup:"#060B15",
    text:"#C8FFF0", sub:"#4D8B72", muted:"#2D5244",
    accent:"#00FFA3", accentHi:"#00D4FF", accentLo:"rgba(0,255,163,0.12)",
    green:"#00FFA3", red:"#FF3366", amber:"#FFD700", sky:"#00D4FF",
    pink:"#FF00FF", purple:"#7B00FF", teal:"#00FFA3",
    g1:"linear-gradient(135deg,#00FFA3,#00D4FF)",
    g2:"linear-gradient(135deg,#00FFA3,#00B37A)",
    g3:"linear-gradient(135deg,#FFD700,#FF3366)",
    g4:"linear-gradient(135deg,#00D4FF,#7B00FF)",
    g5:"linear-gradient(135deg,#FF00FF,#7B00FF)",
    sidebar:"rgba(1,2,8,0.98)", topbar:"rgba(1,2,8,0.93)",
    shadow:"0 20px 60px rgba(0,0,0,0.9)",
    glow:"rgba(0,255,163,0.12)",
  },
};

/* ─── Global CSS ────────────────────────────────────────────────────── */
function injectCSS(t) {
  let el = document.getElementById("los-v5");
  if (!el) { el = document.createElement("style"); el.id = "los-v5"; document.head.appendChild(el); }
  el.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { height: 100%; font-size: 16px; }
    body { height: 100%; background: ${t.bg}; color: ${t.text}; font-family: 'Plus Jakarta Sans', sans-serif;
           -webkit-font-smoothing: antialiased; overflow: hidden; }
    #root { height: 100%; display: flex; flex-direction: column; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${t.accent}44; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: ${t.accent}88; }
    input, textarea, select, button { font-family: inherit; outline: none; border: none; background: none; color: inherit; }
    input::placeholder, textarea::placeholder { color: ${t.muted}; }
    button { cursor: pointer; }
    a { text-decoration: none; color: inherit; }
    /* Animations */
    @keyframes fadeUp    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn   { from { opacity:0; transform:scale(.93); } to { opacity:1; transform:scale(1); } }
    @keyframes slideIn   { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
    @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideUp   { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin      { to { transform: rotate(360deg); } }
    @keyframes pulse     { 0%,100%{ opacity:1; } 50%{ opacity:.35; } }
    @keyframes float     { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-8px); } }
    @keyframes glow      { 0%,100%{ box-shadow:0 0 18px ${t.accent}30; } 50%{ box-shadow:0 0 36px ${t.accent}66; } }
    @keyframes gradMove  { 0%{ background-position:0% 50%; } 50%{ background-position:100% 50%; } 100%{ background-position:0% 50%; } }
    @keyframes toastSlide{ from{ opacity:0; transform:translateX(110%); } to{ opacity:1; transform:translateX(0); } }
    @keyframes shimmer   { from{ background-position:-400px 0; } to{ background-position:400px 0; } }
    /* Utility */
    .pg   { animation: fadeUp .35s cubic-bezier(.16,1,.3,1) both; }
    .s1   { animation-delay: 40ms; }  .s2 { animation-delay: 80ms; }
    .s3   { animation-delay:120ms; }  .s4 { animation-delay:160ms; }
    .s5   { animation-delay:200ms; }  .s6 { animation-delay:240ms; }
    .lift { transition: transform .2s ease, box-shadow .2s ease; }
    .lift:hover { transform: translateY(-2px); box-shadow: ${t.shadow}; }
    .hover-card:hover { background: ${t.surfaceHov} !important; border-color: ${t.borderHov} !important; }
    .nav-btn { transition: all .15s ease; }
    .nav-btn:hover { color: ${t.text} !important; background: ${t.surface} !important; }
    .nav-btn.active { color: ${t.accentHi} !important; background: ${t.accentLo} !important; }
    .grad-text {
      background: linear-gradient(135deg, ${t.accent}, ${t.purple}, ${t.sky});
      background-size: 200%; animation: gradMove 5s ease infinite;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .hero-grad {
      background: linear-gradient(270deg, ${t.accent}, ${t.purple}, ${t.sky}, ${t.pink}, ${t.accent});
      background-size: 400%; animation: gradMove 7s ease infinite;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    input[type=range] { -webkit-appearance:none; height:4px; border-radius:99px; background:${t.border}; cursor:pointer; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:${t.accent}; box-shadow:0 0 8px ${t.accent}88; }
    .cmd-item:hover { background: ${t.surface} !important; }
    .cmd-item.sel  { background: ${t.accentLo} !important; border-color: ${t.borderHov} !important; }
    /* Responsive */
    @media (max-width: 768px) {
      .desktop-only { display: none !important; }
    }
    @media (min-width: 769px) {
      .mobile-only { display: none !important; }
    }
    @media (max-width: 480px) {
      .sm-hide { display: none !important; }
    }
  `;
}

/* ─── Context ───────────────────────────────────────────────────────── */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);
const useT   = () => THEMES[useApp().theme];

/* ─── Seed Data ─────────────────────────────────────────────────────── */
const SEED_TASKS = [
  {id:1,title:"Design onboarding flow",priority:"high",status:"todo",cat:"Work",due:"2025-08-10"},
  {id:2,title:"Integrate Stripe payments",priority:"high",status:"inprogress",cat:"Work",due:"2025-08-12"},
  {id:3,title:"Write Q3 OKRs",priority:"medium",status:"todo",cat:"Work",due:"2025-08-15"},
  {id:4,title:"Fix auth bug on mobile",priority:"high",status:"inprogress",cat:"Work",due:"2025-08-09"},
  {id:5,title:"Update API documentation",priority:"low",status:"done",cat:"Work",due:"2025-08-05"},
  {id:6,title:"Read Deep Work ch.8",priority:"medium",status:"done",cat:"Study",due:"2025-08-06"},
  {id:7,title:"5km morning run",priority:"medium",status:"todo",cat:"Health",due:"2025-08-10"},
  {id:8,title:"Review investment portfolio",priority:"low",status:"inprogress",cat:"Finance",due:"2025-08-11"},
];
const SEED_HABITS = [
  {id:1,name:"Morning Meditation",icon:"🧘",streak:14,color:"#6366F1",done:true, grid:[1,1,1,1,1,1,1,1,1,1,1,1,1,1]},
  {id:2,name:"Read 30 Minutes",icon:"📖",streak:8, color:"#F59E0B",done:false,grid:[1,0,1,1,1,1,1,1,0,1,1,1,1,0]},
  {id:3,name:"Workout",icon:"🏋️",streak:21,color:"#10B981",done:true, grid:[1,1,1,0,1,1,1,1,1,1,1,0,1,1]},
  {id:4,name:"Cold Shower",icon:"🚿",streak:5, color:"#38BDF8",done:false,grid:[0,0,1,1,1,1,1,0,0,1,1,1,1,1]},
  {id:5,name:"Journal",icon:"✍️",streak:3, color:"#EC4899",done:true, grid:[1,0,0,1,1,0,1,0,1,0,1,1,1,0]},
  {id:6,name:"No Sugar",icon:"🚫",streak:9, color:"#A855F7",done:true, grid:[1,1,1,1,1,1,1,1,1,0,0,1,1,1]},
];
const SEED_GOALS = [
  {id:1,title:"Launch LifeOS Beta",icon:"🚀",color:"#6366F1",progress:68,target:"Sep 2025",milestones:["Define MVP ✓","Design ✓","Backend ✓","Frontend →","QA","Launch"]},
  {id:2,title:"Reach $10k MRR",icon:"💰",color:"#10B981",progress:34,target:"Dec 2025",milestones:["First customer ✓","$1k ✓","$5k →","$10k"]},
  {id:3,title:"Run Half Marathon",icon:"🏃",color:"#F59E0B",progress:55,target:"Oct 2025",milestones:["5k ✓","10k ✓","15k →","21k"]},
  {id:4,title:"100 Build-in-Public Posts",icon:"🌟",color:"#EC4899",progress:22,target:"Dec 2025",milestones:["10 posts ✓","25 →","50","100"]},
];
const SEED_NOTES = [
  {id:1,title:"Product Roadmap",content:"- AI task suggestions\n- Collaborative workspaces\n- Mobile app\n- Integrations",tag:"Work",color:"#6366F1",pinned:true,updated:"2h ago"},
  {id:2,title:"Investor Call Notes",content:"• Traction metrics strong\n• Sharpen GTM strategy\n• Send deck by Friday",tag:"Work",color:"#10B981",pinned:false,updated:"Yesterday"},
  {id:3,title:"Deep Work — Key Ideas",content:"Focus without distraction is the new superpower. Schedule deep work blocks every morning.",tag:"Study",color:"#F59E0B",pinned:true,updated:"3d ago"},
  {id:4,title:"Weekly Review Template",content:"✅ Wins this week\n🔄 What to improve\n🎯 Top 3 next week",tag:"Personal",color:"#EC4899",pinned:false,updated:"5d ago"},
];
const SEED_EVENTS = [
  {id:1,title:"Team Standup",time:"09:00",date:"2025-08-10",color:"#6366F1",dur:"30min"},
  {id:2,title:"Product Review",time:"11:00",date:"2025-08-10",color:"#10B981",dur:"1h"},
  {id:3,title:"Investor Meeting",time:"14:00",date:"2025-08-11",color:"#F59E0B",dur:"45min"},
  {id:4,title:"Design Sprint",time:"10:00",date:"2025-08-14",color:"#EC4899",dur:"3h"},
  {id:5,title:"1:1 with CTO",time:"16:00",date:"2025-08-12",color:"#38BDF8",dur:"30min"},
];
const WEEKLY = [
  {day:"Mon",tasks:8, habits:5,score:72},{day:"Tue",tasks:12,habits:6,score:85},
  {day:"Wed",tasks:6, habits:4,score:63},{day:"Thu",tasks:15,habits:6,score:92},
  {day:"Fri",tasks:10,habits:5,score:78},{day:"Sat",tasks:4, habits:6,score:58},
  {day:"Sun",tasks:3, habits:5,score:45},
];
const ACHIEVEMENTS = [
  {id:1,icon:"🔥",title:"Week Warrior",desc:"7-day habit streak",done:true,xp:50},
  {id:2,icon:"⚡",title:"Speed Demon",desc:"10 tasks in one day",done:true,xp:100},
  {id:3,icon:"🎯",title:"Goal Crusher",desc:"75% on any goal",done:true,xp:150},
  {id:4,icon:"🧘",title:"Zen Master",desc:"14-day meditation",done:true,xp:200},
  {id:5,icon:"📚",title:"Bookworm",desc:"Read 30 days straight",done:false,xp:100},
  {id:6,icon:"🏆",title:"Iron Will",desc:"21-day workout streak",done:true,xp:300},
  {id:7,icon:"💎",title:"Diamond",desc:"Reach 2000 XP",done:false,xp:500},
  {id:8,icon:"🚀",title:"Launcher",desc:"Complete a major goal",done:false,xp:400},
];

/* ─── AI Response Engine ─────────────────────────────────────────────── */
const aiReply = (msg, tasks, habits, goals) => {
  const q = msg.toLowerCase().trim();
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const doneT = tasks.filter(t=>t.status==="done").length;
  const doneH = habits.filter(h=>h.done).length;
  const avgG  = Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length);

  if (/^(hi|hello|hey|howdy|sup|yo)\b/.test(q))
    return `${greet}! 👋 I'm **LifeOS AI** — your personal productivity coach.\n\nHere's what I can help you with:\n• 📋 Task prioritization & planning\n• ◎ Habit coaching & streak analysis\n• 🎯 Goal tracking & milestones\n• 🗓 Daily schedule creation\n• 📊 Productivity reports & insights\n\nWhat would you like to tackle today?`;
  if (/good morning/.test(q))
    return `${greet}! ☀️ Ready to build something great?\n\nYou have **${tasks.filter(t=>t.status!=="done").length} tasks** pending and **${habits.filter(h=>!h.done).length} habits** left today. Let's crush it! 🔥`;
  if (/good afternoon/.test(q))
    return `${greet}! 🌤 How's the day going?\n\nSo far you've completed **${doneT}** tasks. You're ${doneT > 3 ? "on a roll" : "just getting started"}. Keep pushing! 💪`;
  if (/good evening|good night/.test(q))
    return `${greet}! 🌙 Time to wind down and reflect.\n\nToday: **${doneT} tasks** done · **${doneH}/${habits.length} habits** complete.\n\nThat's solid work. Take 5 minutes to journal your wins before bed. 🎉`;
  if (/how are you|how.s it|what.s up/.test(q))
    return `Running at full capacity and ready to help you win! 💪\n\nYour current stats:\n• Task completion: **${Math.round((doneT/tasks.length)*100)}%**\n• Habits today: **${doneH}/${habits.length}**\n• Goal avg: **${avgG}%**\n\nShall I give you a full productivity analysis?`;
  if (/thank|thanks/.test(q))
    return `You're very welcome! 😊\n\nRemember: **consistency beats intensity** every time. Small daily wins compound into massive results. Keep going! 🚀`;
  if (/task|todo|work|prioriti/.test(q)) {
    const high = tasks.filter(t=>t.priority==="high"&&t.status!=="done");
    return `📋 **Task Analysis**\n\n${tasks.filter(t=>t.status!=="done").length} open tasks · ${doneT} done\n\n🔴 Top priority: **${high[0]?.title||"All high-priority done! 🎉"}**\n\n**My recommendation:** Apply the 2-minute rule — anything under 2 minutes, do it now. For the rest, batch similar tasks into focused work blocks for maximum efficiency.`;
  }
  if (/habit|streak|routine|daily/.test(q)) {
    const best = habits.reduce((a,b)=>a.streak>b.streak?a:b, habits[0]);
    return `◎ **Habit Report**\n\nBest streak: **${best?.name}** — ${best?.streak} days 🔥\nToday: **${doneH}/${habits.length}** complete\n\n**Science tip:** The "never miss twice" rule is more powerful than perfection. Miss once? Fine. Miss twice? That's when habits die. Protect your streaks!`;
  }
  if (/goal|target|milestone/.test(q)) {
    const top = goals.reduce((a,b)=>a.progress>b.progress?a:b, goals[0]);
    return `🎯 **Goal Tracker**\n\n${goals.map(g=>`${g.icon} ${g.title}: **${g.progress}%**`).join("\n")}\n\nClosest to finish: **${top.title}** at ${top.progress}%\n\n**Focus strategy:** Put 80% of your energy on the goal closest to completion. Finishing builds momentum for everything else.`;
  }
  if (/plan|schedule|today|day/.test(q))
    return `🗓 **Optimized Daily Plan**\n\n**9:00–11:00** Deep Work Block (hardest tasks)\n**11:00–11:15** Short break + quick wins\n**11:15–12:00** Reviews & communications\n**12:00–13:00** Lunch + walk\n**13:00–15:00** Creative / collaborative work\n**15:00–16:00** Meetings & calls\n**16:00–17:00** Admin + plan tomorrow\n**Evening** Habits + wind down\n\n**Key:** Guard your morning — it's peak brainpower time. 🧠`;
  if (/motivat|inspire|stuck|tired/.test(q))
    return `💪 **You've got this.**\n\nYou've maintained a **${Math.max(...habits.map(h=>h.streak))}**-day streak. That puts you in the top 5% of disciplined people.\n\nEvery pro was once a beginner. Every expert was once lost. The only difference between them and everyone else? **They didn't stop.**\n\n*"The secret of getting ahead is getting started."*\n\nPick ONE small task. Do it now. The momentum will follow. 🚀`;
  if (/analytic|stat|score|report|data/.test(q))
    return `📊 **Your Productivity Report**\n\nTask rate: **${Math.round((doneT/tasks.length)*100)}%** (${doneT}/${tasks.length})\nHabits today: **${doneH}/${habits.length}**\nStreak days total: **${habits.reduce((a,h)=>a+h.streak,0)}**\nAvg goal progress: **${avgG}%**\n\n${doneT/tasks.length > 0.7 ? "🔥 Top 20% productivity!" : "📈 Aim for 70%+ to unlock real momentum."}`;
  if (/weather|sport|movie|music|game|news|food|joke|politic/.test(q))
    return `I'm specialized as a **productivity & life coach** 🎯 — those topics are a bit outside my expertise!\n\nBut I can help you with:\n• 📋 Task management\n• ◎ Building winning habits\n• 🎯 Achieving your goals\n• 🗓 Planning your day\n\nWhat productivity challenge can I help you solve?`;
  return `✦ **Here's my take:**\n\nWith **${tasks.filter(t=>t.status!=="done").length}** open tasks, **${doneH}/${habits.length}** habits today, and goals at **${avgG}%** avg — you're building real momentum.\n\n**Top 3 right now:**\n1. ${tasks.find(t=>t.priority==="high"&&t.status!=="done")?.title||"Clear your high-priority tasks"}\n2. Complete your ${habits.filter(h=>!h.done).length} remaining habits\n3. Push your closest goal forward\n\nAnything specific I can dive deeper on? 🚀`;
};

/* ─── Base UI Helpers ────────────────────────────────────────────────── */
const card = (t, extra={}) => ({
  background: t.card, border: `1px solid ${t.border}`,
  borderRadius: 14, ...extra,
});
const popup = (t, extra={}) => ({
  background: t.popup, border: `1.5px solid ${t.borderHov}`,
  borderRadius: 14, boxShadow: t.shadow, ...extra,
});

/* ─── Button ─────────────────────────────────────────────────────────── */
function Btn({ children, onClick, variant="primary", size="md", icon, loading, disabled, style:s={}, full }) {
  const t = useT();
  const sizes = { sm:"7px 14px", md:"9px 20px", lg:"12px 28px" };
  const fs    = { sm:12, md:13.5, lg:15 };
  const isPrimary = variant === "primary";
  const isGhost   = variant === "ghost";
  const isDanger  = variant === "danger";
  return (
    <button disabled={disabled||loading} onClick={onClick} style={{
      display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
      padding: sizes[size], fontSize: fs[size], fontWeight: 600, borderRadius: 10,
      background: isPrimary ? t.g1 : isGhost ? "transparent" : isDanger ? `${t.red}18` : t.surface,
      border: isPrimary ? "none" : isGhost ? `1.5px solid ${t.borderHov}` : isDanger ? `1px solid ${t.red}44` : `1px solid ${t.border}`,
      color: isPrimary ? "#fff" : isDanger ? t.red : t.sub,
      boxShadow: isPrimary ? `0 4px 20px ${t.glow}` : "none",
      opacity: disabled ? .45 : 1, cursor: disabled ? "not-allowed" : "pointer",
      transition: "all .18s", width: full ? "100%" : undefined, ...s,
    }}
      onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.opacity=".82"; if(isPrimary) e.currentTarget.style.transform="translateY(-1px)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.opacity="1"; e.currentTarget.style.transform=""; }}
      onMouseDown={e=>{ if(!disabled) e.currentTarget.style.transform="scale(.97)"; }}
      onMouseUp={e=>{ e.currentTarget.style.transform=""; }}
    >
      {loading ? <span style={{width:13,height:13,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"spin .7s linear infinite",display:"inline-block"}}/> : children}
    </button>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────────── */
const Avatar = ({ name="U", size=36, style:s={} }) => {
  const t = useT();
  const ini = (name||"U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return <div style={{ width:size,height:size,borderRadius:"50%",background:t.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:700,color:"#fff",flexShrink:0,...s }}>{ini}</div>;
};

/* ─── Badge ──────────────────────────────────────────────────────────── */
const Badge = ({ color, bg, children, style:s={} }) => (
  <span style={{ display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:99,fontSize:11,fontWeight:600,color,background:bg,letterSpacing:.3,...s }}>{children}</span>
);

/* ─── Progress Bar ───────────────────────────────────────────────────── */
const PBar = ({ value=0, color, height=5 }) => {
  const t = useT();
  return (
    <div style={{width:"100%",height,background:t.border,borderRadius:99,overflow:"hidden"}}>
      <div style={{height:"100%",borderRadius:99,background:color||t.accent,width:`${Math.min(value,100)}%`,transition:"width 1.1s cubic-bezier(.4,0,.2,1)"}}/>
    </div>
  );
};

/* ─── Ring ───────────────────────────────────────────────────────────── */
const Ring = ({ pct=0, size=80, stroke=7, color, trackColor }) => {
  const t = useT();
  const r=(size-stroke*2)/2, c=2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor||`${t.accent}1A`} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color||t.accent} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c*(1-Math.min(pct,100)/100)} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
    </svg>
  );
};

/* ─── Stat Card ──────────────────────────────────────────────────────── */
function StatCard({ label, value, icon, gradient, delta, delay=0, onClick }) {
  const t = useT();
  return (
    <div onClick={onClick} className="lift pg" style={{ ...card(t,{padding:"18px 20px",position:"relative",overflow:"hidden",animationDelay:`${delay}ms`,cursor:onClick?"pointer":"default"}) }}>
      <div style={{position:"absolute",top:-18,right:-14,fontSize:64,opacity:.045,lineHeight:1,pointerEvents:"none"}}>{icon}</div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
        <div style={{width:38,height:38,borderRadius:11,background:gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{icon}</div>
        {delta!=null && <Badge color={delta>=0?t.green:t.red} bg={delta>=0?`${t.green}18`:`${t.red}18`}>{delta>=0?"↑":"↓"}{Math.abs(delta)}%</Badge>}
      </div>
      <div style={{fontSize:26,fontWeight:800,fontFamily:"'Bricolage Grotesque',sans-serif",lineHeight:1,marginBottom:4}}>{value}</div>
      <div style={{fontSize:12,color:t.sub,fontWeight:500}}>{label}</div>
    </div>
  );
}

/* ─── Toast System ───────────────────────────────────────────────────── */
function ToastContainer({ toasts, remove }) {
  const t = useT();
  const cfg = { success:{c:t.green,sym:"✓"}, error:{c:t.red,sym:"✕"}, info:{c:t.accent,sym:"ℹ"}, warning:{c:t.amber,sym:"⚠"} };
  return (
    <div style={{position:"fixed",bottom:20,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,maxWidth:340,width:"calc(100vw - 32px)"}}>
      {toasts.map(tt => {
        const s = cfg[tt.type]||cfg.info;
        return (
          <div key={tt.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:13,background:t.popup,border:`1px solid ${s.c}44`,boxShadow:t.shadow,animation:"toastSlide .3s cubic-bezier(.34,1.56,.64,1)"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:`${s.c}18`,display:"flex",alignItems:"center",justifyContent:"center",color:s.c,fontWeight:700,fontSize:12,flexShrink:0}}>{s.sym}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{tt.title}</div>{tt.msg&&<div style={{fontSize:11,color:t.sub,marginTop:1}}>{tt.msg}</div>}</div>
            <button onClick={()=>remove(tt.id)} style={{color:t.muted,fontSize:14}}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Command Palette ────────────────────────────────────────────────── */
const CMD_ITEMS = [
  {id:"dashboard",icon:"⊞",label:"Dashboard",sub:"Overview & stats"},
  {id:"tasks",icon:"✓",label:"Tasks",sub:"Kanban board"},
  {id:"habits",icon:"◎",label:"Habits",sub:"Daily tracker"},
  {id:"goals",icon:"◈",label:"Goals",sub:"Milestones"},
  {id:"notes",icon:"≡",label:"Notes",sub:"Knowledge base"},
  {id:"calendar",icon:"▦",label:"Calendar",sub:"Events & schedule"},
  {id:"analytics",icon:"↗",label:"Analytics",sub:"Performance charts"},
  {id:"focus",icon:"⏱",label:"Focus Mode",sub:"Pomodoro timer"},
  {id:"wellness",icon:"💚",label:"Wellness",sub:"Health tracking"},
  {id:"achievements",icon:"🏆",label:"Achievements",sub:"XP & badges"},
  {id:"ai",icon:"✦",label:"AI Assistant",sub:"Productivity coach"},
  {id:"settings",icon:"⚙",label:"Settings",sub:"Preferences"},
];
function CmdPalette({ open, close, nav }) {
  const t = useT();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inp = useRef(null);
  const items = useMemo(()=>CMD_ITEMS.filter(c=>c.label.toLowerCase().includes(q.toLowerCase())||c.sub.toLowerCase().includes(q.toLowerCase())),[q]);
  useEffect(()=>{ if(open){setQ("");setSel(0);setTimeout(()=>inp.current?.focus(),50);} },[open]);
  useEffect(()=>{
    if(!open) return;
    const h = e=>{
      if(e.key==="Escape") close();
      if(e.key==="ArrowDown"){e.preventDefault();setSel(s=>Math.min(s+1,items.length-1));}
      if(e.key==="ArrowUp"){e.preventDefault();setSel(s=>Math.max(s-1,0));}
      if(e.key==="Enter"&&items[sel]){nav(items[sel].id);close();}
    };
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h);
  },[open,items,sel]);
  if(!open) return null;
  return (
    <div onClick={close} style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"12vh",paddingLeft:16,paddingRight:16,animation:"fadeIn .15s"}}>
      <div onClick={e=>e.stopPropagation()} style={{...popup(t),width:"100%",maxWidth:520,maxHeight:"68vh",display:"flex",flexDirection:"column",overflow:"hidden",animation:"scaleIn .18s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderBottom:`1px solid ${t.border}`}}>
          <span style={{fontSize:16,color:t.muted}}>⌕</span>
          <input ref={inp} value={q} onChange={e=>{setQ(e.target.value);setSel(0);}} placeholder="Search pages & actions…" style={{flex:1,fontSize:14,color:t.text}}/>
          <kbd style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:5,padding:"2px 8px",fontSize:10,color:t.muted}}>ESC</kbd>
        </div>
        <div style={{overflowY:"auto",padding:"6px"}}>
          {items.length===0 ? <div style={{textAlign:"center",padding:28,color:t.muted,fontSize:13}}>No results for "{q}"</div>
          : items.map((item,i)=>(
            <button key={item.id} className={`cmd-item ${i===sel?"sel":""}`} onClick={()=>{nav(item.id);close();}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:9,border:`1px solid transparent`,textAlign:"left",transition:"all .1s",cursor:"pointer"}}>
              <span style={{width:30,height:30,borderRadius:8,background:t.surface,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{item.icon}</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{item.label}</div><div style={{fontSize:11,color:t.sub}}>{item.sub}</div></div>
              <span style={{fontSize:10,color:t.muted}}>↵</span>
            </button>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${t.border}`,padding:"8px 16px",display:"flex",gap:12,fontSize:10,color:t.muted}}>
          <span>↑↓ navigate</span><span>↵ open</span><span style={{marginLeft:"auto",color:t.accent}}>⌘K</span>
        </div>
      </div>
    </div>
  );
}

/* ─── LANDING PAGE ───────────────────────────────────────────────────── */
const FEATURES = [
  {i:"✓",  t:"Smart Kanban",    d:"Drag-and-drop board with AI task prioritization.",c:"#6366F1"},
  {i:"◎",  t:"Habit Streaks",   d:"Visual 14-day grid to build unbreakable routines.",c:"#10B981"},
  {i:"◈",  t:"Goal Milestones", d:"Break goals into steps and track daily progress.",c:"#F59E0B"},
  {i:"⏱",  t:"Focus Pomodoro",  d:"25-min deep work sessions with smart scheduling.",c:"#38BDF8"},
  {i:"💚",  t:"Wellness Hub",    d:"Mood, sleep, water, energy — all in one view.",c:"#EC4899"},
  {i:"✦",  t:"AI Coaching",     d:"Context-aware productivity insights via OpenAI.",c:"#A855F7"},
  {i:"↗",  t:"Analytics",       d:"Beautiful charts revealing your real patterns.",c:"#14B8A6"},
  {i:"🏆", t:"Achievements",    d:"XP system and badges to keep you motivated.",c:"#F59E0B"},
];
const PLANS = [
  {name:"Free",    price:"$0",  period:"forever", c:"#6B7280", features:["20 tasks","3 habits","2 goals","Basic analytics","10 AI/day"], main:false},
  {name:"Pro",     price:"$9",  period:"/month",  c:"#6366F1", features:["Unlimited everything","50 AI/day","Pomodoro & wellness","Analytics pro","Priority support"], main:true},
  {name:"Team",    price:"$29", period:"/month",  c:"#10B981", features:["Everything in Pro","Team workspaces","Real-time collab","200 AI/day","Slack & GitHub sync"], main:false},
];

function Landing({ onAuth }) {
  const t = useT(); const { theme, setTheme } = useApp();
  const [mode, setMode] = useState(null);
  const featRef = useRef(); const priceRef = useRef();
  const scrollTo = r => r.current?.scrollIntoView({ behavior:"smooth", block:"start" });
  const themes = ["dark","light","neon"];
  if(mode==="login"||mode==="signup") return <AuthPage mode={mode} setMode={setMode} onAuth={onAuth}/>;

  return (
    <div style={{width:"100%",minHeight:"100vh",background:t.bg,overflowX:"hidden",overflowY:"auto"}}>
      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,height:64,display:"flex",alignItems:"center",padding:"0 max(24px, 4%)",background:t.topbar,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:`1px solid ${t.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginRight:32,flexShrink:0}}>
          <div style={{width:34,height:34,borderRadius:10,background:t.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,animation:"glow 3s infinite"}}>⬡</div>
          <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:19,background:t.g1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>LifeOS</span>
        </div>
        <div className="sm-hide" style={{display:"flex",gap:2}}>
          {[["Features",()=>scrollTo(featRef)],["Pricing",()=>scrollTo(priceRef)],["About",()=>{}]].map(([lbl,fn])=>(
            <button key={lbl} className="nav-btn" onClick={fn} style={{padding:"6px 14px",borderRadius:9,fontSize:13.5,color:t.sub,fontWeight:500}}>{lbl}</button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setTheme(themes[(themes.indexOf(theme)+1)%themes.length])} style={{width:34,height:34,borderRadius:9,...card(t,{display:"flex",alignItems:"center",justifyContent:"center",fontSize:15})}}>{THEMES[theme].emoji}</button>
          <button className="sm-hide" onClick={()=>setMode("login")} style={{padding:"7px 16px",borderRadius:9,fontSize:13,color:t.sub,fontWeight:500}}>Sign in</button>
          <Btn onClick={()=>setMode("signup")} size="sm">Get started →</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section style={{padding:"clamp(60px,10vh,110px) max(24px,5%) 80px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-160,left:"50%",transform:"translateX(-50%)",width:"min(800px,140vw)",height:600,borderRadius:"50%",background:`radial-gradient(circle,${t.glow},transparent 70%)`,filter:"blur(70px)",pointerEvents:"none"}}/>
        {t.id==="neon" && <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 1px 1px,${t.accent}06 1px,transparent 0)`,backgroundSize:"42px 42px",pointerEvents:"none"}}/>}
        <div className="pg" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:99,background:t.accentLo,border:`1px solid ${t.borderHov}`,fontSize:12,fontWeight:600,color:t.accentHi,marginBottom:24}}>
          ✦ LifeOS 2.0 — AI-powered productivity
        </div>
        <h1 className="pg s1" style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(36px,6.5vw,74px)",fontWeight:800,lineHeight:1.06,marginBottom:22,maxWidth:760,margin:"0 auto 22px"}}>
          The Operating System<br/><span className="hero-grad">for Your Entire Life</span>
        </h1>
        <p className="pg s2" style={{fontSize:"clamp(15px,2vw,18px)",color:t.sub,maxWidth:500,margin:"0 auto 38px",lineHeight:1.75}}>
          Tasks, habits, goals, wellness and AI coaching — unified in one beautiful, intelligent dashboard built for high-performers.
        </p>
        <div className="pg s3" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:60}}>
          <Btn onClick={()=>setMode("signup")} size="lg">Start free — no credit card</Btn>
          <Btn onClick={()=>setMode("login")} variant="ghost" size="lg">Sign in →</Btn>
        </div>

        {/* Dashboard preview */}
        <div className="pg s4" style={{maxWidth:860,margin:"0 auto",borderRadius:20,border:`1px solid ${t.borderHov}`,background:t.card,boxShadow:t.shadow,overflow:"hidden",animation:"float 6s ease-in-out infinite"}}>
          <div style={{height:38,background:t.cardAlt,borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",padding:"0 14px",gap:7}}>
            {["#F43F5E","#F59E0B","#10B981"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
            <div style={{flex:1,display:"flex",justifyContent:"center"}}><div style={{...card(t,{padding:"3px 14px",fontSize:10,color:t.sub,borderRadius:6})}}>app.lifeos.io/dashboard</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:10,padding:12,height:200}}>
            <div style={{...card(t,{padding:"10px 8px"})}}>
              {["⊞ Dashboard","✓ Tasks","◎ Habits","◈ Goals","≡ Notes"].map((n,i)=>(
                <div key={i} style={{padding:"7px 9px",borderRadius:7,marginBottom:3,background:i===0?t.accentLo:"transparent",color:i===0?t.accentHi:t.sub,fontSize:11.5,fontWeight:i===0?600:400}}>{n}</div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8}}>
              {[{l:"Tasks Done",v:"5/8",g:t.g1,i:"✓"},{l:"Habit Streak",v:"21d",g:t.g2,i:"🔥"},{l:"Goal Progress",v:"68%",g:t.g3,i:"◈"},{l:"Prod. Score",v:"84",g:t.g4,i:"⚡"}].map((s,i)=>(
                <div key={i} style={{...card(t,{padding:10,display:"flex",alignItems:"center",gap:8})}}>
                  <div style={{width:28,height:28,borderRadius:8,background:s.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{s.i}</div>
                  <div><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:16,fontWeight:800,lineHeight:1}}>{s.v}</div><div style={{fontSize:9.5,color:t.sub}}>{s.l}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:"relative",height:0}}>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:44,background:`linear-gradient(to top,${t.card},transparent)`,pointerEvents:"none"}}/>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{borderTop:`1px solid ${t.border}`,borderBottom:`1px solid ${t.border}`,padding:"26px max(24px,5%)",display:"flex",justifyContent:"center",gap:"clamp(28px,7vw,90px)",flexWrap:"wrap"}}>
        {[{v:"50k+",l:"Active users"},{v:"4.9★",l:"Avg. rating"},{v:"2.3M",l:"Tasks completed"},{v:"98%",l:"Retention"}].map((s,i)=>(
          <div key={i} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(24px,4vw,32px)",fontWeight:800,background:t.g1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.v}</div>
            <div style={{fontSize:12,color:t.sub,marginTop:3}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section ref={featRef} style={{padding:"80px max(24px,5%)",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:t.accent,marginBottom:10,textTransform:"uppercase"}}>Everything you need</div>
        <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(26px,4vw,44px)",fontWeight:800,marginBottom:12}}>Built for the ambitious</h2>
        <p style={{fontSize:15,color:t.sub,maxWidth:440,margin:"0 auto 50px",lineHeight:1.75}}>A complete system to ship more, stress less, and grow every single day.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14,maxWidth:980,margin:"0 auto"}}>
          {FEATURES.map((f,i)=>(
            <div key={i} className="lift hover-card" style={{...card(t,{padding:22,textAlign:"left",transition:"all .2s"})}}>
              <div style={{width:44,height:44,borderRadius:12,background:`${f.c}18`,border:`1px solid ${f.c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14}}>{f.i}</div>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14.5,marginBottom:7}}>{f.t}</div>
              <div style={{fontSize:13,color:t.sub,lineHeight:1.65}}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section ref={priceRef} style={{padding:"80px max(24px,5%)",background:t.cardAlt,textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:t.accent,marginBottom:10,textTransform:"uppercase"}}>Simple pricing</div>
        <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(26px,4vw,44px)",fontWeight:800,marginBottom:12}}>Start free, scale up</h2>
        <p style={{fontSize:15,color:t.sub,maxWidth:380,margin:"0 auto 50px",lineHeight:1.7}}>No hidden fees. Cancel anytime. Upgrade when you're ready.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16,maxWidth:880,margin:"0 auto"}}>
          {PLANS.map((p,i)=>(
            <div key={i} className="lift" style={{...card(t,{padding:30,border:`${p.main?2:1}px solid ${p.main?p.c:t.border}`,background:p.main?t.accentLo:t.card,position:"relative"})}}>
              {p.main && <div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:t.g1,borderRadius:99,padding:"4px 16px",fontSize:11.5,fontWeight:700,color:"#fff",whiteSpace:"nowrap",boxShadow:"0 4px 12px rgba(99,102,241,.4)"}}>⭐ Most Popular</div>}
              <div style={{fontSize:24,marginBottom:10}}>{i===0?"🎁":i===1?"⚡":"👥"}</div>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:20,marginBottom:8}}>{p.name}</div>
              <div style={{marginBottom:22,display:"flex",alignItems:"baseline",justifyContent:"center",gap:2}}>
                <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:40,fontWeight:800,color:p.main?t.accentHi:t.text}}>{p.price}</span>
                <span style={{fontSize:13,color:t.sub}}>{p.period}</span>
              </div>
              <div style={{marginBottom:24}}>
                {p.features.map((f,fi)=>(
                  <div key={fi} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:10,textAlign:"left"}}>
                    <span style={{color:t.green,fontWeight:700,fontSize:14,flexShrink:0,marginTop:1}}>✓</span>
                    <span style={{fontSize:13,color:t.sub,lineHeight:1.5}}>{f}</span>
                  </div>
                ))}
              </div>
              <Btn full onClick={()=>setMode("signup")} variant={p.main?"primary":"ghost"} size="md" style={{justifyContent:"center",padding:"11px"}}>{p.name==="Free"?"Get started":p.name==="Pro"?"Start Pro":"Start Team"}</Btn>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"80px max(24px,5%)",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(700px,100vw)",height:320,borderRadius:"50%",background:`radial-gradient(ellipse,${t.glow},transparent 70%)`,filter:"blur(60px)",pointerEvents:"none"}}/>
        <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(26px,4.5vw,50px)",fontWeight:800,marginBottom:14,position:"relative"}}>Ready to level up your life?</h2>
        <p style={{fontSize:15,color:t.sub,maxWidth:380,margin:"0 auto 34px",position:"relative"}}>Join 50,000+ high-performers who use LifeOS every day.</p>
        <Btn onClick={()=>setMode("signup")} size="lg" style={{position:"relative"}}>Start for free today →</Btn>
      </section>

      {/* Footer */}
      <footer style={{borderTop:`1px solid ${t.border}`,padding:"22px max(24px,5%)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:26,height:26,borderRadius:7,background:t.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>⬡</div>
          <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14}}>LifeOS</span>
        </div>
        <div style={{fontSize:12,color:t.muted}}>© 2025 LifeOS Inc. All rights reserved.</div>
        <div style={{display:"flex",gap:16,fontSize:12}}>
          {["Privacy","Terms","Twitter","GitHub"].map(l=><span key={l} style={{color:t.sub,cursor:"pointer"}}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
}

/* ─── AUTH PAGE ──────────────────────────────────────────────────────── */
// ⚠️ AuthInput MUST be outside AuthPage to prevent remount on each keystroke
const AuthInput = ({ label, field, type="text", placeholder, form, setForm, errors, showPw, togglePw }) => {
  const t = useT();
  const isPass = type === "password";
  const err = errors[field];
  return (
    <div style={{marginBottom:14}}>
      <label style={{fontSize:11.5,fontWeight:600,color:t.sub,display:"block",marginBottom:6,letterSpacing:.5}}>{label}</label>
      <div style={{position:"relative"}}>
        <input
          type={isPass && showPw ? "text" : type}
          value={form[field]}
          onChange={e => setForm(p => ({...p, [field]: e.target.value}))}
          placeholder={placeholder}
          autoComplete={field === "email" ? "email" : isPass ? "current-password" : "off"}
          style={{width:"100%",padding:`10px ${isPass?"42px":12}px 10px 12px`,borderRadius:10,background:t.surface,border:`1.5px solid ${err?t.red:t.border}`,fontSize:13.5,color:t.text,transition:"border-color .2s"}}
          onFocus={e=>e.target.style.borderColor=err?t.red:t.accent}
          onBlur={e=>e.target.style.borderColor=err?t.red:t.border}
        />
        {isPass && <button type="button" onClick={togglePw} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",fontSize:15,color:t.muted}}>{showPw?"🙈":"👁"}</button>}
      </div>
      {err && <div style={{fontSize:11,color:t.red,marginTop:4}}>⚠ {err}</div>}
    </div>
  );
};

function AuthPage({ mode, setMode, onAuth }) {
  const t = useT();
  const isLogin = mode === "login";
  const [form, setForm]   = useState({name:"",email:"",password:"",confirm:""});
  const [errors, setErr]  = useState({});
  const [loading, setLd]  = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@"))     e.email = "Enter a valid email";
    if (form.password.length < 6)      e.password = "Minimum 6 characters";
    if (!isLogin && form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };
const submit = async () => {
  const e = validate()
  setErr(e)
  if (Object.keys(e).length) return
  setLd(true)
  try {
    const url = isLogin
      ? 'https://lifeos-backend.onrender.com/api/auth/login'
      : 'https://lifeos-backend.onrender.com/api/auth/register'

    const body = isLogin
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password }

    const res  = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()

    if (!data.success) {
      setErr({ email: data.message })
      return
    }

    // Save token to localStorage
    localStorage.setItem('accessToken', data.data.accessToken)
    localStorage.setItem('refreshToken', data.data.refreshToken)
    onAuth(data.data.user)

  } catch (err) {
    setErr({ email: 'Cannot connect to server. Make sure backend is running.' })
  } finally {
    setLd(false)
  }
}

  return (
    <div style={{width:"100%",height:"100%",minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-150,left:-100,width:"min(500px,80vw)",height:500,borderRadius:"50%",background:`radial-gradient(circle,${t.glow},transparent 70%)`,filter:"blur(60px)"}}/>
      <div style={{position:"absolute",bottom:-80,right:-80,width:"min(400px,60vw)",height:400,borderRadius:"50%",background:`radial-gradient(circle,${t.glow},transparent 70%)`,filter:"blur(60px)"}}/>
      <div style={{width:"100%",maxWidth:420,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:50,height:50,borderRadius:14,background:t.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 14px",animation:"glow 3s infinite"}}>⬡</div>
          <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:22,marginBottom:6}}>{isLogin?"Welcome back":"Create your account"}</h2>
          <p style={{fontSize:13.5,color:t.sub}}>{isLogin?"Log in to your LifeOS workspace":"Start your productivity journey today"}</p>
        </div>
        <div style={{...popup(t,{padding:28})}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:20}}>
            {["🔍 Google","🐙 GitHub"].map(s=>(
              <button key={s} onClick={submit} style={{padding:"9px",borderRadius:9,fontSize:13,fontWeight:600,...card(t,{}),transition:"border-color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>{s}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{flex:1,height:1,background:t.border}}/><span style={{fontSize:11,color:t.muted,whiteSpace:"nowrap"}}>or with email</span><div style={{flex:1,height:1,background:t.border}}/>
          </div>
          {!isLogin && <AuthInput label="FULL NAME" field="name" placeholder="Alex Chen" form={form} setForm={setForm} errors={errors} showPw={showPw} togglePw={()=>setShowPw(v=>!v)}/>}
          <AuthInput label="EMAIL" field="email" type="email" placeholder="you@example.com" form={form} setForm={setForm} errors={errors} showPw={showPw} togglePw={()=>setShowPw(v=>!v)}/>
          <AuthInput label="PASSWORD" field="password" type="password" placeholder={isLogin?"Your password":"At least 6 characters"} form={form} setForm={setForm} errors={errors} showPw={showPw} togglePw={()=>setShowPw(v=>!v)}/>
          {!isLogin && <AuthInput label="CONFIRM PASSWORD" field="confirm" type="password" placeholder="Repeat password" form={form} setForm={setForm} errors={errors} showPw={showPw} togglePw={()=>setShowPw(v=>!v)}/>}
          {isLogin && <div style={{textAlign:"right",marginBottom:12,marginTop:-4}}><button style={{fontSize:12,color:t.accent,fontWeight:600}}>Forgot password?</button></div>}
          <Btn onClick={submit} loading={loading} full size="md" style={{padding:"12px",marginBottom:16,justifyContent:"center"}}>{isLogin?"Sign in to LifeOS →":"Create free account →"}</Btn>
          <div style={{textAlign:"center",fontSize:13,color:t.sub}}>
            {isLogin?"No account? ":"Have an account? "}
            <button onClick={()=>{setMode(isLogin?"signup":"login");setErr({});setForm({name:"",email:"",password:"",confirm:""}); }} style={{color:t.accent,fontWeight:700}}>{isLogin?"Sign up free":"Sign in"}</button>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:14}}>
          <button onClick={()=>setMode(null)} style={{fontSize:12,color:t.muted}}>← Back to home</button>
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────── */
const NAV = [
  {id:"dashboard",icon:"⊞",label:"Dashboard"},
  {id:"tasks",icon:"✓",label:"Tasks"},
  {id:"habits",icon:"◎",label:"Habits"},
  {id:"goals",icon:"◈",label:"Goals"},
  {id:"notes",icon:"≡",label:"Notes"},
  {id:"calendar",icon:"▦",label:"Calendar"},
  {id:"analytics",icon:"↗",label:"Analytics"},
  {id:"focus",icon:"⏱",label:"Focus"},
  {id:"wellness",icon:"💚",label:"Wellness"},
  {id:"achievements",icon:"🏆",label:"Achievements"},
  {id:"ai",icon:"✦",label:"AI Assistant"},
  {id:"settings",icon:"⚙",label:"Settings"},
];

function Sidebar({ active, nav, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const t = useT();
  const { tasks, user } = useApp();
  const pending = tasks.filter(x=>x.status!=="done").length;

  const SidebarInner = ({ showClose }) => (
    <>
      <div style={{padding:"14px 10px 12px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
        <div style={{width:32,height:32,borderRadius:9,background:t.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,animation:"glow 3s infinite"}}>⬡</div>
        {!collapsed && <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:17,background:t.g1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",whiteSpace:"nowrap"}}>LifeOS</span>}
        {showClose && <button onClick={()=>setMobileOpen(false)} style={{marginLeft:"auto",fontSize:17,color:t.sub}}>✕</button>}
      </div>
      <nav style={{flex:1,padding:"8px 6px",overflowY:"auto",display:"flex",flexDirection:"column",gap:1}}>
        {NAV.map(n => {
          const on = active===n.id;
          return (
            <button key={n.id} className={`nav-btn ${on?"active":""}`} onClick={()=>{nav(n.id);setMobileOpen(false);}} title={collapsed?n.label:""} style={{display:"flex",alignItems:"center",gap:9,padding:collapsed?"10px 0":"9px 10px",justifyContent:collapsed?"center":"flex-start",borderRadius:10,border:`1px solid ${on?t.borderHov:"transparent"}`,fontWeight:on?600:400,fontSize:13,width:"100%",position:"relative",color:on?t.accentHi:t.sub}}>
              {on && <div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:14,background:t.accent,borderRadius:"0 99px 99px 0"}}/>}
              <span style={{fontSize:15,flexShrink:0}}>{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
              {n.id==="tasks"&&pending>0&&!collapsed && <span style={{marginLeft:"auto",fontSize:10,padding:"1px 6px",borderRadius:99,background:t.accent,color:"#fff",fontWeight:700}}>{pending}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"8px 6px 12px",flexShrink:0}}>
        <div style={{...card(t,{padding:"9px",display:"flex",alignItems:"center",gap:8,borderRadius:10,marginBottom:6})}}>
          <Avatar name={user?.name||"U"} size={28}/>
          {!collapsed && <div style={{flex:1,overflow:"hidden"}}><div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.name||"User"}</div><div style={{fontSize:10,color:t.accent,fontWeight:600}}>Pro ✦</div></div>}
        </div>
        <button className="desktop-only" onClick={()=>setCollapsed(c=>!c)} style={{width:"100%",padding:"6px",borderRadius:9,...card(t,{}),fontSize:12,color:t.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>{collapsed?"→":"← Collapse"}</button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="desktop-only" style={{width:collapsed?60:222,flexShrink:0,height:"100vh",background:t.sidebar,borderRight:`1px solid ${t.border}`,display:"flex",flexDirection:"column",transition:"width .28s cubic-bezier(.4,0,.2,1)",overflow:"hidden"}}>
        <SidebarInner showClose={false}/>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
          <div onClick={()=>setMobileOpen(false)} style={{flex:1,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)"}}/>
          <aside style={{width:260,height:"100%",background:t.sidebar,borderLeft:`1px solid ${t.border}`,display:"flex",flexDirection:"column",animation:"slideIn .22s ease"}}>
            <SidebarInner showClose={true}/>
          </aside>
        </div>
      )}
    </>
  );
}

/* ─── TOPBAR ─────────────────────────────────────────────────────────── */
const PAGE_INFO = { dashboard:"Dashboard",tasks:"Tasks",habits:"Habits",goals:"Goals",notes:"Notes",calendar:"Calendar",analytics:"Analytics",focus:"Focus Mode",wellness:"Wellness",achievements:"Achievements",ai:"AI Assistant",settings:"Settings" };

/**
 * FixedDropdown — renders the dropdown with position:fixed so it always
 * escapes any parent stacking context (backdropFilter, transform, etc.)
 * anchorRef: ref to the trigger button
 * align: "right" | "left"
 */
function FixedDropdown({ anchorRef, open, children, width = 320, align = "right" }) {
  const t = useT();
  const [pos, setPos] = useState({ top: 0, right: 0, left: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const dropW = typeof width === "number" ? width : 320;
    const top   = rect.bottom + 8;
    if (align === "right") {
      const right = window.innerWidth - rect.right;
      // Clamp so it doesn't go off left edge
      const left = Math.max(8, rect.right - dropW);
      setPos({ top, right: Math.max(8, right), left: undefined });
    } else {
      setPos({ top, left: Math.max(8, rect.left), right: undefined });
    }
  }, [open]);

  if (!open) return null;
  const dropW = typeof width === "number" ? Math.min(width, window.innerWidth - 16) : width;

  return (
    <div style={{
      position:"fixed",
      top: pos.top,
      right: align === "right" ? pos.right : undefined,
      left: align === "left"  ? pos.left  : undefined,
      width: dropW,
      zIndex: 99999,
      animation: "slideDown .18s cubic-bezier(.16,1,.3,1)",
      ...popup(t, {}),
    }}>
      {children}
    </div>
  );
}

function Topbar({ page, setMobileOpen }) {
  const t = useT();
  const { setCmd, theme, setTheme, toast, user, logout } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profOpen,  setProfOpen]  = useState(false);
  const [notifs, setNotifs] = useState([
    {id:1,text:"🔥 21-day workout streak!",time:"5m"},
    {id:2,text:"⚠ 3 tasks due today",time:"1h"},
    {id:3,text:"💡 Meditation not done",time:"2h"},
    {id:4,text:"🎯 Goal 'LifeOS' hit 68%",time:"3h"},
  ]);
  const nBtnRef = useRef();
  const pBtnRef = useRef();
  const themes  = ["dark","light","neon"];

  // Close on outside click
  useEffect(() => {
    const h = e => {
      if (notifOpen && nBtnRef.current && !nBtnRef.current.contains(e.target)) {
        // Don't close if clicking inside the dropdown itself — check via class
        const drop = document.getElementById("los-notif-drop");
        if (drop && drop.contains(e.target)) return;
        setNotifOpen(false);
      }
      if (profOpen && pBtnRef.current && !pBtnRef.current.contains(e.target)) {
        const drop = document.getElementById("los-prof-drop");
        if (drop && drop.contains(e.target)) return;
        setProfOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [notifOpen, profOpen]);

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === "Escape") { setNotifOpen(false); setProfOpen(false); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <>
      <header style={{
        height: 58, padding: "0 16px 0 14px",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: `1px solid ${t.border}`,
        background: t.topbar,
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        flexShrink: 0,
        /* NO overflow:hidden, NO position that traps children */
        position: "relative", zIndex: 50,
      }}>
        {/* Mobile hamburger */}
        <button className="mobile-only" onClick={()=>setMobileOpen(true)} style={{width:34,height:34,borderRadius:9,...card(t,{display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0})}}>☰</button>

        <div style={{flex:1,minWidth:0}}>
          <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(15px,2.5vw,17px)",fontWeight:800,lineHeight:1}}>{PAGE_INFO[page]}</h1>
          <p style={{fontSize:10,color:t.muted,lineHeight:1,marginTop:2}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</p>
        </div>

        {/* Search */}
        <button className="sm-hide" onClick={()=>setCmd(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:99,...card(t,{}),color:t.muted,fontSize:12.5,width:160,flexShrink:0}}>
          <span>⌕</span><span style={{flex:1,textAlign:"left"}}>Search…</span>
          <kbd style={{fontSize:9,padding:"1px 5px",borderRadius:4,background:t.cardAlt,border:`1px solid ${t.border}`}}>⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <button onClick={()=>setTheme(themes[(themes.indexOf(theme)+1)%themes.length])} style={{width:34,height:34,borderRadius:9,...card(t,{display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0})}}>{THEMES[theme].emoji}</button>

        {/* Notifications trigger */}
        <button ref={nBtnRef} onClick={()=>{setNotifOpen(o=>!o);setProfOpen(false);}} style={{width:34,height:34,borderRadius:9,...card(t,{display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,position:"relative"})}}>
          🔔
          {notifs.length>0 && <div style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:t.red,border:`2px solid ${t.bg}`}}/>}
        </button>

        {/* Profile trigger */}
        <button ref={pBtnRef} onClick={()=>{setProfOpen(o=>!o);setNotifOpen(false);}}>
          <Avatar name={user?.name||"U"} size={32}/>
        </button>
      </header>

      {/* ── Notification dropdown — rendered via FixedDropdown (position:fixed) ── */}
      <FixedDropdown anchorRef={nBtnRef} open={notifOpen} width={320} align="right">
        <div id="los-notif-drop">
          <div style={{padding:"11px 16px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:13}}>Notifications</span>
            <button onClick={()=>{setNotifs([]);toast("info","Cleared","");setNotifOpen(false);}} style={{fontSize:11,color:t.accent,fontWeight:600}}>Clear all</button>
          </div>
          <div style={{maxHeight:300,overflowY:"auto"}}>
            {notifs.length===0
              ? <div style={{padding:"28px 24px",textAlign:"center",color:t.muted,fontSize:12}}>✓ All caught up!</div>
              : notifs.map(n=>(
                <div key={n.id} className="hover-card" style={{padding:"11px 16px",borderBottom:`1px solid ${t.border}`,display:"flex",gap:9,cursor:"pointer",transition:"background .12s"}}>
                  <div style={{flex:1,fontSize:12.5,lineHeight:1.6}}>{n.text}</div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{fontSize:10,color:t.muted,whiteSpace:"nowrap"}}>{n.time} ago</span>
                    <button onClick={e=>{e.stopPropagation();setNotifs(nn=>nn.filter(x=>x.id!==n.id));}} style={{fontSize:11,color:t.muted,lineHeight:1}}>✕</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </FixedDropdown>

      {/* ── Profile dropdown — rendered via FixedDropdown (position:fixed) ── */}
      <FixedDropdown anchorRef={pBtnRef} open={profOpen} width={210} align="right">
        <div id="los-prof-drop" style={{overflow:"hidden",borderRadius:14}}>
          <div style={{padding:"13px 16px",borderBottom:`1px solid ${t.border}`}}>
            <div style={{fontSize:13,fontWeight:700}}>{user?.name||"Alex Chen"}</div>
            <div style={{fontSize:11,color:t.sub,marginTop:1}}>{user?.email||"alex@lifeos.app"}</div>
            <Badge color={t.accentHi} bg={t.accentLo} style={{marginTop:7}}>Pro ✦</Badge>
          </div>
          {[["⚙","Settings"],["🌙","Theme: "+THEMES[theme].label],["🚪","Sign out"]].map(([ic,lb])=>(
            <button key={lb} className="hover-card" onClick={()=>{if(lb==="Sign out")logout();setProfOpen(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 16px",fontSize:12.5,color:lb==="Sign out"?t.red:t.text,fontWeight:500,transition:"background .12s",textAlign:"left"}}>
              <span style={{fontSize:15}}>{ic}</span>{lb}
            </button>
          ))}
        </div>
      </FixedDropdown>
    </>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────────────── */
function Dashboard() {
  const t = useT();
  const { tasks, habits, goals, events, navigate } = useApp();
  const doneT = tasks.filter(x=>x.status==="done").length;
  const doneH = habits.filter(h=>h.done).length;
  const avgG  = Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length);
  const score = Math.min(100,Math.round((doneT/tasks.length)*40+(doneH/habits.length)*35+(avgG/100)*25));

  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      {/* Banner */}
      <div style={{...card(t,{padding:"clamp(18px,3vw,24px)",marginBottom:16,background:`linear-gradient(135deg,${t.accentLo},${t.surface})`,border:`1px solid ${t.borderHov}`,position:"relative",overflow:"hidden"})}}>
        <div style={{position:"absolute",right:-40,top:-40,width:200,height:200,borderRadius:"50%",background:t.glow,filter:"blur(50px)",pointerEvents:"none"}}/>
        <div style={{fontSize:10.5,color:t.accentHi,fontWeight:700,letterSpacing:.8,marginBottom:6}}>GOOD MORNING ✦</div>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"clamp(15px,2.5vw,20px)",fontWeight:800,marginBottom:6}}>Let's build something great today.</div>
        <div style={{fontSize:13,color:t.sub}}><b style={{color:t.text}}>{tasks.filter(x=>x.status!=="done").length} tasks</b> pending · <b style={{color:t.text}}>{habits.length-doneH} habits</b> remaining · <b style={{color:t.text}}>{events[0]?.title||"No events"}</b> up next</div>
        <div style={{position:"absolute",right:22,top:"50%",transform:"translateY(-50%)"}} className="sm-hide">
          <div style={{position:"relative"}}>
            <Ring pct={score} size={78} stroke={7} color={score>=80?t.green:score>=60?t.amber:t.red}/>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:19,fontWeight:800,lineHeight:1}}>{score}</div>
              <div style={{fontSize:8,color:t.muted,fontWeight:700,letterSpacing:.5}}>SCORE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:14}}>
        <StatCard label="Tasks Done" value={`${doneT}/${tasks.length}`} icon="✓" gradient={t.g1} delta={23} onClick={()=>navigate("tasks")}/>
        <StatCard label="Habit Streaks" value={`${habits.reduce((a,h)=>a+h.streak,0)}d`} icon="🔥" gradient={t.g2} delta={8} delay={50} onClick={()=>navigate("habits")}/>
        <StatCard label="Goal Progress" value={`${avgG}%`} icon="◈" gradient={t.g3} delta={5} delay={100} onClick={()=>navigate("goals")}/>
        <StatCard label="Done Today" value={`${doneH}/${habits.length}`} icon="◎" gradient={t.g4} delay={150} onClick={()=>navigate("habits")}/>
      </div>

      {/* Charts */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:14}}>
        <div style={{...card(t,{padding:18})}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Weekly Activity</div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={WEEKLY} margin={{top:0,right:0,left:-24,bottom:0}}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={t.accent} stopOpacity={.35}/><stop offset="95%" stopColor={t.accent} stopOpacity={0}/></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={t.green} stopOpacity={.35}/><stop offset="95%" stopColor={t.green} stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{fill:t.sub,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:t.sub,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:t.popup,border:`1px solid ${t.borderHov}`,borderRadius:9,color:t.text,fontSize:11}}/>
              <Area type="monotone" dataKey="tasks"  stroke={t.accent} strokeWidth={2} fill="url(#g1)" name="Tasks"/>
              <Area type="monotone" dataKey="habits" stroke={t.green}  strokeWidth={2} fill="url(#g2)" name="Habits"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{...card(t,{padding:18})}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Today's Schedule</div>
          {events.slice(0,4).map(e=>(
            <div key={e.id} style={{display:"flex",gap:9,padding:"8px 10px",borderRadius:9,...card(t,{border:`1px solid ${t.border}`}),marginBottom:7}}>
              <div style={{width:3,minHeight:30,background:e.color,borderRadius:99,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12.5,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.title}</div>
                <div style={{fontSize:10.5,color:t.sub}}>{e.time} · {e.dur}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
        <div style={{...card(t,{padding:18})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14}}>Goals</div>
            <button onClick={()=>navigate("goals")} style={{fontSize:12,color:t.accent,fontWeight:600}}>View all →</button>
          </div>
          {goals.map(g=>(
            <div key={g.id} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12.5}}><span style={{fontWeight:500}}>{g.icon} {g.title}</span><span style={{fontWeight:700,color:g.color}}>{g.progress}%</span></div>
              <PBar value={g.progress} color={g.color}/>
            </div>
          ))}
        </div>
        <div style={{...card(t,{padding:18})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14}}>Habits Today</div>
            <button onClick={()=>navigate("habits")} style={{fontSize:12,color:t.accent,fontWeight:600}}>View all →</button>
          </div>
          {habits.slice(0,5).map(h=>(
            <div key={h.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${t.border}`}}>
              <span style={{fontSize:18}}>{h.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12.5,fontWeight:500}}>{h.name}</div>
                <div style={{fontSize:10.5,color:t.sub}}>🔥 {h.streak}d streak</div>
              </div>
              <div style={{width:22,height:22,borderRadius:"50%",background:h.done?h.color:"transparent",border:`2px solid ${h.done?h.color:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700,flexShrink:0}}>{h.done?"✓":""}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── TASKS ──────────────────────────────────────────────────────────── */
function Tasks() {
  const t = useT();
  const { tasks, setTasks, toast } = useApp();
  const [drag, setDrag]   = useState(null);
  const [over, setOver]   = useState(null);
  const [showAdd, setSA]  = useState(false);
  const [newT, setNT]     = useState({title:"",priority:"medium",cat:"Work",due:""});
  const [filter, setFilter] = useState("All");
  const COLS = [{id:"todo",label:"To Do",color:t.sub},{id:"inprogress",label:"In Progress",color:t.amber},{id:"done",label:"Done",color:t.green}];
  const PRIO_C = {high:t.red,medium:t.amber,low:t.green};
  const filtered = filter==="All" ? tasks : tasks.filter(x=>x.priority===filter.toLowerCase()||x.cat===filter);

  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14,alignItems:"center"}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",flex:1}}>
          {["All","High","Medium","Low"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 13px",borderRadius:99,fontSize:12,fontWeight:500,background:filter===f?t.accent:t.surface,color:filter===f?"#fff":t.sub,border:`1px solid ${filter===f?t.accent:t.border}`,transition:"all .15s"}}>{f}</button>
          ))}
        </div>
        <Btn size="sm" onClick={()=>setSA(!showAdd)}>＋ New Task</Btn>
      </div>

      {showAdd && (
        <div style={{...card(t,{padding:13,marginBottom:12,border:`1px solid ${t.borderHov}`})}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,flexWrap:"wrap"}}>
            <input value={newT.title} onChange={e=>setNT({...newT,title:e.target.value})} onKeyDown={e=>{if(e.key==="Enter"&&newT.title.trim()){setTasks(tt=>[...tt,{...newT,id:Date.now(),status:"todo"}]);toast("success","Task added",newT.title);setNT({title:"",priority:"medium",cat:"Work",due:""});setSA(false);}}} placeholder="Task title…" style={{padding:"8px 11px",borderRadius:9,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:13,color:t.text}}/>
            <select value={newT.priority} onChange={e=>setNT({...newT,priority:e.target.value})} style={{padding:"8px 9px",borderRadius:9,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:12,color:t.text}}>
              <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
            </select>
            <Btn size="sm" onClick={async () => {
  if (!newT.title.trim()) return;
  try {
    const res = await fetch('https://lifeos-backend.onrender.com/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(newT)
    });
    const data = await res.json();
    if (data.success) {
      setTasks(tt => [...tt, data.data.task]);
      toast("success", "Task added", newT.title);
      setNT({ title: "", priority: "medium", cat: "Work", due: "" });
      setSA(false);
    }
  } catch (err) {
    // Fallback to local state if API fails
    setTasks(tt => [...tt, { ...newT, id: Date.now(), status: "todo" }]);
    toast("success", "Task added", newT.title);
    setSA(false);
  }
}}>Add</Btn>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
        {COLS.map(col=>(
          <div key={col.id}
            onDragOver={e=>{e.preventDefault();setOver(col.id);}}
            onDragLeave={()=>setOver(null)}
            onDrop={()=>{if(drag!=null){setTasks(tt=>tt.map(x=>x.id===drag?{...x,status:col.id}:x));toast("success","Moved","→ "+col.label);}setDrag(null);setOver(null);}}
            style={{...card(t,{padding:12,minHeight:340,border:`1px solid ${over===col.id?col.color+"88":t.border}`,transition:"border-color .18s"})}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:11}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:col.color}}/>
              <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:12.5}}>{col.label}</span>
              <span style={{marginLeft:"auto",fontSize:10,padding:"1px 6px",borderRadius:99,background:t.surface,color:t.muted}}>{filtered.filter(x=>x.status===col.id).length}</span>
            </div>
            {filtered.filter(x=>x.status===col.id).map(task=>(
              <div key={task.id} draggable onDragStart={()=>setDrag(task.id)} onDragEnd={()=>{setDrag(null);setOver(null);}}
                className="hover-card" style={{...card(t,{padding:11,cursor:"grab",opacity:drag===task.id?.4:1,marginBottom:8,transition:"opacity .2s,background .12s,border-color .12s"})}} >
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,alignItems:"flex-start"}}>
                  <Badge color={PRIO_C[task.priority]} bg={`${PRIO_C[task.priority]}18`}>{task.priority}</Badge>
                  <button onClick={()=>{setTasks(tt=>tt.filter(x=>x.id!==task.id));toast("info","Removed","");}} style={{fontSize:11,color:t.muted}}>✕</button>
                </div>
                <div style={{fontSize:13,fontWeight:600,marginBottom:3,lineHeight:1.45}}>{task.title}</div>
                <div style={{fontSize:10.5,color:t.muted}}>{task.cat}{task.due&&` · 📅 ${task.due}`}</div>
              </div>
            ))}
            {filtered.filter(x=>x.status===col.id).length===0&&(
              <div style={{textAlign:"center",padding:"28px 8px",color:t.muted,fontSize:12,border:`2px dashed ${t.border}`,borderRadius:9,marginTop:4}}>{over===col.id?"Drop here ✓":"Empty"}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── HABITS ─────────────────────────────────────────────────────────── */
function Habits() {
  const t = useT();
  const { habits, setHabits, toast } = useApp();
  const [showAdd, setSA] = useState(false);
  const [newH, setNH] = useState({name:"",icon:"⭐",color:t.accent});
  const toggle = id => { const h=habits.find(x=>x.id===id); setHabits(hh=>hh.map(x=>x.id===id?{...x,done:!x.done,streak:x.done?Math.max(0,x.streak-1):x.streak+1}:x)); if(h) toast(h.done?"info":"success",h.done?"Unchecked":h.name+" ✓",""); };
  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        <StatCard label="Done Today" value={`${habits.filter(h=>h.done).length}/${habits.length}`} icon="✓" gradient={t.g1}/>
        <StatCard label="Best Streak" value={`${Math.max(...habits.map(h=>h.streak))}d`} icon="🏆" gradient={t.g2} delay={50}/>
        <StatCard label="Total Streak" value={`${habits.reduce((a,h)=>a+h.streak,0)}d`} icon="🔥" gradient={t.g3} delay={100}/>
        <StatCard label="Tracked" value={habits.length} icon="◎" gradient={t.g4} delay={150}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:15}}>Daily Habits</div>
        <Btn size="sm" onClick={()=>setSA(!showAdd)}>＋ Add Habit</Btn>
      </div>
      {showAdd&&(
        <div style={{...card(t,{padding:13,marginBottom:12,border:`1px solid ${t.borderHov}`})}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <input value={newH.icon} onChange={e=>setNH({...newH,icon:e.target.value})} style={{width:44,padding:"8px",textAlign:"center",borderRadius:8,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:17,color:t.text}}/>
            <input value={newH.name} onChange={e=>setNH({...newH,name:e.target.value})} placeholder="Habit name…" style={{flex:1,minWidth:120,padding:"8px 11px",borderRadius:8,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:13,color:t.text}}/>
            <div style={{display:"flex",gap:4}}>{["#6366F1","#10B981","#F59E0B","#EC4899","#38BDF8","#A855F7"].map(c=><button key={c} onClick={()=>setNH({...newH,color:c})} style={{width:18,height:18,borderRadius:"50%",background:c,border:`3px solid ${newH.color===c?"white":"transparent"}`,transition:"border .15s"}}/>)}</div>
            <Btn size="sm" onClick={()=>{if(!newH.name.trim())return;setHabits(hh=>[...hh,{id:Date.now(),name:newH.name,icon:newH.icon,streak:0,grid:Array(14).fill(0),color:newH.color,done:false}]);toast("success","Habit added",newH.name);setNH({name:"",icon:"⭐",color:t.accent});setSA(false);}}>Add</Btn>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {habits.map(h=>(
          <div key={h.id} className="lift hover-card" style={{...card(t,{padding:"14px 18px",display:"flex",alignItems:"center",gap:14,border:`1px solid ${h.done?h.color+"44":t.border}`,transition:"all .2s",flexWrap:"wrap"})}}>
            <div style={{width:40,height:40,borderRadius:11,background:`${h.color}18`,border:`1px solid ${h.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{h.icon}</div>
            <div style={{flex:1,minWidth:120}}>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:13.5,marginBottom:7}}>{h.name}</div>
              <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
                {h.grid.map((done,i)=><div key={i} style={{width:15,height:15,borderRadius:3,background:done?`${h.color}BB`:t.surface,border:`1px solid ${done?h.color:t.border}`}}/>)}
              </div>
            </div>
            <div style={{textAlign:"center",minWidth:40}}>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:22,fontWeight:800,color:h.color,lineHeight:1}}>{h.streak}</div>
              <div style={{fontSize:9,color:t.muted}}>days</div>
            </div>
            <button onClick={()=>toggle(h.id)} style={{width:38,height:38,borderRadius:"50%",background:h.done?h.color:"transparent",border:`2.5px solid ${h.done?h.color:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:h.done?15:13,color:h.done?"#fff":t.muted,transition:"all .25s cubic-bezier(.34,1.56,.64,1)",flexShrink:0}}>{h.done?"✓":"○"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── GOALS ──────────────────────────────────────────────────────────── */
function Goals() {
  const t = useT();
  const { goals, setGoals, toast } = useApp();
  const [showAdd, setSA] = useState(false);
  const [newG, setNG] = useState({title:"",icon:"🎯"});
  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:15}}>Long-Term Goals</div>
        <Btn size="sm" onClick={()=>setSA(!showAdd)}>＋ New Goal</Btn>
      </div>
      {showAdd&&(
        <div style={{...card(t,{padding:13,marginBottom:14,border:`1px solid ${t.borderHov}`})}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <input value={newG.icon} onChange={e=>setNG({...newG,icon:e.target.value})} style={{width:44,padding:"8px",textAlign:"center",borderRadius:8,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:17,color:t.text}}/>
            <input value={newG.title} onChange={e=>setNG({...newG,title:e.target.value})} placeholder="Goal title…" style={{flex:1,minWidth:120,padding:"8px 11px",borderRadius:8,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:13,color:t.text}}/>
            <Btn size="sm" onClick={()=>{if(!newG.title.trim())return;setGoals(gg=>[...gg,{id:Date.now(),title:newG.title,icon:newG.icon,color:t.accent,progress:0,target:"TBD",milestones:["Start →"]}]);toast("success","Goal added",newG.title);setNG({title:"",icon:"🎯"});setSA(false);}}>Add</Btn>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
        {goals.map(g=>(
          <div key={g.id} className="lift" style={{...card(t,{padding:22,borderTop:`3px solid ${g.color}`})}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}><span style={{fontSize:22}}>{g.icon}</span><span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:15}}>{g.title}</span></div>
                <Badge color={g.color} bg={`${g.color}18`}>🎯 {g.target}</Badge>
              </div>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:30,fontWeight:800,color:g.color,lineHeight:1}}>{g.progress}%</div>
            </div>
            <PBar value={g.progress} color={g.color} height={6}/>
            <div style={{marginTop:14,display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
              {g.milestones.map((m,mi)=>{
                const done=m.includes("✓"),cur=m.includes("→");
                return <span key={mi} style={{fontSize:11,padding:"3px 9px",borderRadius:99,fontWeight:cur?600:400,background:done?`${g.color}22`:cur?t.accentLo:t.surface,border:`1px solid ${done?g.color+"55":cur?t.borderHov:t.border}`,color:done?g.color:cur?t.accentHi:t.sub}}>{m}</span>;
              })}
            </div>
            <input type="range" min={0} max={100} value={g.progress} onChange={e=>{const v=parseInt(e.target.value);setGoals(gg=>gg.map(og=>og.id===g.id?{...og,progress:v}:og));if(v===100)toast("success","Goal complete! 🎉",g.title);}} style={{width:"100%",accentColor:g.color}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── NOTES ──────────────────────────────────────────────────────────── */
function NoteCard({ n, setNotes, toast }) {
  const t = useT();
  const [editing, setEditing] = useState(false);
  const [lc, setLc] = useState(n.content);
  const TAG_C = {Work:"#6366F1",Study:"#F59E0B",Health:"#10B981",Personal:"#EC4899",Finance:"#38BDF8"};
  const col = TAG_C[n.tag]||n.color||t.accent;
  return (
    <div className="lift hover-card" style={{...card(t,{padding:16,borderLeft:`3px solid ${col}`,transition:"all .2s"})}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:13,flex:1,marginRight:6,lineHeight:1.35}}>{n.title}</div>
        <div style={{display:"flex",gap:3,flexShrink:0}}>
          <button onClick={()=>setNotes(nn=>nn.map(x=>x.id===n.id?{...x,pinned:!x.pinned}:x))} style={{fontSize:10,padding:"2px 6px",borderRadius:5,background:n.pinned?`${col}22`:t.surface,color:n.pinned?col:t.muted}}>📌</button>
          <button onClick={()=>setEditing(!editing)} style={{fontSize:10,padding:"2px 6px",borderRadius:5,background:t.surface,color:t.muted}}>✎</button>
          <button onClick={()=>{setNotes(nn=>nn.filter(x=>x.id!==n.id));toast("info","Deleted","");}} style={{fontSize:10,padding:"2px 6px",borderRadius:5,background:`${t.red}18`,color:t.red}}>✕</button>
        </div>
      </div>
      <Badge color={col} bg={`${col}18`} style={{marginBottom:9}}>{n.tag}</Badge>
      {editing ? <textarea value={lc} onChange={e=>setLc(e.target.value)} onBlur={()=>{setNotes(nn=>nn.map(x=>x.id===n.id?{...x,content:lc,updated:"Just now"}:x));setEditing(false);}} style={{width:"100%",fontSize:12.5,color:t.text,lineHeight:1.65,resize:"vertical",minHeight:72,padding:8,borderRadius:7,background:t.surface,border:`1.5px solid ${t.border}`,marginTop:5}} autoFocus/>
      : <div style={{fontSize:12.5,color:t.sub,lineHeight:1.65,whiteSpace:"pre-line",marginTop:5}}>{n.content.length>110?n.content.slice(0,110)+"…":n.content}</div>}
      <div style={{fontSize:10,color:t.muted,marginTop:9}}>{n.updated}</div>
    </div>
  );
}
function Notes() {
  const t = useT();
  const { notes, setNotes, toast } = useApp();
  const [search, setSrch] = useState("");
  const [showAdd, setSA] = useState(false);
  const [newN, setNN] = useState({title:"",content:"",tag:"Work"});
  const TAG_C = {Work:"#6366F1",Study:"#F59E0B",Health:"#10B981",Personal:"#EC4899",Finance:"#38BDF8"};
  const filtered = notes.filter(n=>n.title.toLowerCase().includes(search.toLowerCase())||n.content.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{display:"flex",gap:9,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{...card(t,{borderRadius:99,padding:"7px 14px",display:"flex",alignItems:"center",gap:7,flex:1,maxWidth:280})}}>
          <span style={{color:t.muted}}>⌕</span>
          <input value={search} onChange={e=>setSrch(e.target.value)} placeholder="Search notes…" style={{fontSize:13,flex:1,color:t.text}}/>
        </div>
        <div style={{flex:1}}/>
        <Btn size="sm" onClick={()=>setSA(!showAdd)}>＋ Note</Btn>
      </div>
      {showAdd&&(
        <div style={{...card(t,{padding:16,marginBottom:16,border:`1px solid ${t.borderHov}`})}}>
          <input value={newN.title} onChange={e=>setNN({...newN,title:e.target.value})} placeholder="Title…" style={{width:"100%",padding:"9px 11px",borderRadius:9,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:13.5,marginBottom:8,color:t.text}}/>
          <textarea value={newN.content} onChange={e=>setNN({...newN,content:e.target.value})} placeholder="Write your note…" rows={3} style={{width:"100%",padding:"9px 11px",borderRadius:9,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:13,resize:"vertical",lineHeight:1.65,marginBottom:9,color:t.text}}/>
          <div style={{display:"flex",gap:9,alignItems:"center"}}>
            <select value={newN.tag} onChange={e=>setNN({...newN,tag:e.target.value})} style={{padding:"7px 9px",borderRadius:9,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:12,color:t.text}}>{Object.keys(TAG_C).map(k=><option key={k}>{k}</option>)}</select>
            <div style={{flex:1}}/>
            <Btn size="sm" onClick={()=>{if(!newN.title.trim())return;setNotes(nn=>[{id:Date.now(),title:newN.title,content:newN.content,tag:newN.tag,color:TAG_C[newN.tag],updated:"Just now",pinned:false},...nn]);toast("success","Note saved",newN.title);setNN({title:"",content:"",tag:"Work"});setSA(false);}}>Save</Btn>
          </div>
        </div>
      )}
      {filtered.filter(n=>n.pinned).length>0&&<><div style={{fontSize:10,fontWeight:700,letterSpacing:.8,color:t.muted,marginBottom:8}}>📌 PINNED</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:11,marginBottom:18}}>{filtered.filter(n=>n.pinned).map(n=><NoteCard key={n.id} n={n} setNotes={setNotes} toast={toast}/>)}</div></>}
      <div style={{fontSize:10,fontWeight:700,letterSpacing:.8,color:t.muted,marginBottom:8}}>ALL NOTES</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:11}}>{filtered.filter(n=>!n.pinned).map(n=><NoteCard key={n.id} n={n} setNotes={setNotes} toast={toast}/>)}</div>
    </div>
  );
}

/* ─── CALENDAR ───────────────────────────────────────────────────────── */
function Calendar() {
  const t = useT();
  const { events, setEvents, toast } = useApp();
  const [cur, setCur] = useState(new Date(2025,7,1));
  const [showAdd, setSA] = useState(false);
  const [newE, setNE] = useState({title:"",time:"09:00",date:"",color:t.accent,dur:"1h"});
  const MON=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const D=["Su","Mo","Tu","We","Th","Fr","Sa"];
  const y=cur.getFullYear(),m=cur.getMonth();
  const dIM=new Date(y,m+1,0).getDate(),fd=new Date(y,m,1).getDay();
  const dk=d=>`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const byDate={}; events.forEach(e=>{if(!byDate[e.date])byDate[e.date]=[];byDate[e.date].push(e);});

  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr clamp(220px,28%,270px)",gap:14}}>
        <div style={{...card(t,{padding:16})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:17}}>{MON[m]} {y}</div>
            <div style={{display:"flex",gap:7}}>
              {[["←",()=>setCur(d=>new Date(d.getFullYear(),d.getMonth()-1,1))],["→",()=>setCur(d=>new Date(d.getFullYear(),d.getMonth()+1,1))]].map(([l,fn])=>(
                <button key={l} onClick={fn} style={{width:30,height:30,borderRadius:7,...card(t,{display:"flex",alignItems:"center",justifyContent:"center",fontSize:15})}}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {D.map(d=><div key={d} style={{textAlign:"center",padding:"4px 2px",fontSize:10,fontWeight:600,color:t.muted}}>{d}</div>)}
            {Array(fd).fill(null).map((_,i)=><div key={`e${i}`}/>)}
            {Array.from({length:dIM},(_,i)=>i+1).map(d=>{
              const key=dk(d),evs=byDate[key]||[];
              const isT=new Date().getDate()===d&&new Date().getMonth()===m&&new Date().getFullYear()===y;
              return (
                <div key={d} onClick={()=>{setNE(e=>({...e,date:key}));setSA(true);}} className="hover-card" style={{padding:"3px",minHeight:52,borderRadius:8,cursor:"pointer",background:isT?`${t.accent}18`:t.surface,border:`1px solid ${isT?t.borderHov:t.border}`,transition:"all .15s"}}>
                  <div style={{fontSize:11,fontWeight:isT?800:400,color:isT?t.accentHi:t.text,textAlign:"center",marginBottom:2}}>{d}</div>
                  {evs.slice(0,2).map(e=><div key={e.id} style={{fontSize:8,padding:"1px 4px",borderRadius:3,background:`${e.color}25`,color:e.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:1}}>{e.title}</div>)}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {showAdd&&(
            <div style={{...card(t,{padding:15,border:`1px solid ${t.borderHov}`})}}>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:13,marginBottom:11}}>Add Event</div>
              <input value={newE.title} onChange={e=>setNE({...newE,title:e.target.value})} placeholder="Event title…" style={{width:"100%",padding:"8px 10px",borderRadius:8,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:13,marginBottom:7,color:t.text}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:8}}>
                <input type="time" value={newE.time} onChange={e=>setNE({...newE,time:e.target.value})} style={{padding:"8px 9px",borderRadius:8,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:12,colorScheme:"dark",color:t.text}}/>
                <input value={newE.dur} onChange={e=>setNE({...newE,dur:e.target.value})} placeholder="Duration" style={{padding:"8px 9px",borderRadius:8,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:12,color:t.text}}/>
              </div>
              {!newE.date&&<input type="date" value={newE.date} onChange={e=>setNE({...newE,date:e.target.value})} style={{width:"100%",padding:"8px 9px",borderRadius:8,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:12,colorScheme:"dark",color:t.text,marginBottom:8}}/>}
              <div style={{display:"flex",gap:5,marginBottom:10}}>{[t.accent,t.green,t.amber,t.pink,t.sky].map(c=><button key={c} onClick={()=>setNE({...newE,color:c})} style={{width:20,height:20,borderRadius:"50%",background:c,border:`3px solid ${newE.color===c?"white":"transparent"}`}}/>)}</div>
              <div style={{display:"flex",gap:7}}>
                <Btn size="sm" full onClick={()=>{if(!newE.title.trim())return;setEvents(ee=>[...ee,{...newE,id:Date.now()}]);toast("success","Event added",newE.title);setNE({title:"",time:"09:00",date:"",color:t.accent,dur:"1h"});setSA(false);}}>Add</Btn>
                <button onClick={()=>setSA(false)} style={{padding:"6px 11px",borderRadius:8,...card(t,{}),fontSize:12,color:t.muted}}>✕</button>
              </div>
            </div>
          )}
          <div style={{...card(t,{padding:16,flex:1})}}>
            <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Upcoming Events</div>
            {events.slice(0,6).map(e=>(
              <div key={e.id} className="hover-card" style={{display:"flex",gap:8,padding:"9px",borderRadius:9,...card(t,{}),marginBottom:7,transition:"all .12s"}}>
                <div style={{width:3,minHeight:32,background:e.color,borderRadius:99,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.title}</div>
                  <div style={{fontSize:10.5,color:t.sub}}>{e.date} · {e.time}</div>
                </div>
                <button onClick={()=>{setEvents(ee=>ee.filter(x=>x.id!==e.id));toast("info","Removed","");}} style={{fontSize:11,color:t.muted}}>✕</button>
              </div>
            ))}
            {!showAdd&&<button onClick={()=>setSA(true)} style={{width:"100%",marginTop:4,padding:"9px",...card(t,{borderRadius:9,border:`2px dashed ${t.border}`,fontSize:12,color:t.muted})}} className="hover-card">＋ Add Event</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ANALYTICS ──────────────────────────────────────────────────────── */
function Analytics() {
  const t = useT();
  const { tasks } = useApp();
  const done = tasks.filter(x=>x.status==="done").length;
  const cats = [{name:"Work",value:40,color:t.accent},{name:"Health",value:25,color:t.green},{name:"Study",value:20,color:t.amber},{name:"Personal",value:15,color:t.pink}];
  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        <StatCard label="Completion Rate" value={`${Math.round((done/tasks.length)*100)}%`} icon="📈" gradient={t.g1} delta={14}/>
        <StatCard label="Focus Hrs/Week" value="32h" icon="⏱" gradient={t.g2} delta={8} delay={50}/>
        <StatCard label="Habit Consistency" value="78%" icon="🎯" gradient={t.g3} delta={-3} delay={100}/>
        <StatCard label="Prod. Score" value="84" icon="⚡" gradient={t.g5} delta={11} delay={150}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:14}}>
        <div style={{...card(t,{padding:20})}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:4}}>Weekly Performance</div>
          <div style={{fontSize:11.5,color:t.sub,marginBottom:14}}>Score, tasks & habits</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={WEEKLY} margin={{top:0,right:0,left:-24,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false}/>
              <XAxis dataKey="day" tick={{fill:t.sub,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:t.sub,fontSize:10}} axisLine={false} tickLine={false} domain={[0,100]}/>
              <Tooltip contentStyle={{background:t.popup,border:`1px solid ${t.borderHov}`,borderRadius:9,color:t.text,fontSize:11}}/>
              <Bar dataKey="score" fill={t.accent} radius={[5,5,0,0]} name="Score"/>
              <Bar dataKey="tasks" fill={t.green}  radius={[5,5,0,0]} name="Tasks"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{...card(t,{padding:20,display:"flex",flexDirection:"column"})}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Category Breakdown</div>
          <div style={{display:"flex",justifyContent:"center",flex:1}}>
            <PieChart width={160} height={160}>
              <Pie data={cats} cx={75} cy={75} innerRadius={46} outerRadius={72} paddingAngle={4} dataKey="value">
                {cats.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:t.popup,border:`1px solid ${t.borderHov}`,borderRadius:9,color:t.text,fontSize:11}}/>
            </PieChart>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {cats.map(c=><div key={c.name} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:t.sub}}><div style={{width:7,height:7,borderRadius:"50%",background:c.color}}/>{c.name}</div>)}
          </div>
        </div>
      </div>
      <div style={{...card(t,{padding:20})}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Focus Hours Trend</div>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={WEEKLY} margin={{top:0,right:0,left:-24,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false}/>
            <XAxis dataKey="day" tick={{fill:t.sub,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:t.sub,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:t.popup,border:`1px solid ${t.borderHov}`,borderRadius:9,color:t.text,fontSize:11}}/>
            <Line type="monotone" dataKey="score" stroke={t.sky} strokeWidth={2.5} dot={{fill:t.sky,r:3}} name="Score"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── FOCUS ──────────────────────────────────────────────────────────── */
function Focus() {
  const t = useT();
  const { toast } = useApp();
  const MODES = {focus:{label:"Focus",dur:25*60,c:t.accent},short:{label:"Short Break",dur:5*60,c:t.green},long:{label:"Long Break",dur:15*60,c:t.sky}};
  const [mode, setMode]   = useState("focus");
  const [time, setTime]   = useState(MODES.focus.dur);
  const [running, setRun] = useState(false);
  const [sessions, setSes]= useState(0);
  const ref = useRef();
  useEffect(()=>{setTime(MODES[mode].dur);setRun(false);clearInterval(ref.current);},[mode]);
  useEffect(()=>{
    if(running){ref.current=setInterval(()=>{setTime(t=>{if(t<=1){clearInterval(ref.current);setRun(false);if(mode==="focus"){setSes(s=>s+1);toast("success","Session complete! 🎉","25 min done");}else toast("info","Break over","Back to work!");return 0;}return t-1;});},1000);}else clearInterval(ref.current);
    return()=>clearInterval(ref.current);
  },[running,mode]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const S=200,ST=11,R=(S-ST*2)/2,C=2*Math.PI*R,mc=MODES[mode].c;
  const pct=(1-time/MODES[mode].dur)*100;
  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
        <div style={{...card(t,{padding:28,display:"flex",flexDirection:"column",alignItems:"center",border:`1px solid ${mc}44`})}}>
          <div style={{display:"flex",gap:7,marginBottom:24,flexWrap:"wrap",justifyContent:"center"}}>
            {Object.entries(MODES).map(([k,m])=>(
              <button key={k} onClick={()=>setMode(k)} style={{padding:"6px 14px",borderRadius:99,fontSize:12,fontWeight:600,background:mode===k?mc:t.surface,color:mode===k?"#fff":t.sub,border:`1px solid ${mode===k?mc:t.border}`,transition:"all .18s"}}>{m.label}</button>
            ))}
          </div>
          <div style={{position:"relative",marginBottom:26,filter:`drop-shadow(0 0 28px ${mc}55)`}}>
            <svg width={S} height={S} style={{transform:"rotate(-90deg)"}}>
              <circle cx={S/2} cy={S/2} r={R} fill="none" stroke={`${mc}18`} strokeWidth={ST}/>
              <circle cx={S/2} cy={S/2} r={R} fill="none" stroke={mc} strokeWidth={ST} strokeDasharray={C} strokeDashoffset={C*(1-pct/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset .95s ease"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:46,fontWeight:800,lineHeight:1}}>{fmt(time)}</div>
              <div style={{fontSize:12,color:t.sub,marginTop:4}}>{MODES[mode].label}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <button onClick={()=>{setTime(MODES[mode].dur);setRun(false);}} style={{width:42,height:42,borderRadius:9,...card(t,{display:"flex",alignItems:"center",justifyContent:"center",fontSize:18})}}>↺</button>
            <button onClick={()=>setRun(r=>!r)} style={{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${mc},${mc}BB)`,fontSize:24,color:"#fff",boxShadow:`0 8px 28px ${mc}55`,display:"flex",alignItems:"center",justifyContent:"center",border:"none",transition:"transform .15s",flexShrink:0}}
              onMouseDown={e=>e.currentTarget.style.transform="scale(.93)"} onMouseUp={e=>e.currentTarget.style.transform=""}>{running?"⏸":"▶"}</button>
            <button onClick={()=>setMode(m=>m==="focus"?"short":"focus")} style={{width:42,height:42,borderRadius:9,...card(t,{display:"flex",alignItems:"center",justifyContent:"center",fontSize:18})}}>⏭</button>
          </div>
          <div style={{marginTop:22,textAlign:"center"}}>
            <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:28,fontWeight:800,color:mc,lineHeight:1}}>{sessions}</div>
            <div style={{fontSize:11,color:t.muted}}>sessions today</div>
          </div>
        </div>
        <div style={{...card(t,{padding:20})}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Optimized Daily Schedule</div>
          {[{t:"09:00",task:"Deep Work Block",type:"Focus",dur:"90min",c:t.accent},{t:"10:30",task:"Short Break",type:"Break",dur:"10min",c:t.green},{t:"10:40",task:"Reviews & Comms",type:"Admin",dur:"30min",c:t.amber},{t:"11:10",task:"Team Standup",type:"Meeting",dur:"15min",c:t.sky},{t:"12:00",task:"Lunch + Walk",type:"Break",dur:"60min",c:t.muted},{t:"13:00",task:"Creative Block",type:"Focus",dur:"2h",c:t.accent},{t:"15:00",task:"Code Review",type:"Review",dur:"45min",c:t.purple},{t:"16:00",task:"Planning + Habits",type:"Wrap",dur:"30min",c:t.teal}].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:8}}>
              <div style={{fontSize:10,color:t.muted,width:40,flexShrink:0,paddingTop:3,fontWeight:600}}>{item.t}</div>
              <div style={{width:2,minHeight:38,background:item.c,borderRadius:99,flexShrink:0}}/>
              <div style={{flex:1,padding:"7px 10px",borderRadius:8,...card(t,{})}}>
                <div style={{fontSize:12.5,fontWeight:600}}>{item.task}</div>
                <div style={{display:"flex",gap:5,marginTop:3}}>
                  <Badge color={item.c} bg={`${item.c}18`} style={{fontSize:9.5}}>{item.type}</Badge>
                  <span style={{fontSize:10,color:t.muted}}>{item.dur}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── WELLNESS ───────────────────────────────────────────────────────── */
function Wellness() {
  const t = useT();
  const { toast } = useApp();
  const [w, setW] = useState({mood:4,sleep:7.5,water:5,energy:7,steps:8240});
  const MOODS=["😞","😕","😐","😊","😁"];
  const upd=(k,v)=>{setW(p=>({...p,[k]:v}));toast("info","Logged",k+" updated");};
  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        <StatCard label="Mood" value={MOODS[w.mood-1]} icon="😊" gradient={t.g5}/>
        <StatCard label="Sleep" value={`${w.sleep}h`} icon="🌙" gradient={t.g4} delta={4} delay={50}/>
        <StatCard label="Hydration" value={`${w.water}/8`} icon="💧" gradient={t.g2} delay={100}/>
        <StatCard label="Steps" value={w.steps.toLocaleString()} icon="👟" gradient={t.g3} delta={12} delay={150}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
        <div style={{...card(t,{padding:22})}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Today's Mood</div>
          <div style={{display:"flex",gap:9,justifyContent:"center",marginBottom:14,flexWrap:"wrap"}}>
            {MOODS.map((emoji,i)=>(
              <button key={i} onClick={()=>upd("mood",i+1)} style={{fontSize:28,padding:"10px",borderRadius:13,background:w.mood===i+1?`${t.pink}22`:t.surface,border:`2px solid ${w.mood===i+1?t.pink:t.border}`,transition:"all .2s",transform:w.mood===i+1?"scale(1.15)":"scale(1)"}}>{emoji}</button>
            ))}
          </div>
          <div style={{textAlign:"center",fontSize:13,color:t.sub}}>Feeling: <b style={{color:t.text}}>{["Rough day","Could be better","Neutral","Feeling good","Amazing! 🎉"][w.mood-1]}</b></div>
        </div>
        <div style={{...card(t,{padding:22})}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Sleep & Energy</div>
          {[{label:`Sleep: ${w.sleep}h`,key:"sleep",min:3,max:10,step:.5,color:t.sky,status:w.sleep>=7?"Great!":"Below goal"},
            {label:`Energy: ${w.energy}/10`,key:"energy",min:1,max:10,step:1,color:t.amber,status:w.energy>=7?"High energy":"Medium"},
            {label:`Steps: ${w.steps.toLocaleString()}/10k`,key:"steps",min:0,max:15000,step:100,color:t.green,status:`${Math.round((w.steps/10000)*100)}%`}].map(item=>(
            <div key={item.key} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:7}}><span>{item.label}</span><span style={{color:item.color,fontWeight:600}}>{item.status}</span></div>
              <input type="range" min={item.min} max={item.max} step={item.step} value={w[item.key]} onChange={e=>upd(item.key,parseFloat(e.target.value))} style={{width:"100%",accentColor:item.color}}/>
            </div>
          ))}
        </div>
        <div style={{...card(t,{padding:22})}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Hydration 💧</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center",marginBottom:14}}>
            {Array(8).fill(null).map((_,i)=>(
              <button key={i} onClick={()=>upd("water",i+1)} style={{fontSize:24,padding:"8px",borderRadius:11,background:i<w.water?`${t.sky}20`:t.surface,border:`2px solid ${i<w.water?t.sky:t.border}`,transition:"all .2s"}}>💧</button>
            ))}
          </div>
          <div style={{textAlign:"center",fontSize:14,color:t.sub,marginBottom:10}}><b style={{color:t.sky,fontSize:22}}>{w.water}</b> / 8 cups</div>
          <PBar value={(w.water/8)*100} color={t.sky} height={7}/>
        </div>
      </div>
    </div>
  );
}

/* ─── ACHIEVEMENTS ───────────────────────────────────────────────────── */
function Achievements() {
  const t = useT();
  const xp = ACHIEVEMENTS.filter(a=>a.done).reduce((s,a)=>s+a.xp,0);
  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)"}}>
      <div style={{...card(t,{padding:22,marginBottom:18,border:`1px solid ${t.borderHov}`,display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"})}}>
        <div style={{position:"relative"}}>
          <Ring pct={(xp/2000)*100} size={80} stroke={7} color={t.amber} trackColor={`${t.amber}18`}/>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🏆</div>
        </div>
        <div style={{flex:1,minWidth:160}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:28,fontWeight:800,lineHeight:1}}>{xp} <span style={{fontSize:14,color:t.sub}}>XP</span></div>
          <div style={{fontSize:13,color:t.sub,marginTop:3}}>Level {Math.floor(xp/300)+1} · {ACHIEVEMENTS.filter(a=>a.done).length}/{ACHIEVEMENTS.length} unlocked</div>
          <div style={{marginTop:10,maxWidth:320}}><PBar value={(xp/2000)*100} color={t.amber} height={5}/></div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
        {ACHIEVEMENTS.map((a,i)=>(
          <div key={a.id} className="lift hover-card" style={{...card(t,{padding:18,border:`1px solid ${a.done?`${t.amber}44`:t.border}`,opacity:a.done?1:.5,animationDelay:`${i*35}ms`,transition:"all .2s"})}}>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:9}}>
              <div style={{width:44,height:44,borderRadius:13,fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",background:a.done?`${t.amber}18`:t.surface,border:`1px solid ${a.done?`${t.amber}44`:t.border}`,filter:a.done?"none":"grayscale(1)"}}>{a.done?a.icon:"🔒"}</div>
              <div><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:13,lineHeight:1.3}}>{a.title}</div><Badge color={a.done?t.amber:t.muted} bg={a.done?`${t.amber}18`:t.surface} style={{marginTop:4}}>+{a.xp} XP</Badge></div>
            </div>
            <div style={{fontSize:12,color:t.sub,lineHeight:1.55}}>{a.desc}</div>
            {a.done && <div style={{fontSize:9,color:t.amber,fontWeight:700,marginTop:8,letterSpacing:.8}}>✓ UNLOCKED</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AI ASSISTANT ───────────────────────────────────────────────────── */
function AIAssistant() {
  const t = useT();
  const { tasks, habits, goals } = useApp();
  const [msgs, setMsgs] = useState([{
    id:1, role:"ai",
    text:"✦ Hi! I'm **LifeOS AI** — your personal productivity coach.\n\nI can help you with:\n• 📋 Task prioritization & planning\n• ◎ Habit coaching\n• 🎯 Goal strategy\n• 🗓 Daily schedule creation\n• 📊 Productivity analytics\n\nWhat would you like to work on? 🚀"
  }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef();
  const QUICK = ["What should I focus on?","Plan my day 📅","Motivate me 🔥","Review my habits","Analyze goals","Weekly report 📊"];

  const send = useCallback((text) => {
    if (!text?.trim() || typing) return;
    setMsgs(m=>[...m,{id:Date.now(),role:"user",text}]);
    setInput("");
    setTyping(true);
    setTimeout(()=>{
      setMsgs(m=>[...m,{id:Date.now()+1,role:"ai",text:aiReply(text,tasks,habits,goals)}]);
      setTyping(false);
    }, 800+Math.random()*700);
  }, [typing,tasks,habits,goals]);

  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs,typing]);

  return (
    <div className="pg" style={{height:"calc(100vh - 58px)",display:"flex",flexDirection:"column",padding:"clamp(12px,2vw,18px)",gap:10,overflow:"hidden"}}>
      {/* Header */}
      <div style={{...card(t,{padding:"12px 16px",display:"flex",alignItems:"center",gap:11,border:`1px solid ${t.borderHov}`,flexShrink:0})}}>
        <div style={{width:38,height:38,borderRadius:12,background:t.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,animation:"glow 3s infinite",flexShrink:0}}>✦</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:14}}>LifeOS AI</div>
          <div style={{fontSize:11,color:t.accentHi,display:"flex",alignItems:"center",gap:5}}><span style={{width:5,height:5,borderRadius:"50%",background:t.green,display:"inline-block",animation:"pulse 2s infinite"}}/>Online · Productivity Coach</div>
        </div>
        <Badge color={t.accentHi} bg={t.accentLo}>GPT-4o Mini</Badge>
      </div>

      {/* Quick prompts */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",flexShrink:0}}>
        {QUICK.map(q=>(
          <button key={q} onClick={()=>send(q)} className="hover-card" style={{padding:"5px 12px",borderRadius:99,fontSize:12,fontWeight:500,...card(t,{transition:"all .15s"}),color:t.sub}}>{q}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:11,minHeight:0}}>
        {msgs.map(msg=>(
          <div key={msg.id} style={{display:"flex",gap:8,justifyContent:msg.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",animation:"fadeUp .28s ease"}}>
            {msg.role==="ai"&&<div style={{width:26,height:26,borderRadius:8,background:t.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>✦</div>}
            <div style={{maxWidth:"76%",padding:"12px 15px",borderRadius:msg.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",background:msg.role==="user"?t.g1:t.popup,border:`1px solid ${msg.role==="user"?t.accent:t.borderHov}`,fontSize:13,lineHeight:1.75,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
              {msg.text.replace(/\*\*(.*?)\*\*/g,"$1")}
            </div>
            {msg.role==="user"&&<Avatar name="Alex Chen" size={26}/>}
          </div>
        ))}
        {typing&&(
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <div style={{width:26,height:26,borderRadius:8,background:t.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✦</div>
            <div style={{padding:"12px 16px",borderRadius:"14px 14px 14px 3px",background:t.popup,border:`1px solid ${t.borderHov}`,display:"flex",gap:4,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:t.accentHi,animation:`pulse 1.2s ${i*.15}s ease infinite`}}/>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{...card(t,{display:"flex",gap:8,padding:"10px 12px",border:`1px solid ${t.borderHov}`,flexShrink:0})}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(input);}}} placeholder="Ask me anything about productivity…" style={{flex:1,fontSize:13.5,padding:"3px 0",color:t.text}}/>
        <button onClick={()=>send(input)} style={{width:36,height:36,borderRadius:9,background:input.trim()?t.g1:t.surface,border:`1px solid ${input.trim()?t.accent:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,transition:"all .2s",color:input.trim()?"#fff":t.muted,flexShrink:0}}>↑</button>
      </div>
    </div>
  );
}

/* ─── SETTINGS ───────────────────────────────────────────────────────── */
function Settings() {
  const t = useT();
  const { theme, setTheme, user, logout, toast } = useApp();
  const [notifs, setNotifs] = useState({habits:true,tasks:true,goals:false,ai:true});
  return (
    <div className="pg" style={{padding:"clamp(14px,2.5vw,22px)",maxWidth:640}}>
      <div style={{...card(t,{padding:22,marginBottom:12})}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Profile</div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18,flexWrap:"wrap"}}>
          <Avatar name={user?.name||"Alex"} size={56}/>
          <div><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:17}}>{user?.name||"Alex Chen"}</div><div style={{color:t.sub,fontSize:13}}>{user?.email||"alex@lifeos.app"}</div><Badge color={t.accentHi} bg={t.accentLo} style={{marginTop:6}}>Pro Plan ✦</Badge></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
          {[["Full Name",user?.name||"Alex Chen"],["Email",user?.email||"alex@lifeos.app"],["Timezone","America/New_York"]].map(([lbl,val])=>(
            <div key={lbl}><div style={{fontSize:11,color:t.muted,fontWeight:600,marginBottom:5,letterSpacing:.5}}>{lbl.toUpperCase()}</div><input defaultValue={val} style={{width:"100%",padding:"9px 11px",borderRadius:9,background:t.surface,border:`1.5px solid ${t.border}`,fontSize:13,color:t.text}}/></div>
          ))}
        </div>
      </div>
      <div style={{...card(t,{padding:22,marginBottom:12})}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Appearance</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {Object.values(THEMES).map(th=>(
            <button key={th.id} onClick={()=>setTheme(th.id)} style={{flex:1,minWidth:90,padding:"14px",borderRadius:11,background:theme===th.id?t.accentLo:t.surface,border:`${theme===th.id?2:1}px solid ${theme===th.id?t.accent:t.border}`,transition:"all .2s",cursor:"pointer"}}>
              <div style={{fontSize:22,marginBottom:5}}>{th.emoji}</div>
              <div style={{fontSize:12.5,fontWeight:600,color:theme===th.id?t.accentHi:t.sub}}>{th.label}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{...card(t,{padding:22,marginBottom:16})}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Notifications</div>
        {Object.entries(notifs).map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${t.border}`}}>
            <div><div style={{fontSize:13,fontWeight:500,textTransform:"capitalize"}}>{k} Reminders</div><div style={{fontSize:11,color:t.muted}}>Push alerts for {k}</div></div>
            <button onClick={()=>setNotifs(n=>({...n,[k]:!n[k]}))} style={{width:44,height:24,borderRadius:99,background:v?t.g1:t.surface,border:`1px solid ${v?t.accent:t.border}`,position:"relative",transition:"all .28s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:v?23:2,width:20,height:20,borderRadius:"50%",background:"white",transition:"left .25s",boxShadow:"0 2px 6px rgba(0,0,0,.35)"}}/>
            </button>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <Btn onClick={()=>toast("success","Saved!","Settings updated")} style={{flex:1,justifyContent:"center",padding:"12px"}}>Save Changes</Btn>
        <Btn variant="danger" onClick={logout} style={{padding:"12px 20px"}}>Sign Out</Btn>
      </div>
    </div>
  );
}

/* ─── APP SHELL ──────────────────────────────────────────────────────── */
function AppShell({ user, logout }) {
  const [page, setPage]       = useState("dashboard");
  const [collapsed, setCol]   = useState(false);
  const [mobileOpen, setMob]  = useState(false);
  const [cmdOpen, setCmd]     = useState(false);
  const [toasts, setToasts]   = useState([]);
  const [tasks, setTasks]     = useState(SEED_TASKS);
  const [habits, setHabits]   = useState(SEED_HABITS);
  const [goals, setGoals]     = useState(SEED_GOALS);
  const [notes, setNotes]     = useState(SEED_NOTES);
  const [events, setEvents]   = useState(SEED_EVENTS);
  const [theme, setTheme]     = useState("dark");
  const t = THEMES[theme];

  useEffect(()=>injectCSS(t),[theme]);
  useEffect(()=>{
    const h=e=>{if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();setCmd(o=>!o);}};
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h);
  },[]);

  const toast = useCallback((type,title,msg="")=>{
    const id=Date.now()+Math.random();
    setToasts(tt=>[...tt,{id,type,title,msg}]);
    setTimeout(()=>setToasts(tt=>tt.filter(x=>x.id!==id)),4200);
  },[]);
  const removeToast = useCallback(id=>setToasts(tt=>tt.filter(x=>x.id!==id)),[]);
  const navigate    = useCallback(p=>setPage(p),[]);

  const PAGES = {
    dashboard:<Dashboard/>, tasks:<Tasks/>, habits:<Habits/>, goals:<Goals/>,
    notes:<Notes/>, calendar:<Calendar/>, analytics:<Analytics/>, focus:<Focus/>,
    wellness:<Wellness/>, achievements:<Achievements/>, ai:<AIAssistant/>, settings:<Settings/>,
  };

  const ctx = { tasks,setTasks,habits,setHabits,goals,setGoals,notes,setNotes,events,setEvents,theme,setTheme,toast,setCmd,navigate,user,logout };

// Add this inside AppShell, after all the useState declarations
useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  // Load tasks from backend
  fetch('https://lifeos-backend.onrender.com/api/tasks', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(data => { if (data.success && data.data.tasks.length > 0) setTasks(data.data.tasks); })
  .catch(() => {}); // keep seed data if API fails

  // Load habits
  fetch('https://lifeos-backend.onrender.com/api/habits', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(data => { if (data.success && data.data.habits.length > 0) setHabits(data.data.habits); })
  .catch(() => {});

  // Load goals
  fetch('https://lifeos-backend.onrender.com/api/goals', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(data => { if (data.success && data.data.goals.length > 0) setGoals(data.data.goals); })
  .catch(() => {});

}, []);

  return (
    <AppCtx.Provider value={ctx}>
      {/* Full-height flex container — fills 100vh exactly */}
      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:t.bg,position:"relative"}}>
        {/* Ambient background */}
        <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
          <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${t.glow},transparent 70%)`,top:-220,left:-150,filter:"blur(80px)"}}/>
          <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${t.glow},transparent 70%)`,bottom:-100,right:-80,filter:"blur(60px)"}}/>
          {t.id==="neon"&&<div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 1px 1px,${t.accent}05 1px,transparent 0)`,backgroundSize:"42px 42px"}}/>}
        </div>

        <Sidebar active={page} nav={navigate} collapsed={collapsed} setCollapsed={setCol} mobileOpen={mobileOpen} setMobileOpen={setMob}/>

        {/* Main area — fills remaining width, scrolls internally */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden",position:"relative",zIndex:1}}>
          <Topbar page={page} setMobileOpen={setMob}/>
          <main style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>{PAGES[page]||<Dashboard/>}</main>
        </div>

        {/* Mobile FAB */}
        <button className="mobile-only" onClick={()=>setMob(true)} style={{position:"fixed",bottom:20,left:16,zIndex:200,width:48,height:48,borderRadius:"50%",background:t.g1,border:"none",fontSize:20,color:"#fff",boxShadow:`0 8px 28px ${t.glow}`,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
      </div>

      <CmdPalette open={cmdOpen} close={()=>setCmd(false)} nav={p=>{navigate(p);setCmd(false);}}/>
      <ToastContainer toasts={toasts} remove={removeToast}/>
    </AppCtx.Provider>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────── */
export default function LifeOS() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser]     = useState(null);
  const [theme, setTheme]   = useState("dark");
  const t = THEMES[theme];
  useEffect(()=>injectCSS(t),[theme]);

  // Provide minimal context for landing/auth pages
  const ctx = { theme, setTheme, tasks:SEED_TASKS, habits:SEED_HABITS, goals:SEED_GOALS, notes:[], events:[], toast:()=>{}, setCmd:()=>{}, navigate:()=>{}, user, logout:()=>{setAuthed(false);setUser(null);} };

  if(!authed) return (
    <AppCtx.Provider value={ctx}>
      <div style={{width:"100%",height:"100vh",overflow:"auto",background:t.bg}}>
        <Landing onAuth={u=>{setUser(u);setAuthed(true);}}/>
      </div>
    </AppCtx.Provider>
  );

  return <AppShell user={user} logout={()=>{setAuthed(false);setUser(null);}}/>;
}