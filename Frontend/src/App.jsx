import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ChallengesPage from './pages/ChallengesPage';
import ProgressDashboard from './pages/ProgressDashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import TutorialPage from './pages/TutorialPage';
import ParticleBackground from './components/common/ParticleBackground';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotFoundPage from './NotFoundPage';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="min-h-screen">
        <ParticleBackground
          color={theme === 'dark' ? '#FFD700' : '#FF9F1C'}
          opacity={theme === 'dark' ? 0.2 : 0.1}
        />
        <Navbar onThemeToggle={toggleTheme} currentTheme={theme} />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/*" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route path="/challenges" element={
              <ProtectedRoute>
                <ChallengesPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ProgressDashboard />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } />
            <Route path="/tutorial" element={
              <ProtectedRoute>
                <TutorialPage />
              </ProtectedRoute>
            } />
            {/* Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;