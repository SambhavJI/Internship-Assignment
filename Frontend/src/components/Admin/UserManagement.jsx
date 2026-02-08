import { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'developer' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/users', { withCredentials: true });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching users');
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/auth/signup', formData, { withCredentials: true });
            setFormData({ username: '', password: '', role: 'developer' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating user');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.patch(`http://localhost:3000/api/users/${userId}/role`, { role: newRole }, { withCredentials: true });
            fetchUsers();
        } catch (err) {
            alert('Error updating role');
        }
    };

    if (loading) return <div className="text-center py-10">Loading personnel records...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-1 space-y-6">
                <h3 className="text-xl font-black text-indigo-900 flex items-center gap-2">
                    📝 Register <span className="text-indigo-400">Personnel</span>
                </h3>
                <form onSubmit={handleCreateUser} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Initial Role</label>
                        <select
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="developer">Developer</option>
                            <option value="project_lead">Project Lead</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-slate-800 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-black transition-all">
                        Confirm Registration
                    </button>
                </form>
            </div>

            {/* User List */}
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black text-indigo-900 flex items-center gap-2">
                    👥 Active <span className="text-indigo-400">Staff</span>
                </h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 uppercase">
                                                {u.username[0]}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{u.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded tracking-tighter text-slate-500">
                                            {u.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <select
                                            className="text-xs border-none bg-indigo-50 text-indigo-600 font-bold rounded p-1 focus:ring-0"
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        >
                                            <option value="developer">Dev</option>
                                            <option value="project_lead">Lead</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
