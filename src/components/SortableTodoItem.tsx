import React, { useState } from 'react';
import { Trash2, CheckCircle, Circle, GripVertical, Clock } from 'lucide-react';
import { Todo } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isDark: boolean;
}

export function SortableTodoItem({ todo, onToggle, onDelete, isDark }: SortableTodoItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      date = new Date(date);
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    const fullDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

    if (days > 0) {
      return `${days}日前 (${fullDate})`;
    } else if (hours > 0) {
      return `${hours}時間前 (${fullDate})`;
    } else if (minutes > 0) {
      return `${minutes}分前 (${fullDate})`;
    } else {
      return `たった今 (${fullDate})`;
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(todo.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className={`flex items-center gap-3 p-3 rounded-lg shadow-sm border group transition-all duration-200
          ${isDark
            ? 'bg-gray-700 border-gray-600'
            : 'bg-white border-gray-100'
          }
          ${isDragging
            ? 'opacity-50 shadow-lg ring-2 ring-purple-500 ring-opacity-50'
            : 'hover:shadow-md'
          }`}
      >
        <button
          className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} cursor-grab active:cursor-grabbing touch-none`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
        <button
          onClick={() => onToggle(todo.id)}
          className="text-gray-400 hover:text-purple-500 transition-colors"
        >
          {todo.completed ? (
            <CheckCircle className="text-green-500" size={24} />
          ) : (
            <Circle size={24} />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <span
            className={`block truncate ${
              todo.completed
                ? 'text-gray-400 line-through'
                : isDark
                  ? 'text-gray-100'
                  : 'text-gray-700'
            }`}
          >
            {todo.text}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <Clock size={12} />
            {formatDate(todo.createdAt)}
          </span>
        </div>
        <button
          onClick={handleDeleteClick}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={20} />
        </button>
      </li>

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDark={isDark}
      />
    </>
  );
}