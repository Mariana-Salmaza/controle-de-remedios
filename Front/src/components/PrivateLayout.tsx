import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import {
  Medication,
  Category,
  ExitToApp,
  Dashboard,
} from "@mui/icons-material";
import { useNavigate, Outlet, Link } from "react-router-dom";

const drawerWidth = 240;

const PrivateLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Meu Remédio
          </Typography>
        </Toolbar>
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/medicines">
            <ListItemIcon>
              <Medication />
            </ListItemIcon>
            <ListItemText primary="Medicamentos" />
          </ListItem>
          <ListItem button component={Link} to="/categories">
            <ListItemIcon>
              <Category />
            </ListItemIcon>
            <ListItemText primary="Categorias" />
          </ListItem>
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box p={2}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleLogout}
            startIcon={<ExitToApp />}
          >
            Sair
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default PrivateLayout;
