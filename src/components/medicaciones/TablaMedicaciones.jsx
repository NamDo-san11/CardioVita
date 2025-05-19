import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { FaShareAlt } from "react-icons/fa";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import ModalCompartirReporte from "../reporte/ModalCompartirReporte";

const TablaMedicaciones = ({ medicaciones, openEditModal, openDeleteModal }) => {
    const [fontSize, setFontSize] = useState("0.85rem");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const updateFontSize = () => {
        const width = window.innerWidth;
        if (width >= 992) setFontSize("1rem");
        else if (width >= 768) setFontSize("0.9rem");
        else setFontSize("0.75rem");
        };
        updateFontSize();
        window.addEventListener("resize", updateFontSize);
        return () => window.removeEventListener("resize", updateFontSize);
    }, []);

    return (
        <>
        <div className="mb-2">
            <Button variant="outline-info" onClick={() => setShowModal(true)}>
            <FaShareAlt /> Compartir Reporte
            </Button>
        </div>

        {medicaciones.length === 0 ? (
            <p className="text-muted">No hay medicaciones registradas.</p>
        ) : (
            <Table striped bordered hover responsive className="bg-white" style={{ fontSize }}>
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
                {medicaciones.map((med) => (
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
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(med)}
                        title="Editar"
                        >
                        <PencilSquare size={16} />
                        </Button>
                        <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => openDeleteModal(med)}
                        title="Eliminar"
                        >
                        <Trash size={16} />
                        </Button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </Table>
        )}

        <ModalCompartirReporte
            show={showModal}
            onClose={() => setShowModal(false)}
            medicaciones={medicaciones}
        />
        </>
    );
};

export default TablaMedicaciones;
