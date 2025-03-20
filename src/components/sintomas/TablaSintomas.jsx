import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaSintomas = ({ sintomas, openEditModal, openDeleteModal }) => {
    return (
        <Table striped bordered hover responsive>
        <thead>
            <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {sintomas.map((sintoma) => (
            <tr key={sintoma.id}>
                <td>{sintoma.nombre}</td>
                <td>{sintoma.descripcion}</td>
                <td>
                <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditModal(sintoma)}
                >
                    <i className="bi bi-pencil"></i>
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => openDeleteModal(sintoma)}
                >
                    <i className="bi bi-trash"></i>
                </Button>
                </td>
            </tr>
            ))}
        </tbody>
        </Table>
    );
};

export default TablaSintomas;
