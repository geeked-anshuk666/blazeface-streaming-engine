import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Activity, Video, AlertCircle, List,
  LayoutDashboard, Users, BarChart3, Settings,
  HelpCircle, ChevronLeft, Clock, Cpu
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8888';

/* ═══════════════════════════════════════════════
   Confidence Gauge
   ═══════════════════════════════════════════════ */
function Gauge({ value }) {
  const pct = Math.round(value * 100);
  const r = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? 'var(--ocean)' : pct >= 50 ? 'var(--canary)' : 'var(--cinnabar)';
  const label = pct >= 80 ? 'High Confidence' : pct >= 50 ? 'Moderate' : 'Low';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
      <svg viewBox="0 0 110 110" style={{ width: '144px', height: '144px', flexShrink: 0 }}>
        <circle cx="55" cy="55" r={r} stroke="var(--border-1)" fill="none" strokeWidth="8" />
        <circle
          cx="55" cy="55" r={r}
          stroke={color} fill="none" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 55 55)" strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="55" y="52" textAnchor="middle" fill="var(--text-0)" fontSize="26" fontWeight="700" fontFamily="Montserrat">{pct}%</text>
        <text x="55" y="68" textAnchor="middle" fill="var(--text-3)" fontSize="9" fontWeight="600">Average</text>
      </svg>
      <span style={{ 
        fontSize: '12px', fontWeight: 'bold', padding: '6px 16px', borderRadius: '50px', 
        border: '1px solid', color, borderColor: `color-mix(in srgb, ${color} 40%, transparent)`, 
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)` 
      }}>
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Sidebar
   ═══════════════════════════════════════════════ */
const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Video,           label: 'Live Feed' },
  { icon: Users,           label: 'Face Registry' },
  { icon: BarChart3,       label: 'Analytics' },
];
const NAV_BOTTOM = [
  { icon: Settings,    label: 'Settings' },
  { icon: HelpCircle,  label: 'Support' },
];

function Sidebar() {
  return (
    <aside style={{ width: '260px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-1)', flexShrink: 0, zIndex: 10 }}>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-1)' }}>
        <Shield style={{ width: '24px', height: '24px', color: 'var(--ocean)' }} />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-0)' }}>FaceStream</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV.map(n => (
          <div key={n.label} className={`sidebar-link ${n.active ? 'active' : ''}`}>
            <n.icon style={{ width: '18px', height: '18px' }} />
            <span>{n.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-1)' }}>
        {NAV_BOTTOM.map(n => (
          <div key={n.label} className="sidebar-link">
            <n.icon style={{ width: '18px', height: '18px' }} />
            <span>{n.label}</span>
          </div>
        ))}
        <Link to="/" className="sidebar-link" style={{ marginTop: '8px', textDecoration: 'none' }}>
          <ChevronLeft style={{ width: '18px', height: '18px' }} />
          <span>Exit App</span>
        </Link>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════
   Dashboard
   ═══════════════════════════════════════════════ */
export default function Dashboard() {
  const [roiData, setRoiData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const stats = useMemo(() => {
    if (!roiData.length) return { avg: 0, max: 0, min: 0, total: 0 };
    const c = roiData.map(d => d.confidence || 0);
    return { avg: c.reduce((a, b) => a + b, 0) / c.length, max: Math.max(...c), min: Math.min(...c), total: roiData.length };
  }, [roiData]);

  const latest = roiData[0] || null;

  /* ── Webcam capture loop ─────────────────── */
  useEffect(() => {
    let mounted = true, video = document.createElement('video'),
        canvas = document.createElement('canvas'), stream = null;

    const loop = async () => {
      if (!isMonitoring || !mounted) return;
      if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.6));
        if (blob && mounted) {
          const fd = new FormData(); fd.append('file', blob, 'frame.jpg');
          try { await fetch(`${API_BASE}/api/v1/feed/ingest`, { method: 'POST', body: fd }); } catch {}
        }
      }
      setTimeout(() => { if (isMonitoring && mounted) requestAnimationFrame(loop); }, 66);
    };

    if (isMonitoring) {
      (async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15 } } });
          video.srcObject = stream; await video.play(); loop();
        } catch { setIsMonitoring(false); }
      })();
    }
    return () => { mounted = false; stream?.getTracks().forEach(t => t.stop()); };
  }, [isMonitoring]);

  /* ── ROI polling ─────────────────────────── */
  useEffect(() => {
    const poll = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/v1/roi?limit=10`);
        if (r.ok) { setRoiData(await r.json()); setIsConnected(true); setLastUpdated(new Date()); }
        else setIsConnected(false);
      } catch { setIsConnected(false); }
    };
    const id = setInterval(poll, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--surface-0)', color: 'var(--text-0)', overflow: 'hidden' }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <div className="hero-glow-bg" style={{ opacity: 0.3 }} />

        {/* ═══ Header ═══════════════════════════ */}
        <header style={{ position: 'relative', zIndex: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid var(--border-1)', backgroundColor: 'var(--surface-0)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className={`dot ${isConnected ? 'dot-live anim-pulse' : 'dot-off'}`} />
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-0)' }}>{isConnected ? 'Live Processing' : 'System Offline'}</span>
            {lastUpdated && (
              <span style={{ fontSize: '13px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px', fontFamily: 'monospace' }}>
                <Clock style={{ width: '14px', height: '14px' }} /> {(Date.now() - lastUpdated) / 1000 < 5 ? 'Just now' : `${Math.round((Date.now() - lastUpdated) / 1000)}s ago`}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button 
              onClick={() => setIsMonitoring(!isMonitoring)} 
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 200ms ease', border: '1px solid',
                backgroundColor: isMonitoring ? 'rgba(242, 66, 54, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                color: isMonitoring ? '#f24236' : '#2ecc71',
                borderColor: isMonitoring ? 'rgba(242, 66, 54, 0.4)' : 'rgba(46, 204, 113, 0.4)'
              }}
            >
              {isMonitoring ? 'Halt Engine' : 'Initialize Engine'}
            </button>
          </div>
        </header>

        {/* ═══ Bento Grid ═══════════════════════ */}
        <div className="scroll-thin" style={{ position: 'relative', zIndex: 10, flex: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', gridAutoRows: 'auto', maxWidth: '1400px', margin: '0 auto' }}>

            {/* ── Live Feed (8 cols) ──────── */}
            <div className="bento-card" style={{ gridColumn: 'span 8', minHeight: '400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-1)', backgroundColor: 'var(--surface-1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Video style={{ width: '16px', height: '16px', color: 'var(--ocean)' }} />
                  <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Vision Matrix</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu style={{ width: '14px', height: '14px', color: 'var(--text-3)' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', letterSpacing: '0.1em' }}>BLAZEFACE // CPU</span>
                </div>
              </div>

              <div style={{ flex: 1, backgroundColor: 'var(--surface-0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '300px' }}>
                {isConnected ? (
                  <img src={`${API_BASE}/api/v1/feed/stream`} alt="Stream" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-3)' }}>
                    <AlertCircle style={{ width: '40px', height: '40px', opacity: 0.2 }} />
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Awaiting Signal</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── System Verdict (4 cols) ──── */}
            <div className="bento-card" style={{ gridColumn: 'span 4', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '24px', marginTop: 0 }}>Confidence Matrix</h3>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Gauge value={stats.avg} />
              </div>
              <div className="bento-inner" style={{ padding: '16px', marginTop: 'auto' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  {stats.avg >= 0.8
                    ? 'Engine indicates high certainty. Bounding box coordinates are stable.'
                    : stats.avg >= 0.5
                    ? 'Engine indicates moderate certainty. Lighting may be suboptimal.'
                    : 'Awaiting sufficient data or engine is operating at low confidence.'}
                </p>
              </div>
            </div>

            {/* ── Latest Frame Data (4 cols) ─ */}
            <div className="bento-card" style={{ gridColumn: 'span 4', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Latest ROI Data</h3>
                <span className={`dot ${latest ? 'dot-live' : 'dot-off'}`} />
              </div>
              {latest ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    ['Coordinate X', latest.x_min.toFixed(4)],
                    ['Coordinate Y', latest.y_min.toFixed(4)],
                    ['Box Width',    latest.width.toFixed(4)],
                    ['Box Height',   latest.height.toFixed(4)],
                    ['Certainty',    (latest.confidence || 0).toFixed(4), true],
                  ].map(([label, val, accent]) => (
                    <div key={label} className="bento-inner" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
                      <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 600, color: accent ? 'var(--ocean)' : 'var(--text-0)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', padding: '40px 0' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em' }}>No Data</span>
                </div>
              )}
            </div>

            {/* ── Telemetry (4 cols) ───────── */}
            <div className="bento-card" style={{ gridColumn: 'span 4', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', marginTop: 0 }}>Engine Telemetry</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  ['Analyzed Frames', stats.total, BarChart3, 'var(--canary)'],
                  ['Mean Certainty',  `${(stats.avg * 100).toFixed(1)}%`, Activity, 'var(--ocean)'],
                  ['Peak Certainty',  `${(stats.max * 100).toFixed(1)}%`, Activity, 'var(--ocean)'],
                  ['Floor Certainty', `${(stats.min * 100).toFixed(1)}%`, Activity, 'var(--cinnabar)'],
                ].map(([label, val, Icon, iconColor]) => (
                  <div key={label} className="bento-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon style={{ width: '16px', height: '16px', color: iconColor }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-2)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: '15px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-0)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Event Log (4 cols) ───────── */}
            <div className="bento-card" style={{ gridColumn: 'span 4', minHeight: '380px' }}>
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <List style={{ width: '16px', height: '16px', color: 'var(--text-2)' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Event Registry</h3>
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', backgroundColor: 'var(--surface-0)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-1)' }}>{roiData.length}</span>
              </div>
              <div className="scroll-thin" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {roiData.length > 0 ? roiData.map(item => (
                  <div key={item.id} className="bento-inner" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--ocean)', marginBottom: '4px' }}>{item.id.slice(0, 8)}</div>
                      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)' }}>{new Date(item.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-0)', marginBottom: '4px' }}>{(item.confidence || 0).toFixed(2)}</div>
                      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase' }}>Certainty</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Log Empty</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
