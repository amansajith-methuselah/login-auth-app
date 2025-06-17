// src/pages/Signup.js

import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  registerWithEmail,
  setupRecaptcha,
  sendPhoneOtp,
  confirmOtp,
} from "../firebase";
import "../styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (usePhone) {
      if (!otpSent) {
        if (!phone) return alert("Please enter a phone number.");
        setupRecaptcha();
        const sent = await sendPhoneOtp(phone);
        if (sent) {
          setOtpSent(true);
          setSnackbar({ open: true, message: "OTP sent!", severity: "success" });
        } else {
          setSnackbar({ open: true, message: "Failed to send OTP", severity: "error" });
        }
      } else {
        const verified = await confirmOtp(otp);
        if (verified) {
          setSnackbar({ open: true, message: "Account created successfully!", severity: "success" });
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setSnackbar({ open: true, message: "OTP verification failed", severity: "error" });
        }
      }
    } else {
      if (password !== confirmPwd) {
        return setSnackbar({
          open: true,
          message: "Passwords do not match.",
          severity: "error",
        });
      }

      const success = await registerWithEmail(email, password);
      if (success) {
        setSnackbar({
          open: true,
          message: "Account created successfully!",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setSnackbar({ open: true, message: "Signup failed", severity: "error" });
      }
    }
  };

  return (
    <Box className="signup-container">
      <Box className="signup-left">
        <img
          src={require("../assets/login-illustration.png")}
          alt="signup"
          className="signup-image"
        />
      </Box>

      <Box className="signup-right">
        <Paper elevation={6} className="signup-paper">
          <Typography variant="h4" gutterBottom align="center">
            Create Account
          </Typography>

          <Button
            variant="text"
            onClick={() => setUsePhone(!usePhone)}
            size="small"
            sx={{ mb: 2, alignSelf: "flex-end", textTransform: "none" }}
          >
            {usePhone ? "Use Email Instead" : "Use Phone Instead"}
          </Button>

          <form onSubmit={handleSignup}>
            {!usePhone ? (
              <>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </>
            ) : (
              <>
                <TextField
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                {otpSent && (
                  <TextField
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                )}
                <div id="recaptcha-container" />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 1 }}
            >
              {usePhone && !otpSent ? "Send OTP" : "Sign Up"}
            </Button>
          </form>

          <Divider sx={{ my: 2 }} />

          <Button
            onClick={() => navigate("/login")}
            variant="text"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            Already have an account? Login
          </Button>
        </Paper>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;
