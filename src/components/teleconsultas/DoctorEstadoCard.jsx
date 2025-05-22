import React from "react";
import { Button, Card, Badge } from "react-bootstrap";

const DoctorEstadoCard = ({ nombre, especialidad, estado, onToggle }) => {
  return (
    <Card className="text-center shadow-sm">
      <Card.Body>
        <Card.Title>Estado de Disponibilidad</Card.Title>
        <br />
        <Card.Text>
          <strong>Nombre:</strong> {nombre}<br />
          <strong>Especialidad:</strong> {especialidad}<br />
          <strong>Estado actual:</strong>{" "}
          <Badge bg={estado === "activo" ? "success" : "danger"}>
            {estado}
          </Badge>
        </Card.Text>
        <Button
          variant={estado === "activo" ? "danger" : "success"}
          onClick={onToggle}
        >
          Cambiar a {estado === "activo" ? "inactivo" : "activo"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DoctorEstadoCard;
