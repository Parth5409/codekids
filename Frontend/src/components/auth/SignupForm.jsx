import { useState } from 'react';
import { motion } from 'framer-motion';
import { TextField, Button, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import RobotMascot from '../common/RobotMascot';
import { useApp } from '../../context/AppContext';

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await login({ username: formData.username, password: formData.password });
        navigate('/dashboard');
      } catch (error) {
        setErrors({ submit: error.message || 'Registration failed. Please try again.' });
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
        Join the Coding Adventure!
      </h2>

      {errors.submit && (
        <Alert severity="error" className="mb-3 sm:mb-4 text-sm sm:text-base">
          {errors.submit}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <TextField
          fullWidth
          label="Choose a Cool Username"
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
            label="Create a Secret Password"
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

        <div className="relative">
          <TextField
            fullWidth
            label="Confirm Your Secret Password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
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
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            {isSubmitting ? 'Creating Account...' : 'Begin Your Journey!'}
          </Button>
        </motion.div>

        <div className="text-center mt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary hover:text-primary-dark text-xs sm:text-sm font-medium"
            onClick={() => navigate('/auth/login')}
          >
            Already have an account? Login here!
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default SignupForm;