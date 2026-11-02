import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const CrudProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [form, setForm] = useState({
        id: null,
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria_id: "",
    });

    // Función auxiliar para obtener los headers con el token JWT
    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    const obtenerProductos = useCallback(async () => {
        try {
            const [productosResponse, categoriasResponse] = await Promise.all([
                api.get('/productos', getHeaders()),
                api.get('/categorias', getHeaders()),
            ]);
            setProductos(productosResponse.data);
            setCategorias(categoriasResponse.data);
        } catch (error) {
            console.error("Error al obtener productos (posible token expirado)");
            setError(error.response?.data?.error || error.message || "No se pudieron cargar los productos.");
        }
    }, []);

    useEffect(() => {
        // La carga inicial sincroniza la tabla con la API al montar el componente.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        obtenerProductos();
    }, [obtenerProductos]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setGuardando(true);
            setError("");
            const payload = {
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                precio: Number(form.precio),
                stock: Number(form.stock),
                categoria_id: Number(form.categoria_id),
            };

            if (form.id) {
                await api.put(`/productos/${form.id}`, payload, getHeaders());
            } else {
                await api.post("/productos", payload, getHeaders());
            }

            setForm({ id: null, nombre: "", descripcion: "", precio: "", stock: "", categoria_id: "" });
            await obtenerProductos();
        } catch (error) {
            setError(error.response?.data?.error || error.message || "No se pudo guardar el producto.");
        } finally {
            setGuardando(false);
        }
    };

    const handleEdit = (producto) => {
        setForm({ ...form, ...producto, categoria_id: producto.categoria_id || producto.categoria?.id || "" });
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                setError("");
                await api.delete(`/productos/${id}`, getHeaders());
                await obtenerProductos();
            } catch (error) {
                setError(error.response?.data?.error || error.message || "No se pudo eliminar el producto.");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Gestión de Productos</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <div className="row">
                {/* Formulario */}
                <div className="col-md-4">
                    <h4>{form.id ? "Editar Producto" : "Nuevo Producto"}</h4>
                    <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                className="form-control"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                className="form-control"
                                value={form.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Precio (S/)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="precio"
                                className="form-control"
                                value={form.precio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                className="form-control"
                                value={form.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Categoría</label>
                            {!categorias.length && (
                                <div className="alert alert-warning py-2">
                                    Debes crear una categoría antes de guardar productos.
                                </div>
                            )}
                            <select
                                name="categoria_id"
                                className="form-select"
                                value={form.categoria_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={guardando || !categorias.length}
                        >
                            {guardando ? "Guardando..." : form.id ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>

                {/* Tabla de Productos */}
                <div className="col-md-8">
                    <h4>Lista de Productos</h4>
                    <table className="table table-striped table-hover shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.id}</td>
                                    <td>{prod.nombre}</td>
                                    <td>S/ {prod.precio}</td>
                                    <td>{prod.stock}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(prod)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(prod.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CrudProductos;