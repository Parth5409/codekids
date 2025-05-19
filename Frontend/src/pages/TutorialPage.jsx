import { useState } from 'react';
import { motion } from 'framer-motion';
import { School, Code, EmojiEvents, Psychology, NavigateNext, NavigateBefore } from '@mui/icons-material';
import RobotMascot from '../components/common/RobotMascot';

const TutorialPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to CodeKids!',
      icon: <School className="text-primary w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Learn coding through fun challenges and earn rewards as you progress.',
      animation: <RobotMascot size={120} className="sm:scale-125 md:scale-150 animate-bounce" />
    },
    {
      title: 'Solve Coding Challenges',
      icon: <Code className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Drag and drop code blocks to create working programs and learn programming concepts.',
      animation: <RobotMascot 
        size={120} 
        color="#3B82F6"
        className="sm:scale-125 md:scale-150"
        customAnimation={{
          rotate: [0, 10, -10, 0],
          transition: { duration: 2, repeat: Infinity }
        }}
      />
    },
    {
      title: 'Track Your Progress',
      icon: <Psychology className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Watch your skills grow with our progress tracking system and milestone achievements.',
      animation: <RobotMascot 
        size={120} 
        color="#22C55E"
        className="sm:scale-125 md:scale-150"
        customAnimation={{
          scale: [1, 1.1, 1],
          transition: { duration: 1.5, repeat: Infinity }
        }}
      />
    },
    {
      title: 'Earn Rewards',
      icon: <EmojiEvents className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Collect badges, points, and climb the leaderboard as you master new concepts.',
      animation: <RobotMascot 
        size={120} 
        color="#FBBF24"
        className="sm:scale-125 md:scale-150"
        customAnimation={{
          y: [0, -15, 0],
          transition: { duration: 1, repeat: Infinity }
        }}
      />
    }
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              {tutorialSteps[currentStep].icon}
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                {tutorialSteps[currentStep].title}
              </h1>
            </motion.div>

            <div className="flex items-center gap-2 justify-center sm:justify-end">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <NavigateBefore className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              )}
              <span className="text-sm sm:text-base text-gray-500">
                {currentStep + 1} / {tutorialSteps.length}
              </span>
              {currentStep < tutorialSteps.length - 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <NavigateNext className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <p className="text-base sm:text-lg text-gray-600">
                {tutorialSteps[currentStep].description}
              </p>
              <div className="flex gap-2 justify-center sm:justify-start">
                {tutorialSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1.5 sm:h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      index === currentStep ? 'w-6 sm:w-8 bg-primary' : 'w-1.5 sm:w-2 bg-gray-200'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              key={`animation-${currentStep}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center items-center pt-4 sm:pt-0"
            >
              {tutorialSteps[currentStep].animation}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TutorialPage;