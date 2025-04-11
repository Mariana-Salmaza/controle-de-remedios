import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import CustomGrid from "../components/CustomGrid";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import loginImage from "../assets/login-image.webp.webp";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AxiosError } from "axios";

interface FormData {
  name: string;
  email: string;
  document: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setSnackbarMessage("As senhas não coincidem.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await api.post("/users", data);
      if (response.status === 201) {
        setSnackbarMessage("Cadastro realizado com sucesso!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        navigate("/login");
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      const errorMessage =
        err.response?.data?.error ||
        "Erro ao cadastrar usuário. Verifique os dados e tente novamente.";

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <CustomGrid container sx={{ minHeight: "100vh" }}>
      <CustomGrid item xs={12} md={6}>
        <img
          src={loginImage}
          alt="Controle de Remédios"
          style={{ width: "100%", height: "100vh", objectFit: "cover" }}
        />
      </CustomGrid>

      <CustomGrid item xs={12} md={6}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          px={8}
        >
          <Paper
            elevation={3}
            sx={{ padding: 6, width: "100%", maxWidth: 400 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Cadastre-se
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Já possui uma conta?
              <Link
                to="/login"
                style={{ color: "teal", marginLeft: 4, textDecoration: "none" }}
              >
                Entrar
              </Link>
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Nome"
                fullWidth
                margin="normal"
                {...register("name", { required: "Nome é obrigatório" })}
                error={!!errors.name}
                helperText={errors.name?.message || ""}
              />
              <TextField
                label="E-mail"
                fullWidth
                margin="normal"
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: "Email inválido",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message || ""}
              />
              <TextField
                label="CPF"
                fullWidth
                margin="normal"
                {...register("document", { required: "CPF é obrigatório" })}
                error={!!errors.document}
                helperText={errors.document?.message || ""}
              />
              <TextField
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                {...register("password", { required: "Senha é obrigatória" })}
                error={!!errors.password}
                helperText={errors.password?.message || ""}
              />
              <TextField
                label="Confirmar Senha"
                type="password"
                fullWidth
                margin="normal"
                {...register("confirmPassword", {
                  required: "Confirme sua senha",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message || ""}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Cadastrar
              </Button>
            </form>
          </Paper>
        </Box>
      </CustomGrid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </CustomGrid>
  );
};

export default RegisterPage;
