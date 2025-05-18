import { useEffect, useState, useCallback } from "react";
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
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  quantity: number;
  schedules: string;
  categoryId: number;
}

const MedicinesByCategory = () => {
  const { categoryId } = useParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const navigate = useNavigate();

  const fetchMedicines = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        return;
      }

      const response = await api.get(`/medicines/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMedicines(response.data.medicines);
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
      alert("Erro ao buscar medicamentos.");
    }
  }, [categoryId]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Medicamentos da Categoria
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/add-medicine`)}
        sx={{ marginBottom: 3 }}
      >
        + Adicionar Medicamento
      </Button>
      {medicines.length > 0 ? (
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
                      variant="outlined"
                      sx={{ marginRight: 1 }}
                      onClick={() => navigate(`/edit-medicine/${medicine.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      color="error"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          if (!token) {
                            alert("Você precisa estar logado.");
                            return;
                          }
                          await api.delete(`/medicines/${medicine.id}`, {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });
                          setMedicines(
                            medicines.filter((m) => m.id !== medicine.id)
                          );
                        } catch (error) {
                          console.error("Erro ao excluir medicamento:", error);
                          alert("Erro ao excluir medicamento.");
                        }
                      }}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" color="text.secondary">
          Nenhum medicamento encontrado nesta categoria.
        </Typography>
      )}
    </Box>
  );
};

export default MedicinesByCategory;
