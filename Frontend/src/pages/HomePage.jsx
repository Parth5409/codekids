import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { School, EmojiEvents, Psychology, Code, Star } from '@mui/icons-material';
import RobotMascot from '../components/common/RobotMascot';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const features = [
    {
      icon: <School className="w-12 h-12 text-blue-500" />,
      title: 'Interactive Learning',
      description: 'Learn coding through fun, interactive challenges and games'
    },
    {
      icon: <Psychology className="w-12 h-12 text-green-500" />,
      title: 'Problem Solving',
      description: 'Develop critical thinking skills with engaging puzzles'
    },
    {
      icon: <EmojiEvents className="w-12 h-12 text-yellow-500" />,
      title: 'Earn Rewards',
      description: 'Collect badges and points as you master new skills'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-28 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <RobotMascot size={250} className="mx-auto mb-8" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold mb-8 gradient-text pb-3"
          >
            Start Your Coding Adventure!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Join our fun-filled journey into the world of programming with interactive challenges and rewards!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-x-4 flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => navigate(user ? '/challenges' : '/auth/signup')}
              className="btn-primary text-lg px-8 py-3 rounded-full hover:scale-105 transition-transform"
            >
              {user ? 'Start Coding Now!' : 'Join for Free!'}
            </button>
            <button
              onClick={() => navigate('/tutorial')}
              className="btn-secondary text-lg px-8 py-3 rounded-full hover:scale-105 transition-transform" 
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
          >
            Why Choose CodeKids?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="card text-center p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard icon={<Code />} number="1000+" text="Coding Challenges" />
            <StatCard icon={<Star />} number="50K+" text="Happy Students" />
            <StatCard icon={<EmojiEvents />} number="100K+" text="Badges Earned" />
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, number, text }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    className="card flex flex-col items-center p-6 hover:shadow-lg transition-shadow"
  >
    <div className="text-primary mb-4">{icon}</div>
    <div className="text-4xl font-bold mb-2 gradient-text">{number}</div>
    <div className="text-gray-600">{text}</div>
  </motion.div>
);

export default HomePage;