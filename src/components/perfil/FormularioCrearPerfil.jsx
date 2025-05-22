import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const FormularioCrearPerfil = ({ onGuardar }) => {
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !especialidad.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const datos = {
      nombre,
      rol: "doctor",
      especialidad,
    };

    onGuardar(datos);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Nombre completo</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ej. Dra. Ana Martínez"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Especialidad médica</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ej. Cardiología"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
        />
      </Form.Group>

      <Button variant="success" type="submit">
        Crear Perfil Médico
      </Button>
    </Form>
  );
};

export default FormularioCrearPerfil;
