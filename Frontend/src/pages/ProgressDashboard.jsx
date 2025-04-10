import { motion } from 'framer-motion';
import { Star, TrendingUp, EmojiEvents } from '@mui/icons-material';
import MilestoneMap from '../components/dashboard/MilestoneMap';
import BadgeGallery from '../components/dashboard/BadgeGallery';
import { useApp } from '../context/AppContext';

const ProgressDashboard = () => {
  const { progress } = useApp();

  const stats = [
    {
      icon: <Star className="text-yellow-400" />,
      label: 'Points Earned',
      value: progress?.points || 0
    },
    {
      icon: <TrendingUp className="text-green-500" />,
      label: 'Challenges Completed',
      value: progress?.completedChallenges?.length || 0
    },
    {
      icon: <EmojiEvents className="text-purple-500" />,
      label: 'Current Level',
      value: progress?.level || 1
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-8">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto"
          >
            <div className="min-w-[768px]">
              <MilestoneMap />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-4 md:p-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
              Your Achievement Gallery
            </h2>
            <BadgeGallery />
          </motion.div>

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
              {(progress?.recentActivity || []).map((activity, index) => (
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