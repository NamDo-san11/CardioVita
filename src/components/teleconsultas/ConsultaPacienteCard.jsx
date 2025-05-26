import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

const ConsultaPacienteCard = ({ consulta }) => {
  const fecha = consulta.fecha?.toDate?.() || new Date();
  const estado = consulta.estado;

  const getColor = () => {
    if (estado === "pendiente") return "warning";
    if (estado === "activa") return "success";
    if (estado === "finalizada") return "secondary";
    return "dark";
  };

  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <Card.Title>{consulta.nombreDoctor}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Enviado: {fecha.toLocaleString()}
        </Card.Subtitle>

        <Badge bg={getColor()} className="mb-2">
          Estado: {estado}
        </Badge>

        <Card.Text className="mt-2">
          <strong>Tu mensaje:</strong><br />
          {consulta.mensaje}
        </Card.Text>

        {estado === "activa" && consulta.salaVideo && (
          <Button
            variant="outline-primary"
            href={consulta.salaVideo}
            target="_blank"
            className="mt-2"
          >
            Unirse a la videollamada
          </Button>
        )}

        {estado === "finalizada" && (
          <div className="text-muted mt-2">Esta consulta ha sido finalizada.</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ConsultaPacienteCard;
