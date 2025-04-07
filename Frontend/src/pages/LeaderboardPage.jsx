import { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-primary">
              <EmojiEvents className="text-yellow-400 mr-2" />
              Leaderboard Champions
            </h1>
            <div className="flex gap-2">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-4 py-2 rounded-full flex items-center gap-2
                    ${selectedCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {category.icon}
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {leaderboardData.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-4 p-4 rounded-xl
                  ${player.username === user?.username ? 'bg-primary/10' : 'bg-gray-50'}
                  ${player.rank <= 3 ? 'border-2 border-yellow-400' : ''}
                `}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                  {player.rank}
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-lg">{player.username}</p>
                  <p className="text-gray-600 text-sm">
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
                  >
                    <EmojiEvents className={`
                      w-8 h-8
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