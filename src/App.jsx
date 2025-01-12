// Import necessary libraries
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    if (taskInput.trim() !== '') {
      axios.post('http://localhost:3000/tasks', { text: taskInput, completed: false })
        .then(response => setTasks([...tasks, response.data]))
        .catch(error => console.error('Error adding task:', error));
      setTaskInput('');
    }
  };

  const toggleTask = (id) => {
    const task = tasks.find(task => task.id === id);
    axios.put(`http://localhost:3000/tasks/${id}`, { ...task, completed: !task.completed })
      .then(response => {
        const updatedTasks = tasks.map(t => (t.id === id ? response.data : t));
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  // Remove a task
  const removeTask = (id) => {
    axios.delete(`http://localhost:3000/tasks/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error removing task:', error));
  };

  const startEditing = (id) => {
    const task = tasks.find(task => task.id === id);
    setEditingIndex(id);
    setEditingText(task.text);
  };

  const saveTask = (id) => {
    axios.put(`http://localhost:3000/tasks/${id}`, { text: editingText })
      .then(response => {
        const updatedTasks = tasks.map(task => (task.id === id ? response.data : task));
        setTasks(updatedTasks);
        setEditingIndex(null);
        setEditingText('');
      })
      .catch(error => console.error('Error saving task:', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">ToDo App</h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-3 border rounded-lg ${
                task.completed ? 'bg-green-100 line-through' : 'bg-gray-50'
              }`}
            >
              {editingIndex === task.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span
                  onClick={() => toggleTask(task.id)}
                  className="cursor-pointer"
                >
                  {task.text}
                </span>
              )}
              {editingIndex === task.id ? (
                <button
                  onClick={() => saveTask(task.id)}
                  className="ml-2 text-green-500 hover:text-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEditing(task.id)}
                  className="ml-2 text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => removeTask(task.id)}
                className="ml-2 text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
