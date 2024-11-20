import React, { useMemo } from 'react';
import { Todo } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTodoItem } from './SortableTodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onReorder: (activeId: number, overId: number) => void;
  isDark: boolean;
}

interface GroupedTodos {
  [key: string]: Todo[];
}

function TodoList({ todos, onToggle, onDelete, onReorder, isDark }: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => a.order - b.order);
  }, [todos]);

  const groupedTodos = useMemo(() => {
    return sortedTodos.reduce((groups: GroupedTodos, todo) => {
      const date = new Date(todo.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey: string;

      if (date.toDateString() === today.toDateString()) {
        dateKey = '今日';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = '昨日';
      } else {
        dateKey = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(todo);
      return groups;
    }, {});
  }, [sortedTodos]);

  if (todos.length === 0) {
    return null;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      onReorder(Number(active.id), Number(over.id));
    }
  };

  const sortedDateGroups = Object.entries(groupedTodos).sort((a, b) => {
    if (a[0] === '今日') return -1;
    if (b[0] === '今日') return 1;
    if (a[0] === '昨日') return -1;
    if (b[0] === '昨日') return 1;
    return b[0].localeCompare(a[0]);
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={sortedTodos.map(todo => todo.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-6">
          {sortedDateGroups.map(([date, dateTodos]) => (
            <div key={date} className="space-y-2">
              <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                {date}
              </h3>
              <ul className="space-y-2">
                {dateTodos.map((todo) => (
                  <SortableTodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    isDark={isDark}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default TodoList;