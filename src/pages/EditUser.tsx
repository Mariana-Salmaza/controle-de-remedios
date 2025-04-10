import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user: {
    id: number;
  };
}

const EditUser = () => {
  const [user, setUser] = useState({
    name: "",
    document: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado");

        const decoded = jwtDecode<DecodedToken>(token);
        const userId = decoded?.user?.id;
        if (!userId) throw new Error("ID do usuário não encontrado");

        const response = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Preenche os campos necessários (sem incluir o email)
        const { name, document } = response.data;
        setUser({ name, document, password: "" });
      } catch (error) {
        alert("Erro ao carregar dados do usuário");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user.password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token não encontrado");
      return;
    }

    const decoded = jwtDecode<DecodedToken>(token);
    const userId = decoded?.user?.id;

    if (!userId) {
      alert("ID do usuário não encontrado.");
      return;
    }

    try {
      const response = await api.put(
        `/users/${userId}`,
        {
          name: user.name,
          document: user.document,
          password: user.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Dados atualizados com sucesso!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      const mensagem =
        error.response?.data?.error || "Erro ao atualizar os dados.";
      alert(mensagem);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Alterar Dados
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
          <TextField
            label="CPF"
            fullWidth
            margin="normal"
            value={user.document}
            onChange={(e) => setUser({ ...user, document: e.target.value })}
            required
          />
          <TextField
            label="Nova Senha"
            type="password"
            fullWidth
            margin="normal"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
          <TextField
            label="Confirmar Senha"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Atualizar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EditUser;
