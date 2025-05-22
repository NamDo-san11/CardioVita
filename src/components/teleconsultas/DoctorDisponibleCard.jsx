import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

const DoctorDisponibleCard = ({ nombre, especialidad, onSolicitar }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{nombre}</Card.Title>
        <Card.Text>
          <strong>Especialidad:</strong> {especialidad} <br />
          <Badge bg="success">Disponible</Badge>
        </Card.Text>
        <Button variant="primary" onClick={onSolicitar}>
          Solicitar Teleconsulta
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DoctorDisponibleCard;
