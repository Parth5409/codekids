import { useState } from 'react';
import { motion } from 'framer-motion';
import { TextField, Button, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import RobotMascot from '../common/RobotMascot';
import { useApp } from '../../context/AppContext';

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!selectedFile) {
      newErrors.avatar = 'Please select a profile picture';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const submitData = new FormData();
        submitData.append('file', selectedFile);
        submitData.append('username', formData.username);
        submitData.append('email', formData.email);
        submitData.append('password', formData.password);
        submitData.append('country', formData.country || 'India');

        await signup(submitData);
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
        {previewUrl && (
          <div className="flex justify-center mb-3">
            <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-2"
        />
        {errors.avatar && (
          <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>
        )}

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
        />

        <TextField
          fullWidth
          label="Your Email Address"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          helperText={errors.email}
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
        />

        <TextField
          fullWidth
          label="Your Country (Optional)"
          variant="outlined"
          value={formData.country}
          onChange={handleChange('country')}
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