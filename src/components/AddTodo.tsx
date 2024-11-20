import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface AddTodoProps {
  onAdd: (text: string) => void;
  isDark: boolean;
}

function AddTodo({ onAdd, isDark }: AddTodoProps) {
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
          className={`flex-1 px-4 py-2 rounded-lg border transition-all
            ${isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-400' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
            } focus:outline-none focus:ring-2 focus:border-transparent`}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2
            ${isDark
              ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-400'
              : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500'
            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">追加</span>
        </button>
      </div>
    </form>
  );
}

export default AddTodo;