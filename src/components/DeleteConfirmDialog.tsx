import React from 'react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDark: boolean;
}

function DeleteConfirmDialog({ isOpen, onConfirm, onCancel, isDark }: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-sm w-full p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          タスクを削除しますか？
        </h3>
        <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          この操作は取り消せません。本当にこのタスクを削除しますか？
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg transition-colors
              ${isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmDialog;