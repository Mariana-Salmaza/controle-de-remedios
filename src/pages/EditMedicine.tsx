import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";

const EditMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState<any>({
    name: "",
    dosage: "",
    quantity: "",
    schedules: "",
    categoryId: "",
  });

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/medicines/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicine(response.data);
      } catch (error) {
        console.error("Erro ao carregar medicamento:", error);
      }
    };
    fetchMedicine();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(`/medicines/${id}`, medicine, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/medicines");
    } catch (error) {
      console.error("Erro ao editar medicamento:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Editar Medicamento
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={medicine.name}
          onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
          required
        />
        <TextField
          label="Dosagem"
          fullWidth
          margin="normal"
          value={medicine.dosage}
          onChange={(e) => setMedicine({ ...medicine, dosage: e.target.value })}
          required
        />
        <TextField
          label="Quantidade"
          fullWidth
          margin="normal"
          value={medicine.quantity}
          onChange={(e) =>
            setMedicine({ ...medicine, quantity: e.target.value })
          }
          required
        />
        <TextField
          label="Horários"
          fullWidth
          margin="normal"
          value={medicine.schedules}
          onChange={(e) =>
            setMedicine({ ...medicine, schedules: e.target.value })
          }
          required
        />
        <TextField
          label="Categoria"
          fullWidth
          margin="normal"
          value={medicine.categoryId}
          onChange={(e) =>
            setMedicine({ ...medicine, categoryId: e.target.value })
          }
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Salvar Alterações
        </Button>
      </form>
    </Box>
  );
};

export default EditMedicine;
