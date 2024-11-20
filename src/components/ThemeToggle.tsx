import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
          : 'bg-white/90 text-gray-700 hover:bg-white shadow-lg'
      }`}
      aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;