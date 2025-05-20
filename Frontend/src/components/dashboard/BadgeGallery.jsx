import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Code, EmojiEvents, Psychology, Speed } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

const BadgeGallery = () => {
  const { user, token } = useApp();
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !token) return;
      
      try {
        const [badgesResponse, userBadgesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/badges`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/badges/user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setBadges(badgesResponse.data);
        setUserBadges(userBadgesResponse.data);
      } catch (err) {
        setError('Failed to load badges');
        console.error('Error fetching badges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  const isEarned = (badgeId) => {
    return userBadges?.some(userBadge => userBadge?.badge && userBadge.badge.id === badgeId) || false;
  };

  // Add default icon mapping
  // Update the getDefaultIcon function to be more robust
  const getDefaultIcon = (badge) => {
    if (!badge) return <EmojiEvents className="w-8 h-8 text-primary" />;

    const iconMap = {
      'FIRST_CODE': <Code className="w-8 h-8 text-green-500" />,
      'CODE_NINJA': <Psychology className="w-8 h-8 text-blue-500" />,
      'BUG_HUNTER': <Speed className="w-8 h-8 text-red-500" />,
      'SPEED_DEMON': <Star className="w-8 h-8 text-yellow-500" />,
      'ACHIEVEMENT': <EmojiEvents className="w-8 h-8 text-purple-500" />
    };

    // Try to match badge name if type is not available
    const badgeNameMap = {
      'First Code': 'FIRST_CODE',
      'Code Ninja': 'CODE_NINJA',
      'Bug Hunter': 'BUG_HUNTER',
      'Speed Demon': 'SPEED_DEMON'
    };

    const type = badge.type || badgeNameMap[badge.title];
    return iconMap[type] || <EmojiEvents className="w-8 h-8 text-primary" />;
  };

  // In the render section, update the icon rendering
  // Add default badges if none are fetched
  const defaultBadges = [
    { 
      id: 1, 
      title: 'First Code',
      description: 'Complete your first coding challenge',
      type: 'FIRST_CODE'
    },
    { 
      id: 2, 
      title: 'Code Ninja',
      description: 'Complete 5 challenges in a row',
      type: 'CODE_NINJA'
    },
    { 
      id: 3, 
      title: 'Bug Hunter',
      description: 'Find and fix 3 bugs',
      type: 'BUG_HUNTER'
    },
    { 
      id: 4, 
      title: 'Speed Demon',
      description: 'Complete a challenge under 5 minutes',
      type: 'SPEED_DEMON'
    }
  ];

  // Update the render section to use defaultBadges if badges array is empty
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
        {(badges.length > 0 ? badges : defaultBadges).map((badge) => {
          const earned = isEarned(badge?.id);
          const earnedBadge = userBadges?.find(ub => ub?.badge && ub.badge.id === badge?.id);

          return (
            <motion.div
              key={badge?.id || 'default'}
              whileHover={{ scale: 1.05 }}
              className={`relative p-4 rounded-xl text-center ${
                earned ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
              }`}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={earned ? { rotate: [0, 360] } : {}}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-2"
              >
                <div className="p-3 rounded-full bg-primary/10">
                  {getDefaultIcon(badge)}
                </div>
              </motion.div>

              <h4 className="font-bold text-sm mb-1">{badge?.title || 'Unknown Badge'}</h4>
              
              <p className="text-xs text-gray-600">
                {badge?.description || 'Complete this achievement to unlock'}
              </p>

              {earned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  title={`Earned on ${new Date(earnedBadge.awardedAt).toLocaleDateString()}`}
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