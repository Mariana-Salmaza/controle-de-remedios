import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState(""); // Estado para o nome da categoria
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Verifica se o nome da categoria foi preenchido
    if (!name) {
      alert("Por favor, preencha o nome da categoria.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        return;
      }

      // Envia a requisição POST para criar uma nova categoria
      const response = await api.post(
        "/categories",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
          },
        }
      );

      if (response.status === 201) {
        alert("Categoria criada com sucesso!");
        navigate("/categories"); // Redireciona para a lista de categorias após o sucesso
      }
    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      alert("Erro ao cadastrar categoria");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cadastrar Categoria
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Cadastrar
        </Button>
      </form>
    </Box>
  );
};

export default AddCategory;
