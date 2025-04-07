import { useState } from 'react';
import { motion } from 'framer-motion';
import { School, Code, EmojiEvents, Psychology, NavigateNext, NavigateBefore } from '@mui/icons-material';
import RobotMascot from '../components/common/RobotMascot';

const TutorialPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to CodeKids!',
      icon: <School className="text-primary w-8 h-8" />,
      description: 'Learn coding through fun challenges and earn rewards as you progress.',
      animation: <RobotMascot size={150} className="animate-bounce" />
    },
    {
      title: 'Solve Coding Challenges',
      icon: <Code className="text-blue-500 w-8 h-8" />,
      description: 'Drag and drop code blocks to create working programs and learn programming concepts.',
      animation: <div className="w-32 h-32 bg-blue-100 rounded-lg animate-pulse" />
    },
    {
      title: 'Track Your Progress',
      icon: <Psychology className="text-green-500 w-8 h-8" />,
      description: 'Watch your skills grow with our progress tracking system and milestone achievements.',
      animation: <div className="w-32 h-32 bg-green-100 rounded-lg animate-spin-slow" />
    },
    {
      title: 'Earn Rewards',
      icon: <EmojiEvents className="text-yellow-400 w-8 h-8" />,
      description: 'Collect badges, points, and climb the leaderboard as you master new concepts.',
      animation: <div className="w-32 h-32 bg-yellow-100 rounded-lg animate-bounce" />
    }
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="flex items-center gap-3"
            >
              {tutorialSteps[currentStep].icon}
              <h1 className="text-2xl font-bold text-primary">
                {tutorialSteps[currentStep].title}
              </h1>
            </motion.div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <NavigateBefore />
                </motion.button>
              )}
              <span className="text-gray-500">
                {currentStep + 1} / {tutorialSteps.length}
              </span>
              {currentStep < tutorialSteps.length - 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <NavigateNext />
                </motion.button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <p className="text-lg text-gray-600">
                {tutorialSteps[currentStep].description}
              </p>
              <div className="flex gap-2">
                {tutorialSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-gray-200'
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
              className="flex justify-center items-center"
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