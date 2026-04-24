import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckSquare, FileText, Settings, Plus, ArrowRight, Loader2 } from 'lucide-react';

export default function App() {
  // --- STATE MANAGEMENT ---
  // In React, 'state' holds data that changes. When state changes, the UI updates instantly.
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This array mocks what we will eventually fetch from Google Sheets
  const [projects, setProjects] = useState([
    { id: '15D-001', client: 'Acme Corp', status: 'Intake', type: 'Platform Tier', date: '2026-04-24' },
    { id: '15D-002', client: 'Stark Industries', status: 'Work in Progress', type: 'Change Request', date: '2026-04-20' },
  ]);

  // --- OPTIMISTIC UI FUNCTION ---
  // This simulates sending data to Google Apps Script.
  const handleScopeIntake = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 1. Gather form data
    const formData = new FormData(e.target);
    const newProject = {
      id: `15D-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      client: formData.get('clientName'),
      status: 'Intake',
      type: formData.get('requestType'),
      date: new Date().toISOString().split('T')[0]
    };

    // 2. Optimistic Update: Instantly add to UI before server responds
    setProjects(prev => [newProject, ...prev]);
    e.target.reset();

    // 3. Simulate Network Latency (Google Apps Script Cold Start)
    setTimeout(() => {
      // Here is where we will eventually call: 
      // fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', { method: 'POST', body: JSON.stringify(newProject) })
      setIsSubmitting(false);
      setCurrentView('dashboard'); // Route back to dashboard
    }, 1500); 
  };

  return (
    <div className="min-h-screen flex selection:bg-zinc-800 selection:text-white">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 hidden md:flex">
          <div className="mb-12">
            <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              <span style={{ color: '#D4AF37' }}>15D</span> SDOS
            </h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-sans">Operating System</p>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Command Center" 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')} 
            />
            <NavItem 
              icon={<Plus size={18} />} 
              label="Scope Engine" 
              active={currentView === 'intake'} 
              onClick={() => setCurrentView('intake')} 
            />
            <NavItem 
              icon={<CheckSquare size={18} />} 
              label="Active Work" 
              active={currentView === 'wip'} 
              onClick={() => setCurrentView('wip')} 
            />
            <NavItem 
              icon={<FileText size={18} />} 
              label="Invoices" 
              active={currentView === 'invoices'} 
              onClick={() => setCurrentView('invoices')} 
            />
          </nav>

          <div className="pt-6 border-t border-white/5">
            <NavItem icon={<Settings size={18} />} label="System Settings" />
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto p-6 md:p-12 relative">
          
          {/* Ambient background glow */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-800/20 blur-[120px] pointer-events-none" />

          {/* VIEW ROUTING */}
          {currentView === 'dashboard' && (
            <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-500">
              <header className="mb-10">
                <h2 className="text-3xl mb-2">Command Center</h2>
                <p className="text-zinc-400">Deterministic overview of all active operations.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard title="Awaiting Intake" value={projects.filter(p => p.status === 'Intake').length} />
                <StatCard title="Work in Progress" value={projects.filter(p => p.status === 'Work in Progress').length} />
                <StatCard title="Pending Invoices" value="0" />
              </div>

              <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl">Active Queue</h3>
                  <button onClick={() => setCurrentView('intake')} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                    New Request <ArrowRight size={14} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-zinc-500">{project.id}</span>
                        <span className="font-medium">{project.client}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm text-zinc-400">{project.type}</span>
                        <Badge status={project.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'intake' && (
            <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-500">
              <header className="mb-10">
                <h2 className="text-3xl mb-2">Scope Engine Intake</h2>
                <p className="text-zinc-400">Force all requests through this deterministic gate.</p>
              </header>

              <form onSubmit={handleScopeIntake} className="glass-panel p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 font-sans">Client / Entity Name</label>
                  <input 
                    required
                    name="clientName"
                    type="text" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors font-sans"
                    placeholder="e.g. Stark Industries"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 font-sans">Routing Decision</label>
                  <select 
                    required
                    name="requestType"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors font-sans appearance-none"
                  >
                    <option value="" disabled selected className="text-zinc-900">Select routing logic...</option>
                    <option value="New Retainer / Project" className="text-zinc-900">New Tiered Project</option>
                    <option value="Task Queue" className="text-zinc-900">Task Queue (In Scope)</option>
                    <option value="Change Request" className="text-zinc-900">Change Request (Requires Quote)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 font-sans">Scope Description</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors font-sans resize-none"
                    placeholder="Define the parameters of the request..."
                  />
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button type="button" onClick={() => setCurrentView('dashboard')} className="px-6 py-2 text-sm text-zinc-400 hover:text-white mr-4 transition-colors font-sans">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="sov-btn">
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Routing...</>
                    ) : (
                      <>Process Intake <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

// --- REUSABLE MICRO-COMPONENTS ---
// These keep your main code clean and maintain a strict design system.

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-white/10 text-white' 
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="font-sans">{label}</span>
    </button>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="glass-panel p-6 flex flex-col">
      <span className="text-sm text-zinc-400 mb-2 font-sans">{title}</span>
      <span className="text-4xl font-medium">{value}</span>
    </div>
  );
}

function Badge({ status }) {
  const styles = {
    'Intake': 'bg-zinc-800 text-zinc-300 border-zinc-700',
    'Work in Progress': 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
    'Completed': 'bg-green-900/20 text-green-400 border-green-800/30'
  };

  const currentStyle = styles[status] || styles['Intake'];

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium font-sans border uppercase tracking-wider ${currentStyle}`}>
      {status}
    </span>
  );
}
