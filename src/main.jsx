import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './features/rootreducer.js';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

const store = configureStore({
  reducer: rootReducer,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
