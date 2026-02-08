import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectDetails from './ProjectDetails';

const ProjectList = ({ refreshTrigger, user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, [refreshTrigger]);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/projects', { withCredentials: true });
            setProjects(res.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching projects');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading projects...</div>;
    if (error) return <div className="text-red-500 text-center py-10 uppercase font-mono text-sm tracking-widest">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-2">
                📂 Active <span className="text-indigo-400">Projects</span>
            </h2>

            {projects.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                    <p className="text-slate-400 font-medium">No projects found. {user.role === 'admin' ? "Start by creating one!" : "Records are empty."}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="group bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                    {project.status}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">
                                    {new Date(project.deadline).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">{project.name}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">{project.description}</p>

                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                    {project.lead?.username?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-tight">{project.lead?.username}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedProject && (
                <ProjectDetails
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    user={user}
                    onRefresh={fetchProjects}
                />
            )}
        </div>
    );
};

export default ProjectList;
