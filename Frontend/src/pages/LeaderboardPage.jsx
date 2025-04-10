import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { EmojiEvents, Star, Speed, Psychology } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const LeaderboardPage = () => {
  const { user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('points');

  const categories = [
    { id: 'points', label: 'Total Points', icon: <Star className="text-yellow-400" /> },
    { id: 'speed', label: 'Fastest Solvers', icon: <Speed className="text-blue-500" /> },
    { id: 'streak', label: 'Longest Streaks', icon: <Psychology className="text-green-500" /> }
  ];

  const leaderboardData = [
    { rank: 1, username: 'CodeMaster', points: 2500, speed: '1m 30s', streak: 15 },
    { rank: 2, username: 'PuzzlePro', points: 2300, speed: '1m 45s', streak: 12 },
    { rank: 3, username: 'ByteWizard', points: 2100, speed: '2m 00s', streak: 10 },
    // Add more mock data
  ];

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
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2
                    text-sm sm:text-base whitespace-nowrap
                    ${selectedCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {React.cloneElement(category.icon, { className: `w-4 h-4 sm:w-5 sm:h-5 ${category.icon.props.className}` })}
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {leaderboardData.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl
                  ${player.username === user?.username ? 'bg-primary/10' : 'bg-gray-50'}
                  ${player.rank <= 3 ? 'border-2 border-yellow-400' : ''}
                `}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-primary text-white font-bold text-sm sm:text-base">
                  {player.rank}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-base sm:text-lg truncate">{player.username}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {selectedCategory === 'points' && `${player.points} points`}
                    {selectedCategory === 'speed' && `Average: ${player.speed}`}
                    {selectedCategory === 'streak' && `${player.streak} days streak`}
                  </p>
                </div>
                {player.rank <= 3 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <EmojiEvents className={`
                      w-6 h-6 sm:w-8 sm:h-8
                      ${player.rank === 1 ? 'text-yellow-400' : ''}
                      ${player.rank === 2 ? 'text-gray-400' : ''}
                      ${player.rank === 3 ? 'text-amber-700' : ''}
                    `} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;