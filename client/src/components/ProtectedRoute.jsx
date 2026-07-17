import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useAuth();
  if (!initialized) return null;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}
