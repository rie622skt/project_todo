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
}

function TodoFilters({ currentFilter, onFilterChange, todoCount }: TodoFiltersProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: `すべて (${todoCount.all})` },
    { value: 'active', label: `未完了 (${todoCount.active})` },
    { value: 'completed', label: `完了済み (${todoCount.completed})` },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all
            ${
              currentFilter === value
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default TodoFilters;