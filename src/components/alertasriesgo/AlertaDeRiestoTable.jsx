import React from "react";
import { Table, Form } from "react-bootstrap";
import "../../styles/AlertaDeRiesgoView.css";

const AlertaDeRiesgoTable = ({ pacientes, filtro, setFiltro }) => {
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
            className="filtro-pacientes"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
        />

        {pacientesFiltrados.length === 0 ? (
            <p className="text-muted">No se encontraron resultados.</p>
        ) : (
            <Table striped bordered hover responsive className="bg-white">
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
                    <td>{paciente.nombre}</td>
                    <td>{paciente.correo}</td>
                    <td>{paciente.edad}</td>
                    <td>{paciente.sistolicaProm}</td>
                    <td>{paciente.diastolicaProm}</td>
                    <td>{paciente.frecuencia}</td>
                </tr>
                ))}
            </tbody>
            </Table>
        )}
        </>
    );
};

export default AlertaDeRiesgoTable;
