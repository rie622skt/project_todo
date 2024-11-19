import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">追加</span>
        </button>
      </div>
    </form>
  );
}

export default AddTodo;