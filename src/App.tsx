import React, { useState, useEffect, useMemo } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import TodoFilters from './components/TodoFilters';
import { Todo, FilterType } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved
      ? JSON.parse(saved, (key, value) => {
          if (key === 'createdAt') return new Date(value);
          return value;
        })
      : [];
  });
  const [filter, setFilter] = useState<FilterType>('all');
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('isDarkMode') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const todoCount = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter(todo => !todo.completed).length,
      completed: todos.filter(todo => todo.completed).length,
    }),
    [todos]
  );

  const addTodo = (text: string) => {
    if (text.trim()) {
      setTodos(prevTodos => [
        ...prevTodos,
        {
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date(),
        },
      ]);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleReorder = (activeId: number, overId: number) => {
    setTodos(prevTodos => {
      const oldIndex = prevTodos.findIndex(todo => todo.id === activeId);
      const newIndex = prevTodos.findIndex(todo => todo.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prevTodos;

      const newTodos = [...prevTodos];
      const [movedItem] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, movedItem);

      return newTodos;
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gray-900 text-gray-200'
          : 'bg-gradient-to-br from-purple-500 to-pink-500 text-gray-800'
      }`}
    >
      <div className="relative max-w-2xl mx-auto">
        <button
          onClick={toggleDarkMode}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-500 ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
          }`}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        <div
          className={`rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-500 ${
            isDarkMode
              ? 'bg-gray-800 text-gray-100'
              : 'bg-white/90 text-gray-800'
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Todo リスト
          </h1>
          <AddTodo onAdd={addTodo} isDarkMode={isDarkMode} />
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            todoCount={todoCount}
            isDarkMode={isDarkMode}
          />
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onReorder={handleReorder}
            isDarkMode={isDarkMode}
          />
          {filteredTodos.length === 0 && (
            <div className="text-center mt-8">
              {filter === 'all' ? (
                <p>タスクを追加してください 🚀</p>
              ) : filter === 'active' ? (
                <p>未完了のタスクはありません ✨</p>
              ) : (
                <p>完了済みのタスクはありません 🎯</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
