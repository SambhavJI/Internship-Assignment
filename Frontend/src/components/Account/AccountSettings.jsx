import { useState } from 'react';
import axios from 'axios';

const AccountSettings = ({ user }) => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return setMessage('New passwords do not match');
        }
        setLoading(true);
        try {
            await axios.patch('http://localhost:3000/api/users/profile/password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            }, { withCredentials: true });
            setMessage('Password updated successfully!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error updating password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-indigo-900 p-8 rounded-2xl text-white shadow-xl">
                <h2 className="text-2xl font-black mb-1 flex items-center gap-2 uppercase tracking-tighter">
                    👤 Profile <span className="text-indigo-300">Overview</span>
                </h2>
                <p className="text-indigo-200 text-sm mb-6 uppercase font-mono tracking-widest">PixelForge Nexus Personnel System</p>

                <div className="grid grid-cols-2 gap-4 border-t border-indigo-800 pt-6">
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Username</p>
                        <p className="text-lg font-bold">{user.username}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Clearance Level</p>
                        <p className="text-lg font-bold uppercase">{user.role.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    🔐 Security <span className="text-indigo-400">Update</span>
                </h3>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>
                    </div>

                    {message && <p className={`text-xs font-mono uppercase tracking-tighter ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-800 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-black transition-all disabled:opacity-50 shadow-lg"
                    >
                        {loading ? 'Updating Credentials...' : 'Update Password'}
                    </button>
                </form>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Multi-Factor Authentication</h4>
                <p className="text-xs text-slate-500 mb-4">Adding MFA significantly boosts your account security. This feature is currently in deployment.</p>
                <button disabled className="px-4 py-2 border-2 border-slate-300 text-slate-400 text-xs font-black uppercase tracking-widest rounded-lg cursor-not-allowed">
                    Setup MFA
                </button>
            </div>
        </div>
    );
};

export default AccountSettings;
