import React from "react";
import { Card, Button } from "react-bootstrap";

const SolicitudCard = ({ solicitud, onAceptar }) => {
  const fecha = solicitud.fecha?.toDate?.() || new Date();

  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <Card.Title>{solicitud.nombrePaciente}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Enviado: {fecha.toLocaleString()}
        </Card.Subtitle>
        <Card.Text>
          <strong>Mensaje:</strong><br />
          {solicitud.mensaje}
        </Card.Text>
        <Button variant="success" onClick={() => onAceptar(solicitud)}>
          Aceptar e iniciar consulta
        </Button>
      </Card.Body>
    </Card>
  );
};

export default SolicitudCard;
