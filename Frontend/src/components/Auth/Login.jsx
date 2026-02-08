import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'developer',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', formData, {
                withCredentials: true,
            });
            if (onLoginSuccess) onLoginSuccess(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Nexus <span className="text-indigo-500">Authentication</span></h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Secure Personnel Access Gate</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                        placeholder="Personnel ID..."
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-600 uppercase"
                    >
                        <option value="developer">Developer</option>
                        <option value="project_lead">Project Lead</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {loading ? 'Validating...' : 'Access System'}
                </button>
            </form>
            {message && (
                <p className="text-center text-xs font-mono text-red-500 uppercase tracking-tighter">
                    ⚠️ {message}
                </p>
            )}
        </div>
    );
}

export default Login;
