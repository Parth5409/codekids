import { motion, AnimatePresence } from 'framer-motion';
import { Close, Lightbulb } from '@mui/icons-material';
import RobotMascot from '../common/RobotMascot';

const HintModal = ({ isOpen, onClose, hint }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Lightbulb className="text-yellow-400 mr-2" />
                <h3 className="text-xl font-bold text-primary">Need a Hint?</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <Close />
              </button>
            </div>

            <div className="flex items-center mb-6">
              <RobotMascot size={80} className="mr-4" />
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-blue-50 p-4 rounded-lg flex-1"
              >
                <p className="text-gray-700">{hint}</p>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-primary text-white rounded-full font-medium"
              onClick={onClose}
            >
              Got it, thanks!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HintModal;