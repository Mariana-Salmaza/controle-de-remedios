import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  component: React.ElementType;
}

interface TokenPayload {
  exp: number;
}

const ProtectedRoute = ({ component: Component }: ProtectedRouteProps) => {
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsValidToken(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp > currentTime) {
        setIsValidToken(true);
      } else {
        localStorage.removeItem("token");
        setIsValidToken(false);
      }
    } catch {
      localStorage.removeItem("token");
      setIsValidToken(false);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return isValidToken ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
