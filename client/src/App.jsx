import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { RoomPage } from './pages/RoomPage';
import { ResultsPage } from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-mystery-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/room/:id" element={<RoomPage />} />
            <Route path="/room/:id/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
