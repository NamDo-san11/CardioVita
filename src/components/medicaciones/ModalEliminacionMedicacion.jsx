import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionMedicacion = ({ show, onHide, datos, onEliminar }) => {
    if (!datos) return null;

    const { nombre, hora, fechaInicio, fechaFin } = datos;

    return (
        <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Eliminar Medicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>¿Estás seguro que deseas eliminar la siguiente medicación?</p>
            <ul>
            <li><strong>Nombre:</strong> {nombre}</li>
            <li><strong>Hora:</strong> {hora}</li>
            <li><strong>Inicio:</strong> {fechaInicio}</li>
            <li><strong>Fin:</strong> {fechaFin}</li>
            </ul>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
            Cancelar
            </Button>
            <Button variant="danger" onClick={onEliminar}>
            Eliminar
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionMedicacion;
