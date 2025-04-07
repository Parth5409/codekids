import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { Code, Lightbulb, ArrowForward, Refresh } from '@mui/icons-material';
import ReactConfetti from 'react-confetti';
import CodeBlock from '../components/challenges/CodeBlock';
import HintModal from '../components/challenges/HintModal';
import { useApp } from '../context/AppContext';

const DroppableArea = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'dropzone',
  });

  return (
    <div ref={setNodeRef} className="min-h-[200px] w-full">
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
  const [shake, setShake] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
        { id: 'for', content: 'for i in range(3):', type: 'control' },
        { id: 'print', content: 'print', type: 'action' },
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
        { id: 'if', content: 'if x > 0:', type: 'control' },
        { id: 'print', content: 'print', type: 'action' },
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
            setShowConfetti(true);
            updateProgress(currentChallenge);
            setTimeout(() => {
              setShowConfetti(false);
              if (currentChallenge < challenges.length - 1) {
                setCurrentChallenge(prev => prev + 1);
                setDroppedBlocks([]);
              }
            }, 3000);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">
                Challenge {currentChallenge + 1}
              </h1>
              <span className="text-gray-400">
                {currentChallenge + 1} of {challenges.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetChallenge}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
              >
                <Refresh />
                <span>Reset</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHint(true)}
                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
              >
                <Lightbulb />
                <span>Need a Hint?</span>
              </motion.button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              {challenges[currentChallenge].title}
            </h2>
            <p className="text-gray-600">
              {challenges[currentChallenge].description}
            </p>
          </div>

          <DndContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Code />
                  <span>Available Blocks</span>
                </h3>
                <div className="flex gap-4 flex-wrap">
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
                  className="bg-gray-800 p-4 rounded-lg min-h-[200px] border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <h3 className="text-white font-medium mb-4">Drop Your Blocks Here</h3>
                  <div className="flex flex-col gap-2">
                    {droppedBlocks.map((block, index) => (
                      <motion.div
                        key={`${block.id}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded ${
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
                    <div className="text-gray-500 text-center py-8">
                      Drag and drop code blocks here to build your solution
                    </div>
                  )}
                </motion.div>
              </DroppableArea>
            </div>
          </DndContext>

          {currentChallenge < challenges.length - 1 && (
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextChallenge}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
              >
                <span>Next Challenge</span>
                <ArrowForward />
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