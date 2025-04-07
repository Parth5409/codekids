import { motion } from 'framer-motion';
import { CheckCircle, LockOutlined, School, Code, Psychology, EmojiEvents } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const MilestoneMap = () => {
  const { progress } = useApp();
  const currentLevel = progress?.level || 1;
  const milestones = [
    { id: 1, name: 'Getting Started', icon: School, color: '#4CAF50' },
    { id: 2, name: 'Basic Commands', icon: Code, color: '#2196F3' },
    { id: 3, name: 'Loops & Logic', icon: Psychology, color: '#9C27B0' },
    { id: 4, name: 'Advanced Skills', icon: EmojiEvents, color: '#F44336' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <h3 className="text-xl font-bold text-primary mb-8 text-center">
        Your Learning Adventure
      </h3>

      <div className="relative pt-8 pb-24">
        {/* Progress Path */}
        <div className="absolute top-12 left-0 w-full h-2 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentLevel / milestones.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>

        {/* Milestones */}
        <div className="relative flex justify-between px-4 md:px-8">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const isCompleted = index + 1 <= currentLevel;
            const isActive = index + 1 === currentLevel;

            return (
              <motion.div
                key={milestone.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col items-center"
                style={{ minWidth: '80px' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <LockOutlined className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </motion.div>

                <div className="absolute top-16 w-24 md:w-32 text-center">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.3 }}
                  >
                    <Icon 
                      className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 ${
                        isActive ? 'text-primary' : 'text-gray-400'
                      }`}
                    />
                    <p className={`text-xs md:text-sm font-medium ${
                      isActive ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {milestone.name}
                    </p>
                  </motion.div>
                </div>

                {isActive && (
                  <motion.div
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-primary text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">
                      Current Level
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MilestoneMap;