// main.jsx (KEEP this one)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* KEEP the Router here */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);