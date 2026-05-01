import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { useStaticData } from '../data/useStaticData';

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
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.4; }
    50%      { opacity: 0.8; }
  }
  .landing-nav-btn:hover { background: var(--bg-surface-3) !important; transform: translateY(-1px); }
  .landing-nav-btn { transition: all 0.2s ease; }
  .cta-primary:hover { transform: translateY(-3px) scale(1.02) !important; box-shadow: 0 20px 40px -8px rgba(239,68,68,0.55) !important; }
  .cta-secondary:hover { background: var(--bg-surface-3) !important; transform: translateY(-2px); border-color: var(--red-border) !important; }
  .cta-secondary { transition: all 0.3s ease; }
  .coverage-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.18) !important; border-color: var(--hov-color) !important; }
  [data-theme="dark"] .coverage-card:hover { box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important; }
  .coverage-card { transition: transform 0.35s cubic-bezier(.22,.61,.36,1), box-shadow 0.35s ease, border-color 0.3s ease; }
  .score-tier:hover { transform: translateX(6px); background: var(--bg-surface-3) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .score-tier { transition: all 0.25s cubic-bezier(.22,.61,.36,1); }
  .stat-chip { transition: all 0.3s ease; }
  .stat-chip:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .hero-mesh { background-size: 400% 400%; animation: gradientShift 12s ease infinite; }
`;

/* ─── Brain SVG Icon ─── */

const BrainIcon = ({ size = 40, color = 'var(--red)' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8C23.2 8 16 15.2 16 24c0 4.4 1.7 8.4 4.4 11.4C17.3 37.4 16 40.5 16 44c0 6.6 5.4 12 12 12h8c6.6 0 12-5.4 12-12 0-3.5-1.3-6.6-4.4-8.6C46.3 32.4 48 28.4 48 24c0-8.8-7.2-16-16-16z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 24c0-4.4 3.6-8 8-8M32 16v4M24 28h4M36 28h4M26 36c1.6 1.2 3.6 2 6 2s4.4-.8 6-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="24" r="3" fill="currentColor" fillOpacity="0.6" />
  </svg>
);

/* ─── Section data ─── */
const COVERAGE = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>, color: 'var(--red)', hov: 'var(--red-border)', label: 'Symptom Awareness', desc: 'Do people recognize warning signs like sudden weakness, speech difficulty, or vision problems?' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>, color: 'var(--amber)', hov: 'var(--amber-border)', label: 'Risk Factor Awareness', desc: 'Understanding of conditions like hypertension, diabetes, smoking, and lifestyle risks.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="9" y1="9" x2="9" y2="11"/></svg>, color: 'var(--blue)', hov: 'var(--blue-border)', label: 'Response Behavior', desc: 'What actions people take during a stroke — who they contact and how quickly they respond.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: '#8b5cf6', hov: 'rgba(139,92,246,0.35)', label: 'Demographic Breakdown', desc: 'Analysis across age groups, gender, education levels, and income categories.' },
];

const DIMENSIONS = [
  'Recognition of stroke symptoms',
  'Knowledge of risk factors',
  'Understanding of urgency (golden hour response)',
  'Demographic and socioeconomic correlations',
];

/* ─── Component ─── */
const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { data: dashboardData, loading } = useStaticData("/analytics/dashboard-stats.json");

  const kpi = dashboardData?.kpi || {};

  const SCORE_TIERS = [
    { dot: 'var(--red)', bg: 'var(--red-bg)', border: 'var(--red-border)', label: 'Low Awareness', sub: 'Limited knowledge, high risk', value: `${kpi.lowPercent ?? '—'}%` },
    { dot: 'var(--amber)', bg: 'var(--amber-bg)', border: 'var(--amber-border)', label: 'Moderate Awareness', sub: 'Partial understanding', value: `${kpi.moderatePercent ?? '—'}%` },
    { dot: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-border)', label: 'High Awareness', sub: 'Well-informed and responsive', value: `${kpi.highPercent ?? '—'}%` },
  ];

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

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <style>{STYLE}</style>
      <style>{`
        .land-anim { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
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
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 48px',
          background: 'transparent',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainIcon size={28} color="#ef4444" />
            <span className="landing-brand-text" style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Stroke<span style={{ color: '#ef4444' }}>Awareness</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[
              { label: 'Purpose', id: 'purpose' },
              { label: 'Coverage', id: 'coverage' },
              { label: 'Scoring', id: 'scoring' },
            ].map(n => (
              <button key={n.id} className="landing-nav-btn" onClick={() => scrollTo(n.id)} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff', padding: '7px 14px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
                backdropFilter: 'blur(4px)'
              }}>{n.label}</button>
            ))}
            <a href={import.meta.env.VITE_PREDICTION_URL || "https://stroke-prediction-placeholder.vercel.app"} target="_blank" rel="noopener noreferrer" className="landing-nav-btn" style={{
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)',
              color: '#ffffff', padding: '7px 14px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              Risk Predictor
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </nav>

        {/* ════════════════════════════ HERO ════════════════════════════ */}
        <section ref={heroRef} style={{
          minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '100px 24px 80px', position: 'relative', overflow: 'hidden',
          backgroundColor: '#0a0e1a' // Force dark background
        }}>
          {/* Background Video - Fully visible now */}
          <video autoPlay loop muted playsInline style={{
            position: 'absolute', inset: 0, zIndex: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: 0.85, // High opacity so the video is vivid
            mixBlendMode: 'screen', // Keeps the glowing effect clean
            transition: 'opacity 0.3s ease'
          }}>
            <source src="/brain_animation.mp4" type="video/mp4" />
          </video>

          {/* Dark Gradient Overlay for Text Readability */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: 'linear-gradient(to bottom, rgba(10,14,26,0.4) 0%, rgba(10,14,26,0.7) 70%, #0a0e1a 100%)',
          }} />

          <div style={{ maxWidth: '900px', textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp 0.9s ease-out forwards' }}>

            {/* Subtle Brain Icon */}
            <div style={{ animation: 'float 4s ease-in-out infinite', marginBottom: '24px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BrainIcon size={36} color="#ef4444" />
              </div>
            </div>

            {/* Initiative Link */}
            <a href="https://brainline.info/" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
              color: '#cbd5e1', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em',
              textTransform: 'uppercase', marginBottom: '24px', textDecoration: 'none',
              backdropFilter: 'blur(8px)', transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#cbd5e1'; }}>
              A BrainLine Initiative
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>

            {/* Headline */}
            <h1 className="landing-hero-h1" style={{
              fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 800, lineHeight: 1.1,
              letterSpacing: '-0.02em', marginBottom: '24px', 
              color: '#ffffff', // Forced white text
              textShadow: '0 4px 20px rgba(0,0,0,0.8)' // Ensures readability over the video
            }}>
              BrainLine<br /><span style={{ fontSize: '85%', fontWeight: 600, color: '#e2e8f0', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Stroke Awareness Dashboard</span>
            </h1>

            {/* Subtitle */}
            <p className="landing-subtitle" style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#f8fafc', lineHeight: 1.6, maxWidth: '640px', marginBottom: '36px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              Analyzing stroke awareness levels across{' '}
              <span style={{ color: '#ef4444', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{(kpi.totalRespondents || 6168).toLocaleString()}</span>{' '}
              respondents to identify knowledge gaps and improve early response.
            </p>

            {/* CTAs (Moved up for visibility) */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' }}>
              <button className="cta-primary" onClick={() => navigate('/overview')} style={{
                background: '#3b82f6', color: '#fff', border: 'none', padding: '14px 32px',
                fontSize: '15px', fontWeight: 600, borderRadius: '8px', cursor: 'pointer',
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(59,130,246,0.4)'
              }}>
                Explore Dashboard
                <span style={{ fontSize: '16px' }}>→</span>
              </button>
              <button className="cta-secondary" onClick={() => scrollTo('purpose')} style={{
                background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)',
                padding: '14px 32px', fontSize: '15px', fontWeight: 600, borderRadius: '8px',
                cursor: 'pointer', transition: 'all 0.2s ease', backdropFilter: 'blur(8px)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                View Research Goals
              </button>
              <a href={import.meta.env.VITE_PREDICTION_URL || "https://stroke-prediction-placeholder.vercel.app"} target="_blank" rel="noopener noreferrer" className="cta-secondary" style={{
                background: 'rgba(139,92,246,0.1)', color: '#ffffff', border: '1px solid rgba(139,92,246,0.4)',
                padding: '14px 32px', fontSize: '15px', fontWeight: 600, borderRadius: '8px',
                cursor: 'pointer', transition: 'all 0.2s ease', backdropFilter: 'blur(8px)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}>
                Try Risk Predictor
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>

            {/* Professional Stat chips (Moved down and compacted) */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { color: '#ef4444', stat: `${kpi.lowPercent ?? '—'}%`, label: 'Low Awareness' },
                { color: '#f59e0b', stat: `${kpi.moderatePercent ?? '—'}%`, label: 'Moderate Awareness' },
                { color: '#10b981', stat: `${kpi.highPercent ?? '—'}%`, label: 'High Awareness' },
              ].map(c => (
                <div key={c.label} className="stat-chip" style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '10px 20px', borderRadius: '8px', backdropFilter: 'blur(12px)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c.color }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ color: c.color, fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>{c.stat}</span>
                    <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{c.label}</span>
                  </div>
                </div>
              ))}
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
                { color: 'var(--blue)', bg: 'var(--blue-bg)', border: 'var(--blue-border)', title: 'Our Approach', text: `We surveyed ${(kpi.totalRespondents || 6168).toLocaleString()} people to map awareness levels across dimensions of symptom recognition, risk factor knowledge, and emergency behavior.` },
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
              Four Dimensions of Awareness
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '520px', margin: '0 auto' }}>
              Each section of the dashboard dives deep into a critical facet of stroke awareness.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {COVERAGE.map((c, i) => (
              <div key={c.label} className="coverage-card land-anim" style={{
                '--hov-color': c.hov,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderTop: `3px solid ${c.color}`,
                borderRadius: '16px', padding: '28px 24px',
                display: 'flex', flexDirection: 'column', gap: '14px',
                boxShadow: theme === 'dark' ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 16px rgba(0,0,0,0.06)',
                animationDelay: `${i * 0.08}s`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '80px', height: '80px', background: `radial-gradient(circle, ${c.color}15, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${c.color}12`, border: `1px solid ${c.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                }}>{c.icon}</div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '15px', margin: 0 }}>{c.label}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
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
          padding: '64px 48px 40px',
          background: 'linear-gradient(180deg, var(--bg-surface-3) 0%, var(--bg-page) 100%)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '1px', background: 'linear-gradient(to right, transparent, var(--red-border), transparent)' }} />
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '48px' }}>
              {[
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, label: 'Data Source', text: `Survey conducted across Thane & Mumbai with ${(kpi.totalRespondents || 6168).toLocaleString()} participants.` },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2v1"/><path d="M15 2v1"/><path d="M12 2v2"/><path d="M12 18v4"/><path d="M8 22h8"/><path d="M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/><path d="M3 6h18"/><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>, label: 'Methodology', text: 'Structured questionnaire covering awareness, behavior, and risk understanding.' },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label: 'Privacy Note', text: 'All responses are anonymized and used solely for research and awareness purposes.' },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, label: 'Project By', text: 'Harshali Gaikwad, Siddhi Mankar, Sri Satya, Komal Bhat — TY Mini Project.' },
              ].map(f => (
                <div key={f.label} style={{
                  padding: '20px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{f.icon}</span>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '13px', margin: 0 }}>{f.label}</p>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>{f.text}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BrainIcon size={22} color="var(--red)" />
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Stroke Awareness Dashboard · 2025</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)', padding: '12px 18px', borderRadius: '999px',
            fontSize: '16px', cursor: 'pointer', lineHeight: 1,
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            transition: 'all 0.3s cubic-bezier(.22,.61,.36,1)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'; }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

      </div>
    </>
  );
};

export default Landing;
