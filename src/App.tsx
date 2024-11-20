import React, { useState, useEffect, useMemo } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import TodoFilters from './components/TodoFilters';
import ThemeToggle from './components/ThemeToggle';
import { Todo, FilterType } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'createdAt') return new Date(value);
      return value;
    }) : [];
  });
  const [filter, setFilter] = useState<FilterType>('all');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

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

  const todoCount = useMemo(() => ({
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
  }), [todos]);

  const addTodo = (text: string) => {
    if (text.trim()) {
      setTodos(prevTodos => [
        {
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date(),
          order: prevTodos.length > 0 ? Math.min(...prevTodos.map(t => t.order)) - 1 : 0
        },
        ...prevTodos
      ]);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleReorder = (activeId: number, overId: number) => {
    setTodos(prevTodos => {
      const oldIndex = prevTodos.findIndex(todo => todo.id === activeId);
      const newIndex = prevTodos.findIndex(todo => todo.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prevTodos;

      const newTodos = [...prevTodos];
      const [movedItem] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, movedItem);

      // Update order values
      return newTodos.map((todo, index) => ({
        ...todo,
        order: index
      }));
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDark ? 'from-gray-900 to-gray-800' : 'from-purple-500 to-pink-500'} py-8 px-4 transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
        <div className={`${isDark ? 'bg-gray-800/90 text-white' : 'bg-white/90'} backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-300`}>
          <h1 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Todo リスト
          </h1>
          <AddTodo onAdd={addTodo} isDark={isDark} />
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            todoCount={todoCount}
            isDark={isDark}
          />
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onReorder={handleReorder}
            isDark={isDark}
          />
          {filteredTodos.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
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