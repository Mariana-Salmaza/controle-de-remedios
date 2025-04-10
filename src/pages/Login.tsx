import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import loginImage from "../assets/login-image.webp.webp";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await api.post("/login", data);
      console.log(response.data); // Log da resposta para depuração
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Erro ao fazer login. Verifique seu e-mail e senha.");
      console.error(error); // Log do erro
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid item xs={12} md={6}>
        <img
          src={loginImage}
          alt="Controle de Remédios"
          style={{ width: "100%", height: "100vh", objectFit: "cover" }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
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
              Entrar
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Informe o e-mail e senha cadastrados. Novo por aqui?
              <Link
                to="/register"
                style={{ color: "teal", marginLeft: 4, textDecoration: "none" }}
              >
                Cadastre-se!
              </Link>
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
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
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                {...register("password", { required: "Senha é obrigatória" })}
                error={!!errors.password}
                helperText={errors.password?.message || ""}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Entrar
              </Button>
            </form>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
