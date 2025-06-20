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
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

const AddMedicine = () => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [schedules, setSchedules] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
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
    } catch {
      setMessage("Erro ao buscar categorias");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("Medicamento cadastrado com sucesso!");
        setOpenSnackbar(true);
        navigate("/medicines");
      }
    } catch {
      setMessage("Erro ao cadastrar medicamento");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="categoria-label">Categoria</InputLabel>
          <Select
            labelId="categoria-label"
            id="categoria"
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message.includes("sucesso") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMedicine;
