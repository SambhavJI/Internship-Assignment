import { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectDetails = ({ project, onClose, user, onRefresh }) => {
    const [documents, setDocuments] = useState([]);
    const [newDeveloper, setNewDeveloper] = useState('');
    const [docName, setDocName] = useState('');
    const [docUrl, setDocUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, [project._id]);

    const fetchDocuments = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/documents/project/${project._id}`, { withCredentials: true });
            setDocuments(res.data);
        } catch (err) {
            console.error('Error fetching docs', err);
        }
    };

    const handleAssignMember = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:3000/api/projects/${project._id}/assign`, { developerUsername: newDeveloper }, { withCredentials: true });
            setNewDeveloper('');
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Error assigning member');
        }
    };

    const handleUploadDoc = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/documents', { name: docName, url: docUrl, projectId: project._id }, { withCredentials: true });
            setDocName('');
            setDocUrl('');
            fetchDocuments();
        } catch (err) {
            alert(err.response?.data?.message || 'Error uploading document');
        }
    };

    const handleComplete = async () => {
        try {
            await axios.patch(`http://localhost:3000/api/projects/${project._id}/status`, { status: 'completed' }, { withCredentials: true });
            onRefresh();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating status');
        }
    };

    return (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{project.name}</h2>
                        <p className="text-xs text-slate-400 font-mono">ID: {project._id}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">✕</button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Details & Team */}
                    <div className="space-y-8">
                        <section>
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Project Scope</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Team Personnel</h4>
                            <div className="space-y-2">
                                {project.team?.map((member) => (
                                    <div key={member._id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100">
                                            {member.username?.[0]?.toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 uppercase">{member.username}</span>
                                    </div>
                                ))}
                            </div>

                            {(user.role === 'admin' || user.role === 'project_lead') && project.status === 'active' && (
                                <form onSubmit={handleAssignMember} className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Member username..."
                                        value={newDeveloper}
                                        onChange={(e) => setNewDeveloper(e.target.value)}
                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors">Add</button>
                                </form>
                            )}
                        </section>

                        {user.role === 'admin' && project.status === 'active' && (
                            <button
                                onClick={handleComplete}
                                className="w-full py-4 border-2 border-green-500 text-green-600 font-black uppercase tracking-widest rounded-xl hover:bg-green-50 transition-all active:scale-[0.98]"
                            >
                                Mark as Completed
                            </button>
                        )}
                    </div>

                    {/* Documents */}
                    <div className="space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <section>
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Project Assets</h4>
                            <div className="space-y-3">
                                {documents.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">No documents uploaded yet.</p>
                                ) : (
                                    documents.map((doc) => (
                                        <a
                                            key={doc._id}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-400 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">📄</span>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700 uppercase group-hover:text-indigo-600 transition-colors">{doc.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">By: {doc.uploadedBy?.username}</p>
                                                </div>
                                            </div>
                                            <span className="text-indigo-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                        </a>
                                    ))
                                )}
                            </div>

                            {(user.role === 'admin' || user.role === 'project_lead') && (
                                <form onSubmit={handleUploadDoc} className="mt-6 space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Resource</p>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Document Title"
                                        value={docName}
                                        onChange={(e) => setDocName(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                    />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Resource URL"
                                        value={docUrl}
                                        onChange={(e) => setDocUrl(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                    />
                                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Submit Asset</button>
                                </form>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
