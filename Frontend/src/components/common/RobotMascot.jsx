import { motion } from 'framer-motion';

const RobotMascot = ({ size = 200, color = '#FF4949', className = '', customAnimation }) => { // Changed default color
    return (
        <motion.div
            className={`relative ${className}`}
            style={{ 
                width: size, 
                height: size,
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
            }}
            animate={customAnimation || { y: [0, -10, 0] }}
            transition={!customAnimation && {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
            }}
        >
            <div className="relative w-full h-full">
                {/* Head */}
                <motion.div
                    className="absolute top-[15%] left-[30%] w-[40%] h-[35%] rounded-xl shadow-lg"
                    style={{ 
                        backgroundColor: color,
                        boxShadow: '0 0 15px rgba(255, 73, 73, 0.3)' // Added colored shadow
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Eyes */}
                    <div className="absolute top-[35%] left-[25%] w-[15%] h-[15%] bg-white rounded-full shadow-inner" />
                    <div className="absolute top-[35%] right-[25%] w-[15%] h-[15%] bg-white rounded-full shadow-inner" />

                    {/* Mouth */}
                    <div className="absolute bottom-[20%] left-[20%] w-[60%] h-[4px] bg-gray-900 rounded-full" />
                </motion.div>

                {/* Body */}
                <motion.div
                    className="absolute top-[55%] left-[25%] w-[50%] h-[30%] rounded-xl shadow-lg"
                    style={{ 
                        backgroundColor: color,
                        boxShadow: '0 0 15px rgba(255, 73, 73, 0.3)' // Added colored shadow
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Control Panel */}
                    <div className="absolute top-[20%] left-[20%] w-[60%] h-[40%] bg-gray-800 rounded-lg">
                        <div className="flex justify-around items-center h-full">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </div>
                </motion.div>

                {/* Arms */}
                <motion.div
                    className="absolute top-[60%] left-[15%] w-[10%] h-[20%] bg-gray-800 rounded-lg shadow-md"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                />
                <motion.div
                    className="absolute top-[60%] right-[15%] w-[10%] h-[20%] bg-gray-800 rounded-lg shadow-md"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                />

                {/* Antenna */}
                <motion.div
                    className="absolute top-[10%] left-[48%] w-[4%] h-[10%] bg-gray-900"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    style={{ transformOrigin: 'bottom' }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                >
                    <motion.div
                        className="absolute -top-2 left-1/2 w-3 h-3 rounded-full bg-red-500 -translate-x-1/2 shadow-glow"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            boxShadow: ['0 0 10px #ff0000', '0 0 20px #ff0000', '0 0 10px #ff0000']
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RobotMascot;