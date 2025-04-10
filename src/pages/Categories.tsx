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

  // Função para excluir categoria
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        return;
      }

      const response = await api.delete(`/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Atualiza a lista de categorias após a exclusão
        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );
        alert("Categoria excluída com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria.");
    }
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
                  onClick={() => navigate(`/medicines/category/${category.id}`)}
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
                {/* Botão de Excluir Categoria */}
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginTop: 2, marginLeft: 1 }}
                  onClick={() => handleDeleteCategory(category.id)} // Função de exclusão
                >
                  Excluir
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
