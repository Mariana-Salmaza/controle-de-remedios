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

interface DecodedToken {
  user: {
    id: number;
  };
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const decoded = jwtDecode<DecodedToken>(token); // Decodifica o token
        const userId = decoded?.user?.id;

        if (!userId) {
          throw new Error("ID do usuário não encontrado no token");
        }

        const response = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Passando o token para o backend
        });

        setUser(response.data); // Atualiza o estado com os dados do usuário
      } catch (error) {
        alert("Erro ao carregar dados do usuário");
        console.error(error); // Exibe o erro no console para depuração
        navigate("/login"); // Redireciona para a página de login
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = async () => {
    if (user) {
      try {
        const response = await api.delete(`/users/${user.id}`);
        if (response.status === 204) {
          alert("Usuário excluído com sucesso!");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch {
        alert("Erro ao excluir o usuário");
      }
    }
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
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate("/edit-user")}
        >
          Alterar Dados
        </Button>

        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleDelete} // Chamando a função de exclusão
        >
          Excluir Conta
        </Button>

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
