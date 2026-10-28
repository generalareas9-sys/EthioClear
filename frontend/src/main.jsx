// src/main.jsx
// Application entry point — mounts the React tree into #root (see
// index.html). Wrapped in StrictMode to surface potential issues
// during development.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
