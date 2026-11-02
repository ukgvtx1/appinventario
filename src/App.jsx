import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import Login from './components/login/login';
import CrudProductos from './components/CrudProductos/CrudProductos';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

// Componente para el Navbar que incluye el botón de Cerrar Sesión y marca SENATI
const Navigation = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Borramos el token
        navigate('/'); // Redirigimos al Login
    };

    return (
        <nav className="navbar navbar-dark bg-dark shadow-sm px-4">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">SENATI - Sistema de Inventario</span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};

// Layout protegido que incluye la barra de navegación superior
const ProtectedLayout = () => {
    return (
        <ProtectedRoute>
            <Navigation />
            <div className="container mt-4">
                <Outlet />
            </div>
        </ProtectedRoute>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta Pública */}
                <Route path="/" element={<Login />} />

                {/* Rutas Protegidas (Requieren Token e incluyen Navbar) */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/productos" element={<CrudProductos />} />
                    {/* Aquí puedes agregar las demás rutas protegidas cuando las necesites */}
                    {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                    {/* <Route path="/categorias" element={<Categorias />} /> */}
                    {/* <Route path="/proveedores" element={<Proveedores />} /> */}
                    {/* <Route path="/kardex" element={<Kardex />} /> */}
                    {/* <Route path="/usuarios" element={<Usuarios />} /> */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;