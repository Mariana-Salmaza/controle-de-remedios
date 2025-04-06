import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddMedicine = () => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [schedules, setSchedules] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Para armazenar o ID da categoria
  const [categories, setCategories] = useState<any[]>([]); // Para armazenar as categorias
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

      setCategories(response.data.categories); // Atualizando o estado com as categorias
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      alert("Erro ao buscar categorias.");
    }
  };

  useEffect(() => {
    fetchCategories(); // Carrega as categorias assim que o componente é montado
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifique se todos os campos obrigatórios estão preenchidos
    if (!name || !dosage || !quantity || !schedules || !categoryId) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        return;
      }

      const response = await api.post(
        "/medicines",
        {
          name,
          dosage,
          quantity,
          schedules,
          categoryId, // Passando categoryId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
          },
        }
      );

      if (response.status === 201) {
        navigate("/medicines"); // Redireciona após o sucesso
      }
    } catch (error) {
      console.error("Erro ao cadastrar medicamento:", error);
      alert("Erro ao cadastrar medicamento");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cadastrar Medicamento
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
        <TextField
          label="Dosagem"
          fullWidth
          margin="normal"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required
        />
        <TextField
          label="Quantidade"
          fullWidth
          margin="normal"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <TextField
          label="Horários"
          fullWidth
          margin="normal"
          value={schedules}
          onChange={(e) => setSchedules(e.target.value)}
          required
        />

        {/* Campo para selecionar categoria */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            label="Categoria"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Cadastrar
        </Button>
      </form>
    </Box>
  );
};

export default AddMedicine;
