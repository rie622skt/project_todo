import React from 'react';
import { FilterType } from '../types';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todoCount: {
    all: number;
    active: number;
    completed: number;
  };
  isDarkMode: boolean;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({
  currentFilter,
  onFilterChange,
  todoCount,
  isDarkMode,
}) => {
  return (
    <div className="flex justify-around mt-4">
      {['all', 'active', 'completed'].map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter as FilterType)}
          className={`px-4 py-2 rounded-lg transition-colors duration-500 ${
            currentFilter === filter
              ? isDarkMode
                ? 'bg-blue-600 text-gray-200'
                : 'bg-purple-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {filter === 'all'
            ? `全て (${todoCount.all})`
            : filter === 'active'
            ? `未完了 (${todoCount.active})`
            : `完了 (${todoCount.completed})`}
        </button>
      ))}
    </div>
  );
};

export default TodoFilters;
