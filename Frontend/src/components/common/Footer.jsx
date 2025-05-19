import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { School, Security, Help } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/tutorial" text="Start Learning" icon={<School className="w-5 h-5" />} />
              <FooterLink to="/challenges" text="Fun Challenges" icon={<School className="w-5 h-5" />} />
              <FooterLink to="/help" text="Need Help?" icon={<Help className="w-5 h-5" />} />
            </ul>
          </div>

          {/* Parents Section */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">For Parents</h3>
            <ul className="space-y-2">
              <FooterLink to="/safety" text="Safety Guide" icon={<Security className="w-5 h-5" />} />
              <FooterLink to="/privacy" text="Privacy Policy" icon={<Security className="w-5 h-5" />} />
              <FooterLink to="/settings" text="Parental Controls" icon={<Security className="w-5 h-5" />} />
            </ul>
          </div>

          {/* Fun Facts */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Did You Know?</h3>
            <motion.div
              className="bg-blue-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-sm text-gray-600">
                Computers can perform billions of calculations per second! 
                That's faster than counting to 100 million years!
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              © 2024 CodeKids. Made with 💖 for young coders!
            </motion.div>

            <motion.div
              className="flex space-x-4 mt-4 md:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/terms" className="text-sm text-gray-500 hover:text-primary">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary">
                Privacy
              </Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-primary">
                Contact
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, text, icon }) => (
  <li>
    <Link to={to}>
      <motion.div
        className="flex items-center space-x-2 text-gray-600 hover:text-primary"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
        <span className="text-sm">{text}</span>
      </motion.div>
    </Link>
  </li>
);

export default Footer;