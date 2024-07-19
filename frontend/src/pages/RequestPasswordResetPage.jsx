import React, { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";

const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        { email }
      );
      setMessage("Check your email for further instructions.");
    } catch (error) {
      setError("Failed to request password reset. Please try again.");
      console.error(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Request Password Reset
        </Typography>
        <form onSubmit={handleRequestReset}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Send Reset Email
          </Button>
          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default RequestPasswordResetPage;