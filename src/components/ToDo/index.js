import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import './index.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Navbar';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskValue, setEditTaskValue] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('pending'); // default status for editing
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');

    if (!jwtToken) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      fetchTasks(jwtToken);
    }
  }, [navigate]);

  const fetchTasks = async (token) => {
    try {
      const response = await axios.get('https://to-do-app-ytdb.onrender.com/api/todos/tasks', {
        headers: {
          Authorization: `Bearer ${token}`, // Send JWT token for authentication
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks. Please try again.');
    }
  };

  const addTask = async () => {
    const jwtToken = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'https://to-do-app-ytdb.onrender.com/api/todos/tasks',
        { title: newTask, status: 'pending' }, // Set default status to pending when adding a new task
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const editTask = async (id) => {
    const jwtToken = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `https://to-do-app-ytdb.onrender.com/api/todos/tasks/${id}`,
        { title: editTaskValue, status: editTaskStatus }, // Include the updated status
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setTasks(tasks.map(task => (task.taskId === id ? response.data : task))); // Update the task in the state
      setEditTaskId(null);
      setEditTaskValue('');
      setEditTaskStatus('pending'); // Reset status for editing
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    const jwtToken = localStorage.getItem('token');
    try {
      await axios.delete(`https://to-do-app-ytdb.onrender.com/api/todos/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setTasks(tasks.filter(task => task.taskId !== id)); // Filter out the deleted task
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  return (

    <>
     <Navbar/>
    
    <div className="todo-container">
      <h2>Todo List</h2>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.taskId} className="task-item">
            {editTaskId === task.taskId ? (
              <div className="edit-task-container">
                <input
                  type="text"
                  value={editTaskValue}
                  onChange={(e) => setEditTaskValue(e.target.value)}
                  placeholder="Edit Task"
                />
                <select
                  value={editTaskStatus}
                  onChange={(e) => setEditTaskStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="done">Done</option>
                </select>
                <button onClick={() => editTask(task.taskId)}>
                  Update
                </button>
                <button onClick={() => setEditTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="task-details">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-status">Status: {task.status}</p>
                <div className="button-group">
                  <button onClick={() => { 
                    setEditTaskId(task.taskId); 
                    setEditTaskValue(task.title); 
                    setEditTaskStatus(task.status); 
                  }} className="icon-button">
                    <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                  </button>
                  <button onClick={() => deleteTask(task.taskId)} className="icon-button">
                    <FontAwesomeIcon icon={faTrash} className="delete-icon" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      
    </div>
    </>
  );
  
 
};


export default Todo;
