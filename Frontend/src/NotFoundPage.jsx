import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';
import RobotMascot from '../src/components/common/RobotMascot';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <RobotMascot size={200} className="mx-auto mb-8" />
        </motion.div>

        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-6xl md:text-8xl font-bold mb-4 gradient-text"
        >
          Oops! 404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 mb-8"
        >
          Looks like this page got lost in cyberspace!
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home />
          <span>Back to Home</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;