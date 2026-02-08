import { useState } from 'react';
import axios from 'axios';

const CreateProject = ({ onProjectCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        deadline: '',
        leadUsername: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:3000/api/projects', formData, { withCredentials: true });
            setSuccess('Project created successfully!');
            setFormData({ name: '', description: '', deadline: '', leadUsername: '' });
            onProjectCreated();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-indigo-900 flex items-center gap-2">
                ➕ Create New <span className="text-indigo-400">Project</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter project name..."
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</label>
                    <textarea
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter project description..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deadline</label>
                        <input
                            type="date"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assign Lead (Username)</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={formData.leadUsername}
                            onChange={(e) => setFormData({ ...formData, leadUsername: e.target.value })}
                            placeholder="Username..."
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs font-mono tracking-tighter uppercase">{error}</p>}
                {success && <p className="text-green-500 text-xs font-mono tracking-tighter uppercase">{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Deploy Project'}
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
