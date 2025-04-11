import { Table, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const TablaMedicaciones = ({ medicaciones, openEditModal, openDeleteModal }) => {
    const [fontSize, setFontSize] = useState("0.85rem");

    useEffect(() => {
        const updateFontSize = () => {
        const width = window.innerWidth;
        if (width >= 992) {
            // Laptops y pantallas grandes
            setFontSize("1rem");
        } else if (width >= 768) {
            // Tablets o pantallas medianas
            setFontSize("0.9rem");
        } else {
            // Móviles
            setFontSize("0.75rem");
        }
        };

        updateFontSize(); // al cargar
        window.addEventListener("resize", updateFontSize);
        return () => window.removeEventListener("resize", updateFontSize);
    }, []);

    return (
        <div style={{ overflowX: "auto", maxWidth: "100%", fontSize }}>
        <table className="table table-striped table-bordered table-hover table-sm mb-0">
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
                    <button
                    className="btn btn-warning btn-sm"
                    onClick={() => openEditModal(med)}
                    title="Editar"
                    >
                    <FaEdit />
                    </button>
                    <button
                    className="btn btn-danger btn-sm"
                    onClick={() => openDeleteModal(med)}
                    title="Eliminar"
                    >
                    <FaTrash />
                    </button>

                    </div>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
};

export default TablaMedicaciones;
