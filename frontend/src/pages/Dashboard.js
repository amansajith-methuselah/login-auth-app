// src/pages/Dashboard.js

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../firebase";
import { auth } from "../firebase";

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f0f4ff" }}>
      <Grid item xs={12} md={12}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 5,
              maxWidth: 500,
              width: "100%",
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "#ffffff",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#007BFF",
                width: 56,
                height: 56,
                margin: "0 auto 16px auto",
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || user?.phoneNumber?.slice(-1)}
            </Avatar>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Hello, {user?.email || user?.phoneNumber || "User"}!
            </Typography>
            <Typography
              variant="subtitle1"
              color="success.main"
              sx={{ mb: 3 }}
            >
              Login Successful
            </Typography>

            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              color="primary"
              onClick={handleLogout}
              sx={{
                mt: 2,
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
