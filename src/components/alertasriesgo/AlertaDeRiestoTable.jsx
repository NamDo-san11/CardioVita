import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import "../../styles/AlertaDeRiesgoView.css";

const AlertaDeRiesgoTable = ({ pacientes, filtro, setFiltro }) => {
    const [fontSize, setFontSize] = useState("0.85rem");

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

    const filtroNormalizado = filtro.toLowerCase();

    const pacientesFiltrados = pacientes.filter((p) =>
        p.nombre?.toLowerCase().includes(filtroNormalizado) ||
        p.correo?.toLowerCase().includes(filtroNormalizado) ||
        String(p.edad).includes(filtroNormalizado)
    );

    return (
        <>
            <Form.Control
                type="text"
                placeholder="Buscar por nombre, edad o correo..."
                className="filtro-pacientes mb-3"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />

            {pacientesFiltrados.length === 0 ? (
                <p className="text-muted">No se encontraron resultados.</p>
            ) : (
                <Table striped bordered hover responsive className="bg-white" style={{ fontSize }}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Edad</th>
                            <th>Sistólica Promedio</th>
                            <th>Diastólica Promedio</th>
                            <th>Frecuencia Habitual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientesFiltrados.map((paciente, idx) => (
                            <tr key={idx}>
                                <td data-label="Nombre">{paciente.nombre}</td>
                                <td data-label="Correo">{paciente.correo}</td>
                                <td data-label="Edad">{paciente.edad}</td>
                                <td data-label="Sistólica">{paciente.sistolicaProm}</td>
                                <td data-label="Diastólica">{paciente.diastolicaProm}</td>
                                <td data-label="Frecuencia">{paciente.frecuencia}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default AlertaDeRiesgoTable;
