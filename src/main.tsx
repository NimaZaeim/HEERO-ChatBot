// This file is used to bootstrap the React application.
// It imports the necessary modules, styles, and renders the main App component into the root element of the HTML document.

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);