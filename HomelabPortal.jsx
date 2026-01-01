import React, { useState } from 'react';
import { 
  Server, Shield, Cloud, HardDrive, Layout, 
  Terminal, Globe, Lock, Activity, Database,
  ChevronRight, BookOpen, Cpu, Wifi, Command
} from 'lucide-react';

const App = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const navigation = [
    { id: 'overview', name: 'Architecture', icon: Layout },
    { id: 'docker', name: 'Docker Stack', icon: HardDrive },
    { id: 'networking', name: 'Networking & SSL', icon: Globe },
    { id: 'pihole', name: 'Pi-hole (Remote)', icon: Shield },
    { id: 'commands', name: 'Linux Commands', icon: Command },
    { id: 'guides', name: 'Setup Guides', icon: BookOpen },
  ];

  const sections = {
    overview: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Homelab Architecture Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="flex items-center font-semibold text-blue-700 mb-2">
              <Globe className="w-5 h-5 mr-2" /> Public Zone (Cloudflare Tunnel)
            </h3>
            <ul className="text-sm text-blue-900 space-y-1">
              <li>• weather.datasharkvag.com (Static)</li>
              <li>• hedging.datasharkvag.com (Static)</li>
              <li>• Nginx serving as internal relay</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <h3 className="flex items-center font-semibold text-emerald-700 mb-2">
              <Lock className="w-5 h-5 mr-2" /> Private Zone (Tailscale + SSL)
            </h3>
            <ul className="text-sm text-emerald-900 space-y-1">
              <li>• Home Assistant (Host Mode)</li>
              <li>• Nextcloud & MariaDB</li>
              <li>• InfluxDB & Grafana</li>
              <li>• Portainer CE Management</li>
            </ul>
          </div>
        </div>
        <div className="p-6 bg-slate-900 text-white rounded-xl">
          <h3 className="text-lg font-mono mb-4 text-emerald-400">Node Configuration</h3>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <Cpu className="text-slate-400" />
              <div>
                <p className="font-bold">Main Server (Pi 4)</p>
                <p className="text-xs text-slate-300">Docker Engine | Nginx Proxy Manager | Tailscale</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Wifi className="text-slate-400" />
              <div>
                <p className="font-bold">DNS Server (Pi Zero)</p>
                <p className="text-xs text-slate-300">Pi-hole | Tailscale Node</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    docker: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Deployment Stack</h2>
        <p className="text-slate-600">The entire stack is deployed using a single Docker Compose file for high availability.</p>
        <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm text-emerald-300 overflow-x-auto">
          <pre>{`services:
  nginx: # SSL termination & Proxy
  cloudflared: # Public Tunnel Access
  home_assistant: # Home Automation (Host Mode)
  nextcloud: # Private Storage
  influxdb2: # Time Series Data
  grafana: # Visualization
  portainer: # Management UI
  samba: # Network File Sharing`}</pre>
        </div>
      </div>
    ),
    networking: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">SSL & Routing Logic</h2>
        <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50">
          <h4 className="font-bold text-indigo-800">Cloudflare Wildcard SSL</h4>
          <p className="text-sm text-indigo-700">
            Using DNS-01 Challenge, Nginx Proxy Manager (NPM) fetches a certificate for *.datasharkvag.com.
            This allows internal Tailscale IPs to use full HTTPS even though they aren't publicly exposed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-bold text-slate-700">Public Flow</h4>
            <p className="text-xs text-slate-500 mt-1 uppercase">{"User -> Cloudflare -> Tunnel -> NPM -> Static Files"}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-bold text-slate-700">Private Flow</h4>
            <p className="text-xs text-slate-500 mt-1 uppercase">{"User -> Tailscale -> NPM (SSL) -> Internal Container"}</p>
          </div>
        </div>
      </div>
    ),
    pihole: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Pi-hole Distribution</h2>
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 font-medium">Remote Node Configuration:</p>
          <p className="text-sm text-amber-700 mt-2">
            The Pi-hole resides on a separate Pi Zero. To maintain SSL parity:
          </p>
          <ul className="list-disc ml-5 mt-3 text-sm text-amber-900 space-y-2">
            <li>NPM on Pi 4 proxies traffic to Pi Zero local IP.</li>
            <li>DNS Records in Pi-hole point the domain to the Pi 4 (NPM) IP.</li>
            <li>NPM handles the SSL Handshake then fetches data from Pi Zero over HTTP port 80.</li>
          </ul>
        </div>
      </div>
    ),
    commands: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Linux Command Reference</h2>
        
        {/* Network Commands */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center">
            <Globe className="w-5 h-5 mr-2" /> Network & Hostname
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Check IP Address</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">hostname -I</code>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">ip addr show</code>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Change Hostname</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">sudo hostnamectl set-hostname new-name</code>
              <p className="text-xs text-slate-500 mt-1">Requires reboot to take full effect.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Set Static IP (UI Method)</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">sudo nmtui</code>
              <p className="text-xs text-slate-500 mt-1">Use the graphical menu to 'Edit a connection' &rarr; IPv4 &rarr; Manual.</p>
            </div>
          </div>
        </div>

        {/* Maintenance Commands */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-600 mb-3 flex items-center">
            <Database className="w-5 h-5 mr-2" /> Maintenance & Backups
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Backup NPM Database</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">
                cp ./volumes/nginx/data/database.sqlite ./volumes/nginx/data/database_$(date +%F).sqlite
              </code>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Update Pi-hole Gravity</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">pihole -g</code>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Update Pi-hole System</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">pihole -up</code>
            </div>
          </div>
        </div>

        {/* Troubleshooting Commands */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-rose-600 mb-3 flex items-center">
            <Terminal className="w-5 h-5 mr-2" /> Troubleshooting Basics
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Search Text in Files (Grep)</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">grep -r "search_term" /path/to/folder</code>
              <p className="text-xs text-slate-500 mt-1">Example: grep -r "error" ./volumes/nginx/logs</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Check Disk Space</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">df -h</code>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Check Running Ports</p>
              <code className="block bg-slate-100 p-2 rounded text-xs mt-1 font-mono">sudo netstat -tulpn</code>
            </div>
          </div>
        </div>
      </div>
    ),
    guides: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Quick-Start Commands</h2>
        <div className="space-y-3">
          <div className="p-3 bg-slate-100 rounded border">
            <code className="text-sm font-bold text-pink-600">docker compose up -d</code>
            <p className="text-xs text-slate-500 mt-1">Deploy the main stack on Pi 4</p>
          </div>
          <div className="p-3 bg-slate-100 rounded border">
            <code className="text-sm font-bold text-pink-600">ipconfig /flushdns</code>
            <p className="text-xs text-slate-500 mt-1">Fix Windows name resolution after DNS changes</p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-slate-900 text-white p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Activity className="text-emerald-400 w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">Homelab Portal</h1>
        </div>
        
        <div className="space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">Host Domain</p>
            <p className="text-sm font-mono text-emerald-400">datasharkvag.com</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          {sections[activeSection]}
        </div>
        
        <footer className="mt-8 text-center text-slate-400 text-sm">
          <p>© 2025 datasharkvag.com | Managed with Docker & Cloudflare</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
