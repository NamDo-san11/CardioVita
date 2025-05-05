import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const Paso1 = ({ datos, onChange, onNext }) => {
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [formularioValido, setFormularioValido] = useState(false);

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

  useEffect(() => {
    const camposLlenos =
      datos.nombre?.trim() &&
      datos.correo?.trim() &&
      datos.password?.trim() &&
      confirmarPassword.trim() &&
      datos.rol;

    const contraseñasCoinciden = datos.password === confirmarPassword;

    setErrorPassword(!contraseñasCoinciden && confirmarPassword.length > 0);
    setFormularioValido(camposLlenos && contraseñasCoinciden);
  }, [datos, confirmarPassword]);

  return (
    <>
      <h4 className="mb-3 fw-bold">Datos Iniciales</h4>

      <Form.Group controlId="formFoto" className="mb-3">
        <Form.Label>Foto de perfil</Form.Label>
        <Form.Control type="file" name="foto" accept="image/*" onChange={handleChange} />
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

      <Row className="mb-3">
        <Col>
          <Form.Group controlId="formClave">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={datos.password}
              onChange={handleChange}
              isInvalid={errorPassword}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formConfirmarClave">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repetir"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              isInvalid={errorPassword}
            />
            {errorPassword && (
              <Form.Text className="text-danger">
                Las contraseñas no coinciden.
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formRol" className="mb-3">
        <Form.Label>Rol</Form.Label>
        <Form.Select name="rol" value={datos.rol} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="usuario">Usuario</option>
          <option value="doctor">Doctor</option>
        </Form.Select>
      </Form.Group>

      <div className="text-end mt-4">
        <Button variant="primary" onClick={onNext} disabled={!formularioValido}>
          Siguiente
        </Button>
      </div>
    </>
  );
};

export default Paso1;
