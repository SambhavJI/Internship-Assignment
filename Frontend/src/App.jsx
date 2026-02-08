import { useState } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProjectList from './components/Projects/ProjectList';
import CreateProject from './components/Projects/CreateProject';
import UserManagement from './components/Admin/UserManagement';
import AccountSettings from './components/Account/AccountSettings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setActiveTab('projects');
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const allTabs = [
    { id: 'login', label: 'Login', icon: '🔐' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'create', label: 'New Project', icon: '➕', roles: ['admin'] },
    { id: 'users', label: 'User Management', icon: '👥', roles: ['admin'] },
    { id: 'settings', label: 'Account', icon: '⚙️' },
  ];

  // Filter tabs based on user role
  const tabs = allTabs.filter(tab => !tab.roles || (user && tab.roles.includes(user.role)));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tight">
              🛠️ PixelForge <span className="text-indigo-300">Nexus</span>
            </h1>
            {user && (
              <div className="flex items-center gap-4">
                <span className="bg-indigo-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {user.username} • <span className="uppercase">{user.role.replace('_', ' ')}</span>
                </span>
                <button
                  onClick={() => {
                    setUser(null);
                    setActiveTab('login');
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
          {activeTab === 'login' && (
            <div className="p-8 max-w-md mx-auto">
              <Login onLoginSuccess={handleLoginSuccess} />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="p-8">
              <ProjectList refreshTrigger={refreshTrigger} user={user} />
            </div>
          )}

          {activeTab === 'create' && user && user.role === 'admin' && (
            <div className="p-8 max-w-2xl mx-auto">
              <CreateProject onProjectCreated={handleRefresh} />
            </div>
          )}

          {activeTab === 'users' && user && user.role === 'admin' && (
            <div className="p-8">
              <UserManagement />
            </div>
          )}

          {activeTab === 'settings' && user && (
            <div className="p-8 max-w-md mx-auto">
              <AccountSettings user={user} />
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 text-sm mb-2">🛡️ Privilege Separation</h4>
            <p className="text-xs text-gray-500">Access control is enforced at both frontend and backend layers.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 text-sm mb-2">📑 Document Control</h4>
            <p className="text-xs text-gray-500">Only assigned team members can view project-specific documentation.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 text-sm mb-2">🔒 Secure Login</h4>
            <p className="text-xs text-gray-500">Implementing Bcrypt hashing and JWT for session management.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
