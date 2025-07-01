import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import AddEntry from './components/AddEntry';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import { GlucoseProvider } from './context/GlucoseContext';
import './index.css';

function App() {
  return (
    <GlucoseProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto pb-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddEntry />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
          <Navigation />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </GlucoseProvider>
  );
}

export default App; 