import React, { useState, useEffect, useMemo } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import TodoFilters from './components/TodoFilters';
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

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

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
        ...prevTodos,
        {
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date(),
        }
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

      return newTodos;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Todo リスト
          </h1>
          <AddTodo onAdd={addTodo} />
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            todoCount={todoCount}
          />
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onReorder={handleReorder}
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