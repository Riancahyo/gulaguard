import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
// TypeScript may not have declarations for CSS imports in this project setup.
// Suppress the error for the side-effect import of the stylesheet.
// @ts-ignore: TS can't find module declaration for CSS files
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);