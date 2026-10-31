/**
 * @fileoverview Application entry point for EventCraft AI.
 * Mounts the React 18 application with StrictMode for development quality assurance.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in the document. Ensure index.html contains <div id="root">.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
