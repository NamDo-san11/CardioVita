import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaMedicaciones = ({ medicaciones, openEditModal, openDeleteModal }) => {
    return (
        <div style={{ overflowX: "auto", maxWidth: "100%", fontSize: "0.85rem" }}>

        <Table striped bordered hover responsive size="sm" className="mb-0">
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
                        <td>{med.hora}</td>
                        <td>{med.tomado ? "Sí" : "No"}</td>
                        <td>{med.pospuesto ? "Sí" : "No"}</td>
                        <td>{med.fechaInicio}</td>
                        <td>{med.fechaFin}</td>
                        <td>
                        <div className="d-flex flex-wrap gap-2">
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => openEditModal(med)}
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
                            </div>

                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </Table>
    </div>
    );
};

export default TablaMedicaciones;
