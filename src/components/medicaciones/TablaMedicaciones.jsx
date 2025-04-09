import React from "react";
import { Table, Button } from "react-bootstrap";

// Función para formatear la hora a 12h
const formatearHora12 = (hora24) => {
    const [hora, minuto] = hora24.split(":").map(Number);
    const ampm = hora >= 12 ? "PM" : "AM";
    const hora12 = hora % 12 || 12;
    return `${hora12}:${minuto.toString().padStart(2, "0")} ${ampm}`;
};

const TablaMedicaciones = ({ medicaciones, openEditModal, openDeleteModal }) => {
    return (
    <Table striped bordered hover responsive>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Hora</th>
                <th>Tomado</th>
                <th>Pospuesto</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {medicaciones.length === 0 ? (
                <tr>
                    <td colSpan="7" className="text-center">
                        No hay medicaciones registradas.
                    </td>
                </tr>
            ) : (
                medicaciones.map((med) => (
                    <tr key={med.id}>
                        <td>{med.nombre}</td>
                        <td>{formatearHora12(med.hora)}</td>
                        <td>{med.tomado ? "Sí" : "No"}</td>
                        <td>{med.pospuesto ? "Sí" : "No"}</td>
                        <td>{med.fechaInicio}</td>
                        <td>{med.fechaFin}</td>
                        <td>
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => openEditModal(med)}
                                className="me-2"
                            >
                                Editar
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => openDeleteModal(med)}
                            >
                                Eliminar
                            </Button>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </Table>
    );
};

export default TablaMedicaciones;
