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
  const { progress, updateProgress, token } = useApp(); // Assuming token is available in useApp()
  const [showHint, setShowHint] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [shake, setShake] = useState(false);
  const [backendChallenges, setBackendChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processedChallenges, setProcessedChallenges] = useState([]);
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

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/challenges`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        // Assuming Spring Page structure, challenges are in 'content'
        setBackendChallenges(data.content || []);
        console.log('Fetched challenges:', data.content);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch challenges:', err);
        setBackendChallenges([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    if (backendChallenges && backendChallenges.length > 0) {
      const newProcessedChallenges = backendChallenges.map(challenge => {
        try {
          const blocks = JSON.parse(challenge.codeBlocks || '[]');
          const solution = JSON.parse(challenge.solutionLogic || '[]');
          const hint = challenge.hint || challenge.description || "Try your best!";
          return {
            ...challenge, // keep other fields like id, title, description
            blocks,
            solution,
            hint
          };
        } catch (e) {
          console.error("Failed to parse challenge data:", challenge, e);
          return null;
        }
      }).filter(Boolean);
      setProcessedChallenges(newProcessedChallenges);
      if (currentChallenge >= newProcessedChallenges.length && newProcessedChallenges.length > 0) {
        setCurrentChallenge(0);
      } else if (newProcessedChallenges.length === 0) {
        setCurrentChallenge(0);
      }
    } else {
      setProcessedChallenges([]);
      setCurrentChallenge(0);
    }
  }, [backendChallenges]); // currentChallenge is not needed here as it's reset based on newProcessedChallenges

  const handleStartChallenge = async (challengeId) => {
    if (!token) {
      console.warn("No auth token available, cannot start challenge.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/challenges/${challengeId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Challenge started:', data);
    } catch (error) {
      console.error('Failed to start challenge:', error);
    }
  };

  const handleSubmitChallenge = async (challengeId, solutionAttempt) => {
    if (!token) {
      console.warn("No auth token available, cannot submit challenge.");
      throw new Error("Authentication token not found."); // Throw error to indicate submission failure
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solutionAttempt)
      });
      if (!response.ok) {
        const errorData = await response.text(); // Try to get more error info
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText} - ${errorData}`);
      }
      const data = await response.json();
      console.log('Challenge submitted successfully:', data);
      return data; // Return data for potential further use
    } catch (error) {
      console.error('Failed to submit challenge:', error);
      throw error; // Re-throw to be caught by caller
    }
  };

  useEffect(() => {
    if (processedChallenges.length > 0 && processedChallenges[currentChallenge] && token) {
      const challengeId = processedChallenges[currentChallenge].id;
      handleStartChallenge(challengeId);
    }
    // Ensure droppedBlocks are reset when currentChallenge changes
    setDroppedBlocks([]);
  }, [currentChallenge, processedChallenges, token]);


  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && over.id === 'dropzone' && processedChallenges.length > 0 && processedChallenges[currentChallenge]) {
      const currentChallengeData = processedChallenges[currentChallenge];
      const draggedBlock = currentChallengeData.blocks.find(
        (block) => block.id === active.id
      );

      if (draggedBlock && !droppedBlocks.find(block => block.id === draggedBlock.id)) {
        const newDroppedBlocks = [...droppedBlocks, draggedBlock];
        setDroppedBlocks(newDroppedBlocks); // Update droppedBlocks immediately for UI responsiveness

        const solution = currentChallengeData.solution;

        if (newDroppedBlocks.length === solution.length) {
          const isCorrect = newDroppedBlocks.every(
            (block, index) => block.id === solution[index]
          );

          if (isCorrect) {
            if (token) {
              try {
                await handleSubmitChallenge(currentChallengeData.id, newDroppedBlocks);
                // Proceed with success UI only if submission is successful
                updateProgress(currentChallengeData.id); // Use ID for progress
                setShowSuccessPopup(true);
                setShowConfetti(true);
                setTimeout(() => {
                  setShowConfetti(false);
                  setShowSuccessPopup(false);
                  if (currentChallenge < processedChallenges.length - 1) {
                    setCurrentChallenge(prev => prev + 1);
                    // setDroppedBlocks([]); // Already handled by useEffect for currentChallenge change
                  }
                }, 4000);
              } catch (error) {
                console.error("Challenge submission failed, not proceeding with success UI.", error);
                // Optionally: set an error state here to show a message to the user
                // For now, we just log it and prevent the success UI.
                // Shake animation for incorrect attempt might be better here or a specific error message.
                setShake(true);
                setTimeout(() => {
                  setShake(false);
                  // Do not clear droppedBlocks here, let user see their attempt
                }, 820);
                return; // Stop further execution in isCorrect block
              }
            } else {
              console.warn("No auth token available, cannot submit challenge.");
              // Handle case where token is missing but solution is correct locally
              // Might show a message to the user to log in
              setShake(true); // Indicate something is off
              setTimeout(() => setShake(false), 820);
              return;
            }
          } else {
            setShake(true);
            setTimeout(() => {
              setShake(false);
              setDroppedBlocks([]); // Clear blocks on incorrect attempt
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
    if (currentChallenge < processedChallenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      // setDroppedBlocks([]); // Already handled by useEffect for currentChallenge change
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading challenges...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  if (processedChallenges.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">No challenges available.</div>;
  }

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
                {currentChallenge + 1} of {processedChallenges.length}
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
              {processedChallenges[currentChallenge].title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {processedChallenges[currentChallenge].description}
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
                  {processedChallenges[currentChallenge].blocks
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

          {currentChallenge < processedChallenges.length - 1 && (
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
        hint={processedChallenges[currentChallenge].hint}
      />
    </div>
  );
};

export default ChallengesPage;
