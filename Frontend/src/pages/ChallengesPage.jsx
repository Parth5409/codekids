import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  useDraggable, 
  useDroppable,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors 
} from '@dnd-kit/core';
import { Code, Lightbulb, ArrowForward, Refresh, EmojiEvents, Star } from '@mui/icons-material';
import ReactConfetti from 'react-confetti';
import CodeBlock from '../components/challenges/CodeBlock';
import HintModal from '../components/challenges/HintModal';
import { useApp } from '../context/AppContext';

const DroppableArea = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'dropzone',
  });

  return (
    <div ref={setNodeRef} className="min-h-[150px] sm:min-h-[200px] w-full">
      {children}
    </div>
  );
};

const ChallengesPage = () => {
  const { progress, updateProgress } = useApp();
  const [showHint, setShowHint] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [shake, setShake] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const challenges = [
    {
      id: 1,
      title: 'Print Hello World',
      description: 'Create your first program by arranging the blocks to print "Hello World"',
      hint: 'Start with the print statement block and add the text inside!',
      blocks: [
        { id: 'print', content: 'print', type: 'action' },
        { id: 'hello', content: '"Hello World"', type: 'variable' }
      ],
      solution: ['print', 'hello']
    },
    {
      id: 2,
      title: 'Simple Loop',
      description: 'Create a loop that prints numbers from 1 to 3',
      hint: 'Use the for loop block and arrange the numbers correctly!',
      blocks: [
        { id: 'print', content: 'print', type: 'action' },
        { id: 'for', content: 'for i in range(3):', type: 'control' },
        { id: 'i', content: 'i', type: 'variable' }
      ],
      solution: ['for', 'print', 'i']
    },
    {
      id: 3,
      title: 'If Statement',
      description: 'Create an if statement to check if a number is positive',
      hint: 'Use the if condition block with the comparison operator!',
      blocks: [
        { id: 'print', content: 'print', type: 'action' },
        { id: 'if', content: 'if x > 0:', type: 'control' },
        { id: 'message', content: '"Positive number"', type: 'variable' }
      ],
      solution: ['if', 'print', 'message']
    }
  ];

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && over.id === 'dropzone') {
      const draggedBlock = challenges[currentChallenge].blocks.find(
        (block) => block.id === active.id
      );

      if (draggedBlock && !droppedBlocks.find(block => block.id === draggedBlock.id)) {
        setDroppedBlocks((prev) => [...prev, draggedBlock]);

        const newDroppedBlocks = [...droppedBlocks, draggedBlock];
        const solution = challenges[currentChallenge].solution;

        if (newDroppedBlocks.length === solution.length) {
          const isCorrect = newDroppedBlocks.every(
            (block, index) => block.id === solution[index]
          );

          if (isCorrect) {
            setShowSuccessPopup(true);
            setShowConfetti(true);
            updateProgress(currentChallenge);
            setTimeout(() => {
              setShowConfetti(false);
              setShowSuccessPopup(false);
              if (currentChallenge < challenges.length - 1) {
                setCurrentChallenge(prev => prev + 1);
                setDroppedBlocks([]);
              }
            }, 4000);
          } else {
            setShake(true);
            setTimeout(() => {
              setShake(false);
              setDroppedBlocks([]);
            }, 820);
          }
        }
      }
    }
  };

  const resetChallenge = () => {
    setDroppedBlocks([]);
  };

  const handleNextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setDroppedBlocks([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          tweenDuration={4000}
          colors={['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#4169E1']}
          confettiSource={{
            x: windowSize.width / 2,
            y: windowSize.height / 2,
            w: 0,
            h: 0
          }}
        />
      )}

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center max-w-md mx-auto relative overflow-hidden"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <EmojiEvents className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400" />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                  Excellent Work!
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  You've successfully completed the challenge!
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2 
                    }}
                  >
                    <Star className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg sm:text-xl font-semibold text-green-500"
              >
                +100 Points
              </motion.div>

              <motion.div
                className="absolute -z-10 inset-0 opacity-10"
                animate={{
                  background: [
                    "radial-gradient(circle, #FFD700 0%, transparent 70%)",
                    "radial-gradient(circle, #FFA500 0%, transparent 70%)",
                    "radial-gradient(circle, #FFD700 0%, transparent 70%)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                Challenge {currentChallenge + 1}
              </h1>
              <span className="text-sm sm:text-base text-gray-400">
                {currentChallenge + 1} of {challenges.length}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetChallenge}
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-700"
              >
                <Refresh className="w-5 h-5" />
                <span>Reset</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-yellow-600 hover:text-yellow-700"
              >
                <Lightbulb className="w-5 h-5" />
                <span>Need a Hint?</span>
              </motion.button>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              {challenges[currentChallenge].title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {challenges[currentChallenge].description}
            </p>
          </div>

          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  <span>Available Blocks</span>
                  <span className="text-xs text-gray-500 ml-2">(Press and hold to drag on mobile)</span>
                </h3>
                <div className="flex gap-2 sm:gap-4 flex-wrap">
                  {challenges[currentChallenge].blocks
                    .filter((block) => !droppedBlocks.find((d) => d.id === block.id))
                    .map((block) => (
                      <CodeBlock
                        key={block.id}
                        id={block.id}
                        content={block.content}
                        type={block.type}
                      />
                    ))}
                </div>
              </div>

              <DroppableArea>
                <motion.div
                  animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-800 p-3 sm:p-4 rounded-lg min-h-[150px] sm:min-h-[200px] border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors touch-none"
                >
                  <h3 className="text-sm sm:text-base text-white font-medium mb-3 sm:mb-4">Drop Your Blocks Here</h3>
                  <div className="flex flex-col gap-2">
                    {droppedBlocks.map((block, index) => (
                      <motion.div
                        key={`${block.id}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-2 sm:p-3 rounded text-sm sm:text-base ${
                          block.type === 'action'
                            ? 'bg-blue-600'
                            : block.type === 'control'
                            ? 'bg-purple-600'
                            : 'bg-green-600'
                        } text-white shadow-md`}
                      >
                        {block.content}
                      </motion.div>
                    ))}
                  </div>
                  {droppedBlocks.length === 0 && (
                    <div className="text-sm sm:text-base text-gray-500 text-center py-6 sm:py-8">
                      Drag and drop code blocks here to build your solution
                    </div>
                  )}
                </motion.div>
              </DroppableArea>
            </div>
          </DndContext>

          {currentChallenge < challenges.length - 1 && (
            <div className="mt-4 sm:mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextChallenge}
                className="flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
              >
                <span>Next Challenge</span>
                <ArrowForward className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      <HintModal
        isOpen={showHint}
        onClose={() => setShowHint(false)}
        hint={challenges[currentChallenge].hint}
      />
    </div>
  );
};

export default ChallengesPage;