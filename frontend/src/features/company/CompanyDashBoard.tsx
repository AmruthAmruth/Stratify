import React, { useState } from 'react';
import { Building2, Users, FolderKanban, CheckCircle, Clock, AlertCircle, ChevronRight, Search, Bell, Settings, BarChart3, Target, Zap } from 'lucide-react';

// Stratify Signature Dashboard — redesigned with palette:
// bg: #fbfbfb | text: #3b3b3b | accent: #009063 | lilac: #dfdcef

export default function StratifyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const projects = [
    { id: 1, name: 'Q1 Product Launch', owner: 'Sarah Chen', dept: 'Engineering', status: 'on-track', progress: 75, team: 8 },
    { id: 2, name: 'Brand Redesign', owner: 'Mike Peters', dept: 'Marketing', status: 'at-risk', progress: 45, team: 5 },
    { id: 3, name: 'Sales Automation', owner: 'Lisa Wong', dept: 'Sales', status: 'on-track', progress: 60, team: 4 },
    { id: 4, name: 'Infrastructure Upgrade', owner: 'David Kim', dept: 'Operations', status: 'completed', progress: 100, team: 6 }
  ];

  const departments = [
    { name: 'Engineering', lead: 'Sarah Chen', members: 24, active: 12, color: 'lilac' },
    { name: 'Marketing', lead: 'Mike Peters', members: 15, active: 8, color: 'lilac' },
    { name: 'Sales', lead: 'Lisa Wong', members: 18, active: 9, color: 'lilac' },
    { name: 'Operations', lead: 'David Kim', members: 12, active: 7, color: 'lilac' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'on-track': return { text: '#046c47', bg: 'rgba(0,144,99,0.06)', border: 'rgba(0,144,99,0.12)' };
      case 'at-risk': return { text: '#b45309', bg: 'rgba(190,110,0,0.06)', border: 'rgba(190,110,0,0.12)' };
      case 'completed': return { text: '#134e8a', bg: 'rgba(13,90,165,0.06)', border: 'rgba(13,90,165,0.12)' };
      default: return { text: '#3b3b3b', bg: 'rgba(59,59,59,0.03)', border: 'rgba(59,59,59,0.06)' };
    }
  };

  return (
    <div
      className="w-full min-h-screen p-2"
      style={{ backgroundColor: '#fbfbfb', color: '#3b3b3b', WebkitFontSmoothing: 'antialiased' }}
    >
      <div className="max-w-8xl mx-auto">

      
        

        {/* Stats Overview */}
        <section className="grid grid-cols-4 gap-4 mt-6">
          <StatCard icon={<FolderKanban className="w-5 h-5" />} title="Active Projects" value="24" delta="+12%" deltaColor="#009063" />
          <StatCard icon={<Users className="w-5 h-5" />} title="Team Members" value="69" delta="+8%" deltaColor="#009063" />
          <StatCard icon={<Target className="w-5 h-5" />} title="Completion Rate" value="89%" delta="On track" deltaColor="#009063" />
          <StatCard icon={<Zap className="w-5 h-5" />} title="Visibility" value="100%" delta="Real-time" deltaColor="#6b6b6b" />
        </section>

        {/* Main Grid */}
        <main className="grid grid-cols-3 gap-6 mt-6">

          {/* Projects */}
          <section className="col-span-2 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'rgba(223,220,239,0.7)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Active Projects</h2>
              <button className="text-sm font-medium inline-flex items-center gap-2" style={{ color: '#009063' }}>
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {projects.map(project => {
                const status = getStatusColor(project.status);
                return (
                  <article key={project.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow" style={{ borderColor: 'rgba(223,220,239,0.55)' }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{project.name}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span style={{ color: '#6b6b6b' }}>Owner: <span className="font-medium" style={{ color: '#3b3b3b' }}>{project.owner}</span></span>
                          <span className="text-slate-300">•</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium border" style={{ borderColor: 'rgba(223,220,239,0.7)', backgroundColor: '#fff' }}>{project.dept}</span>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-lg text-xs font-medium border" style={{ color: status.text, backgroundColor: status.bg, borderColor: status.border }}>
                        {project.status === 'on-track' && '✓ On Track'}
                        {project.status === 'at-risk' && '⚠ At Risk'}
                        {project.status === 'completed' && '✓ Completed'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: '#6b6b6b' }}>Progress</span>
                        <span className="font-medium" style={{ color: '#3b3b3b' }}>{project.progress}%</span>
                      </div>

                      <div className="w-full bg-[rgba(59,59,59,0.03)] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all`}
                          style={{
                            width: `${project.progress}%`,
                            background: project.status === 'completed' ? '#134e8a' : (project.status === 'on-track' ? '#009063' : '#d97706')
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs" style={{ color: '#6b6b6b', marginTop: 8 }}>
                        <Users className="w-3 h-3" />
                        <span>{project.team} team members</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Departments */}
          <aside className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'rgba(223,220,239,0.7)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Departments</h2>
              <BarChart3 className="w-5 h-5" style={{ color: '#6b6b6b' }} />
            </div>

            <div className="space-y-4">
              {departments.map((dept, idx) => (
                <div key={idx} className="border rounded-xl p-4 hover:shadow-md transition-shadow" style={{ borderColor: 'rgba(223,220,239,0.55)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: '#dfdcef', color: '#3b3b3b' }}>{dept.name[0]}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-sm">{dept.name}</h3>
                      <p className="text-xs" style={{ color: '#6b6b6b' }}>Lead: {dept.lead}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-3 border-t" style={{ borderColor: 'rgba(59,59,59,0.03)' }}>
                    <div className="flex items-center gap-1" style={{ color: '#6b6b6b' }}>
                      <Users className="w-3 h-3" />
                      <span className="text-xs">{dept.members} members</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: '#009063' }}>
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-xs font-medium">{dept.active} active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Ownership Badge */}
            <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: 'rgba(0,144,99,0.14)', background: 'linear-gradient(90deg, rgba(0,144,99,0.03), rgba(13,90,165,0.02))' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" style={{ color: '#009063' }} />
                <span className="font-semibold text-sm">Clear Ownership</span>
              </div>
              <p className="text-xs" style={{ color: '#6b6b6b' }}>
                Every project has a defined owner. Every department has clear routing. Zero confusion.
              </p>
            </div>
          </aside>

        </main>

        {/* Bottom Tagline */}
        <footer className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#6b6b6b' }}>
            <span className="font-semibold" style={{ color: '#3b3b3b' }}>One source of truth.</span> Real-time visibility. No endless meetings.
          </p>
        </footer>
      </div>
    </div>
  );
}


// Small presentational sub-component for stats
function StatCard({ icon, title, value, delta, deltaColor }){
  return (
    <div className="bg-white rounded-xl p-5 border" style={{ borderColor: 'rgba(223,220,239,0.65)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-[rgba(223,220,239,0.45)]">{icon}</div>
        <span className="text-xs font-medium" style={{ color: deltaColor }}>{delta}</span>
      </div>
      <div className="text-2xl font-semibold" style={{ color: '#3b3b3b' }}>{value}</div>
      <div className="text-sm" style={{ color: '#6b6b6b' }}>{title}</div>
    </div>
  );
}
