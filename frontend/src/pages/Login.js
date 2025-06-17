import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/login-illustration.png'; // Adjust path as per your project
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const [usePhone, setUsePhone] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleLogin = async () => {
    try {
      if (usePhone) {
        if (!otpSent) {
          window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': () => {}
          }, auth);

          const confirmation = await signInWithPhoneNumber(auth, emailOrPhone, window.recaptchaVerifier);
          window.confirmationResult = confirmation;
          setOtpSent(true);
        } else {
          await window.confirmationResult.confirm(otp);
          navigate('/dashboard');
        }
      } else {
        await signInWithEmailAndPassword(auth, emailOrPhone, password);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Image Section */}
      <Box sx={{ flex: 1, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={loginImage} alt="Login Illustration" style={{ maxWidth: '80%', height: 'auto' }} />
      </Box>

      {/* Right Form Section */}
      <Box sx={{ flex: 1, backgroundColor: '#eaf3fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, width: '80%', maxWidth: 400, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', mb: 2, textAlign: 'center' }}
            onClick={() => {
              setUsePhone(!usePhone);
              setOtpSent(false);
              setEmailOrPhone('');
              setOtp('');
            }}
          >
            {usePhone ? 'Use Email Instead' : 'Use Phone Instead'}
          </Typography>

          {!usePhone ? (
            <>
              <TextField
                placeholder="Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                InputProps={{
                  style: {
                    color: 'black',
                    backgroundColor: 'white',
                  },
                }}
              />
              <TextField
                placeholder="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  style: {
                    color: 'black',
                    backgroundColor: 'white',
                  },
                }}
              />
            </>
          ) : (
            <>
              <TextField
                placeholder="Phone Number (+91...)"
                variant="outlined"
                fullWidth
                margin="normal"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                InputProps={{
                  style: {
                    color: 'black',
                    backgroundColor: 'white',
                  },
                }}
              />
              {otpSent && (
                <TextField
                  placeholder="Enter OTP"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  InputProps={{
                    style: {
                      color: 'black',
                      backgroundColor: 'white',
                    },
                  }}
                />
              )}
              <div id="recaptcha-container" />
            </>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#1976d2' }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="/signup" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
