import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// PWAの自動更新を設定
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('新しいバージョンが利用可能です。更新しますか？')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('アプリがオフラインで利用可能になりました');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);