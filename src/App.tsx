import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import NewCampaign from './pages/NewCampaign';
import CampaignDetails from './pages/CampaignDetails';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'healthy') {
            setBackendReady(true);
            setError(null);
            console.log('✅ Backend is ready:', data);
          } else {
            throw new Error('Backend returned unhealthy status');
          }
        } else {
          throw new Error(`Health check failed with status ${response.status}`);
        }
      } catch (err) {
        console.warn(`Health check attempt ${retryCount + 1} failed:`, err);
        setRetryCount((prev) => prev + 1);

        // Retry after a delay
        if (retryCount < 30) {
          setTimeout(() => {
            checkBackendHealth();
          }, 2000); // Retry every 2 seconds
        } else {
          setError('Failed to connect to backend after multiple attempts. Please ensure the backend is running.');
        }
      }
    };

    checkBackendHealth();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Backend Connection Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700">To start the backend:</p>
            <code className="text-xs text-gray-600 block">cd backend</code>
            <code className="text-xs text-gray-600 block">python -m uvicorn app.main:app --reload</code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!backendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-900">{retryCount}</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Starting up...</h2>
          <p className="text-gray-600 mb-4">Waiting for backend to start</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="animate-pulse">●</div>
            <span>Checking health endpoint</span>
            <div className="animate-pulse animation-delay-200">●</div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Attempt {retryCount + 1} of 30</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<NewCampaign />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
