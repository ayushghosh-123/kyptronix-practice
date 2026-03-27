'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    console.log('TodoPage mounted, fetching todos...');
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      console.log('Fetching todos from /api/todos');
      const res = await fetch('/api/todos');
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch todos: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Todos fetched successfully:', data);
      setTodos(data);
      setApiError('');
    } catch (err) {
      console.error('Error loading todos:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load todos';
      setError(errorMsg);
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      
      if (!res.ok) throw new Error('Failed to add todo');
      
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTitle('');
      setDescription('');
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add todo';
      setError(errorMsg);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      
      if (!res.ok) throw new Error('Failed to update todo');
      
      const updatedTodo = await res.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMsg);
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const updateTodo = async (id: string) => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editTitle.trim(), 
          description: editDescription.trim() 
        }),
      });
      
      if (!res.ok) throw new Error('Failed to update todo');
      
      const updatedTodo = await res.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMsg);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      
      if (!res.ok) throw new Error('Failed to delete todo');
      
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-black text-lg">Loading todos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">📝 Todo App</h1>
          <p className="text-black">Stay organized and track your tasks</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-medium">⚠️ Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {apiError && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            <p className="font-medium">⚠️ Connection Issue</p>
            <p className="text-sm">Cannot connect to the server. Make sure MongoDB is running and the API is accessible.</p>
            <button 
              onClick={fetchTodos}
              className="mt-2 px-4 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Add New Todo</h2>
          
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            ✨ Add Todo
          </button>
        </form>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Todos ({todos.length})
          </h2>
          
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-black text-lg">🎉 No todos yet! Add one to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg transition duration-200 ${
                    editingId === todo.id
                      ? 'bg-blue-50 border-blue-300'
                      : todo.completed
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-blue-200 hover:border-blue-400'
                  }`}
                >
                  {editingId === todo.id ? (
                    // Edit Mode
                    <div className="w-full">
                      <div className="mb-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-lg font-medium"
                          placeholder="Todo title"
                        />
                      </div>
                      <div className="mb-4">
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-sm"
                          placeholder="Description (optional)"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTodo(todo.id)}
                          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium text-sm"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition font-medium text-sm"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id, todo.completed)}
                        className="w-5 h-5 mt-1 cursor-pointer accent-blue-600"
                      />
                      
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-medium ${
                            todo.completed
                              ? 'line-through text-black'
                              : 'text-black'
                          }`}
                        >
                          {todo.title}
                        </h3>
                        
                        {todo.description && (
                          <p className={`mt-1 text-sm ${
                            todo.completed ? 'text-black' : 'text-black'
                          }`}>
                            {todo.description}
                          </p>
                        )}
                        
                        <p className="text-xs text-black mt-2">
                          📅 {new Date(todo.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(todo)}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition duration-200 font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition duration-200 font-medium"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
