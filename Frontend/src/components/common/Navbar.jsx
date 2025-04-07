import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, School, EmojiEvents, Person, MenuBook, ExitToApp, Menu as MenuIcon } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
    const { user, logout } = useApp();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            setIsOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <School className="text-primary h-8 w-8" />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-primary font-bold text-2xl"
                            >
                                CodeKids
                            </motion.div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <>
                                <NavLink to="/" icon={<Home />} text="Home" />
                                <NavLink to="/challenges" icon={<School />} text="Challenges" />
                                <NavLink to="/dashboard" icon={<Person />} text="Dashboard" />
                                <NavLink to="/leaderboard" icon={<EmojiEvents />} text="Leaders" />
                                <NavLink to="/tutorial" icon={<MenuBook />} text="Tutorial" />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <ExitToApp />
                                    <span>Logout</span>
                                </motion.button>
                            </>
                        ) : (
                            <NavLink to="/auth/login" icon={<Person />} text="Login" />
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary"
                        >
                            <MenuIcon className="h-8 w-8" />
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden overflow-hidden"
                >
                    <div className="pb-4 space-y-2">
                        {user ? (
                            <>
                                <NavLink to="/" icon={<Home />} text="Home" onClick={() => setIsOpen(false)} />
                                <NavLink to="/challenges" icon={<School />} text="Challenges" onClick={() => setIsOpen(false)} />
                                <NavLink to="/dashboard" icon={<Person />} text="Dashboard" onClick={() => setIsOpen(false)} />
                                <NavLink to="/leaderboard" icon={<EmojiEvents />} text="Leaders" onClick={() => setIsOpen(false)} />
                                <NavLink to="/tutorial" icon={<MenuBook />} text="Tutorial" onClick={() => setIsOpen(false)} />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-full flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <ExitToApp />
                                    <span>Logout</span>
                                </motion.button>
                            </>
                        ) : (
                            <NavLink to="/auth/login" icon={<Person />} text="Login" onClick={() => setIsOpen(false)} />
                        )}
                    </div>
                </motion.div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, text, onClick }) => (
    <Link to={to} onClick={onClick}>
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-primary transition-colors"
        >
            {icon}
            <span className="font-medium">{text}</span>
        </motion.div>
    </Link>
);

export default Navbar;