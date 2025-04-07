import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const CodeBlock = ({ id, content, type }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        cursor-grab active:cursor-grabbing
        p-3 rounded shadow-md
        ${type === 'action' ? 'bg-blue-600' : type === 'control' ? 'bg-purple-600' : 'bg-green-600'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        text-white
      `}
    >
      {content}
    </motion.div>
  );
};

export default CodeBlock;