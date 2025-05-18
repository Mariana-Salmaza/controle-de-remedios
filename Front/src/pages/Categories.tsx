import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Pagination } from "@mui/material";
import CustomGrid from "../components/CustomGrid";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Category {
  id: number;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        return;
      }

      const response = await api.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data.categories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      alert("Erro ao buscar categorias.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Categorias de Medicamentos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add-category")}
        sx={{ marginBottom: 3 }}
      >
        + Adicionar Categoria
      </Button>

      <CustomGrid container spacing={3}>
        {currentCategories.length > 0 ? (
          currentCategories.map((category) => (
            <CustomGrid item xs={12} sm={6} md={4} key={category.id}>
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
                  onClick={() => navigate(`/edit-category/${category.id}`)}
                >
                  Editar
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginTop: 2, marginLeft: 1 }}
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Excluir
                </Button>
              </Paper>
            </CustomGrid>
          ))
        ) : (
          <Typography variant="h6" color="text.secondary">
            Nenhuma categoria encontrada.
          </Typography>
        )}
      </CustomGrid>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default Categories;
