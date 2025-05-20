import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EmojiEvents, Star, Speed, Psychology, 
  NavigateNext, NavigateBefore, EmojiPeople 
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const LeaderboardPage = () => {
  const { user, token } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('points');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');

  const categories = [
    { id: 'points', label: 'Total Points', icon: <Star className="text-yellow-400" /> },
    { id: 'badges', label: 'Most Badges', icon: <EmojiEvents className="text-blue-500" /> },
    { id: 'challenges', label: 'Challenges Completed', icon: <Psychology className="text-green-500" /> },
    { id: 'country', label: 'By Country', icon: <EmojiPeople className="text-purple-500" /> }
  ];

  useEffect(() => {
    fetchLeaderboardData();
    if (user?.id) {
      fetchUserBadges();
    }
  }, [currentPage, selectedCountry, user?.id]);

  const fetchLeaderboardData = async () => {
    try {
      // setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/api/leaderboard?page=${currentPage}&size=10${selectedCountry ? `&country=${selectedCountry}` : ''}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLeaderboardData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to load leaderboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBadges = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/badges/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserBadges(response.data);
    } catch (err) {
      console.error('Failed to fetch user badges:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // After fetching leaderboardData, if it's empty, show current user with default values
  const displayLeaderboardData = leaderboardData.length > 0
    ? leaderboardData
    : user
      ? [{
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          points: user.points || 0,
          completedChallenges: 0,
          earnedBadges: 0,
          rank: 1
        }]
      : [];

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-primary flex items-center">
              <EmojiEvents className="text-yellow-400 mr-2 w-6 h-6 sm:w-8 sm:h-8" />
              Leaderboard Champions
            </h1>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    if (category.id === 'country' && !selectedCountry) {
                      setSelectedCountry(user?.country || '');
                    }
                  }}
                  className={`
                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2
                    text-sm sm:text-base whitespace-nowrap
                    ${selectedCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {React.cloneElement(category.icon, { 
                    className: `w-4 h-4 sm:w-5 sm:h-5 ${category.icon.props.className}` 
                  })}
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {displayLeaderboardData.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl
                  ${entry.username === user?.username ? 'bg-primary/10' : 'bg-gray-50'}
                  ${index < 3 ? 'border-2 border-yellow-400' : ''}
                `}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-primary text-white font-bold text-sm sm:text-base">
                  {index + 1}
                </div>
                {entry.avatar && (
                  <img 
                    src={entry.avatar} 
                    alt={entry.username}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-base sm:text-lg truncate">{entry.username}</p>
                  <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
                    <span>{entry.points} points</span>
                    <span>•</span>
                    <span>{entry.completedChallenges} challenges</span>
                    <span>•</span>
                    <span>{entry.earnedBadges} badges</span>
                  </div>
                </div>
                {index < 3 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <EmojiEvents className={`
                      w-6 h-6 sm:w-8 sm:h-8
                      ${index === 0 ? 'text-yellow-400' : ''}
                      ${index === 1 ? 'text-gray-400' : ''}
                      ${index === 2 ? 'text-amber-700' : ''}
                    `} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="bg-gray-200 text-gray-700 p-2 rounded-lg disabled:opacity-50"
            >
              <NavigateBefore />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="bg-gray-200 text-gray-700 p-2 rounded-lg disabled:opacity-50"
            >
              <NavigateNext />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;