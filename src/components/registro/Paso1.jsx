import React from "react";
import { Form, Button } from "react-bootstrap";

const Paso1 = ({ datos, onChange, onNext }) => {
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "foto" && files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange("fotoBase64", reader.result);
        };
        reader.readAsDataURL(files[0]);
        } else {
        onChange(name, value);
        }
    };

    return (
        <>
        <h4 className="mb-3 fw-bold ">Datos Iniciales</h4>

        <Form.Group controlId="formFoto" className="mb-3">
            <Form.Label>Foto de perfil</Form.Label>
            <Form.Control
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            />
            {datos.fotoBase64 && (
            <img
                src={datos.fotoBase64}
                alt="Preview"
                className="mt-2 rounded"
                width="80"
                height="80"
            />
            )}
        </Form.Group>

        <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
            type="text"
            placeholder="Ej. Juan Pérez"
            name="nombre"
            value={datos.nombre}
            onChange={handleChange}
            />
        </Form.Group>

        <Form.Group controlId="formCorreo" className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
            type="email"
            placeholder="usuario@email.com"
            name="correo"
            value={datos.correo}
            onChange={handleChange}
            />
        </Form.Group>

        <Form.Group controlId="formClave" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={datos.password}
            onChange={handleChange}
            />
        </Form.Group>

        <Form.Group controlId="formRol" className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="rol" value={datos.rol} onChange={handleChange}>
            <option value="usuario">Usuario</option>
            <option value="doctor">Doctor</option>
            </Form.Select>
        </Form.Group>

        <div className="text-end mt-4">
            <Button variant="primary" onClick={onNext}>
            Siguiente
            </Button>
        </div>
        </>
    );
};

export default Paso1;