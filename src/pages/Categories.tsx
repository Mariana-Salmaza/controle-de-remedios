import { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Supondo que você tenha configurado o axios com o baseURL

interface Category {
  id: number;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  // Função para buscar as categorias
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        return;
      }

      const response = await api.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
        },
      });

      setCategories(response.data.categories); // Atualizando o estado com as categorias recebidas
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      alert("Erro ao buscar categorias.");
    }
  };

  useEffect(() => {
    fetchCategories(); // Chama a função ao montar o componente
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    // Redireciona para a página de medicamentos dessa categoria
    navigate(`/medicines/category/${categoryId}`);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Categorias de Medicamentos
      </Typography>

      {/* Botão para adicionar nova categoria */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add-category")} // Redireciona para a página de adicionar categoria
        sx={{ marginBottom: 3 }}
      >
        + Adicionar Categoria
      </Button>

      <Grid container spacing={3}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h6">{category.name}</Typography>
                <Button
                  variant="outlined"
                  sx={{ marginTop: 2 }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  Ver Medicamentos
                </Button>
                <Button
                  variant="outlined"
                  sx={{ marginTop: 2, marginLeft: 1 }}
                  onClick={() => navigate(`/edit-category/${category.id}`)} // Redireciona para editar categoria
                >
                  Editar
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="text.secondary">
            Nenhuma categoria encontrada.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Categories;
