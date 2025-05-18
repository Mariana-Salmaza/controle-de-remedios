import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Medicines from "./pages/Medicines";
import EditMedicine from "./pages/EditMedicine";
import EditCategory from "./pages/EditCategory";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivateLayout from "./components/PrivateLayout";
import AddMedicine from "./pages/AddMedicine"; // Importe a página de adicionar medicamento
import AddCategory from "./pages/AddCategory";
import MedicinesByCategory from "./pages/MedicinesByCategory";
import EditUser from "./pages/EditUser";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-medicine" element={<AddMedicine />} />{" "}
        <Route element={<PrivateLayout />}>
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={Dashboard} />}
          />
          <Route
            path="/categories"
            element={<ProtectedRoute component={Categories} />}
          />
          <Route
            path="/medicines"
            element={<ProtectedRoute component={Medicines} />}
          />
          <Route
            path="/edit-medicine/:id"
            element={<ProtectedRoute component={EditMedicine} />}
          />
          <Route
            path="/edit-category/:id"
            element={<ProtectedRoute component={EditCategory} />}
          />
          <Route
            path="/add-category"
            element={<ProtectedRoute component={AddCategory} />}
          />
          <Route
            path="/medicines/category/:categoryId"
            element={<MedicinesByCategory />}
          />
          <Route
            path="/edit-user"
            element={<ProtectedRoute component={EditUser} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
