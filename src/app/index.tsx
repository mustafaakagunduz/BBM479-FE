import React from 'react';
import ReactDOM from 'react-dom/client';

import App from "next/app";
import {BrowserRouter} from "react-router-dom";




const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} else {
  console.error("Could not find element with id 'root'");
}
