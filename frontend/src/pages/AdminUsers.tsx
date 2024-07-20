import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { User } from "../types";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User>>({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setUsers(users.filter((user) => user._id !== id));
  };

  const editUser = (user: User) => {
    setEditUserId(user._id);
    setEditUserData(user);
  };

  const saveUser = async (id: string) => {
    const { data } = await axios.put(
      `http://localhost:5000/api/users/${id}`,
      editUserData, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUsers(users.map((user) => (user._id === id ? data : user)));
    setEditUserId(null);
    dispatch(updateUser(data));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                {editUserId === user._id ? (
                  <TextField
                    name="name"
                    value={editUserData.name || ""}
                    onChange={handleChange}
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editUserId === user._id ? (
                  <TextField
                    name="email"
                    value={editUserData.email || ""}
                    onChange={handleChange}
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {editUserId === user._id ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveUser(user._id)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => editUser(user)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminUsers;
