import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const ConsultaForm = ({ onSubmit }) => {
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mensaje.trim() === "") return;
    onSubmit(mensaje.trim());
    setMensaje(""); // limpiar campo después de enviar
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="consultaMensaje" className="mb-3">
        <Form.Label className="text-secondary">Escribe tu consulta</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Describe tus síntomas, dudas o necesidades..."
        />
      </Form.Group>
      <Button variant="outline-success" type="submit">
        Enviar Consulta
      </Button>
    </Form>
  );
};

export default ConsultaForm;
