import { motion } from 'framer-motion';
import { Star, Code, EmojiEvents, Psychology, Speed } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const BadgeGallery = () => {
  const { progress } = useApp();
  const defaultBadges = [
    { id: 1, name: 'First Steps', icon: Star, color: '#FFD700', description: 'Completed your first coding challenge!' },
    { id: 2, name: 'Loop Master', icon: Code, color: '#4CAF50', description: 'Mastered the art of loops' },
    { id: 3, name: 'Logic Wizard', icon: Psychology, color: '#2196F3', description: 'Solved complex logic problems' },
    { id: 4, name: 'Speed Coder', icon: Speed, color: '#F44336', description: 'Completed challenges in record time' },
    { id: 5, name: 'Champion', icon: EmojiEvents, color: '#9C27B0', description: 'Reached the top of the leaderboard' }
  ];

  const earnedBadgeIds = progress?.badges || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-2xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-primary mb-6 text-center">
        Your Achievement Badges
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {defaultBadges.map((badge) => {
          const Icon = badge.icon;
          const isEarned = earnedBadgeIds.includes(badge.id);

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              className={`relative p-4 rounded-xl text-center ${
                isEarned ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
              }`}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={isEarned ? { rotate: [0, 360] } : {}}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-2"
              >
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${badge.color}20` }}
                >
                  <Icon
                    className="w-8 h-8"
                    style={{ color: badge.color }}
                  />
                </div>
              </motion.div>

              <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
              
              <p className="text-xs text-gray-600">
                {badge.description}
              </p>

              {isEarned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BadgeGallery;