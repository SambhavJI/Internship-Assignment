import { useState } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import TaskList from './components/Tasks/TaskList';
import CreateTask from './components/Tasks/CreateTask';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [user, setUser] = useState(null);
  const [refreshTasks, setRefreshTasks] = useState(0);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setActiveTab('tasks');
  };

  const handleTaskCreated = () => {
    setRefreshTasks((prev) => prev + 1);
  };

  const allTabs = [
    { id: 'login', label: 'Login', icon: '🔐' },
    { id: 'signup', label: 'Signup', icon: '📝' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'create', label: 'Create Task', icon: '➕', adminOnly: true },
  ];

  // Filter tabs based on user role
  const tabs = allTabs.filter(tab => !tab.adminOnly || (user && user.role === 'admin'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              🚀 API Testing Dashboard
            </h1>
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Logged in as: <strong>{user.username}</strong> ({user.role})
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTab === 'login' && (
            <div className="lg:col-span-1">
              <Login onLoginSuccess={handleLoginSuccess} />
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="lg:col-span-1">
              <Signup />
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="lg:col-span-2">
              <TaskList refreshTrigger={refreshTasks} />
            </div>
          )}

          {activeTab === 'create' && user && user.role === 'admin' && (
            <div className="lg:col-span-1">
              <CreateTask onTaskCreated={handleTaskCreated} />
            </div>
          )}
        </div>

        {/* API Info */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📡 Available API Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-700">Auth Routes:</h4>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li><code className="bg-gray-100 px-1 rounded">POST /api/auth/signup</code> - Register user</li>
                <li><code className="bg-gray-100 px-1 rounded">POST /api/auth/login</code> - Login user</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Task Routes:</h4>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li><code className="bg-gray-100 px-1 rounded">GET /api/tasks</code> - Get all tasks</li>
                <li><code className="bg-gray-100 px-1 rounded">POST /api/tasks</code> - Create task (Admin)</li>
                <li><code className="bg-gray-100 px-1 rounded">PATCH /api/tasks/:id</code> - Update status</li>
                <li><code className="bg-gray-100 px-1 rounded">DELETE /api/tasks/:id</code> - Delete (Admin)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
