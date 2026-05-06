import React, { useState, useEffect } from 'react';
import { Shield, Activity, List, Video, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

function App() {
  const [roiData, setRoiData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch ROI data periodically
  useEffect(() => {
    const fetchROI = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/roi?limit=10`);
        if (response.ok) {
          const data = await response.json();
          setRoiData(data);
          setIsConnected(true);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };

    const interval = setInterval(fetchROI, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FACESTREAM <span className="text-cyan-400 text-sm font-mono">SOC_MONITOR v1.0</span></h1>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Real-Time Intelligence Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {isConnected ? 'LIVE_STREAM_ACTIVE' : 'SYSTEM_OFFLINE'}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Section */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative group rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-800">
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Feed: Primary_Inference</span>
            </div>
            
            {/* Stream Player */}
            <div className="aspect-video bg-black flex items-center justify-center">
              {isConnected ? (
                <img 
                  src={`${API_BASE}/api/v1/feed/stream`} 
                  alt="Live Feed"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-600">
                  <AlertCircle className="w-12 h-12" />
                  <p className="text-sm font-mono">AWAITING_SIGNAL...</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Inference Model</span>
                  <span className="text-xs font-mono text-cyan-300">Mediapipe BlazeFace (CPU)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Resolution</span>
                  <span className="text-xs font-mono">Scaled-to-Fit</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400 tracking-widest">STABLE</span>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Intelligence Dashboard */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-5 flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest">ROI_Registry</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">LATEST_10</span>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {roiData.length > 0 ? roiData.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-tighter">ID: {item.id.slice(0, 8)}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="block text-[8px] text-slate-500 uppercase mb-0.5">X_Coord</span>
                      <span className="text-xs font-mono text-slate-300">{item.x_min.toFixed(4)}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="block text-[8px] text-slate-500 uppercase mb-0.5">Y_Coord</span>
                      <span className="text-xs font-mono text-slate-300">{item.y_min.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold text-slate-600">Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500" 
                          style={{ width: `${(item.confidence || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">{(item.confidence || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-700 border-2 border-dashed border-slate-800 rounded-2xl">
                  <Activity className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">NO_DATA_PERSISTED</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <footer className="mt-12 pt-6 border-t border-slate-800 flex justify-between items-center text-slate-600">
        <div className="text-[10px] font-mono uppercase tracking-widest">
          Node_Instance: <span className="text-slate-400">ROI_MONITOR_01</span>
        </div>
        <div className="text-[10px] font-mono">
          &copy; 2024 FACESTREAM SECURE INFRASTRUCTURE
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}} />
    </div>
  );
}

export default App;
