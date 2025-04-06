import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { jwtDecode } from "jwt-decode";

interface UserData {
  id: number;
  name: string;
  email: string;
  document: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = token ? jwtDecode<any>(token) : null;
        const userId = decoded?.user?.id;

        if (!userId) {
          throw new Error("ID do usuário não encontrado no token");
        }

        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        alert("Erro ao carregar dados do usuário");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return <Typography variant="h6">Carregando dados...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bem-vindo, {user.name}!
        </Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Typography variant="body1">CPF: {user.document}</Typography>
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleLogout}
        >
          Sair
        </Button>
      </Paper>
    </Box>
  );
};

export default Dashboard;
