import { motion } from 'framer-motion';
import { Star, TrendingUp, EmojiEvents } from '@mui/icons-material';
import MilestoneMap from '../components/dashboard/MilestoneMap';
import BadgeGallery from '../components/dashboard/BadgeGallery';
import { useApp } from '../context/AppContext';

const ProgressDashboard = () => {
  const { progress } = useApp();

  const stats = [
    {
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Points Earned',
      value: progress?.points || 0
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Challenges Completed',
      value: progress?.completedChallenges?.length || 0
    },
    {
      icon: <EmojiEvents className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Current Level',
      value: progress?.level || 1
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-2 sm:px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-gray-100 rounded-full">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
              <div className="min-w-[320px] sm:min-w-[640px] md:min-w-[768px]">
                <MilestoneMap />
              </div>
            </div>
            <div className="absolute left-0 right-0 bottom-0 h-4 bg-gradient-to-t from-gray-50 to-transparent sm:hidden" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow p-3 sm:p-4 md:p-6"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6">
              Your Achievement Gallery
            </h2>
            <BadgeGallery />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow p-3 sm:p-4 md:p-6"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6">
              Recent Activity
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {(progress?.recentActivity || []).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
                    {React.cloneElement(activity.icon, { 
                      className: "w-4 h-4 sm:w-5 sm:h-5 text-primary" 
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">{activity.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{activity.timestamp}</p>
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