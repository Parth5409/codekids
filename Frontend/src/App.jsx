import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className="min-h-screen">
          <ParticleBackground
            color={theme === 'dark' ? '#FFD700' : '#FF9F1C'}
            opacity={theme === 'dark' ? 0.2 : 0.1}
          />
          <Navbar onThemeToggle={toggleTheme} currentTheme={theme} />
          <main className="container mx-auto p-4">
            <Outlet />
          </main>
          <Footer />
        </div>
      ),
      children: [
        { path: "", element: <HomePage /> },
        { path: "auth/*", element: <AuthPage /> },
        {
          path: "challenges",
          element: (
            <ProtectedRoute>
              <ChallengesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <ProgressDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "leaderboard",
          element: (
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "tutorial",
          element: (
            <ProtectedRoute>
              <TutorialPage />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;