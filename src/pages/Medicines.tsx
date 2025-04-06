import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import api from "../api";
import { Link } from "react-router-dom";

const Medicines = () => {
  const [medicines, setMedicines] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/medicines", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicines(response.data.medicines);
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      }
    };
    fetchMedicines();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/medicines/${id}`);
      setMedicines(medicines.filter((medicine) => medicine.id !== id));
    } catch (error) {
      console.error("Erro ao excluir medicamento:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Medicamentos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/add-medicine"
        sx={{ marginBottom: 3 }}
      >
        + Adicionar Medicamento
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Dosagem</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Horários</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.dosage}</TableCell>
                <TableCell>{medicine.quantity}</TableCell>
                <TableCell>{medicine.schedules}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/edit-medicine/${medicine.id}`}
                    sx={{ marginRight: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(medicine.id)}
                    color="error"
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Medicines;
