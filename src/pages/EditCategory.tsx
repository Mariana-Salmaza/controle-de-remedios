import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api"; // Seu axios configurado

const EditCategory = () => {
  const { id } = useParams(); // Pega o id da categoria da URL
  const [category, setCategory] = useState({
    name: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Se estivermos editando, buscamos a categoria pelo ID
      const fetchCategory = async () => {
        const response = await api.get(`/categories/${id}`);
        setCategory(response.data);
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        // Se estivermos editando, fazemos um PUT
        await api.put(`/categories/${id}`, category);
        alert("Categoria atualizada com sucesso");
      } else {
        // Se estivermos criando, fazemos um POST
        await api.post("/categories", category);
        alert("Categoria criada com sucesso");
      }
      navigate("/categories"); // Redireciona para a listagem de categorias
    } catch {
      alert("Erro ao salvar categoria");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {id ? "Editar Categoria" : "Cadastrar Categoria"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          name="name"
          value={category.name}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          {id ? "Atualizar" : "Cadastrar"}
        </Button>
      </form>
    </Box>
  );
};

export default EditCategory;
