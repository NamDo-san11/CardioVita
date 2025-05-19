import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

const ConsultaCardDoctor = ({ consulta, onResponder }) => {
  const [respuesta, setRespuesta] = useState(consulta.respuesta || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onResponder(consulta.id, respuesta);
  };

  return (
    <Card className="mb-3 shadow">
      <Card.Body>
        <Card.Title className="mb-2">
          {consulta.nombre ? (
            <>
              {consulta.nombre}{" "}
              {consulta.edad && (
                <span className="text-muted">({consulta.edad} años)</span>
              )}
            </>
          ) : (
            <span className="text-muted">Paciente anónimo</span>
          )}
        </Card.Title>

        <Card.Subtitle className="mb-3 text-muted">
          {consulta.timestamp?.toDate?.().toLocaleString() || "Sin fecha"}
        </Card.Subtitle>

        <Card.Text className="mb-3">
          <strong>Consulta:</strong> {consulta.mensaje}
        </Card.Text>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label><strong>Respuesta del doctor:</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
            />
          </Form.Group>
          <Button type="submit" variant="outline-info" size="sm">
            Guardar Respuesta
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ConsultaCardDoctor;
