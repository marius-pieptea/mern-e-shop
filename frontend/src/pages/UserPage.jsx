import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../features/user/userSlice";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  Alert,
} from "@mui/material";

const UserPage = () => {
  const { user, dataLoaded } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const fetchUserData = async () => {
    if (!localStorage.getItem("token")) return;

    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(setUser(response.data));
      setFormData({
        name: response.data.name,
        email: response.data.email,
        password: "",
      });
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  useEffect(() => {
    if (!dataLoaded && localStorage.getItem("token")) {
      fetchUserData();
    }
  }, [dataLoaded]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match");
      return false;
    }
    if (formData.newPassword && !formData.oldPassword) {
      setError("Please enter your old password to change your password");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const dataToSend = {
        name: formData.name,
      };

      if (formData.email !== user.email) {
        dataToSend.email = formData.email;
      }

      if (formData.newPassword) {
        dataToSend.oldPassword = formData.oldPassword;
        dataToSend.newPassword = formData.newPassword;
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(setUser(response.data));
      setEditMode(false);
      setError("");
      setFormData({
        ...formData,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };
  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          User Page
        </Typography>
        {user ? (
          <Paper elevation={3} sx={{ p: 2 }}>
            {editMode ? (
              <>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type="password"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ mt: 2 }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setEditMode(false);
                    setError("");
                    setFormData({
                      ...formData,
                      oldPassword: "",
                      newPassword: "",
                      confirmNewPassword: "",
                    });
                  }}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body1">{user.email}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  sx={{ mt: 2 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Logout
                </Button>
              </>
            )}
          </Paper>
        ) : (
          <Typography variant="body1">Please log in.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default UserPage;
