import { useState } from 'react';
import { motion } from 'framer-motion';
import { TextField, Button, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import RobotMascot from '../common/RobotMascot';
import { useApp } from '../../context/AppContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await login(formData);
        navigate('/dashboard');
      } catch (error) {
        setErrors({ submit: error.message || 'Login failed. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleForgotPassword = () => {
    navigate('/auth/reset-password');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[340px] sm:max-w-md p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-xl mx-2"
    >
      <div className="flex justify-center mb-4 sm:mb-6">
        <RobotMascot size={100} className="sm:scale-110 md:scale-120" />
      </div>
      
      <h2 className="text-xl sm:text-2xl font-bold text-center text-primary mb-4 sm:mb-6">
        Welcome Back, Explorer!
      </h2>

      {errors.submit && (
        <Alert severity="error" className="mb-3 sm:mb-4 text-sm sm:text-base">
          {errors.submit}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={formData.username}
          onChange={handleChange('username')}
          error={!!errors.username}
          helperText={errors.username}
          disabled={isSubmitting}
          className="bg-gray-50"
          size="small"
          sx={{ 
            '& .MuiInputLabel-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            },
            '& .MuiInputBase-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
          inputProps={{
            'aria-label': 'Username',
            autoComplete: 'username'
          }}
        />

        <div className="relative">
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.password}
            onChange={handleChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isSubmitting}
            className="bg-gray-50"
            size="small"
            sx={{ 
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              },
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </div>

        <motion.div
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            className={`
              bg-primary hover:bg-primary-dark text-white 
              py-2.5 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isSubmitting ? 'Logging in...' : 'Start Your Adventure!'}
          </Button>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-4 text-xs sm:text-sm">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary hover:text-primary-dark font-medium"
            onClick={handleForgotPassword}
          >
            Forgot your password?
          </motion.button>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary hover:text-primary-dark font-medium"
            onClick={() => navigate('/auth/signup')}
          >
            Create Account
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;