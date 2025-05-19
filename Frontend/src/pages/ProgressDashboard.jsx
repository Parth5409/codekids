import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, EmojiEvents, Code } from '@mui/icons-material';
import axios from 'axios';
import MilestoneMap from '../components/dashboard/MilestoneMap';
import BadgeGallery from '../components/dashboard/BadgeGallery';
import { useApp } from '../context/AppContext';

const ProgressDashboard = () => {
  const { user, token } = useApp();
  const [userProgress, setUserProgress] = useState({
    points: 0,
    completedChallenges: 0,
    earnedBadges: 0,
    level: 1
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !token) {
        setLoading(false);
        setError('Please log in to view your progress');
        return;
      }

      try {
        await Promise.all([fetchUserProgress(), fetchRecentActivities()]);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, token]);

  const fetchUserProgress = async () => {
    try {
      const [rankResponse, challengesResponse, badgesResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/leaderboard/user/${user.id}/rank`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8080/api/users/${user.id}/challenges`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8080/api/users/${user.id}/badges`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const completedChallenges = challengesResponse.data.filter(
        challenge => challenge.status === 'COMPLETED'
      );

      setUserProgress({
        points: user.points || 0,
        completedChallenges: completedChallenges.length,
        earnedBadges: badgesResponse.data.length,
        level: Math.floor((user.points || 0) / 100) + 1
      });
    } catch (err) {
      setError(`Failed to load progress data: ${err.response?.data?.message || err.message}`);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const [challengesResponse, badgesResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/users/${user.id}/challenges`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8080/api/users/${user.id}/badges`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const activities = [
        ...challengesResponse.data.map(challenge => ({
          icon: getActivityIcon(challenge.status === 'COMPLETED' ? 'CHALLENGE_COMPLETED' : 'IN_PROGRESS'),
          title: `Challenge: ${challenge.challenge?.title || 'Unknown Challenge'}`,
          timestamp: new Date(challenge.startedAt || Date.now()),
          type: challenge.status
        })),
        ...badgesResponse.data.map(badge => ({
          icon: getActivityIcon('BADGE_EARNED'),
          title: `Badge Earned: ${badge.badge?.name || 'Unknown Badge'}`,
          timestamp: new Date(badge.earnedAt || Date.now()),
          type: 'BADGE_EARNED'
        }))
      ].sort((a, b) => b.timestamp - a.timestamp)
       .map(activity => ({
         ...activity,
         timestamp: activity.timestamp.toLocaleDateString()
       }));

      setRecentActivities(activities);
    } catch (err) {
      // Keep error handling without console.log
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'CHALLENGE_COMPLETED':
        return <Code className="text-green-500" />;
      case 'BADGE_EARNED':
        return <EmojiEvents className="text-purple-500" />;
      case 'POINTS_EARNED':
        return <Star className="text-yellow-400" />;
      default:
        return <TrendingUp className="text-blue-500" />;
    }
  };

  const stats = [
    {
      icon: <Star className="text-yellow-400" />,
      label: 'Points Earned',
      value: userProgress.points
    },
    {
      icon: <TrendingUp className="text-green-500" />,
      label: 'Challenges Completed',
      value: userProgress.completedChallenges
    },
    {
      icon: <EmojiEvents className="text-purple-500" />,
      label: 'Current Level',
      value: userProgress.level
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 md:p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-gray-100 rounded-full">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-primary">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Milestone Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto"
          >
            <div className="min-w-[768px]">
              <MilestoneMap progress={userProgress} />
            </div>
          </motion.div>

          {/* Badge Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-4 md:p-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
              Your Achievement Gallery
            </h2>
            <BadgeGallery userId={user.id} />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-4 md:p-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-primary/10 rounded-full">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">{activity.title}</p>
                    <p className="text-xs md:text-sm text-gray-600">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;