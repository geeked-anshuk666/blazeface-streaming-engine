import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Scan, Lock, Cpu, Activity, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Scan,
    title: 'Real-Time Detection',
    body: 'Mediapipe BlazeFace inference at 15+ FPS. Sub-100ms latency on commodity CPU hardware - no GPU required.',
    accent: 'var(--ocean)',
  },
  {
    icon: Activity,
    title: 'Structured ROI Persistence',
    body: 'Every detection writes X, Y, Width, Height, and Confidence to a relational store with session isolation.',
    accent: 'var(--canary)',
  },
  {
    icon: Lock,
    title: 'Hardened Pipeline',
    body: 'Rate-limited ingestion, 2 MB payload caps, and async processing decouple I/O from inference.',
    accent: 'var(--cinnabar)',
  },
];

const PIPELINE = ['Capture', 'Ingest', 'Detect', 'Annotate', 'Persist', 'Stream'];

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--surface-0)', color: 'var(--text-0)', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* ── Navbar ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 48px', alignItems: 'center' }}>
        <Link style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }} to="/">
          <Shield style={{ color: 'var(--ocean)', width: 24, height: 24 }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-0)' }}>FaceStream</span>
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-2)', textDecoration: 'none', fontWeight: 500 }}>Features</a>
          <a href="#pipeline" style={{ color: 'var(--text-2)', textDecoration: 'none', fontWeight: 500 }}>Architecture</a>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', borderRadius: '50px', border: '1px solid var(--border-2)', backgroundColor: 'var(--surface-1)', marginBottom: '40px' }}>
          <span className="dot dot-live anim-pulse" />
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-2)' }}>v1.0 - System Operational</span>
        </div>

        <h1 className="font-display" style={{ fontSize: '64px', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '32px' }}>
          Real-Time<br />
          <span style={{ color: 'var(--ocean)', fontStyle: 'italic', fontWeight: 300 }}>Face Intelligence</span>
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '48px', fontWeight: 300 }}>
          A zero-dependency face detection platform built on Mediapipe inference.
          No OpenCV. No bloat. Stream, detect, and persist - in real time.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '80px' }}>
          <Link to="/dashboard" className="btn-primary">
            Enter SOC Dashboard <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
          <a href="#features" className="btn-ghost">
            Explore Architecture
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
          {[
            { val: '15+', label: 'Frames / Sec', color: 'var(--ocean)' },
            { val: '<100ms', label: 'Latency', color: 'var(--canary)' },
            { val: '95%+', label: 'Confidence', color: 'var(--ocean)' },
            { val: '0', label: 'OpenCV Deps', color: 'var(--cinnabar)' },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 300, color: m.color, marginBottom: '8px' }}>{m.val}</div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: 'var(--text-3)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
        <h2 className="font-display" style={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center', marginBottom: '64px' }}>
          Engineered for <span style={{ color: 'var(--ocean)', fontStyle: 'italic', fontWeight: 300 }}>Throughput</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="glass-card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', backgroundColor: `color-mix(in srgb, ${f.accent} 10%, transparent)` }}>
                <f.icon style={{ width: 20, height: 20, color: f.accent }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6, fontWeight: 300 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline ── */}
      <section id="pipeline" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
        <div className="glass-card" style={{ padding: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Cpu style={{ width: 16, height: 16, color: 'var(--canary)' }} />
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--canary)' }}>System Pipeline</span>
          </div>
          <h3 className="font-display" style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>End-to-End Detection</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '32px', fontWeight: 300 }}>
            Webcam frames are captured at the browser, POSTed to a FastAPI endpoint, processed through
            Mediapipe BlazeFace, annotated with bounding boxes, persisted as structured ROI data,
            and streamed back as an MJPEG feed - all in a single async loop.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            {PIPELINE.map((step, i) => (
              <React.Fragment key={step}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ocean)', backgroundColor: 'var(--surface-0)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-1)' }}>
                  {step}
                </span>
                {i < PIPELINE.length - 1 && <ArrowRight style={{ width: 12, height: 12, color: 'var(--text-3)' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
