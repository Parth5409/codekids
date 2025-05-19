import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, Palette, Face } from '@mui/icons-material';
import RobotMascot from '../common/RobotMascot';
import { useApp } from '../../context/AppContext';

const AvatarCustomizer = () => {
  const { user, updateProgress } = useApp();
  const [currentColor, setCurrentColor] = useState(user?.avatarColor || '#FF9F1C');
  const colors = ['#FF9F1C', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'];

  const handleColorChange = async (color) => {
    setCurrentColor(color);
    try {
      await updateProgress({ avatarColor: color });
    } catch (error) {
      console.error('Failed to update avatar color:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-white rounded-2xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-primary mb-6 text-center">
        Customize Your Robot Friend!
      </h3>

      <div className="flex flex-col items-center space-y-6">
        <RobotMascot size={200} color={currentColor} />

        <div className="flex items-center space-x-4">
          <IconButton className="bg-gray-100">
            <ChevronLeft />
          </IconButton>
          
          <div className="flex space-x-2">
            {colors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>

          <IconButton className="bg-gray-100">
            <ChevronRight />
          </IconButton>
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outlined"
            startIcon={<Face />}
            className="border-primary text-primary"
          >
            Change Style
          </Button>
          <Button
            variant="outlined"
            startIcon={<Palette />}
            className="border-primary text-primary"
          >
            More Colors
          </Button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-primary text-white rounded-full font-medium"
          onClick={() => onSave({ color: currentColor })}
        >
          Save My Robot!
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AvatarCustomizer;