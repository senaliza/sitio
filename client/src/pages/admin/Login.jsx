import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Logo from "../../components/Logo.jsx";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <Link to="/" className="logo" aria-label="Ir al inicio">
            <Logo width={160} />
          </Link>
        </div>
        <h1>Panel administrativo</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          Ingrese sus credenciales para continuar.
        </p>
        {error && <div className="alerta alerta-error">{error}</div>}
        <form onSubmit={enviar}>
          <div className="campo">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="campo">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primario btn-bloque" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
      <style>{`
        .login-wrap { position: relative; min-height: 100vh; display: grid; place-items: center; padding: 24px; overflow: hidden;
          background: linear-gradient(185deg, #102a52 0%, #0c1f40 50%, #0a1733 100%); }
        .login-wrap::before { content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 26px 26px; opacity: .6; }
        .login-wrap::after { content: ''; position: absolute; width: 480px; height: 480px; border-radius: 50%;
          filter: blur(90px); background: rgba(34,211,238,0.22); top: -160px; right: -80px; pointer-events: none; }
        .login-card { position: relative; z-index: 1; background: rgba(255,255,255,0.98); border-radius: var(--radio);
          padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 30px 80px rgba(5, 16, 38, 0.5);
          border: 1px solid rgba(255,255,255,0.6); animation: login-in .5s cubic-bezier(0.22,1,0.36,1); }
        @keyframes login-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .login-logo { display: flex; align-items: center; margin-bottom: 28px; }
        .login-logo .logo { display: inline-flex; }
        .login-card h1 { font-size: 1.5rem; margin-bottom: 6px; }
      `}</style>
    </div>
  );
}
