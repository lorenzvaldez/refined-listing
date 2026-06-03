import { useState, useEffect } from "react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&family=Outfit:wght@200;300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #080808; --card: #111111;
    --border: rgba(255,255,255,0.06); --border-bright: rgba(255,255,255,0.1);
    --gold: #c9a84c; --gold-dim: rgba(201,168,76,0.12);
    --white: #f0ece4; --muted: rgba(240,236,228,0.45); --dim: rgba(240,236,228,0.2);
    --success: #4caf82;
  }
  body { background: var(--black); color: var(--white); font-family: 'Outfit', sans-serif; font-weight: 300; min-height: 100vh; }
  @keyframes fadeDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const FREE_LIMIT = 3;
const DEMO_PASSWORD = process.env.REACT_APP_DEMO_PASSWORD || "LVAI2026";

const getRefSource = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref") || params.get("utm_source") || "direct";
  } catch { return "direct"; }
};

const addToMailchimp = async (name, email) => {
  try {
    await fetch("/api/mailchimp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
  } catch (e) {
    console.log("Mailchimp sync attempted for:", email);
  }
};

function GoldLine() {
  return <div style={{ width:36, height:1, background:"linear-gradient(90deg,transparent,var(--gold),transparent)", margin:"16px auto", opacity:0.5 }} />;
}

function Card({ children, style={}, delay=0 }) {
  return (
    <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:18,
      padding:"32px", marginBottom:16, position:"relative", overflow:"hidden",
      animation:`fadeUp 0.7s ease ${delay}s both`, ...style }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
        background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.25),transparent)" }} />
      {children}
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.2em",
      color:"var(--gold)", textTransform:"uppercase", marginBottom:20,
      display:"flex", alignItems:"center", gap:12 }}>
      {text}<div style={{ flex:1, height:1, background:"var(--border-bright)" }} />
    </div>
  );
}

function FieldLabel({ text }) {
  return <label style={{ display:"block", fontSize:11, color:"var(--muted)",
    letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8,
    fontFamily:"'DM Mono',monospace" }}>{text}</label>;
}

function Logo() {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:24 }}>
      <div style={{ width:34, height:34, border:"1px solid var(--gold)", borderRadius:7,
        display:"flex", alignItems:"center", justifyContent:"center", background:"var(--gold-dim)" }}>
        <span style={{ fontSize:16, color:"var(--gold)" }}>◆</span>
      </div>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12,
        letterSpacing:"0.18em", color:"var(--gold)", textTransform:"uppercase", fontWeight:300 }}>
        RefinedListing.com
      </span>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ textAlign:"center", marginTop:32 }}>
      <GoldLine />
      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.15em", color:"var(--dim)", textTransform:"uppercase" }}>
        RefinedListing.com — Powered by LVAI.Studios
      </p>
    </div>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { quote:"Done before I finish my coffee. Polished, compliant, sounds better than anything I'd write.", name:"Sarah M.", title:"Realtor® | Oahu" },
  { quote:"Fair housing compliance is always on my mind. RefinedListing keeps language clean every time.", name:"David T.", title:"Broker/Owner | Las Vegas" },
  { quote:"RefinedListing nailed the luxury tone. My clients actually complimented the descriptions.", name:"Priya K.", title:"Luxury Specialist | Honolulu" },
  { quote:"I manage 30+ listings a month. The copy is consistently MLS-ready. Not going back.", name:"Marcus L.", title:"Team Lead | Las Vegas" },
  { quote:"My listing copy used to be my weakest point. Now it's the part I'm most proud of.", name:"Jen R.", title:"Independent Agent | Maui" },
];

// ─── SCREEN 1: EMAIL GATE ────────────────────────────────────────────────────

function EmailGate({ onAccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim()) { setErr("Please enter your name and email."); return; }
    if (!email.includes("@")) { setErr("Please enter a valid email address."); return; }
    setLoading(true);
    await addToMailchimp(name.trim(), email.trim());
    setLoading(false);
    onAccess({ name: name.trim(), email: email.trim() });
  };

  const inp = { width:"100%", background:"#0c0c0c", border:"1px solid var(--border-bright)",
    borderRadius:10, padding:"13px 16px", color:"var(--white)", fontSize:14, fontWeight:300, outline:"none" };

  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:500, margin:"0 auto", padding:"0 20px 80px" }}>

      {/* HERO */}
      <div style={{ textAlign:"center", padding:"64px 0 36px", animation:"fadeDown 0.7s ease both" }}>
        <Logo />
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(38px,6vw,56px)",
          fontWeight:300, lineHeight:1.1, color:"var(--white)", marginBottom:14 }}>
          Your listings.<br/><em style={{ fontStyle:"italic", color:"var(--gold)" }}>Refined.</em>
        </h1>
        <GoldLine />
        <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.7, maxWidth:360, margin:"0 auto" }}>
          MLS-compliant. Luxury-caliber. Generated instantly.
        </p>
      </div>

      {/* THE PROBLEM */}
      <div style={{
        background:"rgba(201,168,76,0.03)",
        border:"1px solid rgba(201,168,76,0.12)",
        borderRadius:16, padding:"28px 24px", marginBottom:16,
      }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em",
          color:"var(--gold)", textTransform:"uppercase", marginBottom:16 }}>The Problem</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(20px,3.5vw,28px)",
          fontWeight:300, color:"var(--white)", lineHeight:1.3, marginBottom:16 }}>
          ChatGPT doesn't know Fair Housing law.<br/>
          <span style={{ color:"var(--gold)", fontStyle:"italic" }}>Your license is on the line.</span>
        </h2>
        <p style={{ fontSize:14, color:"rgba(240,236,228,0.6)", lineHeight:1.8, marginBottom:12 }}>
          Most agents using AI to write listing descriptions don't realize they're generating Fair Housing violations.
          Phrases like "quiet neighborhood," "exclusive," "perfect for families," and "walking distance to church"
          are flagged by MLS auditors as discriminatory code language — and the agent is liable, not the AI.
        </p>
        <p style={{ fontSize:14, color:"rgba(240,236,228,0.6)", lineHeight:1.8, margin:0 }}>
          One violation can mean a <span style={{ color:"var(--white)", fontWeight:500 }}>$16,000 HUD fine</span>,
          an immediate listing removal, and a brokerage investigation.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div style={{
        background:"rgba(201,168,76,0.03)",
        border:"1px solid rgba(201,168,76,0.12)",
        borderRadius:16, padding:"28px 24px", marginBottom:16,
      }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em",
          color:"var(--gold)", textTransform:"uppercase", marginBottom:16 }}>How It Works</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(20px,3.5vw,26px)",
          fontWeight:300, color:"var(--white)", lineHeight:1.3, marginBottom:24 }}>
          Three steps. Zero compliance risk.
        </h2>
        {[
          { n:"01", title:"Enter your property details", desc:"Bedrooms, bathrooms, key features, neighborhood highlights — just the facts." },
          { n:"02", title:"Choose your tone", desc:"Luxury, modern, warm, investment, or starter. RefinedListing matches your brand voice." },
          { n:"03", title:"Get compliant copy instantly", desc:"MLS-ready, Fair Housing-safe, luxury-caliber listing descriptions. No prompt engineering. No guessing." },
        ].map(step => (
          <div key={step.n} style={{ display:"flex", gap:20, marginBottom:20, alignItems:"flex-start" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"var(--gold)",
              minWidth:28, paddingTop:2, flexShrink:0 }}>{step.n}</span>
            <div>
              <p style={{ fontSize:14, fontWeight:500, color:"var(--white)", margin:"0 0 4px" }}>{step.title}</p>
              <p style={{ fontSize:13, color:"rgba(240,236,228,0.55)", lineHeight:1.7, margin:0 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BUILT FOR */}
      <div style={{
        background:"rgba(201,168,76,0.03)",
        border:"1px solid rgba(201,168,76,0.12)",
        borderRadius:16, padding:"28px 24px", marginBottom:16,
      }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em",
          color:"var(--gold)", textTransform:"uppercase", marginBottom:16 }}>Built For</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(18px,3vw,24px)",
          fontWeight:300, color:"var(--white)", lineHeight:1.3, marginBottom:20 }}>
          Every real estate professional<br/>
          <span style={{ color:"var(--gold)", fontStyle:"italic" }}>with something to protect.</span>
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { title:"Independent Agents", desc:"Write compliant listings in seconds without hiring a copywriter." },
            { title:"Luxury Specialists", desc:"Maintain a high-end brand voice while staying fully MLS-compliant." },
            { title:"Brokers & Teams", desc:"Protect your entire office from Fair Housing liability at scale." },
            { title:"Transaction Coordinators", desc:"Catch violations before they hit MLS and cost your clients." },
          ].map(card => (
            <div key={card.title} style={{
              background:"rgba(201,168,76,0.04)", border:"1px solid rgba(201,168,76,0.15)",
              borderRadius:10, padding:"16px",
            }}>
              <p style={{ fontSize:11, fontWeight:600, color:"var(--gold)", marginBottom:6,
                letterSpacing:"0.03em", fontFamily:"'DM Mono',monospace" }}>{card.title}</p>
              <p style={{ fontSize:12, color:"rgba(240,236,228,0.55)", lineHeight:1.6, margin:0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SIGNUP FORM */}
      <Card>
        <SectionLabel text="Start Your Free Trial" />

        <div style={{ background:"var(--gold-dim)", border:"1px solid rgba(201,168,76,0.15)",
          borderRadius:10, padding:"12px 16px", marginBottom:24,
          display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex" }}>
            {["S","M","J","L","R"].map((l,i) => (
              <div key={i} style={{ width:26, height:26, borderRadius:"50%",
                background:`hsl(${i*55+20},35%,28%)`, border:"2px solid var(--black)",
                marginLeft: i ? -7 : 0, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:9, color:"var(--gold)", fontFamily:"'DM Mono',monospace", flexShrink:0 }}>{l}</div>
            ))}
          </div>
          <p style={{ fontSize:11, color:"var(--muted)", fontFamily:"'DM Mono',monospace", letterSpacing:"0.04em" }}>
            47 Las Vegas realtors — compliant listings in seconds
          </p>
        </div>

        <div style={{ marginBottom:14 }}>
          <FieldLabel text="Your Name" />
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Sarah Johnson"
            style={inp}
            onFocus={e=>e.target.style.borderColor="rgba(201,168,76,0.4)"}
            onBlur={e=>e.target.style.borderColor="var(--border-bright)"} />
        </div>
        <div style={{ marginBottom:20 }}>
          <FieldLabel text="Work Email" />
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="sarah@simplyvegasrealty.com" style={inp}
            onFocus={e=>e.target.style.borderColor="rgba(201,168,76,0.4)"}
            onBlur={e=>e.target.style.borderColor="var(--border-bright)"} />
        </div>

        {err && <div style={{ background:"rgba(220,60,60,0.08)", border:"1px solid rgba(220,60,60,0.2)",
          borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:13, color:"#f08080" }}>{err}</div>}

        <button onClick={submit} disabled={loading} style={{
          width:"100%", padding:"16px", borderRadius:12,
          background: loading ? "transparent" : "linear-gradient(135deg,#c9a84c,#e8c96a,#c9a84c)",
          border: loading ? "1px solid var(--gold)" : "none",
          color: loading ? "var(--gold)" : "#080808",
          fontSize:13, fontFamily:"'DM Mono',monospace", letterSpacing:"0.15em", textTransform:"uppercase",
          cursor: loading ? "not-allowed" : "pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        }}>
          {loading
            ? <><div style={{ width:14, height:14, border:"1.5px solid var(--gold)", borderTopColor:"transparent",
                borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />Getting your access...</>
            : <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Start My 3 Free Listings
              </>}
        </button>
        <p style={{ textAlign:"center", fontSize:11, color:"var(--dim)", marginTop:12,
          fontFamily:"'DM Mono',monospace", letterSpacing:"0.07em" }}>
          No credit card · No commitment · Instant access
        </p>
      </Card>

      {/* STAT BOXES */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {[{icon:"⚡",label:"Instant",sub:"Per listing"},{icon:"✦",label:"MLS Ready",sub:"Every time"},{icon:"∞",label:"All Styles",sub:"Luxury to starter"}].map(({icon,label,sub})=>(
          <div key={label} style={{ background:"var(--card)", border:"1px solid var(--border)",
            borderRadius:12, padding:"16px 10px", textAlign:"center" }}>
            <div style={{ fontSize:18, marginBottom:6 }}>{icon}</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"var(--gold)", letterSpacing:"0.08em" }}>{label}</div>
            <div style={{ fontSize:11, color:"var(--dim)", marginTop:2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS */}
      <div style={{ marginTop:32, paddingBottom:16 }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em",
          color:"var(--muted)", textTransform:"uppercase", textAlign:"center", marginBottom:16 }}>
          What Agents Are Saying
        </p>
        {TESTIMONIALS.map((t,i) => (
          <div key={i} style={{ background:"rgba(201,168,76,0.04)", border:"1px solid rgba(201,168,76,0.1)",
            borderRadius:8, padding:"14px 16px", marginBottom:10 }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:12, color:"var(--cream)", lineHeight:1.7,
              fontStyle:"italic", margin:"0 0 8px" }}>"{t.quote}"</p>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"var(--gold)",
              letterSpacing:"0.1em", margin:0 }}>— {t.name}, {t.title}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

// ─── SCREEN 2: APP ───────────────────────────────────────────────────────────
function AppScreen({ user, generationsUsed, setGenerationsUsed, onPaywall, freeLimit }) {
  const [form, setForm] = useState({ address:"",type:"",beds:"",baths:"",sqft:"",price:"",features:"",style:"luxury",tone:"professional" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('listing');
  const remaining = (freeLimit || FREE_LIMIT) - generationsUsed;
  const set = (f,v) => setForm(p=>({...p,[f]:v}));

  const propertyTypes = ["Single Family","Condo","Townhouse","Luxury Estate","Penthouse","Land","Commercial","Multi-Family"];
  const styles = [{value:"luxury",label:"Luxury"},{value:"modern",label:"Modern"},{value:"warm",label:"Warm & Inviting"},{value:"investment",label:"Investment"}];
  const tones = [{value:"professional",label:"Professional"},{value:"storytelling",label:"Storytelling"},{value:"bold",label:"Bold & Direct"},{value:"elegant",label:"Elegant"}];

  const generate = async () => {
    if (!form.address || !form.type) { setError("Please enter a property address and type."); return; }
    if (generationsUsed >= (freeLimit || FREE_LIMIT) && freeLimit < 999) { onPaywall(); return; }
    setError(""); setLoading(true); setResult("");
    const prompt = `You are an elite real estate copywriter writing MLS-ready listing descriptions for top realtors. Write a compelling description for:
Address: ${form.address} | Type: ${form.type} | Beds: ${form.beds||"n/a"} | Baths: ${form.baths||"n/a"} | Sqft: ${form.sqft||"n/a"} | Price: ${form.price?"$"+form.price:"n/a"}
Features: ${form.features||"none specified"} | Style: ${form.style} | Tone: ${form.tone}
Rules: 150-200 words. Powerful hook. No clichés like "nestled" or "boasts". Specific and evocative. End with a call to action. Output the description only.`;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, email: user?.email })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = typeof errData.error === "string" ? errData.error : JSON.stringify(errData.error || res.status);
        setError("Generation failed: " + errMsg);
        setLoading(false);
        return;
      }
      const data = await res.json();
      const text = data.result || "";
      if (!text) { setError("No content returned. Please try again."); setLoading(false); return; }
      setResult(text.trim());
      const newCount = generationsUsed + 1;
      setGenerationsUsed(newCount);
      if (newCount >= (freeLimit || FREE_LIMIT) && freeLimit < 999) {
        setTimeout(() => { onPaywall(); }, 15000);
      }
    } catch (err) {
      setError("Something went wrong: " + err.message);
    }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const reset = () => { setResult(""); setForm({address:"",type:"",beds:"",baths:"",sqft:"",price:"",features:"",style:"luxury",tone:"professional"}); };

  const inp = { width:"100%", background:"#0c0c0c", border:"1px solid var(--border-bright)",
    borderRadius:10, padding:"12px 14px", color:"var(--white)", fontSize:14, fontWeight:300, outline:"none" };
  const focusGold = e => e.target.style.borderColor="rgba(201,168,76,0.4)";
  const blurReset = e => e.target.style.borderColor="var(--border-bright)";

  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:760, margin:"0 auto", padding:"0 20px 80px" }}>
      <div style={{ textAlign:"center", padding:"40px 0 28px", animation:"fadeDown 0.7s ease both" }}>
        <Logo />
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,4vw,46px)",
          fontWeight:300, lineHeight:1.1, color:"var(--white)", marginBottom:10 }}>
          Welcome back, <em style={{ fontStyle:"italic", color:"var(--gold)" }}>{user.name.split(" ")[0]}.</em>
        </h1>
        <GoldLine />

        {/* Tab Navigation */}
        <div style={{ display:"flex", gap:6, marginBottom:20 }}>
          {[
            { label:"Listing Copy", key:"listing", tag:null },
            { label:"Marketing Suite", key:"marketing", tag:"Fall 2026" },
            { label:"Phase 3", key:"phase3", tag:"Winter 2026" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                flex:1, padding:"9px 8px", borderRadius:10, fontSize:10,
                fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em",
                textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
                background: activeTab === tab.key ? "var(--gold)" : "rgba(201,168,76,0.06)",
                border:"1px solid rgba(201,168,76,0.2)",
                color: activeTab === tab.key ? "#080808" : "var(--muted)",
                display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              }}>
              <span>{tab.label}</span>
              {tab.tag && <span style={{
                fontSize:7, background: activeTab === tab.key ? "rgba(0,0,0,0.15)" : "rgba(201,168,76,0.15)",
                color: activeTab === tab.key ? "#080808" : "var(--gold)",
                padding:"1px 5px", borderRadius:6, letterSpacing:"0.1em",
              }}>{tab.tag}</span>}
            </button>
          ))}
        </div>

        {/* Usage dots */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginTop:4,
          background:"var(--card)", border:"1px solid var(--border-bright)", borderRadius:20, padding:"8px 18px" }}>
          {[...Array(3)].map((_,i)=>(
            <div key={i} style={{ width:8, height:8, borderRadius:"50%", transition:"background 0.4s",
              background: i < generationsUsed ? "rgba(201,168,76,0.2)" : "var(--gold)" }} />
          ))}
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, marginLeft:4,
            color:"var(--gold)", letterSpacing:"0.08em" }}>
            {(freeLimit || FREE_LIMIT) >= 999 ? "Demo Mode — Unlimited" : remaining > 0 ? `${remaining} free listing${remaining!==1?"s":""} remaining` : "Upgrade to continue"}
          </span>
        </div>
      </div>

      {activeTab === "phase3" ? (
        <div style={{ padding:"20px 0" }}>
          <div style={{ background:"rgba(201,168,76,0.04)", border:"1px solid rgba(201,168,76,0.12)", borderRadius:10, padding:"20px 24px", marginBottom:16 }}>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.25em", color:"var(--muted)", textTransform:"uppercase", margin:"0 0 10px" }}>Phase 3 — Coming Winter 2026</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:"var(--gold)", margin:"0 0 10px", fontWeight:600 }}>Pricing Justification Copy</p>
            <p style={{ fontFamily:"Georgia,serif", fontSize:12.5, color:"var(--cream)", lineHeight:1.75, margin:"0 0 12px" }}>Turn your CMA data into a seller-ready pricing narrative. Walk into every listing appointment with copy that closes sellers and prevents price reduction battles.</p>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"var(--muted)", letterSpacing:"0.08em", margin:0 }}>Founding members get early access at today's locked rate — forever.</p>
          </div>
          {["Seller-ready pricing narrative from your CMA data","Objection-handling copy for price reduction conversations","Listing appointment presentation scripts","Comparable sales storytelling copy","Seller confidence builder — close more listings"].map(f=>(
            <div key={f} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid rgba(201,168,76,0.1)" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(201,168,76,0.5)", flexShrink:0 }} />
              <span style={{ fontFamily:"Georgia,serif", fontSize:12, color:"var(--cream)" }}>{f}</span>
            </div>
          ))}
        </div>
      ) : activeTab === "marketing" ? (
        <div style={{ padding:"20px 0" }}>
          <div style={{ background:"rgba(201,168,76,0.04)", border:"1px solid rgba(201,168,76,0.12)", borderRadius:10, padding:"20px 24px", marginBottom:16 }}>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.25em", color:"var(--muted)", textTransform:"uppercase", margin:"0 0 10px" }}>Phase 2 — Coming Fall 2026</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:"var(--gold)", margin:"0 0 10px", fontWeight:600 }}>Full Listing Marketing Suite</p>
            <p style={{ fontFamily:"Georgia,serif", fontSize:12.5, color:"var(--cream)", lineHeight:1.75, margin:"0 0 12px" }}>Everything you need to market a listing — MLS-compliant, luxury-caliber, ready in minutes. Built for agents who want to look like they have a full marketing team.</p>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"var(--muted)", letterSpacing:"0.08em", margin:0 }}>Founding members get all Phase 2 features at their locked rate — forever.</p>
          </div>
          {["Instagram caption generator — MLS-compliant, fair housing safe","Email blast templates for new listing announcements","Open house announcement copy for every channel","Brochure & flyer copy — print-ready","MLS-compliant Facebook ad scripts","YouTube property tour scripts"].map(f=>(
            <div key={f} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid rgba(201,168,76,0.1)" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(201,168,76,0.5)", flexShrink:0 }} />
              <span style={{ fontFamily:"Georgia,serif", fontSize:12, color:"var(--cream)" }}>{f}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <Card delay={0.05}>
            <SectionLabel text="Property Details" />
            <div style={{ marginBottom:14 }}>
              <FieldLabel text="Property Address *" />
              <input value={form.address} onChange={e=>set("address",e.target.value)}
                placeholder="123 Desert Rose Drive, Las Vegas, NV 89101"
                style={{...inp,width:"100%"}} onFocus={focusGold} onBlur={blurReset} />
            </div>
            <div style={{ marginBottom:14 }}>
              <FieldLabel text="Property Type *" />
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {propertyTypes.map(t=>(
                  <button key={t} onClick={()=>set("type",t)} style={{
                    padding:"7px 13px", borderRadius:8, fontSize:12, cursor:"pointer", transition:"all 0.2s",
                    background:form.type===t?"var(--gold-dim)":"transparent",
                    border:form.type===t?"1px solid var(--gold)":"1px solid var(--border-bright)",
                    color:form.type===t?"var(--gold)":"var(--muted)"}}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:14 }}>
              {[{f:"beds",l:"Beds",p:"4"},{f:"baths",l:"Baths",p:"3"},{f:"sqft",l:"Sq Ft",p:"2400"},{f:"price",l:"Price ($)",p:"850000"}].map(({f,l,p})=>(
                <div key={f}><FieldLabel text={l} />
                  <input value={form[f]} onChange={e=>set(f,e.target.value)} placeholder={p}
                    style={inp} onFocus={focusGold} onBlur={blurReset} /></div>
              ))}
            </div>
            <div style={{ marginBottom:20 }}>
              <FieldLabel text="Key Features & Highlights" />
              <textarea value={form.features} onChange={e=>set("features",e.target.value)}
                placeholder="Pool, mountain views, chef's kitchen, smart home, 3-car garage, renovated master bath..."
                rows={3} style={{...inp,resize:"vertical",lineHeight:1.6}}
                onFocus={focusGold} onBlur={blurReset} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
              {[{label:"Listing Style",field:"style",options:styles},{label:"Tone",field:"tone",options:tones}].map(({label,field,options})=>(
                <div key={field}><FieldLabel text={label} />
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {options.map(o=>(
                      <button key={o.value} onClick={()=>set(field,o.value)} style={{
                        padding:"9px 14px", borderRadius:8, fontSize:12, cursor:"pointer",
                        transition:"all 0.2s", textAlign:"left",
                        background:form[field]===o.value?"var(--gold-dim)":"transparent",
                        border:form[field]===o.value?"1px solid var(--gold)":"1px solid var(--border-bright)",
                        color:form[field]===o.value?"var(--gold)":"var(--muted)"}}>{o.label}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {error && <div style={{ background:"rgba(220,60,60,0.08)",border:"1px solid rgba(220,60,60,0.2)",
              borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#f08080"}}>{error}</div>}
            <button onClick={generate} disabled={loading || (generationsUsed >= (freeLimit || FREE_LIMIT) && freeLimit < 999)} style={{
              width:"100%",padding:"16px",borderRadius:12,
              background:loading?"transparent":"linear-gradient(135deg,#c9a84c,#e8c96a,#c9a84c)",
              border:loading?"1px solid var(--gold)":"none",
              color:loading?"var(--gold)":"#080808",
              fontSize:13,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",textTransform:"uppercase",
              cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              {loading?<><div style={{width:14,height:14,border:"1.5px solid var(--gold)",borderTopColor:"transparent",
                borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Crafting your listing...</>
                :<><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Generate Listing Description</>}
            </button>
          </Card>

          {result && (
            <Card style={{ border:"1px solid rgba(201,168,76,0.25)" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.2em",
                  color:"var(--gold)",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--success)" }}/>Listing Ready
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--dim)" }}>{result.length} chars</span>
              </div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,
                lineHeight:1.8,color:"var(--white)",borderLeft:"2px solid var(--gold-dim)",
                paddingLeft:20,marginBottom:24}}>{result}</p>
              <div style={{ display:"flex",gap:10 }}>
                <button onClick={copy} style={{ flex:1,padding:"13px",borderRadius:10,cursor:"pointer",transition:"all 0.25s",
                  background:copied?"rgba(76,175,130,0.15)":"var(--gold-dim)",
                  border:copied?"1px solid rgba(76,175,130,0.4)":"1px solid rgba(201,168,76,0.3)",
                  color:copied?"var(--success)":"var(--gold)",
                  fontSize:12,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",textTransform:"uppercase",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {copied?"✓ Copied!":"Copy to Clipboard"}
                </button>
                {["Regenerate","New Listing"].map(label=>(
                  <button key={label} onClick={label==="Regenerate"?generate:reset} style={{
                    padding:"13px 16px",borderRadius:10,cursor:"pointer",background:"transparent",
                    border:"1px solid var(--border-bright)",color:"var(--muted)",
                    fontSize:12,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",textTransform:"uppercase"}}
                    onMouseEnter={e=>{e.target.style.color="var(--gold)";e.target.style.borderColor="rgba(201,168,76,0.3)"}}
                    onMouseLeave={e=>{e.target.style.color="var(--muted)";e.target.style.borderColor="var(--border-bright)"}}>{label}</button>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
      <Footer />
    </div>
  );
}

// ─── SCREEN 3: PAYWALL ───────────────────────────────────────────────────────
function Paywall({ user }) {
  const perks = [
    "Unlimited listing descriptions — forever",
    "All styles: Luxury, Modern, Warm, Investment",
    "All tones: Professional, Storytelling, Bold, Elegant",
    "Priority support directly from the founder",
    "Founding rate locked in — never increases",
  ];
  return (
    <div style={{ position:"relative",zIndex:1,maxWidth:500,margin:"0 auto",padding:"0 20px 80px" }}>
      <div style={{ textAlign:"center",padding:"72px 0 36px",animation:"fadeDown 0.7s ease both" }}>
        <Logo />
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(32px,5vw,48px)",
          fontWeight:300,lineHeight:1.1,color:"var(--white)",marginBottom:14}}>
          You've used your<br/><em style={{ fontStyle:"italic",color:"var(--gold)" }}>3 free listings.</em>
        </h1>
        <GoldLine />
        <p style={{ fontSize:14,color:"var(--muted)",lineHeight:1.7,maxWidth:340,margin:"0 auto" }}>
          {user.name.split(" ")[0]}, you're already saving real time. Keep that momentum — unlock unlimited listings today.
        </p>
      </div>

      <Card>
        <SectionLabel text="Unlock Full Access" />
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:68,
              fontWeight:300, color:"var(--gold)", lineHeight:1 }}>$97</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"var(--muted)" }}>/month</span>
          </div>
          <p style={{ fontSize:12, color:"var(--dim)", marginTop:4,
            fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em" }}>Cancel anytime · Instant access</p>
        </div>

        <div style={{ marginBottom:28 }}>
          {perks.map(perk=>(
            <div key={perk} style={{ display:"flex",alignItems:"center",gap:12,
              padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{ width:18,height:18,borderRadius:"50%",background:"var(--gold-dim)",
                border:"1px solid rgba(201,168,76,0.3)",display:"flex",alignItems:"center",
                justifyContent:"center",flexShrink:0}}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4l2 2 4-4" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize:13,color:"var(--muted)"}}>{perk}</span>
            </div>
          ))}
        </div>

        {/* COMING SOON */}
        <div style={{ margin:"0 0 24px", padding:"16px", borderRadius:10,
          border:"1px solid rgba(201,168,76,0.2)", background:"rgba(201,168,76,0.04)" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em",
            color:"var(--gold)", textTransform:"uppercase", marginBottom:12,
            display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)" }} />
            Coming Soon — Full Listing Marketing Suite
          </div>
          {["Instagram caption generator","Open house announcement copy","Email blast templates",
            "Brochure & flyer copy","MLS-compliant Facebook ad copy","YouTube property tour scripts"].map(feature => (
            <div key={feature} style={{ display:"flex", alignItems:"center", gap:8,
              padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)",
              fontSize:12, color:"var(--muted)" }}>
              <span style={{ color:"var(--gold)", fontSize:10 }}>◆</span>
              {feature}
            </div>
          ))}
          <p style={{ marginTop:12, fontSize:11, color:"var(--gold)",
            fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em", lineHeight:1.5 }}>
            Founding members get all future features at their locked rate — forever.
          </p>
        </div>

        {/* PHASE 3 TEASER */}
        <div style={{ margin:"32px 0 8px", background:"rgba(201,168,76,0.04)",
          border:"1px solid rgba(201,168,76,0.12)", borderRadius:10, padding:"20px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(201,168,76,0.5)" }} />
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.25em",
              color:"var(--muted)", textTransform:"uppercase" }}>Phase 3 — Coming Winter 2026</span>
          </div>
          <p style={{ fontFamily:"Georgia,serif", fontSize:15, color:"var(--gold)",
            margin:"0 0 8px", fontWeight:600, letterSpacing:"0.02em" }}>Pricing Justification Copy</p>
          <p style={{ fontFamily:"Georgia,serif", fontSize:12.5, color:"var(--cream)",
            lineHeight:1.75, margin:"0 0 12px" }}>
            Turn your CMA data into a seller-ready pricing narrative that closes listing
            appointments and prevents price reduction battles.
          </p>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"var(--muted)",
            letterSpacing:"0.08em", margin:0 }}>
            Founding members get early access at today's locked rate — forever.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ margin:"32px 0 8px" }}>
          <GoldLine />
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.2em",
            color:"var(--muted)", textTransform:"uppercase", margin:"16px 0 20px", textAlign:"center" }}>
            Frequently Asked Questions
          </p>
          {[
            { q:"Is this just ChatGPT?", a:"No. RefinedListing is pre-trained specifically on real estate data, MLS requirements, and fair housing law. Generic AI tools like ChatGPT can accidentally violate fair housing regulations. Every output from RefinedListing is compliant by design." },
            { q:"How is this different from other AI writing tools?", a:"Most AI tools require you to know how to prompt them. RefinedListing requires zero prompt engineering. Just fill in your property details, pick a style and tone, and hit generate. It thinks like a realtor." },
            { q:"Can I cancel anytime?", a:"Yes — cancel anytime, no questions asked. Just email lorenz@refinedlisting.com and we'll handle it immediately." },
            { q:"What is the Full Listing Marketing Suite?", a:"Coming Fall 2026 — Instagram captions, email blast templates, open house copy, brochure copy, Facebook ad scripts, and more. Founding members get all of it at today's locked price forever." },
            { q:"Is my listing data stored?", a:"No. Your property details are processed in real time to generate your description and are not stored or used for training." },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom:"1px solid rgba(201,168,76,0.15)", paddingBottom:14, marginBottom:14 }}>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--gold)",
                letterSpacing:"0.05em", margin:"0 0 6px", fontWeight:600 }}>{item.q}</p>
              <p style={{ fontFamily:"Georgia,serif", fontSize:12, color:"var(--cream)",
                lineHeight:1.7, margin:0 }}>{item.a}</p>
            </div>
          ))}
        </div>

        <a href="https://buy.stripe.com/9B6bJ31oL8sFdXu2gh8IU00" target="_blank" rel="noopener noreferrer"
          style={{ textDecoration:"none", display:"block", marginTop:20 }}>
          <div style={{ width:"100%", padding:"16px", borderRadius:12,
            background:"linear-gradient(135deg,#c9a84c,#e8c96a,#c9a84c)",
            color:"#080808", fontSize:14, fontWeight:700, textAlign:"center",
            fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}>
            Unlock Full Access — $97/mo
          </div>
        </a>
        <p style={{ textAlign:"center", fontSize:11, color:"var(--dim)", marginTop:12,
          fontFamily:"'DM Mono',monospace", letterSpacing:"0.07em" }}>
          Cancel anytime · email <a href="mailto:lorenz@refinedlisting.com"
            style={{ color:"var(--gold)", textDecoration:"none" }}>lorenz@refinedlisting.com</a>
        </p>
      </Card>

      <Card style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,
          fontStyle:"italic",color:"var(--white)",lineHeight:1.7,marginBottom:14}}>
          "I used to dread writing listing descriptions. Now I do it between showings. Total game changer."
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,
          color:"var(--gold)",letterSpacing:"0.15em",textTransform:"uppercase"}}>
          — Las Vegas Founding Member
        </div>
      </Card>
      <Footer />
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function RefinedListing() {
  const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const isDemo = urlParams.get("demo") === DEMO_PASSWORD;
  const [screen, setScreen] = useState(isDemo ? "app" : "gate");
  const [user, setUser] = useState(isDemo ? { name: "Demo Mode", email: "demo@refinedlisting.com" } : null);
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const freeLimit = isDemo ? 999 : FREE_LIMIT;

  useEffect(() => {
    if (user && user.email && !isDemo) {
      fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, action: "check" })
      })
        .then(r => r.json())
        .then(d => {
          if (d.used !== undefined) {
            setGenerationsUsed(d.used);
            if (d.used >= FREE_LIMIT) setScreen("paywall");
          }
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
        background:"radial-gradient(ellipse 80% 60% at 70% -10%,rgba(201,168,76,0.05) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 20% 100%,rgba(201,168,76,0.03) 0%,transparent 60%)"}} />
      {screen==="gate" && <EmailGate onAccess={u=>{setUser(u);setScreen("app");}} />}
      {screen==="app" && user && <AppScreen user={user} generationsUsed={generationsUsed}
        setGenerationsUsed={setGenerationsUsed} onPaywall={()=>setScreen("paywall")} freeLimit={freeLimit} />}
      {screen==="paywall" && user && <Paywall user={user} />}
    </>
  );
}
