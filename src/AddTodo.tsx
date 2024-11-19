import React, { useState } from 'react';

interface AddTodoProps {
  onAdd: (text: string) => void;
  isDarkMode: boolean;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAdd, isDarkMode }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`flex-1 p-2 rounded-lg border transition-colors duration-500 ${
          isDarkMode
            ? 'bg-gray-700 text-gray-200 border-gray-600 placeholder-gray-400'
            : 'bg-gray-200 text-gray-800 border-gray-300 placeholder-gray-500'
        }`}
        placeholder="タスクを入力"
      />
      <button
        type="submit"
        className={`px-4 py-2 rounded-lg transition-colors duration-500 ${
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-500 text-gray-200'
            : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
        }`}
      >
        追加
      </button>
    </form>
  );
};

export default AddTodo;

