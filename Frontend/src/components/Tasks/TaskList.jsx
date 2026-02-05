import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

function TaskList({ refreshTrigger }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchTasks = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.get(`${API_BASE}/tasks`, { withCredentials: true });
            setTasks(response.data.tasks || response.data || []);
            setMessage(`✅ Fetched ${response.data.tasks?.length || response.data?.length || 0} tasks`);
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [refreshTrigger]);

    const handleDelete = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await axios.delete(`${API_BASE}/tasks/${taskId}`, { withCredentials: true });
            setMessage('✅ Task deleted successfully');
            fetchTasks();
        } catch (error) {
            setMessage(`❌ Delete Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.patch(`${API_BASE}/tasks/${taskId}`, { status: newStatus }, { withCredentials: true });
            setMessage('✅ Task status updated');
            fetchTasks();
        } catch (error) {
            setMessage(`❌ Update Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Tasks</h2>
                <button
                    onClick={fetchTasks}
                    disabled={loading}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                    {loading ? 'Loading...' : '🔄 Refresh'}
                </button>
            </div>

            {message && (
                <p className={`mb-4 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}

            {tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tasks found</p>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                    <div className="flex gap-2 mt-2 text-xs text-gray-500">
                                        <span>Assigned to: {task.assignedTo?.username || task.assignedTo || 'N/A'}</span>
                                        <span>|</span>
                                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        className="text-xs border rounded px-2 py-1"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="text-xs text-red-600 hover:text-red-800"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TaskList;
