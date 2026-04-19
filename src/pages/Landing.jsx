import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';

/* ─── Inline keyframes injected once ─── */
const STYLE = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239,68,68,0.45); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 16px rgba(239,68,68,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  .landing-nav-btn:hover { background: var(--bg-surface-3) !important; }
  .cta-primary:hover { transform: translateY(-3px) !important; box-shadow: 0 20px 40px -8px rgba(239,68,68,0.55) !important; }
  .cta-secondary:hover { background: var(--bg-surface-3) !important; opacity: 0.9; }
  .coverage-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.15) !important; border-color: var(--hov-color) !important; }
  [data-theme="dark"] .coverage-card:hover { box-shadow: 0 16px 40px rgba(0,0,0,0.45) !important; }
  .coverage-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
  .score-tier:hover { transform: translateX(4px); background: var(--bg-surface-3) !important; }
  .score-tier { transition: transform 0.2s ease, background 0.2s ease; }
`;

/* ─── Brain SVG Icon ─── */
import { useStaticData } from '../data/useStaticData';

const BrainIcon = ({ size = 40, color = 'var(--red)' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8C23.2 8 16 15.2 16 24c0 4.4 1.7 8.4 4.4 11.4C17.3 37.4 16 40.5 16 44c0 6.6 5.4 12 12 12h8c6.6 0 12-5.4 12-12 0-3.5-1.3-6.6-4.4-8.6C46.3 32.4 48 28.4 48 24c0-8.8-7.2-16-16-16z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 24c0-4.4 3.6-8 8-8M32 16v4M24 28h4M36 28h4M26 36c1.6 1.2 3.6 2 6 2s4.4-.8 6-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="24" r="3" fill="currentColor" fillOpacity="0.6" />
  </svg>
);

/* ─── Section data ─── */
const COVERAGE = [
  { icon: '🧠', color: 'var(--red)', hov: 'var(--red-border)', label: 'Symptom Awareness', desc: 'Do people recognize warning signs like sudden weakness, speech difficulty, or vision problems?' },
  { icon: '⚠️', color: 'var(--amber)', hov: 'var(--amber-border)', label: 'Risk Factor Awareness', desc: 'Understanding of conditions like hypertension, diabetes, smoking, and lifestyle risks.' },
  { icon: '🚑', color: 'var(--blue)', hov: 'var(--blue-border)', label: 'Response Behavior', desc: 'What actions people take during a stroke — who they contact and how quickly they respond.' },
  { icon: '👥', color: '#8b5cf6', hov: 'rgba(139,92,246,0.35)', label: 'Demographic Breakdown', desc: 'Analysis across age groups, gender, education levels, and income categories.' },
];

const DIMENSIONS = [
  'Recognition of stroke symptoms',
  'Knowledge of risk factors',
  'Understanding of urgency (golden hour response)',
  'Preferred first response / action taken',
  'Exposure to healthcare information',
];

/* ─── Component ─── */
const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const { data: dashboardData, loading, error } = useStaticData('/dashboard');

  /* Smooth fade-in for each animated section on scroll */
  useEffect(() => {
    const els = document.querySelectorAll('.land-anim');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('land-visible'); }),
      { threshold: 0.15 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'inherit' }}>Loading...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--red)', fontFamily: 'inherit' }}>Error: Backend Not Found. Please start the backend server.</div>;
  if (!dashboardData) return null;

  const SCORE_TIERS = [
    { dot: 'var(--red)', bg: 'var(--red-bg)', border: 'var(--red-border)', label: 'Low Awareness', sub: 'Limited knowledge, high risk', value: `${dashboardData.kpi.lowPercent}%` },
    { dot: 'var(--amber)', bg: 'var(--amber-bg)', border: 'var(--amber-border)', label: 'Moderate Awareness', sub: 'Partial understanding', value: `${dashboardData.kpi.moderatePercent}%` },
    { dot: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-border)', label: 'High Awareness', sub: 'Well-informed and responsive', value: `${dashboardData.kpi.highPercent}%` },
  ];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <style>{STYLE}</style>
      <style>{`
        .land-anim { opacity: 1; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .land-anim.land-visible { opacity: 1; transform: translateY(0); }
        .land-anim:nth-child(2) { transition-delay: 0.1s; }
        .land-anim:nth-child(3) { transition-delay: 0.18s; }
        .land-anim:nth-child(4) { transition-delay: 0.26s; }
        .land-anim:nth-child(5) { transition-delay: 0.34s; }

        /* ── Light mode overrides ── */
        [data-theme="light"] .landing-root {
          background: var(--bg-page) !important;
          color: var(--text-primary) !important;
        }
        [data-theme="light"] .landing-nav {
          background: rgba(244,245,247,0.88) !important;
          border-bottom: 1px solid var(--border) !important;
        }
        [data-theme="light"] .landing-nav-btn {
          color: var(--text-secondary) !important;
          border-color: var(--border) !important;
        }
        [data-theme="light"] .landing-brand-text { color: var(--text-primary) !important; }
        [data-theme="light"] .landing-hero-h1 {
          background-image: linear-gradient(135deg, #111827 30%, #6b7280 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        [data-theme="light"] .landing-subtitle { color: var(--text-secondary) !important; }
        [data-theme="light"] .landing-subtitle strong { color: var(--text-primary) !important; }
        [data-theme="light"] .landing-body-text { color: var(--text-muted) !important; }
        [data-theme="light"] .land-section-bg {
          background: var(--bg-surface) !important;
          border-color: var(--border) !important;
        }
        [data-theme="light"] .land-card-bg {
          background: var(--bg-surface-2) !important;
          border-color: var(--border) !important;
        }
        [data-theme="light"] .land-card-text { color: var(--text-secondary) !important; }
        [data-theme="light"] .land-card-subtext { color: var(--text-muted) !important; }
        [data-theme="light"] .land-card-title { color: var(--text-primary) !important; }
        [data-theme="light"] .land-footer {
          background: var(--bg-surface-2) !important;
          border-top-color: var(--border) !important;
        }
        [data-theme="light"] .land-footer-text { color: var(--text-muted) !important; }
        [data-theme="light"] .land-footer-label { color: var(--text-primary) !important; }
        [data-theme="light"] .land-stat-value { color: var(--text-primary) !important; }
        [data-theme="light"] .land-stat-label { color: var(--text-muted) !important; }
        [data-theme="light"] .land-dim-item { color: var(--text-secondary) !important; }
        [data-theme="light"] .land-section-heading { color: var(--text-primary) !important; }
        [data-theme="light"] .land-section-sub { color: var(--text-muted) !important; }
        [data-theme="light"] .score-tier {
          background: var(--bg-surface-2) !important;
          border-color: var(--border) !important;
        }
        [data-theme="light"] .land-anim-card {
          background: rgba(239,68,68,0.05) !important;
          border-color: rgba(239,68,68,0.2) !important;
        }
        [data-theme="light"] .land-theme-toggle {
          background: var(--bg-surface-3) !important;
          border-color: var(--border) !important;
          color: var(--text-secondary) !important;
        }
      `}</style>

      <div className="landing-root" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", overflowX: 'hidden', transition: 'background 0.25s ease, color 0.25s ease' }}>

        {/* ════════════════════════════ NAV ════════════════════════════ */}
        <nav className="landing-nav" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 48px',
          background: 'rgba(10,14,26,0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          transition: 'background 0.25s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainIcon size={28} color="var(--red)" />
            <span className="landing-brand-text" style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
              Stroke<span style={{ color: 'var(--red)' }}>Awareness</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[
              { label: 'Purpose', id: 'purpose' },
              { label: 'Coverage', id: 'coverage' },
              { label: 'Scoring', id: 'scoring' },
            ].map(n => (
              <button key={n.id} className="landing-nav-btn" onClick={() => scrollTo(n.id)} style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', padding: '7px 14px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s ease',
              }}>{n.label}</button>
            ))}
            {/* Theme toggle — same as dashboard */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="land-theme-toggle"
              style={{
                background: 'var(--bg-surface-3)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)', padding: '7px 12px', borderRadius: '8px',
                fontSize: '15px', cursor: 'pointer', lineHeight: 1,
                transition: 'background 0.2s ease',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
              <span style={{ fontSize: '12px', fontWeight: 500 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </nav>

        {/* ════════════════════════════ HERO ════════════════════════════ */}
        <section ref={heroRef} style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Background blobs */}
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '860px', textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp 0.9s ease-out forwards' }}>

            {/* Animated brain icon */}
            <div style={{ animation: 'float 4s ease-in-out infinite', marginBottom: '28px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse-ring 2.5s ease-in-out infinite',
              }}>
                <BrainIcon size={44} color="#ef4444" />
              </div>
            </div>

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '999px',
              border: '1px solid var(--red-border)', background: 'var(--red-bg)',
              color: 'var(--red)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', marginBottom: '28px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block', animation: 'pulse-ring 2s infinite' }} />
              2025 Research Insights
            </div>

            {/* Headline */}
            <h1 className="landing-hero-h1" style={{
              fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.04em', marginBottom: '24px',
              backgroundImage: theme === 'dark'
                ? 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)'
                : 'linear-gradient(135deg, #111827 30%, #4b5563 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              BrainLine<br />Brain Stroke Awareness Dashboard
            </h1>

            {/* Subtitle */}
            <p className="landing-subtitle" style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '620px', marginBottom: '20px' }}>
              Analyzing stroke awareness levels across{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{dashboardData.kpi.totalRespondents.toLocaleString()} respondents</span>{' '}
              to identify knowledge gaps and improve early response.
            </p>
            <p className="landing-body-text" style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '540px', marginBottom: '48px' }}>
              Stroke is a leading cause of death and disability, yet many cases are preventable. This dashboard reveals exactly where the public's knowledge fails.
            </p>

            {/* Stat chips */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '52px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { emoji: '🔴', color: 'var(--red)', stat: `${dashboardData.kpi.lowPercent}%`, label: 'Low Awareness' },
                { emoji: '🟡', color: 'var(--amber)', stat: `${dashboardData.kpi.moderatePercent}%`, label: 'Moderate' },
                { emoji: '🟢', color: 'var(--green)', stat: `${dashboardData.kpi.highPercent}%`, label: 'High Awareness' },
              ].map(c => (
                <div key={c.label} style={{
                  background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                  padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span>{c.emoji}</span>
                  <span style={{ color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>{c.stat}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="cta-primary" onClick={() => navigate('/overview')} style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#fff', border: 'none', padding: '16px 36px',
                fontSize: '16px', fontWeight: 700, borderRadius: '999px', cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(239,68,68,0.4)',
                transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                Explore Dashboard →
              </button>
              <button className="cta-secondary" onClick={() => scrollTo('purpose')} style={{
                background: 'var(--bg-surface-3)', color: 'var(--text-primary)', border: '1px solid var(--border)',
                padding: '16px 36px', fontSize: '16px', fontWeight: 700, borderRadius: '999px',
                cursor: 'pointer', transition: 'all 0.3s ease',
              }}>
                View Research Goals
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════ PURPOSE ════════════════════════════ */}
        <section id="purpose" style={{ padding: '96px 48px', maxWidth: '1100px', margin: '0 auto' }}>
          <div className="land-anim" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', fontWeight: 600 }}>Why This Matters</span>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '12px', marginBottom: '20px', lineHeight: 1.15 }}>
                Time is Brain.<br /><span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '80%' }}>Every second counts.</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '15px', marginBottom: '20px' }}>
                Stroke is a leading cause of death and disability, yet many cases are preventable through early detection and timely action. However, awareness of key symptoms and emergency response remains dangerously low.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '14px' }}>
                This dashboard bridges the gap by analyzing real-world awareness data and identifying areas where education and intervention are needed most.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { color: 'var(--red)', bg: 'var(--red-bg)', border: 'var(--red-border)', title: 'The Problem', text: 'Most people cannot identify a stroke in time. Delayed action means irreversible brain damage.' },
                { color: 'var(--blue)', bg: 'var(--blue-bg)', border: 'var(--blue-border)', title: 'Our Approach', text: `We surveyed ${dashboardData.kpi.totalRespondents.toLocaleString()} people to map awareness levels across dimensions of symptom recognition, risk factor knowledge, and emergency behavior.` },
                { color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-border)', title: 'The Goal', text: 'Translate data into targeted recommendations for community health programs and policy interventions.' },
              ].map(c => (
                <div key={c.title} className="land-anim" style={{
                  background: c.bg, border: `1px solid ${c.border}`, borderLeft: `4px solid ${c.color}`,
                  borderRadius: '12px', padding: '16px 20px',
                }}>
                  <p style={{ color: c.color, fontWeight: 700, fontSize: '13px', margin: '0 0 6px' }}>{c.title}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)', marginX: 'auto' }} />

        {/* ════════════════════════════ COVERAGE ════════════════════════════ */}
        <section id="coverage" style={{ padding: '96px 48px', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="land-anim" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', fontWeight: 600 }}>What the Dashboard Covers</span>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '12px', marginBottom: '12px' }}>
              Five Dimensions of Awareness
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '520px', margin: '0 auto' }}>
              Each section of the dashboard dives deep into a critical facet of stroke awareness.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {COVERAGE.map((c, i) => (
              <div key={c.label} className="coverage-card land-anim" style={{
                '--hov-color': c.hov,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '28px 22px',
                display: 'flex', flexDirection: 'column', gap: '12px',
                boxShadow: theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)',
                animationDelay: `${i * 0.08}s`,
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: `${c.color}18`, border: `1px solid ${c.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                }}>{c.icon}</div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '15px', margin: 0 }}>{c.label}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />

        {/* ════════════════════════════ SCORING ════════════════════════════ */}
        <section id="scoring" style={{ padding: '96px 48px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
            <div className="land-anim">
              <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', fontWeight: 600 }}>How It Works</span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '12px', marginBottom: '20px' }}>
                How the Awareness Score Is Calculated
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '15px', marginBottom: '28px' }}>
                Awareness is calculated based on <strong style={{ color: 'var(--text-primary)' }}>multiple dimensions</strong>, not just symptom recall. This gives a richer picture of true preparedness:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {DIMENSIONS.map((d, i) => (
                  <li key={i} className="land-anim" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{
                      minWidth: '24px', height: '24px', borderRadius: '50%',
                      background: 'var(--amber-bg)', border: '1px solid var(--amber-border)',
                      color: 'var(--amber)', fontSize: '11px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{i + 1}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="land-anim" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: '4px' }}>Classification System</p>
              {SCORE_TIERS.map(t => (
                <div key={t.label} className="score-tier" style={{
                  background: t.bg, border: `1px solid ${t.border}`,
                  borderRadius: '12px', padding: '18px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.dot, flexShrink: 0, boxShadow: `0 0 8px ${t.dot}` }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px', margin: '0 0 2px' }}>{t.label}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{t.sub}</p>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', fontWeight: 700, color: t.dot }}>{t.value}</span>
                </div>
              ))}
              <div style={{
                marginTop: '8px', background: 'var(--blue-bg)', border: '1px solid var(--blue-border)',
                borderRadius: '12px', padding: '16px 20px',
              }}>
                <p style={{ color: 'var(--blue)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                  💡 This scoring helps identify <strong>vulnerable populations</strong> and target awareness efforts effectively.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ════════════════════════════ FOOTER ════════════════════════════ */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '56px 48px 40px',
          background: 'var(--bg-surface-3)',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
              {[
                { label: '📋 Data Source', text: `Survey conducted across Thane & Mumbai with ${dashboardData.kpi.totalRespondents.toLocaleString()} participants.` },
                { label: '🔬 Methodology', text: 'Structured questionnaire covering awareness, behavior, and risk understanding.' },
                { label: '🔒 Privacy Note', text: 'All responses are anonymized and used solely for research and awareness purposes.' },
                { label: '👩‍💻 Project By', text: 'Harshali Gaikwad , Siddhi Mankar ,Sri satya , Komal Bhat — Research Dashboard, TY Mini Project.' },
              ].map(f => (
                <div key={f.label}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '13px', marginBottom: '10px' }}>{f.label}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>{f.text}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BrainIcon size={22} color="var(--red)" />
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Stroke Awareness Dashboard · 2025</span>
              </div>
              <button onClick={() => navigate('/overview')} style={{
                background: 'linear-gradient(135deg, var(--red), #b91c1c)',
                color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '999px',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}>
                Enter Dashboard →
              </button>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Landing;
