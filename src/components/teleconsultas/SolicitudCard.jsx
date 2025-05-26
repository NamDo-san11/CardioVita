import React from "react";
import { Card, Button } from "react-bootstrap";

const SolicitudCard = ({ solicitud, onAceptar, onFinalizar }) => {
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

        {/* Si está pendiente, se puede aceptar */}
        {solicitud.estado === "pendiente" && (
          <Button variant="success" onClick={() => onAceptar(solicitud)}>
            Aceptar e iniciar consulta
          </Button>
        )}

        {/* Si está activa, se puede unir y finalizar */}
        {solicitud.estado === "activa" && (
          <>
            <Button
              variant="outline-primary"
              href={solicitud.salaVideo}
              target="_blank"
              className="me-2"
            >
              Unirse a la videollamada
            </Button>
            <Button variant="danger" onClick={() => onFinalizar(solicitud)}>
              Finalizar consulta
            </Button>
          </>
        )}

        {/* Si ya fue finalizada, solo se muestra eso */}
        {solicitud.estado === "finalizada" && (
          <div className="text-muted mt-2">Consulta finalizada.</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SolicitudCard;
