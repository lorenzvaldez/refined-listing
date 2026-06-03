// ─────────────────────────────────────────────────────────────────────────────
// PASTE THIS BLOCK DIRECTLY ABOVE <Card> in the EmailGate function
// (between the closing </div> of the hero section and the opening <Card>)
// ─────────────────────────────────────────────────────────────────────────────

{/* THE PROBLEM */}
<div style={{
  background:"rgba(201,168,76,0.03)",
  border:"1px solid rgba(201,168,76,0.12)",
  borderRadius:16,
  padding:"28px 24px",
  marginBottom:16,
}}>
  <p style={{
    fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em",
    color:"var(--gold)", textTransform:"uppercase", marginBottom:16,
  }}>The Problem</p>
  <h2 style={{
    fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(20px,3.5vw,28px)",
    fontWeight:300, color:"var(--white)", lineHeight:1.3, marginBottom:16,
  }}>
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
  borderRadius:16,
  padding:"28px 24px",
  marginBottom:16,
}}>
  <p style={{
    fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em",
    color:"var(--gold)", textTransform:"uppercase", marginBottom:16,
  }}>How It Works</p>
  <h2 style={{
    fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(20px,3.5vw,26px)",
    fontWeight:300, color:"var(--white)", lineHeight:1.3, marginBottom:24,
  }}>
    Three steps. Zero compliance risk.
  </h2>
  {[
    { n:"01", title:"Enter your property details", desc:"Bedrooms, bathrooms, key features, neighborhood highlights — just the facts." },
    { n:"02", title:"Choose your tone", desc:"Luxury, modern, warm, investment, or starter. RefinedListing matches your brand voice." },
    { n:"03", title:"Get compliant copy instantly", desc:"MLS-ready, Fair Housing-safe, luxury-caliber listing descriptions. No prompt engineering. No guessing." },
  ].map(step => (
    <div key={step.n} style={{ display:"flex", gap:20, marginBottom:20, alignItems:"flex-start" }}>
      <span style={{
        fontFamily:"'DM Mono',monospace", fontSize:12, color:"var(--gold)",
        minWidth:28, paddingTop:2, flexShrink:0,
      }}>{step.n}</span>
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
  borderRadius:16,
  padding:"28px 24px",
  marginBottom:16,
}}>
  <p style={{
    fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em",
    color:"var(--gold)", textTransform:"uppercase", marginBottom:16,
  }}>Built For</p>
  <h2 style={{
    fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(18px,3vw,24px)",
    fontWeight:300, color:"var(--white)", lineHeight:1.3, marginBottom:20,
  }}>
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
        background:"rgba(201,168,76,0.04)",
        border:"1px solid rgba(201,168,76,0.15)",
        borderRadius:10, padding:"16px",
      }}>
        <p style={{
          fontSize:11, fontWeight:600, color:"var(--gold)",
          marginBottom:6, letterSpacing:"0.03em",
          fontFamily:"'DM Mono',monospace",
        }}>{card.title}</p>
        <p style={{ fontSize:12, color:"rgba(240,236,228,0.55)", lineHeight:1.6, margin:0 }}>{card.desc}</p>
      </div>
    ))}
  </div>
</div>

// ─────────────────────────────────────────────────────────────────────────────
// END OF INSERT — <Card> with "Start Your Free Trial" follows below
// ─────────────────────────────────────────────────────────────────────────────
