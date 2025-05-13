import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

const HistorialConsultasUsuario = ({ consultas, onDelete, onEdit }) => {
  if (!consultas || consultas.length === 0) {
    return <p className="text-black-50">Aún no has enviado consultas.</p>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-black mb-4">Mis Consultas</h4>
      {consultas.map((consulta) => (
        <Card key={consulta.id} className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="mb-2"><strong>Consulta:</strong></h6>
                <p className="mb-2">{consulta.mensaje}</p>
                <small className="text-muted">
                  {consulta.timestamp?.toDate?.().toLocaleString() || "Sin fecha"}
                </small>
              </div>
              <div className="text-end">
                <Badge bg={consulta.respuesta?.trim() ? "success" : "secondary"}>
                  {consulta.respuesta?.trim() ? "Respondida" : "No respondida"}
                </Badge>
              </div>
            </div>

            {consulta.respuesta?.trim() && (
              <div className="mt-3 p-3 bg-light border border-success rounded">
                <strong className="text-success">Respuesta del doctor:</strong>
                <p className="mb-0">{consulta.respuesta}</p>
              </div>
            )}

            <div className="d-flex gap-2 justify-content-end mt-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onEdit(consulta)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(consulta.id)}
              >
                Eliminar
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default HistorialConsultasUsuario;
